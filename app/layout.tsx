import type { Metadata } from 'next'
import { QueryProvider } from '@/components/layout/QueryProvider'
import './globals.css'
import './styles.css'

const themeBootScript = `
try {
  var ls = JSON.parse(localStorage.getItem('wealthos-theme') || '{}');
  var t = ls && ls.state && ls.state.theme;
  var dark = t === 'dark' || (t !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (dark) document.documentElement.classList.add('dark');
} catch(e){ document.documentElement.classList.add('dark'); }
`

export const metadata: Metadata = {
  title: 'WealthOS — AI-Powered Portfolio Tracker',
  description: 'Track stocks, crypto and mutual funds with AI-powered insights. Built for Indian investors.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
      <QueryProvider>
        {children}
      </QueryProvider>
      </body>
      </html>
  )
}