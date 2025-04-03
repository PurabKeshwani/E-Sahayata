"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { FileUploader } from "@/components/file-uploader"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

// Mock user type
type User = {
  id: string
  name: string
  email: string
  role: string
}

const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone number must be 10 digits." }),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"], { required_error: "Please select a gender." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "male",
      address: "",
    },
  })

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const userData = localStorage.getItem("e-sahayata-user")
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)

        // Set form default values
        form.setValue("fullName", parsedUser.name || "")
        form.setValue("email", parsedUser.email || "")
        form.setValue("phone", "9876543210") // Mock data
        form.setValue("dateOfBirth", "1990-01-01") // Mock data
        form.setValue("gender", "male") // Mock data
        form.setValue("address", "123 Main Street, City, State, 123456") // Mock data
      } else {
        router.push("/auth/login")
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router, form])

  function onSubmit(data: ProfileFormValues) {
    setIsSaving(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    // Simulate API call
    setTimeout(() => {
      // Update user data in localStorage
      if (user) {
        const updatedUser = {
          ...user,
          name: data.fullName,
          email: data.email,
        }
        localStorage.setItem("e-sahayata-user", JSON.stringify(updatedUser))
        setUser(updatedUser)
        setSuccessMessage("Profile updated successfully")
      } else {
        setErrorMessage("Failed to update profile. Please try again.")
      }
      setIsSaving(false)
    }, 1500)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="mt-2 text-muted-foreground">Manage your personal information and documents</p>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              {successMessage && (
                <Alert className="mb-4 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
                </Alert>
              )}

              {errorMessage && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your 10-digit phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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

                  <Button type="submit" className="bg-[#10B981] hover:bg-[#059669]" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Document Management</CardTitle>
              <CardDescription>Upload and manage your important documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-medium">Identity Documents</h3>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="aadhar">Aadhaar Card</Label>
                      <FileUploader
                        id="aadhar"
                        accept=".pdf,.jpg,.jpeg,.png"
                        maxSize={5}
                        onUpload={(file) => console.log("Uploaded:", file)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pan">PAN Card</Label>
                      <FileUploader
                        id="pan"
                        accept=".pdf,.jpg,.jpeg,.png"
                        maxSize={5}
                        onUpload={(file) => console.log("Uploaded:", file)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-medium">Address Proof</h3>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="ration">Ration Card</Label>
                      <FileUploader
                        id="ration"
                        accept=".pdf,.jpg,.jpeg,.png"
                        maxSize={5}
                        onUpload={(file) => console.log("Uploaded:", file)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="utility">Utility Bill</Label>
                      <FileUploader
                        id="utility"
                        accept=".pdf,.jpg,.jpeg,.png"
                        maxSize={5}
                        onUpload={(file) => console.log("Uploaded:", file)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-medium">Other Documents</h3>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="income">Income Certificate</Label>
                      <FileUploader
                        id="income"
                        accept=".pdf,.jpg,.jpeg,.png"
                        maxSize={5}
                        onUpload={(file) => console.log("Uploaded:", file)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="other">Other Documents</Label>
                      <FileUploader
                        id="other"
                        accept=".pdf,.jpg,.jpeg,.png"
                        maxSize={5}
                        onUpload={(file) => console.log("Uploaded:", file)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-[#10B981] hover:bg-[#059669]">Save All Documents</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-medium">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                </div>

                <Button className="bg-[#10B981] hover:bg-[#059669]">Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

