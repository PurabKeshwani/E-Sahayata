"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, MessageSquare, HelpCircle, Heart, Calendar, Search, Filter, Loader2 } from "lucide-react"
import { createClient } from '@supabase/supabase-js'
import RequireAuth from "@/components/auth/require-auth"

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function FormsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [responseCounts, setResponseCounts] = useState({
    beneficiary: 0,
    volunteer: 0,
    feedback: 0,
    service: 0,
    donation: 0,
    event: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefreshed, setLastRefreshed] = useState(new Date())
  
  // Function to fetch response counts
  const fetchResponseCounts = async () => {
    setIsLoading(true)
    try {
      // Fetch counts for each table with more detailed error handling
      const fetchTableCount = async (tableName: string) => {
        try {
          // Try to use RPC function to get count (bypasses RLS)
          const { data: rpcData, error: rpcError } = await supabase.rpc('get_table_count', { 
            table_name: tableName 
          });
          
          if (!rpcError && rpcData !== null) {
            console.log(`${tableName} count from RPC:`, rpcData);
            return rpcData;
          }
          
          // If RPC fails, try direct count with auth
          const { count, error } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });
          
          if (error) {
            console.error(`Error fetching ${tableName} count:`, error);
            
            // Check if this is an RLS error
            if (error.message.includes('permission') || error.message.includes('policy')) {
              console.warn(`Possible RLS policy restriction on ${tableName}`);
            }
            
            return 0;
          }
          
          // If count is 0, double-check by actually fetching some data
          if (count === 0) {
            const { data, error: fetchError } = await supabase
              .from(tableName)
              .select('id')
              .limit(5);
            
            if (fetchError) {
              console.error(`Error fetching ${tableName} data:`, fetchError);
              return 0;
            }
            
            // Log the actual data to verify
            console.log(`${tableName} sample data:`, data);
            
            // If we got data but count was 0, return the length of the data array
            if (data && data.length > 0) {
              console.log(`${tableName} has data but count was 0, using data.length:`, data.length);
              return data.length;
            }
          }
          
          console.log(`${tableName} count:`, count);
          return count ?? 0;
        } catch (e) {
          console.error(`Unexpected error with ${tableName}:`, e);
          return 0;
        }
      };
  
      const [
        beneficiaryCount,
        volunteerCount,
        feedbackCount,
        serviceCount,
        donationCount,
        eventCount
      ] = await Promise.all([
        fetchTableCount('beneficiaries'),
        fetchTableCount('volunteers'),
        fetchTableCount('feedback'),
        fetchTableCount('service_requests'),
        fetchTableCount('donations'),
        fetchTableCount('event_participants')
      ])
  
      setResponseCounts({
        beneficiary: beneficiaryCount,
        volunteer: volunteerCount,
        feedback: feedbackCount,
        service: serviceCount,
        donation: donationCount,
        event: eventCount
      })
      
      setLastRefreshed(new Date())
    } catch (error) {
      console.error('Error fetching response counts:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Fetch response counts from database on component mount
  useEffect(() => {
    fetchResponseCounts()
    
    // Set up interval to refresh counts every 30 seconds
    const intervalId = setInterval(fetchResponseCounts, 30000)
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      clearInterval(intervalId)
    }
  }, [])
  
  const forms = [
    {
      id: "beneficiary",
      title: "Beneficiary Registration Form",
      description: "Register individuals who will receive services or aid",
      icon: <Users className="h-8 w-8 text-blue-500" />,
      category: "registration",
      responses: responseCounts.beneficiary,
    },
    {
      id: "volunteer",
      title: "Volunteer Registration Form",
      description: "Sign up to volunteer and contribute to our mission",
      icon: <FileText className="h-8 w-8 text-green-500" />,
      category: "volunteer",
      responses: responseCounts.volunteer,
    },
    {
      id: "feedback",
      title: "Feedback & Suggestions Form",
      description: "Share your thoughts to help us improve our services",
      icon: <MessageSquare className="h-8 w-8 text-yellow-500" />,
      category: "feedback",
      responses: responseCounts.feedback,
    },
    {
      id: "service",
      title: "NGO Service Request Form",
      description: "Request digital services or report technical issues",
      icon: <HelpCircle className="h-8 w-8 text-purple-500" />,
      category: "service",
      responses: responseCounts.service,
    },
    {
      id: "donation",
      title: "Donation Form",
      description: "Support our cause with financial contributions",
      icon: <Heart className="h-8 w-8 text-red-500" />,
      category: "donation",
      responses: responseCounts.donation,
    },
    {
      id: "event",
      title: "Event Participation Form",
      description: "Register for upcoming events and activities",
      icon: <Calendar className="h-8 w-8 text-indigo-500" />,
      category: "event",
      responses: responseCounts.event,
    },
  ]

  // Filter forms based on search query and selected category
  const filteredForms = forms.filter((form) => {
    const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         form.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || form.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">NGO Form Dashboard</h1>
        <p className="mt-4 text-lg text-muted-foreground">Access all digital forms to streamline your NGO operations</p>
      </div>

      <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search forms..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchResponseCounts}
            disabled={isLoading}
          >
            {isLoading ? "Refreshing..." : "Refresh Counts"}
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <select 
            className="rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="registration">Registration</option>
            <option value="volunteer">Volunteer</option>
            <option value="feedback">Feedback</option>
            <option value="service">Service</option>
            <option value="donation">Donation</option>
            <option value="event">Event</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <p className="text-lg text-muted-foreground">Loading form data...</p>
          </div>
        ) : filteredForms.length > 0 ? (
          filteredForms.map((form) => (
            <Card key={form.id} className="overflow-hidden transition-all hover:shadow-md hover:scale-[1.02]">
              <CardHeader className="pb-2">
                <div className="mb-2">{form.icon}</div>
                <div className="flex items-center justify-between">
                  <CardTitle>{form.title}</CardTitle>
                  <Badge variant="outline" className="ml-2">
                    {form.responses === 0 ? "No" : form.responses} {form.responses === 1 ? "response" : "responses"}
                  </Badge>
                </div>
                <CardDescription>{form.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Streamline your data collection process with our easy-to-use digital forms.
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/forms/${form.id}`} className="w-full">
                  <Button className="w-full bg-[#10B981] hover:bg-[#059669] transition-all">Fill Form</Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-lg text-muted-foreground">No forms match your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Remove 'async' from FormsPage and use useEffect for session check
export default function FormsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/auth/login')
        return
      }
      setIsAuthenticated(true)
    }

    checkSession()
  }, [router])

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return <FormsContent />
}

