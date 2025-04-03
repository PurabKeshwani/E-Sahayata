"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  ngoName: z.string().min(2, { message: "NGO name must be at least 2 characters." }),
  serviceType: z.string({ required_error: "Please select a service type." }),
  issueDescription: z.string().min(10, { message: "Description must be at least 10 characters." }),
  contactPersonName: z.string().min(2, { message: "Contact person name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phoneNumber: z.string().regex(/^\d{10}$/, { message: "Phone number must be 10 digits." }),
})

type FormValues = z.infer<typeof formSchema>

export default function ServiceRequestForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ngoName: "",
      serviceType: "",
      issueDescription: "",
      contactPersonName: "",
      email: "",
      phoneNumber: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    setErrorMessage(null)
    
    try {
      // Insert service request data into Supabase
      const { error } = await supabase
        .from('service_requests')
        .insert({
          ngo_name: data.ngoName,
          service_type: data.serviceType,
          issue_description: data.issueDescription,
          contact_person_name: data.contactPersonName,
          email: data.email,
          phone_number: data.phoneNumber,
          request_date: new Date().toISOString(),
          status: 'pending'
        })

      if (error) {
        console.error('Error submitting service request:', error)
        throw new Error(`Failed to submit request: ${error.message}`)
      }

      console.log('Service request submitted:', data)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Service request submission error:', error)
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
            <CardTitle className="text-center">Request Submitted</CardTitle>
            <CardDescription className="text-center">
              Your service request has been submitted successfully. Our team will get back to you shortly.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setIsSubmitted(false)} className="w-full bg-[#10B981] hover:bg-[#059669]">
              Submit Another Request
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Service Request Form</h1>
        <p className="mt-2 text-muted-foreground">Request digital services or report issues</p>
      </div>

      {errorMessage && (
        <Alert className="mb-6 bg-red-50">
          <AlertDescription className="text-red-600">{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Service Request Details</CardTitle>
          <CardDescription>
            Please provide details about the service you need or issue you're experiencing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="ngoName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NGO Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your NGO name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dataRetrieval">Data Retrieval</SelectItem>
                        <SelectItem value="formModification">Form Modification</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="training">Training Request</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issueDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please describe your issue or service request in detail"
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide as much detail as possible to help us address your request efficiently
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPersonName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact person's name" {...field} />
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
                      <Input type="email" placeholder="Enter contact email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Enter 10-digit phone number" {...field} />
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
                {isSubmitting ? "Processing..." : "Submit Request"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

