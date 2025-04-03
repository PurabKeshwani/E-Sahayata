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
  name: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal("")),
  feedbackType: z.string({ required_error: "Please select a feedback type." }),
  message: z.string().min(5, { message: "Message must be at least 5 characters." }),
})

type FormValues = z.infer<typeof formSchema>

export default function FeedbackForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      feedbackType: "",
      message: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    setErrorMessage(null)
    
    try {
      // Insert feedback data into Supabase
      const { error } = await supabase
        .from('feedback')
        .insert({
          name: data.name || 'Anonymous',
          email: data.email || null,
          feedback_type: data.feedbackType,
          message: data.message,
          submission_date: new Date().toISOString(),
          status: 'new'
        })

      if (error) {
        console.error('Error submitting feedback:', error)
        throw new Error(`Failed to submit feedback: ${error.message}`)
      }

      console.log('Feedback submitted:', data)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Feedback submission error:', error)
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
            <CardTitle className="text-center">Feedback Submitted</CardTitle>
            <CardDescription className="text-center">
              Thank you for sharing your feedback. Your input helps us improve our services.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setIsSubmitted(false)} className="w-full bg-[#10B981] hover:bg-[#059669]">
              Submit Another Feedback
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Share Your Feedback</h1>
        <p className="mt-2 text-muted-foreground">Help us improve by sharing your suggestions</p>
      </div>

      {errorMessage && (
        <Alert className="mb-6 bg-red-50">
          <AlertDescription className="text-red-600">{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Feedback Form</CardTitle>
          <CardDescription>
            Your feedback is valuable to us. Feel free to share your thoughts anonymously.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormDescription>You can choose to remain anonymous</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address (Optional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email address" {...field} />
                    </FormControl>
                    <FormDescription>Provide your email if you would like us to follow up</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="feedbackType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select feedback type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="complaint">Complaint</SelectItem>
                        <SelectItem value="suggestion">Suggestion</SelectItem>
                        <SelectItem value="compliment">Compliment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please share your detailed feedback here"
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
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
                {isSubmitting ? "Sending..." : "Send Feedback"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

