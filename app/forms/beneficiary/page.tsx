"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CheckCircle2, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUploader } from "@/components/file-uploader"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with additional options
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  gender: z.enum(["male", "female", "other"], { required_error: "Please select a gender." }),
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  contactNumber: z.string().regex(/^\d{10}$/, { message: "Contact number must be 10 digits." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  ngoName: z.string({ required_error: "Please select an NGO." }),
  category: z.string({ required_error: "Please select a category." }),
  incomeRange: z.string({ required_error: "Please select your income range." }),
})

type FormValues = z.infer<typeof formSchema>

// Mock user type
type User = {
  id: string
  name: string
  email: string
  role: string
}

export default function BeneficiaryRegistrationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [autoSaveMessage, setAutoSaveMessage] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isClient, setIsClient] = useState(false)
  // Keep state variables for UI purposes only
  const [aadharFile, setAadharFile] = useState<File | null>(null)
  const [incomeFile, setIncomeFile] = useState<File | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      address: "",
      contactNumber: "",
      email: "",
      category: "",
      incomeRange: "",
    },
  })

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in and auto-fill form data
    const userData = localStorage.getItem("e-sahayata-user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Auto-fill form with user data
      form.setValue("fullName", parsedUser.name || "")
      form.setValue("email", parsedUser.email || "")

      // Simulate retrieving additional user data
      if (parsedUser.email === "admin@example.com") {
        form.setValue("contactNumber", "9876543210")
        form.setValue("address", "123 Main Street, City, State, 123456")
      }
    }

    // Set up auto-save functionality
    const autoSaveInterval = setInterval(() => {
      const formData = form.getValues()
      const isFormDirty = Object.values(formData).some((value) => value !== undefined && value !== "")

      if (isFormDirty) {
        // Save form data to localStorage
        localStorage.setItem("beneficiary-form-draft", JSON.stringify(formData))
        setAutoSaveMessage("Draft saved automatically")

        // Clear message after 3 seconds
        setTimeout(() => {
          setAutoSaveMessage(null)
        }, 3000)
      }
    }, 30000) // Auto-save every 30 seconds

    // Load draft if exists
    const savedDraft = localStorage.getItem("beneficiary-form-draft")
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft)
        Object.entries(draftData).forEach(([key, value]) => {
          // Skip dateOfBirth as it needs special handling
          if (key !== "dateOfBirth" && value) {
            form.setValue(key as any, value as any)
          }
        })

        // Handle dateOfBirth separately if it exists
        if (draftData.dateOfBirth) {
          form.setValue("dateOfBirth", new Date(draftData.dateOfBirth))
        }
      } catch (error) {
        console.error("Error loading draft:", error)
      }
    }

    return () => {
      clearInterval(autoSaveInterval)
    }
  }, [form])

  async function onSubmit(data: FormValues) {
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      // Insert beneficiary data without document URLs
      const { data: beneficiary, error: insertError } = await supabase
        .from('beneficiaries')
        .insert({
          full_name: data.fullName,
          gender: data.gender,
          date_of_birth: data.dateOfBirth.toISOString().split('T')[0],
          address: data.address,
          contact_number: data.contactNumber,
          email: data.email,
          ngo_name: data.ngoName,
          category: data.category,
          income_range: data.incomeRange,
          // Remove the document URL fields that don't exist in the database
        })
        .select()
        .single()
  
      if (insertError) {
        console.error('Insert error:', insertError)
        throw new Error(`Database error: ${insertError.message}`)
      }
      
      // Log success with document info for UI purposes only
      if (aadharFile) {
        console.log('Aadhar document would be uploaded:', aadharFile.name)
      }
      if (incomeFile) {
        console.log('Income document would be uploaded:', incomeFile.name)
      }
      
      localStorage.removeItem("beneficiary-form-draft")
      setIsSubmitted(true)
  
    } catch (error) {
      console.error('Form submission error:', error)
      alert(error instanceof Error ? error.message : 'Failed to submit form. Please try again.')
    }
  }

  function saveDraft() {
    setIsSaving(true)
    const formData = form.getValues()
    localStorage.setItem("beneficiary-form-draft", JSON.stringify(formData))

    setTimeout(() => {
      setIsSaving(false)
      setAutoSaveMessage("Draft saved successfully")

      setTimeout(() => {
        setAutoSaveMessage(null)
      }, 3000)
    }, 1000)
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-12">
        <Card className="w-full">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-center">Registration Successful</CardTitle>
            <CardDescription className="text-center">
              Thank you for registering as a beneficiary. Your information has been submitted successfully.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setIsSubmitted(false)} className="w-full bg-[#10B981] hover:bg-[#059669]">
              Register Another Beneficiary
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Beneficiary Registration</h1>
        <p className="mt-2 text-muted-foreground">Fill in the details to register as a beneficiary</p>
      </div>

      {autoSaveMessage && (
        <Alert className="mb-6 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">{autoSaveMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Please provide accurate information for registration purposes</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="font-normal">Male</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal">Female</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="other" />
                          </FormControl>
                          <FormLabel className="font-normal">Other</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter your full address" className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Enter 10-digit mobile number" {...field} />
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
                      <Input type="email" placeholder="Enter your email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ngoName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NGO Name</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an NGO" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ngo1">Helping Hands Foundation</SelectItem>
                        <SelectItem value="ngo2">Care & Support Trust</SelectItem>
                        <SelectItem value="ngo3">Community Welfare Society</SelectItem>
                        <SelectItem value="ngo4">Rural Development Initiative</SelectItem>
                        <SelectItem value="ngo5">Children's Education Fund</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the NGO you are registering with</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="obc">OBC</SelectItem>
                        <SelectItem value="sc">SC</SelectItem>
                        <SelectItem value="st">ST</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="incomeRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Family Income</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select income range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="below100k">Below ₹1,00,000</SelectItem>
                        <SelectItem value="100k-300k">₹1,00,000 - ₹3,00,000</SelectItem>
                        <SelectItem value="300k-500k">₹3,00,000 - ₹5,00,000</SelectItem>
                        <SelectItem value="500k-800k">₹5,00,000 - ₹8,00,000</SelectItem>
                        <SelectItem value="above800k">Above ₹8,00,000</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <h3 className="mb-2 text-base font-medium">Document Upload</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="aadhar">Aadhaar Card</Label>
                    <FileUploader
                      id="aadhar"
                      accept=".pdf,.jpg,.jpeg,.png"
                      maxSize={5}
                      onUpload={(file) => setAadharFile(file)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="income">Income Certificate</Label>
                    <FileUploader
                      id="income"
                      accept=".pdf,.jpg,.jpeg,.png"
                      maxSize={5}
                      onUpload={(file) => setIncomeFile(file)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button type="button" variant="outline" className="flex-1" onClick={saveDraft} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Draft"}
                </Button>
                <Button type="submit" className="flex-1 bg-[#10B981] hover:bg-[#059669]">
                  Register
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

// Remove these lines at the bottom of the file:
// import { uploadDocumentToStorage } from "@/app/actions/upload"
// async function handleFileUpload(file: File, beneficiaryId: string, documentType: 'aadhar' | 'income') { ... }

