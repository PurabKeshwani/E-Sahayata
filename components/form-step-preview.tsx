import type { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface FormStepPreviewProps {
  form: UseFormReturn<any>
}

export function FormStepPreview({ form }: FormStepPreviewProps) {
  const formData = form.getValues()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium">Form Preview</h3>
        <p className="text-sm text-muted-foreground">This is how your form will appear to users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{formData.title}</CardTitle>
          {formData.description && <CardDescription>{formData.description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.fields.map((field: any) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="flex items-center">
                {field.label}
                {field.required && <span className="ml-1 text-destructive">*</span>}
              </Label>

              {field.type === "text" && <Input id={field.id} placeholder={field.placeholder} />}

              {field.type === "email" && <Input id={field.id} type="email" placeholder={field.placeholder} />}

              {field.type === "number" && <Input id={field.id} type="number" placeholder={field.placeholder} />}

              {field.type === "textarea" && <Textarea id={field.id} placeholder={field.placeholder} />}

              {field.type === "select" && (
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option: string, index: number) => (
                      <SelectItem key={index} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === "checkbox" && (
                <div className="space-y-2">
                  {field.options?.map((option: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox id={`${field.id}-${index}`} />
                      <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                    </div>
                  ))}
                </div>
              )}

              {field.type === "radio" && (
                <RadioGroup>
                  {field.options?.map((option: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                      <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="rounded-md bg-muted p-4">
        <h4 className="mb-2 font-medium">Form Settings</h4>
        <ul className="space-y-2 text-sm">
          <li>
            <span className="font-medium">Multiple Submissions:</span>{" "}
            {formData.settings.allowMultipleSubmissions ? "Allowed" : "Not allowed"}
          </li>
          <li>
            <span className="font-medium">Confirmation Message:</span> {formData.settings.confirmationMessage}
          </li>
          {formData.settings.notifyEmail && (
            <li>
              <span className="font-medium">Notification Email:</span> {formData.settings.notifyEmail}
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

