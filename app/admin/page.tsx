'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AdminIndexPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/admin/dashboard')
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Redirecting to admin dashboard...</p>
      </div>
    </div>
  )
}