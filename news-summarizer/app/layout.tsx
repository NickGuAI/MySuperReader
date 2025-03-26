import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TranslationProvider } from "@/contexts/translation-context"
import { AuthProvider } from '@/contexts/AuthContext'
import { LoginButton } from '@/components/LoginButton'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "News Summarizer",
  description: "AI-powered news summarization app",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TranslationProvider>
              <header className="border-b">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                  <h1 className="text-2xl font-bold">MySuperReader</h1>
                  <LoginButton />
                </div>
              </header>
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
            </TranslationProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'