"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
  participantName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.string().refine(
    (val) => {
      const num = Number.parseInt(val)
      return !isNaN(num) && num >= 5 && num <= 100
    },
    { message: "Age must be between 5 and 100." },
  ),
  gender: z.string({ required_error: "Please select a gender." }),
  eventName: z.string({ required_error: "Please select an event." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  contactNumber: z.string().regex(/^\d{10}$/, { message: "Contact number must be 10 digits." }),
})

type FormValues = z.infer<typeof formSchema>

export default function EventParticipationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      participantName: "",
      age: "",
      gender: "",
      eventName: "",
      email: "",
      contactNumber: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    setErrorMessage(null)
    
    try {
      // Insert event participation data into Supabase
      const { error } = await supabase
        .from('event_participants')
        .insert({
          participant_name: data.participantName,
          age: parseInt(data.age),
          gender: data.gender,
          event_name: data.eventName,
          email: data.email,
          contact_number: data.contactNumber,
          registration_date: new Date().toISOString(),
          status: 'registered'
        })

      if (error) {
        console.error('Error submitting registration:', error)
        throw new Error(`Failed to register: ${error.message}`)
      }

      console.log('Event registration submitted:', data)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Registration submission error:', error)
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
            <CardTitle className="text-center">Registration Successful</CardTitle>
            <CardDescription className="text-center">
              You have successfully registered for the event. We look forward to your participation!
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setIsSubmitted(false)} className="w-full bg-[#10B981] hover:bg-[#059669]">
              Register for Another Event
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Event Registration</h1>
        <p className="mt-2 text-muted-foreground">Sign up for upcoming events and make an impact</p>
      </div>

      {errorMessage && (
        <Alert className="mb-6 bg-red-50">
          <AlertDescription className="text-red-600">{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Event Registration Details</CardTitle>
          <CardDescription>Please provide your information to register for an event</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="participantName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participant Name</FormLabel>
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
                name="eventName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an event" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workshop">NGO Workshop</SelectItem>
                        <SelectItem value="outreach">Community Outreach</SelectItem>
                        <SelectItem value="fundraiser">Fundraiser Event</SelectItem>
                        <SelectItem value="training">Digital Training Session</SelectItem>
                        <SelectItem value="awareness">Awareness Campaign</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the event you would like to participate in</FormDescription>
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
                    <FormDescription>We'll send event details and updates to this email</FormDescription>
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

              <Button 
                type="submit" 
                className="w-full bg-[#10B981] hover:bg-[#059669]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Register for Event"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

