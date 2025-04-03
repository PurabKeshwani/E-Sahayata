"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2 } from "lucide-react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from '@supabase/supabase-js'
import { Alert, AlertDescription } from "@/components/ui/alert"

// Initialize Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  age: z.string().refine(
    (val) => {
      const num = Number.parseInt(val)
      return !isNaN(num) && num >= 18 && num <= 80
    },
    { message: "Age must be between 18 and 80." },
  ),
  gender: z.string({ required_error: "Please select a gender." }),
  skills: z.string().min(5, { message: "Please describe your skills in at least 5 characters." }),
  availability: z.array(z.string()).min(1, { message: "Please select at least one availability option." }),
  preferredNgo: z.string({ required_error: "Please select an NGO." }),
  contactNumber: z.string().regex(/^\d{10}$/, { message: "Contact number must be 10 digits." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
})

type FormValues = z.infer<typeof formSchema>

export default function VolunteerRegistrationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      age: "",
      gender: "",
      skills: "",
      availability: [],
      preferredNgo: "",
      contactNumber: "",
      email: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    setErrorMessage(null)
    
    try {
      // Insert volunteer data into Supabase
      const { error } = await supabase
        .from('volunteers')
        .insert({
          full_name: data.fullName,
          age: parseInt(data.age),
          gender: data.gender,
          skills: data.skills,
          availability: data.availability,
          preferred_ngo: data.preferredNgo,
          contact_number: data.contactNumber,
          email: data.email,
          registration_date: new Date().toISOString(),
          status: 'pending'
        })

      if (error) {
        console.error('Error submitting volunteer application:', error)
        throw new Error(`Failed to submit application: ${error.message}`)
      }

      console.log('Volunteer application submitted:', data)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Volunteer application submission error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-12">
        <Card className="w-full">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-center">Application Submitted</CardTitle>
            <CardDescription className="text-center">
              Thank you for volunteering! Your application has been submitted successfully. We will contact you soon.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setIsSubmitted(false)} className="w-full bg-[#10B981] hover:bg-[#059669]">
              Submit Another Application
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Volunteer Registration</h1>
        <p className="mt-2 text-muted-foreground">Join us in making a difference</p>
      </div>

      {errorMessage && (
        <Alert className="mb-6 bg-red-50">
          <AlertDescription className="text-red-600">{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Volunteer Information</CardTitle>
          <CardDescription>Please provide your details to register as a volunteer</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter your age" {...field} />
                    </FormControl>
                    <FormDescription>You must be at least 18 years old to volunteer</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills/Expertise</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your skills, expertise, and experience"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>List any relevant skills that could help our organization</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availability"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Availability</FormLabel>
                      <FormDescription>Select when you are available to volunteer</FormDescription>
                    </div>
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="availability"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("weekdays")}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, "weekdays"])
                                      : field.onChange(field.value?.filter((value) => value !== "weekdays"))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Weekdays</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                      <FormField
                        control={form.control}
                        name="availability"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("weekends")}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, "weekends"])
                                      : field.onChange(field.value?.filter((value) => value !== "weekends"))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Weekends</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredNgo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred NGO</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an NGO" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ngo1">Helping Hands Foundation</SelectItem>
                        <SelectItem value="ngo2">Care & Support Trust</SelectItem>
                        <SelectItem value="ngo3">Community Welfare Society</SelectItem>
                        <SelectItem value="ngo4">Rural Development Initiative</SelectItem>
                        <SelectItem value="ngo5">Children's Education Fund</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the NGO you would like to volunteer with</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Enter 10-digit mobile number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-[#10B981] hover:bg-[#059669]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Apply"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

