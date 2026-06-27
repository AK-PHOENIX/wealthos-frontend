'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'

function ThemeInit() {
    useTheme()
    return null
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeInit />
            {children}
        </QueryClientProvider>
    )
}