'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Heart, Share2, Download } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function ImpactPage() {
  // State for counter animations
  const [formsCount, setFormsCount] = useState(0)
  const [treesCount, setTreesCount] = useState(0)
  const [usersCount, setUsersCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  
  // State for testimonial carousel
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Non-profit Director",
      text: "This platform has revolutionized how we collect data from our beneficiaries. We've reduced our paperwork by 80%!",
      image: "/images/testimonial1.jpg"
    },
    {
      name: "Michael Chen",
      role: "Environmental Activist",
      text: "The environmental impact of switching to digital forms cannot be overstated. We've saved thousands of sheets of paper.",
      image: "/images/testimonial2.jpg"
    },
    {
      name: "Priya Sharma",
      role: "Community Organizer",
      text: "The accessibility features have allowed us to reach communities that were previously excluded from our initiatives.",
      image: "/images/testimonial3.jpg"
    }
  ]
  
  // State for contact form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setFormSubmitted(true)
    // Reset form after submission
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' })
      setFormSubmitted(false)
    }, 3000)
  }
  
  // Handle testimonial navigation
  const nextTestimonial = () => {
    setCurrentTestimonial(prev => (prev + 1) % testimonials.length)
  }
  
  const prevTestimonial = () => {
    setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length)
  }
  
  // Animate counters when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )
    
    const statsSection = document.getElementById('stats-section')
    if (statsSection) observer.observe(statsSection)
    
    return () => {
      if (statsSection) observer.unobserve(statsSection)
    }
  }, [])
  
  // Animate the counters
  useEffect(() => {
    if (isVisible) {
      const formsInterval = setInterval(() => {
        setFormsCount(prev => {
          if (prev < 1000000) return prev + 50000
          clearInterval(formsInterval)
          return 1000000
        })
      }, 50)
      
      const treesInterval = setInterval(() => {
        setTreesCount(prev => {
          if (prev < 50000) return prev + 2500
          clearInterval(treesInterval)
          return 50000
        })
      }, 50)
      
      const usersInterval = setInterval(() => {
        setUsersCount(prev => {
          if (prev < 100000) return prev + 5000
          clearInterval(usersInterval)
          return 100000
        })
      }, 50)
      
      return () => {
        clearInterval(formsInterval)
        clearInterval(treesInterval)
        clearInterval(usersInterval)
      }
    }
  }, [isVisible])
  
  // Format large numbers with commas and + sign
  const formatNumber = (num: number) => {
    return num >= 1000000 
      ? Math.floor(num / 1000000) + 'M+' 
      : num >= 1000 
        ? Math.floor(num / 1000) + 'K+' 
        : num
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        className="text-4xl font-bold text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Our Impact
      </motion.h1>
      
      <Tabs defaultValue="overview" className="mb-12">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stories">Impact Stories</TabsTrigger>
          <TabsTrigger value="getinvolved">Get Involved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Environmental Impact</h2>
                  <p className="mb-4">We've helped reduce paper waste by digitizing forms and documents.</p>
                  <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                    <Image
                      src="/images/environment.jpg"
                      alt="Environmental Impact"
                      fill
                      className="object-cover rounded-lg transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="mb-4">
                    <p className="text-sm mb-1">Paper reduction</p>
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-right mt-1">75% less paper used</p>
                  </div>
                  <Button variant="outline" className="w-full">Learn More</Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Social Impact</h2>
                  <p className="mb-4">Making form submission accessible to everyone, everywhere.</p>
                  <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                    <Image
                      src="/images/social.jpg"
                      alt="Social Impact"
                      fill
                      className="object-cover rounded-lg transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="mb-4">
                    <p className="text-sm mb-1">Accessibility improvement</p>
                    <Progress value={90} className="h-2" />
                    <p className="text-xs text-right mt-1">90% more accessible</p>
                  </div>
                  <Button variant="outline" className="w-full">Learn More</Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Economic Impact</h2>
                  <p className="mb-4">Helping businesses save time and resources through efficient form management.</p>
                  <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                    <Image
                      src="/images/economic.jpg"
                      alt="Economic Impact"
                      fill
                      className="object-cover rounded-lg transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="mb-4">
                    <p className="text-sm mb-1">Time efficiency</p>
                    <Progress value={65} className="h-2" />
                    <p className="text-xs text-right mt-1">65% time saved</p>
                  </div>
                  <Button variant="outline" className="w-full">Learn More</Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div 
            id="stats-section"
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-4">Our Numbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-md transition-shadow">
                <div className="text-4xl font-bold text-blue-600">{formatNumber(formsCount)}</div>
                <div className="text-gray-600">Forms Processed</div>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-md transition-shadow">
                <div className="text-4xl font-bold text-green-600">{formatNumber(treesCount)}</div>
                <div className="text-gray-600">Trees Saved</div>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-md transition-shadow">
                <div className="text-4xl font-bold text-purple-600">{formatNumber(usersCount)}</div>
                <div className="text-gray-600">Happy Users</div>
              </Card>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="stories">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Impact Stories</h2>
            
            <div className="relative bg-gray-50 rounded-xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                  <Image
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <blockquote className="text-lg italic mb-4">"{testimonials[currentTestimonial].text}"</blockquote>
                  <p className="font-semibold">{testimonials[currentTestimonial].name}</p>
                  <p className="text-sm text-gray-600">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
              
              <div className="flex justify-center mt-6 gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={prevTestimonial}
                  className="rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {testimonials.map((_, index) => (
                  <span 
                    key={index} 
                    className={`block w-2 h-2 rounded-full ${
                      index === currentTestimonial ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                ))}
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={nextTestimonial}
                  className="rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Case Study: Education Sector</h3>
                  <p className="mb-4">
                    A local school district implemented our form platform for student registrations and saw a 95% 
                    reduction in paperwork and a 70% decrease in processing time.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex gap-1">
                      <Heart className="h-4 w-4" /> Like
                    </Button>
                    <Button variant="outline" size="sm" className="flex gap-1">
                      <Share2 className="h-4 w-4" /> Share
                    </Button>
                    <Button variant="outline" size="sm" className="flex gap-1">
                      <Download className="h-4 w-4" /> Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Case Study: Healthcare</h3>
                  <p className="mb-4">
                    A rural health clinic used our platform to digitize patient intake forms, resulting in 
                    improved data accuracy and a 60% faster patient check-in process.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex gap-1">
                      <Heart className="h-4 w-4" /> Like
                    </Button>
                    <Button variant="outline" size="sm" className="flex gap-1">
                      <Share2 className="h-4 w-4" /> Share
                    </Button>
                    <Button variant="outline" size="sm" className="flex gap-1">
                      <Download className="h-4 w-4" /> Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="getinvolved">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Get Involved</h2>
              <p className="mb-6">
                Want to be part of our mission to make forms more accessible and environmentally friendly? 
                There are many ways you can contribute to our impact.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Spread the Word</h3>
                    <p className="text-sm text-gray-600">Share our platform with organizations that could benefit from digital forms.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Provide Feedback</h3>
                    <p className="text-sm text-gray-600">Help us improve by sharing your experience and suggestions.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Partner With Us</h3>
                    <p className="text-sm text-gray-600">Explore collaboration opportunities for greater impact.</p>
                  </div>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Impact Newsletter</h3>
                  <p className="text-sm mb-4">Subscribe to receive updates on our impact and new initiatives.</p>
                  <div className="flex gap-2">
                    <Input placeholder="Your email" className="flex-1" />
                    <Button>Subscribe</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
                  {formSubmitted ? (
                    <div className="bg-green-50 text-green-700 p-4 rounded-md">
                      <p className="font-medium">Thank you for your message!</p>
                      <p className="text-sm">We'll get back to you as soon as possible.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-1">
                            Name
                          </label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium mb-1">
                            Message
                          </label>
                          <Textarea
                            id="message"
                            name="message"
                            rows={4}
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <Button type="submit" className="w-full">Send Message</Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
