"use client"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Grip, Plus, Trash2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface FormStepFieldsProps {
  form: UseFormReturn<any>
}

const fieldTypes = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "number", label: "Number" },
  { value: "textarea", label: "Text Area" },
  { value: "select", label: "Dropdown" },
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio Button" },
]

export function FormStepFields({ form }: FormStepFieldsProps) {
  const [showFieldForm, setShowFieldForm] = useState(false)
  const [newField, setNewField] = useState({
    id: "",
    type: "text",
    label: "",
    placeholder: "",
    required: false,
    options: [""],
  })

  const fields = form.watch("fields") || []

  const addField = () => {
    const fieldToAdd = {
      ...newField,
      id: uuidv4(),
    }
    form.setValue("fields", [...fields, fieldToAdd])
    setNewField({
      id: "",
      type: "text",
      label: "",
      placeholder: "",
      required: false,
      options: [""],
    })
    setShowFieldForm(false)
  }

  const removeField = (index: number) => {
    const updatedFields = [...fields]
    updatedFields.splice(index, 1)
    form.setValue("fields", updatedFields)
  }

  const addOption = () => {
    setNewField({
      ...newField,
      options: [...(newField.options || []), ""],
    })
  }

  const updateOption = (index: number, value: string) => {
    const updatedOptions = [...(newField.options || [])]
    updatedOptions[index] = value
    setNewField({
      ...newField,
      options: updatedOptions,
    })
  }

  const removeOption = (index: number) => {
    const updatedOptions = [...(newField.options || [])]
    updatedOptions.splice(index, 1)
    setNewField({
      ...newField,
      options: updatedOptions,
    })
  }

  return (
    <div className="space-y-6">
      {fields.length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed text-center">
          <p className="text-sm text-muted-foreground">No fields added yet</p>
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => setShowFieldForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Field
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {fields.map((field: any, index: number) => (
              <Card key={field.id} className="relative">
                <div className="absolute left-3 top-3 cursor-move text-muted-foreground">
                  <Grip className="h-5 w-5" />
                </div>
                <CardHeader className="pl-12">
                  <CardTitle className="text-base font-medium">{field.label}</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between border-t pt-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div>Type: {fieldTypes.find((t) => t.value === field.type)?.label}</div>
                    {field.required && <div className="text-primary">Required</div>}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeField(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center">
            <Button type="button" variant="outline" onClick={() => setShowFieldForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Another Field
            </Button>
          </div>
        </>
      )}

      {showFieldForm && (
        <Card className="mt-6 border-primary/50">
          <CardHeader>
            <CardTitle className="text-lg">Add New Field</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FormLabel>Field Type</FormLabel>
                <Select value={newField.type} onValueChange={(value) => setNewField({ ...newField, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <FormLabel>Field Label</FormLabel>
                <Input
                  value={newField.label}
                  onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                  placeholder="Enter field label"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FormLabel>Placeholder Text</FormLabel>
                <Input
                  value={newField.placeholder}
                  onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                  placeholder="Enter placeholder text"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  checked={newField.required}
                  onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
                  id="required-field"
                />
                <FormLabel htmlFor="required-field" className="cursor-pointer">
                  Required Field
                </FormLabel>
              </div>
            </div>

            {(newField.type === "select" || newField.type === "radio" || newField.type === "checkbox") && (
              <div className="space-y-3">
                <FormLabel>Options</FormLabel>
                {newField.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      disabled={newField.options?.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addOption}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Option
                </Button>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowFieldForm(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={addField} disabled={!newField.label}>
                Add Field
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

