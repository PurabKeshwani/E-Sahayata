"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
})

type FormValues = z.infer<typeof formSchema>

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // In your onSubmit function
  
  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    setError(null)
  
    try {
      // Sign in with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
  
      if (authError) {
        throw new Error(authError.message || "Invalid email or password")
      }
  
      if (authData?.user) {
        // Check if profile exists, if not create it
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();
        
        let profileData = existingProfile;
        
        // If profile doesn't exist, create it
        if (profileError && profileError.code === 'PGRST116') {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              full_name: authData.user.email?.split('@')[0] || 'User',
              email: authData.user.email,
              role: 'user', // Default role is 'user'
              created_at: new Date().toISOString(),
            })
            .select()
            .single();
            
          if (insertError) {
            console.error("Error creating profile:", insertError);
          } else {
            profileData = newProfile;
          }
        }
        
        // Store user data in localStorage with role from profile
        localStorage.setItem(
          "e-sahayata-user",
          JSON.stringify({
            id: authData.user.id,
            name: profileData?.full_name || authData.user.email?.split('@')[0],
            email: authData.user.email,
            role: profileData?.role || 'user',
          })
        )
  
        // Redirect to dashboard
        router.push("/dashboard")
      }
    } catch (error: any) {
      setError(error.message || "Failed to login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-4 py-12">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-right text-sm">
                <Link href="/auth/forgot-password" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full bg-[#10B981] hover:bg-[#059669]" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
        {/* Removed the CardFooter with registration link */}
      </Card>
    </div>
  )
}

// In your login form submission handler
const handleLogin = async (data: { email: string; password: string }) => {
  // After successful authentication
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })
  
  if (!error && authData.user) {
    // Make sure this is being set correctly
    localStorage.setItem(
      "e-sahayata-user",
      JSON.stringify({
        id: authData.user.id,
        name: authData.user.email?.split('@')[0] || 'User',
        email: authData.user.email,
        role: 'user', // Or whatever role logic you have
      })
    )
    
useRouter().push("/dashboard")
  }
}

