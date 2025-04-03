import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface FormStepSettingsProps {
  form: UseFormReturn<any>
}

export function FormStepSettings({ form }: FormStepSettingsProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="settings.allowMultipleSubmissions"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Allow Multiple Submissions</FormLabel>
              <FormDescription>Let users submit the form multiple times from the same device</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="settings.confirmationMessage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirmation Message</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter a message to show after form submission"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>This message will be displayed to users after they submit the form.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="settings.notifyEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notification Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Enter email to receive notifications (optional)" {...field} />
            </FormControl>
            <FormDescription>Get notified by email when someone submits your form.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

