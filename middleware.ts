import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname
  
  // Define admin-only paths
  const adminOnlyPaths = [
    '/forms',
    '/impact',
    // Add other admin-only paths here
  ]
  
  // Check if the current path is admin-only
  const isAdminOnlyPath = adminOnlyPaths.some(adminPath => 
    path.startsWith(adminPath)
  )
  
  // If it's not an admin-only path, allow access
  if (!isAdminOnlyPath) {
    return NextResponse.next()
  }
  
  // Get user data from localStorage (client-side only)
  // For middleware, we need to use cookies instead
  const userDataCookie = request.cookies.get('user-role')
  
  // If no user data or not an admin, redirect to dashboard
  if (!userDataCookie || userDataCookie.value !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // Allow access for admins
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/forms/:path*',
    '/impact/:path*',
    // Add other protected paths here
  ],
}