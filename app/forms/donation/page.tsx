"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle2 } from "lucide-react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { createClient } from '@supabase/supabase-js'
import { Alert, AlertDescription } from "@/components/ui/alert"

// Initialize Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const formSchema = z.object({
  donorName: z.string().min(2, { message: "Donor name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  donationAmount: z.string().refine(
    (val) => {
      const num = Number.parseInt(val)
      return !isNaN(num) && num >= 100
    },
    { message: "Donation amount must be at least ₹100." },
  ),
  paymentMethod: z.enum(["upi", "netbanking", "card"], { required_error: "Please select a payment method." }),
  message: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function DonationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      donorName: "",
      email: "",
      donationAmount: "",
      message: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    setErrorMessage(null)
    
    try {
      // Insert donation data into Supabase
      const { error } = await supabase
        .from('donations')
        .insert({
          donor_name: data.donorName,
          email: data.email,
          donation_amount: parseInt(data.donationAmount),
          payment_method: data.paymentMethod,
          message: data.message || null,
          donation_date: new Date().toISOString(),
          status: 'completed' // In a real app, this would be set after payment processing
        })

      if (error) {
        console.error('Error submitting donation:', error)
        throw new Error(`Failed to submit donation: ${error.message}`)
      }

      // In a real app, you would process payment here
      console.log('Donation submitted:', data)
      
      setIsSubmitted(true)
    } catch (error) {
      console.error('Donation submission error:', error)
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
            <CardTitle className="text-center">Thank You for Your Donation!</CardTitle>
            <CardDescription className="text-center">
              Your generous contribution will help us make a difference. A receipt has been sent to your email.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setIsSubmitted(false)} className="w-full bg-[#10B981] hover:bg-[#059669]">
              Make Another Donation
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Support Our Mission</h1>
        <p className="mt-2 text-muted-foreground">Contribute to making a difference</p>
      </div>

      {errorMessage && (
        <Alert className="mb-6 bg-red-50">
          <AlertDescription className="text-red-600">{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Donation Information</CardTitle>
          <CardDescription>Your contribution helps us continue our work in the community</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="donorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
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
                    <FormDescription>We'll send the donation receipt to this email</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="donationAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donation Amount (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter amount (minimum ₹100)" {...field} />
                    </FormControl>
                    <FormDescription>Minimum donation amount is ₹100</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="upi" />
                          </FormControl>
                          <FormLabel className="font-normal">UPI</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="netbanking" />
                          </FormControl>
                          <FormLabel className="font-normal">Net Banking</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="card" />
                          </FormControl>
                          <FormLabel className="font-normal">Credit/Debit Card</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Leave a message with your donation" className="resize-none" {...field} />
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
                {isSubmitting ? "Processing..." : "Donate Now"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

