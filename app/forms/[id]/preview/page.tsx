import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

export default function FormPreview({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the form data based on the ID
  const formData = {
    id: params.id,
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
      confirmationMessage: "Thank you for your feedback!",
    },
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

      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Form Preview</h1>
          <p className="mt-2 text-muted-foreground">This is how your form will appear to users</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{formData.title}</CardTitle>
            {formData.description && <CardDescription>{formData.description}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="flex items-center">
                  {field.label}
                  {field.required && <span className="ml-1 text-destructive">*</span>}
                </Label>

                {field.type === "text" && <Input id={field.id} placeholder={field.placeholder} />}

                {field.type === "email" && <Input id={field.id} type="email" placeholder={field.placeholder} />}

                {field.type === "textarea" && <Textarea id={field.id} placeholder={field.placeholder} />}

                {field.type === "select" && (
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option, index) => (
                        <SelectItem key={index} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button className="w-full">Submit</Button>
          </CardFooter>
        </Card>

        <div className="mt-8 rounded-lg border p-4">
          <h2 className="mb-2 text-lg font-medium">After Submission</h2>
          <p className="text-muted-foreground">{formData.settings.confirmationMessage}</p>
        </div>

        <div className="mt-8 flex justify-center">
          <Link href={`/forms/${params.id}/edit`}>
            <Button variant="outline">Edit This Form</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

