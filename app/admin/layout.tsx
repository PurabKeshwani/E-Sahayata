import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Form Platform',
  description: 'Admin dashboard for managing users and form submissions',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}