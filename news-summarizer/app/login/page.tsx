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

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
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
            Enter your Inoreader credentials to continue
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full jp-button bg-indigo hover:bg-indigo-light" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </CardFooter>
        </form>
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

