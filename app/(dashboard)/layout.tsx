'use client'
import type { ReactNode } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <Navbar title="" />
      <main>
        {children}
      </main>
    </div>
  )
}
