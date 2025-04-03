// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Form } from "@/components/ui/form"
// import { FormStepBasic } from "@/components/form-step-basic"
// import { FormStepFields } from "@/components/form-step-fields"
// import { FormStepSettings } from "@/components/form-step-settings"
// import { FormStepPreview } from "@/components/form-step-preview"
// import { FormProgress } from "@/components/form-progress"

// const formSchema = z.object({
//   title: z.string().min(2, {
//     message: "Title must be at least 2 characters.",
//   }),
//   description: z.string().optional(),
//   fields: z.array(
//     z.object({
//       id: z.string(),
//       type: z.enum(["text", "email", "number", "textarea", "select", "checkbox", "radio"]),
//       label: z.string(),
//       placeholder: z.string().optional(),
//       required: z.boolean().default(false),
//       options: z.array(z.string()).optional(),
//     }),
//   ),
//   settings: z.object({
//     allowMultipleSubmissions: z.boolean().default(false),
//     confirmationMessage: z.string(),
//     notifyEmail: z.string().email().optional(),
//   }),
// })

// export default function CreateForm() {
//   const router = useRouter()
//   const [step, setStep] = useState(1)
//   const totalSteps = 4

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       fields: [],
//       settings: {
//         allowMultipleSubmissions: false,
//         confirmationMessage: "Thank you for your submission!",
//         notifyEmail: "",
//       },
//     },
//   })

//   function nextStep() {
//     if (step < totalSteps) {
//       setStep(step + 1)
//     }
//   }

//   function prevStep() {
//     if (step > 1) {
//       setStep(step - 1)
//     }
//   }

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     console.log(values)
//     // Here you would save the form to your backend
//     router.push("/")
//   }

//   return (
//     <div className="container mx-auto px-4 py-12">
//       <div className="mb-8 text-center">
//         <h1 className="text-3xl font-bold">Create New Form</h1>
//         <p className="mt-2 text-muted-foreground">Design your form in a few simple steps</p>
//       </div>

//       <Card className="mx-auto max-w-3xl">
//         <CardHeader>
//           <CardTitle>
//             Step {step} of {totalSteps}
//           </CardTitle>
//           <CardDescription>
//             {step === 1 && "Basic information about your form"}
//             {step === 2 && "Add fields to your form"}
//             {step === 3 && "Configure form settings"}
//             {step === 4 && "Preview and publish your form"}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <FormProgress currentStep={step} totalSteps={totalSteps} />

//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6 pt-6">
//               {step === 1 && <FormStepBasic form={form} />}
//               {step === 2 && <FormStepFields form={form} />}
//               {step === 3 && <FormStepSettings form={form} />}
//               {step === 4 && <FormStepPreview form={form} />}
//             </form>
//           </Form>
//         </CardContent>
//         <CardFooter className="flex justify-between border-t p-6">
//           <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1}>
//             Previous
//           </Button>
//           <div>
//             {step < totalSteps ? (
//               <Button type="button" onClick={nextStep}>
//                 Next
//               </Button>
//             ) : (
//               <Button type="button" onClick={form.handleSubmit(onSubmit)}>
//                 Create Form
//               </Button>
//             )}
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }

