"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Search, Eye, Download } from "lucide-react"
// Mock user type
type User = {
  id: string
  name: string
  email: string
  role: string
}

// Mock application type
type Application = {
  id: string
  formType: string
  title: string
  submittedDate: string
  status: "pending" | "approved" | "rejected"
  category: string
}

import RequireAuth from "@/components/auth/require-auth"

function DashboardContent() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")

  // Mock applications data
  const applications: Application[] = [
    {
      id: "APP-001",
      formType: "beneficiary",
      title: "Beneficiary Registration",
      submittedDate: "2023-05-15",
      status: "approved",
      category: "registration",
    },
    {
      id: "APP-002",
      formType: "volunteer",
      title: "Volunteer Application",
      submittedDate: "2023-06-10",
      status: "pending",
      category: "volunteer",
    },
    {
      id: "APP-003",
      formType: "service",
      title: "Service Request",
      submittedDate: "2023-06-20",
      status: "rejected",
      category: "service",
    },
    {
      id: "APP-004",
      formType: "donation",
      title: "Donation Form",
      submittedDate: "2023-07-05",
      status: "approved",
      category: "donation",
    },
    {
      id: "APP-005",
      formType: "event",
      title: "Event Registration",
      submittedDate: "2023-07-15",
      status: "pending",
      category: "event",
    },
  ]

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const userData = localStorage.getItem("e-sahayata-user")
      if (userData) {
        setUser(JSON.parse(userData))
      } else {
        router.push("/auth/login")
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

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

  // Filter applications based on search term and active filter
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeFilter === "all") return matchesSearch
    if (activeFilter === "pending") return matchesSearch && app.status === "pending"
    if (activeFilter === "approved") return matchesSearch && app.status === "approved"
    if (activeFilter === "rejected") return matchesSearch && app.status === "rejected"

    return matchesSearch
  })

  // Reusable application list component
  const ApplicationList = ({ applications }: { applications: Application[] }) => (
    <div className="space-y-4">
      {applications.length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed text-center">
          <p className="text-sm text-muted-foreground">No applications found</p>
        </div>
      ) : (
        applications.map((application) => (
          <div
            key={application.id}
            className="flex flex-col justify-between rounded-lg border p-4 sm:flex-row sm:items-center"
          >
            <div className="mb-2 sm:mb-0">
              <div className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">{application.title}</h3>
                <Badge
                  className={`ml-2 ${
                    application.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : application.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                  variant="outline"
                >
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                ID: {application.id} • Submitted on{" "}
                {new Date(application.submittedDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="mr-1 h-4 w-4" />
                View
              </Button>
              {application.status === "approved" && (
                <Button variant="outline" size="sm">
                  <Download className="mr-1 h-4 w-4" />
                  Download
                </Button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <p className="mt-2 text-muted-foreground">Manage your applications and track their status</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{applications.length}</CardTitle>
            <CardDescription>Total Applications</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{applications.filter((app) => app.status === "pending").length}</CardTitle>
            <CardDescription>Pending Applications</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{applications.filter((app) => app.status === "approved").length}</CardTitle>
            <CardDescription>Approved Applications</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveFilter}>
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <TabsList>
              <TabsTrigger value="all">All Applications</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Application History</CardTitle>
                <CardDescription>View and track all your submitted applications</CardDescription>
              </CardHeader>
              <CardContent>
                <ApplicationList applications={filteredApplications} />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Previous</Button>
                <Button variant="outline">Next</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Pending Applications</CardTitle>
                <CardDescription>Applications awaiting review or approval</CardDescription>
              </CardHeader>
              <CardContent>
                <ApplicationList 
                  applications={filteredApplications.filter(app => app.status === "pending")} 
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Previous</Button>
                <Button variant="outline">Next</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Approved Applications</CardTitle>
                <CardDescription>Applications that have been approved</CardDescription>
              </CardHeader>
              <CardContent>
                <ApplicationList 
                  applications={filteredApplications.filter(app => app.status === "approved")} 
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Previous</Button>
                <Button variant="outline">Next</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="rejected" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Rejected Applications</CardTitle>
                <CardDescription>Applications that have been declined</CardDescription>
              </CardHeader>
              <CardContent>
                <ApplicationList 
                  applications={filteredApplications.filter(app => app.status === "rejected")} 
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Previous</Button>
                <Button variant="outline">Next</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  )
}

