import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Eye, Pencil } from "lucide-react"

export default function FormDetails({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the form data based on the ID
  const formData = {
    id: params.id,
    title: "Customer Feedback Form",
    description: "Help us improve our services by providing your feedback",
    createdAt: "2023-05-15",
    updatedAt: "2023-05-20",
    responses: 12,
    fields: [
      { id: "1", label: "Name", type: "text", required: true },
      { id: "2", label: "Email", type: "email", required: true },
      { id: "3", label: "Rating", type: "select", required: true },
      { id: "4", label: "Comments", type: "textarea", required: false },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forms
        </Link>
      </div>

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">{formData.title}</h1>
          <p className="mt-1 text-muted-foreground">{formData.description}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/forms/${params.id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Form
            </Button>
          </Link>
          <Link href={`/forms/${params.id}/preview`}>
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{formData.responses}</CardTitle>
            <CardDescription>Total Responses</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{formData.fields.length}</CardTitle>
            <CardDescription>Form Fields</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{new Date(formData.updatedAt).toLocaleDateString()}</CardTitle>
            <CardDescription>Last Updated</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Response Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                View a summary of all responses collected through this form.
              </p>
              <Button variant="outline" className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                View Responses
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Export Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Download all form responses as CSV or Excel file for analysis.
              </p>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export Responses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Form Fields</CardTitle>
            <CardDescription>Overview of all fields in your form</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.fields.map((field) => (
                <div key={field.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">{field.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      Type: {field.type} {field.required && "• Required"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

