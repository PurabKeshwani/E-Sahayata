import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface FormStepBasicProps {
  form: UseFormReturn<any>
}

export function FormStepBasic({ form }: FormStepBasicProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Form Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter form title" {...field} />
            </FormControl>
            <FormDescription>This will be displayed at the top of your form.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter a description for your form (optional)" className="resize-none" {...field} />
            </FormControl>
            <FormDescription>Provide additional context or instructions for form users.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

