"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { FormStepBasic } from "@/components/form-step-basic"
import { FormStepFields } from "@/components/form-step-fields"
import { FormStepSettings } from "@/components/form-step-settings"
import { FormStepPreview } from "@/components/form-step-preview"
import { FormProgress } from "@/components/form-progress"
import { ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  fields: z.array(
    z.object({
      id: z.string(),
      type: z.enum(["text", "email", "number", "textarea", "select", "checkbox", "radio"]),
      label: z.string(),
      placeholder: z.string().optional(),
      required: z.boolean().default(false),
      options: z.array(z.string()).optional(),
    }),
  ),
  settings: z.object({
    allowMultipleSubmissions: z.boolean().default(false),
    confirmationMessage: z.string(),
    notifyEmail: z.string().email().optional(),
  }),
})

export default function EditForm({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const totalSteps = 4

  // In a real app, you would fetch the form data based on the ID
  const mockFormData = {
    title: "Customer Feedback Form",
    description: "Help us improve our services by providing your feedback",
    fields: [
      {
        id: "1",
        type: "text",
        label: "Name",
        placeholder: "Enter your full name",
        required: true,
      },
      {
        id: "2",
        type: "email",
        label: "Email",
        placeholder: "Enter your email address",
        required: true,
      },
      {
        id: "3",
        type: "select",
        label: "Rating",
        placeholder: "Select your rating",
        required: true,
        options: ["Excellent", "Good", "Average", "Poor"],
      },
      {
        id: "4",
        type: "textarea",
        label: "Comments",
        placeholder: "Please share your feedback",
        required: false,
      },
    ],
    settings: {
      allowMultipleSubmissions: false,
      confirmationMessage: "Thank you for your feedback!",
      notifyEmail: "notifications@example.com",
    },
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: mockFormData,
  })

  function nextStep() {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  function prevStep() {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Here you would update the form in your backend
    router.push(`/forms/${params.id}`)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href={`/forms/${params.id}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Form Details
        </Link>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Edit Form</h1>
        <p className="mt-2 text-muted-foreground">Update your form design and settings</p>
      </div>

      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>
            Step {step} of {totalSteps}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Basic information about your form"}
            {step === 2 && "Add fields to your form"}
            {step === 3 && "Configure form settings"}
            {step === 4 && "Preview and publish your form"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProgress currentStep={step} totalSteps={totalSteps} />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
              {step === 1 && <FormStepBasic form={form} />}
              {step === 2 && <FormStepFields form={form} />}
              {step === 3 && <FormStepSettings form={form} />}
              {step === 4 && <FormStepPreview form={form} />}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1}>
            Previous
          </Button>
          <div>
            {step < totalSteps ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="button" onClick={form.handleSubmit(onSubmit)}>
                Save Changes
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

