"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Separator } from "@/components/ui/separator"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const { login, signInWithGoogle } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(username, password)
      if (result.success) {
        toast({
          title: "Login successful",
          description: "Welcome to News Summarizer",
        })
        router.push("/")
      } else {
        toast({
          title: "Login failed",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    
    try {
      const result = await signInWithGoogle()
      if (!result.success) {
        toast({
          title: "Google Sign-in Failed",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Google sign-in error:", error)
      toast({
        title: "Sign-in Error",
        description: "An unexpected error occurred during Google sign-in",
        variant: "destructive",
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-kinari px-4">
      <Card className="w-full max-w-md jp-card border-t-4 border-t-indigo">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16 bg-indigo/10 rounded-full flex items-center justify-center">
              <span className="text-indigo text-2xl font-light">ニュース</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-light text-indigo">Sign in to News Summarizer</CardTitle>
          <CardDescription className="text-sm text-sumi/60">
            Choose your preferred sign-in method
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button 
            className="w-full flex items-center justify-center space-x-2 border border-gray-300 bg-white hover:bg-gray-50 text-black"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
              </g>
            </svg>
            <span>{isGoogleLoading ? "Signing in..." : "Sign in with Google"}</span>
          </Button>
          
          <div className="relative flex items-center">
            <Separator className="flex-grow" />
            <span className="px-3 text-xs text-sumi/60">or</span>
            <Separator className="flex-grow" />
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs text-sumi/70">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="your_username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border-sumi/20 focus:border-indigo focus:ring-indigo/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs text-sumi/70">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-sumi/20 focus:border-indigo focus:ring-indigo/20"
                />
              </div>
              <Button type="submit" className="w-full jp-button bg-indigo hover:bg-indigo-light" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in with Username"}
              </Button>
            </div>
          </form>
        </CardContent>
        
        <div className="px-6 pb-6">
          <div className="text-xs text-center text-sumi/60 mt-4">
            <p>Demo credentials:</p>
            <p className="mt-1">
              Username: <span className="text-indigo">demo</span> | Password:{" "}
              <span className="text-indigo">password</span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

