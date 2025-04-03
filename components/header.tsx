"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, User, LogOut, Settings, FileText, Shield } from "lucide-react"

// Mock user type
type UserType = {
  id: string
  name: string
  email: string
  role: string
}

export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const userData = localStorage.getItem("e-sahayata-user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      // Check if user is admin
      setIsAdmin(parsedUser.role === "admin")
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem("e-sahayata-user")
    setUser(null)
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-full">
              <Image 
                src="/logo.jpg" 
                alt="E-Sahayata Logo" 
                width={56}
                height={56}
                className="object-cover"
                priority
              />
            </div>
            <span className="text-2xl font-bold">E-Sahayata</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "text-primary" : "text-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            href="/forms"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname && (pathname === "/forms" || pathname.startsWith("/forms/")) ? "text-primary" : "text-foreground"
            }`}
          >
            Forms
          </Link>
          <Link
            href="/impact"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/impact" ? "text-primary" : "text-foreground"
            }`}
          >
            Impact
          </Link>
          <Link
            href="/contact"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/contact" ? "text-primary" : "text-foreground"
            }`}
          >
            Contact
          </Link>
        
        {/* Admin Panel Link - Only visible to admins */}
        {isClient && isAdmin && (
          <Link
            href="/admin/dashboard"
            className={`text-sm font-medium transition-colors hover:text-primary flex items-center ${
              pathname && pathname.startsWith("/admin") ? "text-primary" : "text-foreground"
            }`}
          >
            <Shield className="mr-1 h-4 w-4" />
            Admin Panel
          </Link>
        )}

          {isClient && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex cursor-pointer items-center">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex cursor-pointer items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/applications" className="flex cursor-pointer items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    My Applications
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login">
              <Button className="bg-[#10B981] hover:bg-[#059669] transition-all">Get Started</Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="flex items-center md:hidden"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="container mx-auto px-4 pb-4 md:hidden">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                pathname === "/" ? "bg-muted text-primary" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/forms"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                pathname && (pathname === "/forms" || pathname.startsWith("/forms/")) ? "bg-muted text-primary" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Forms
            </Link>
            <Link
              href="/impact"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                pathname === "/impact" ? "bg-muted text-primary" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Impact
            </Link>
            <Link
              href="/contact"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                pathname === "/contact" ? "bg-muted text-primary" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Admin Panel Link for Mobile - Only visible to admins */}
            {isClient && isAdmin && (
              <Link
                href="/admin/dashboard"
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted flex items-center ${
                  pathname && pathname.startsWith("/admin") ? "bg-muted text-primary" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Shield className="mr-2 h-4 w-4" />
                Admin Panel
              </Link>
            )}

            {isClient && user ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-muted"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-[#10B981] hover:bg-[#059669] transition-all">Get Started</Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

