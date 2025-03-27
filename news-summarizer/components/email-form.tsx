"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Mail, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { emailService } from "@/lib/external-services/email-service"
import type { NewsItem } from "@/lib/types"

interface EmailFormProps {
  selectedArticles: NewsItem[]
  onClose: () => void
}

export default function EmailForm({ selectedArticles, onClose }: EmailFormProps) {
  const [email, setEmail] = useState("")
  const [includeSummaries, setIncludeSummaries] = useState(true)
  const [sending, setSending] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    setSending(true)

    try {
      // Prepare email content
      const subject = `Your News Summary: ${selectedArticles.length} Articles`

      let content = `<h1>Your News Summary</h1>
<p>Here are the articles you selected:</p>
<ul>`

      selectedArticles.forEach((article) => {
        content += `<li>
  <h2>${article.title}</h2>
  <p><strong>Source:</strong> ${article.source}</p>
  ${includeSummaries && article.summary ? `<p><strong>Summary:</strong> ${article.summary}</p>` : ""}
  <p><a href="${article.url}">Read full article</a></p>
</li>`
      })

      content += `</ul>
<p>Thank you for using our News Summarizer!</p>`

      const result = await emailService.sendEmail(email, subject, content)

      if (result.success) {
        toast({
          title: "Email Sent",
          description: result.message,
        })
        onClose()
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to send email:", error)
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <Card className="jp-card border-t-4 border-t-pine">
      <CardHeader className="pb-3 border-b border-sumi/5">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-pine" />
          <CardTitle className="text-lg font-normal text-pine">Email Articles</CardTitle>
        </div>
        <CardDescription className="text-xs text-sumi/60 mt-1">
          Send {selectedArticles.length} selected article{selectedArticles.length !== 1 ? "s" : ""} to your email
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs text-sumi/70">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-sumi/20 focus:border-pine focus:ring-pine/20 text-sm"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-summaries"
              checked={includeSummaries}
              onCheckedChange={(checked) => setIncludeSummaries(checked === true)}
              className="text-pine border-sumi/30 data-[state=checked]:bg-pine data-[state=checked]:border-pine"
            />
            <Label htmlFor="include-summaries" className="text-xs text-sumi/70">
              Include AI summaries (if available)
            </Label>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-sumi/70">Selected Articles</Label>
            <div className="max-h-40 overflow-y-auto border border-sumi/10 p-2 space-y-1 bg-kinari-dark">
              {selectedArticles.map((article) => (
                <div
                  key={article.id}
                  className="text-xs text-sumi/80 border-b border-sumi/5 pb-1 last:border-0 last:pb-0"
                >
                  {article.title}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-sumi/5 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="jp-button-outline text-xs border-sumi/30 text-sumi/70 hover:bg-sumi/5"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={sending} className="jp-button bg-pine hover:bg-pine-light text-xs">
            {sending ? (
              <>Sending...</>
            ) : (
              <>
                <Send className="h-3 w-3 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

