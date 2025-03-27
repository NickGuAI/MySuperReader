"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, BookOpen, Save, Sparkles } from "lucide-react"

export default function ProfilePage() {
  const { user, isLoading, logout, updatePreferences } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [emailDigest, setEmailDigest] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  // Initialize form with user preferences
  useEffect(() => {
    if (user) {
      setSelectedCategories(user.preferences.categories)
      setSelectedSources(user.preferences.sources)
      setEmailDigest(user.preferences.emailDigest)
    }
  }, [user])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kinari">
        <p className="text-sumi/60">Loading...</p>
      </div>
    )
  }

  const handleSavePreferences = async () => {
    setIsSaving(true)
    try {
      const result = await updatePreferences({
        categories: selectedCategories,
        sources: selectedSources,
        emailDigest,
      })

      if (result.success) {
        toast({
          title: "Preferences saved",
          description: "Your preferences have been updated",
        })
      } else {
        toast({
          title: "Failed to save preferences",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Save preferences error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const allCategories = ["technology", "business", "science", "health", "politics", "entertainment", "sports"]
  const allSources = [
    "TechCrunch",
    "The Verge",
    "Wired",
    "BBC News",
    "CNN",
    "The New York Times",
    "Washington Post",
    "Bloomberg",
  ]

  return (
    <div className="min-h-screen bg-kinari">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-sumi/70 hover:text-sumi hover:bg-sumi/5"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="jp-card border-l-4 border-l-indigo">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-light text-indigo">Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-indigo/20 mb-4">
                    <Image
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.displayName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h2 className="text-lg font-medium text-indigo">{user.displayName}</h2>
                  <p className="text-sm text-sumi/60">{user.email}</p>
                </div>

                <Separator className="bg-sumi/10" />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo/10 p-2 rounded-sm">
                      <BookOpen className="h-5 w-5 text-indigo" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-sumi/80">Articles Read</p>
                      <p className="text-lg text-indigo">{user.stats.articlesRead}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-ochre/10 p-2 rounded-sm">
                      <Save className="h-5 w-5 text-ochre" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-sumi/80">Saved Articles</p>
                      <p className="text-lg text-ochre">{user.stats.articlesSaved}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-vermilion/10 p-2 rounded-sm">
                      <Sparkles className="h-5 w-5 text-vermilion" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-sumi/80">Summaries Generated</p>
                      <p className="text-lg text-vermilion">{user.stats.summariesGenerated}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full jp-button-outline border-sumi/30 text-sumi/70 hover:bg-sumi/5"
                  onClick={() => logout()}
                >
                  Sign out
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="jp-card">
              <CardHeader>
                <CardTitle className="text-xl font-light text-indigo">Preferences</CardTitle>
                <CardDescription className="text-sm text-sumi/60">Customize your news experience</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="categories">
                  <TabsList className="bg-kinari-dark border border-sumi/10 p-1 mb-6">
                    <TabsTrigger
                      value="categories"
                      className="text-xs data-[state=active]:bg-indigo data-[state=active]:text-kinari"
                    >
                      Categories
                    </TabsTrigger>
                    <TabsTrigger
                      value="sources"
                      className="text-xs data-[state=active]:bg-indigo data-[state=active]:text-kinari"
                    >
                      Sources
                    </TabsTrigger>
                    <TabsTrigger
                      value="notifications"
                      className="text-xs data-[state=active]:bg-indigo data-[state=active]:text-kinari"
                    >
                      Notifications
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="categories" className="space-y-4">
                    <div className="text-sm text-sumi/70 mb-2">Select categories you're interested in:</div>
                    <div className="grid grid-cols-2 gap-4">
                      {allCategories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCategories((prev) => [...prev, category])
                              } else {
                                setSelectedCategories((prev) => prev.filter((c) => c !== category))
                              }
                            }}
                            className="text-indigo border-sumi/30 data-[state=checked]:bg-indigo data-[state=checked]:border-indigo"
                          />
                          <Label htmlFor={`category-${category}`} className="text-sm text-sumi/80 capitalize">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="sources" className="space-y-4">
                    <div className="text-sm text-sumi/70 mb-2">Select your preferred news sources:</div>
                    <div className="grid grid-cols-2 gap-4">
                      {allSources.map((source) => (
                        <div key={source} className="flex items-center space-x-2">
                          <Checkbox
                            id={`source-${source}`}
                            checked={selectedSources.includes(source)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedSources((prev) => [...prev, source])
                              } else {
                                setSelectedSources((prev) => prev.filter((s) => s !== source))
                              }
                            }}
                            className="text-indigo border-sumi/30 data-[state=checked]:bg-indigo data-[state=checked]:border-indigo"
                          />
                          <Label htmlFor={`source-${source}`} className="text-sm text-sumi/80">
                            {source}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="notifications" className="space-y-4">
                    <div className="text-sm text-sumi/70 mb-2">Email notification settings:</div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="email-digest"
                        checked={emailDigest}
                        onCheckedChange={(checked) => setEmailDigest(checked === true)}
                        className="text-indigo border-sumi/30 data-[state=checked]:bg-indigo data-[state=checked]:border-indigo"
                      />
                      <Label htmlFor="email-digest" className="text-sm text-sumi/80">
                        Receive daily email digest of top news
                      </Label>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={handleSavePreferences}
                  disabled={isSaving}
                  className="jp-button bg-indigo hover:bg-indigo-light"
                >
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

