"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { authService } from "@/lib/external-services/auth-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    async function handleAuthCallback() {
      try {
        // Check if this is an Inoreader OAuth callback
        const code = searchParams.get("code")
        const state = searchParams.get("state")
        
        if (!code || !state) {
          setStatus("error")
          setErrorMessage("Missing required auth parameters")
          return
        }
        
        // Get user to check authentication
        const user = await authService.getCurrentUser()
        if (!user) {
          setStatus("error")
          setErrorMessage("You must be logged in to connect Inoreader")
          return
        }
        
        // Call the callback API endpoint
        const response = await fetch(
          `/api/auth/inoreader/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`
        )
        const data = await response.json()
        
        if (!response.ok) {
          setStatus("error")
          setErrorMessage(data.error || "Failed to authenticate with Inoreader")
          return
        }
        
        setStatus("success")
        
        // Redirect to profile after short delay
        setTimeout(() => {
          router.push("/profile")
        }, 2000)
      } catch (error) {
        console.error("Auth callback error:", error)
        setStatus("error")
        setErrorMessage("An unexpected error occurred")
      }
    }
    
    handleAuthCallback()
  }, [searchParams, router])
  
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-130px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Inoreader Authentication</CardTitle>
          <CardDescription>
            {status === "loading" && "Processing your authentication..."}
            {status === "success" && "Authentication successful!"}
            {status === "error" && "Authentication failed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground text-center">
                Connecting your Inoreader account, please wait...
              </p>
            </div>
          )}
          
          {status === "success" && (
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Connected!</AlertTitle>
              <AlertDescription className="text-green-700">
                Your Inoreader account has been successfully connected. Redirecting you to your profile...
              </AlertDescription>
            </Alert>
          )}
          
          {status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {errorMessage || "Something went wrong when processing your authentication."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 