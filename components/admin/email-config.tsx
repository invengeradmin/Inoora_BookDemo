"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Send, Settings, CheckCircle, AlertCircle, Info } from "lucide-react"
import { getEmailConfig, saveEmailConfig } from "@/lib/database"
import { testEmailConfiguration } from "@/lib/email"
import type { EmailConfig as EmailConfigType } from "@/types/database"

export function EmailConfig() {
  const [config, setConfig] = useState<Partial<EmailConfigType>>({
    smtp_host: "",
    smtp_port: 587,
    smtp_user: "",
    smtp_password: "",
    from_email: "",
    from_name: "Inoora Demo Scheduler",
    is_active: true,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testEmail, setTestEmail] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null)

  useEffect(() => {
    loadConfig()
  }, [])

 const loadConfig = async () => {
  try {
    setIsLoading(true)
    const res = await fetch("/api/email-config", { cache: "no-store" })
    const data = await res.json()

    if (data.success && data.data) setConfig(data.data)
  } catch (error) {
    console.error("Failed to load email config:", error)
    setMessage({ type: "error", text: "Failed to load configuration" })
  } finally {
    setIsLoading(false)
  }
}
  const handleSave = async () => {
  try {
    setIsSaving(true)
    setMessage(null)

    if (!config.smtp_host || !config.smtp_user || !config.smtp_password || !config.from_email) {
      setMessage({ type: "error", text: "Please fill in all required fields" })
      return
    }

    const response = await fetch("/api/email-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    })

    const result = await response.json()

    if (!result.success) throw new Error(result.message)

    setMessage({ type: "success", text: "Email configuration saved successfully!" })
  } catch (error: any) {
    console.error("Failed to save email config:", error)
    setMessage({ type: "error", text: error.message || "Failed to save email configuration" })
  } finally {
    setIsSaving(false)
  }
}

  const handleTest = async () => {
    if (!testEmail) {
      setMessage({ type: "error", text: "Please enter a test email address" })
      return
    }

    if (!config.smtp_host || !config.smtp_user || !config.smtp_password || !config.from_email) {
      setMessage({ type: "error", text: "Please save your configuration first before testing" })
      return
    }

    try {
      setIsTesting(true)
      setMessage({ type: "info", text: "Sending test email... This may take a moment." })

      const result = await testEmailConfiguration(testEmail)

      if (result.success) {
        setMessage({ type: "success", text: "Test email sent successfully! Check your inbox." })
      } else {
        setMessage({
          type: "error",
          text: result.message || "Failed to send test email. Please check your SMTP credentials.",
        })
      }
    } catch (error) {
      console.error("Email test failed:", error)
      setMessage({
        type: "error",
        text: `Failed to send test email: ${error.message}. Please verify your SMTP settings.`,
      })
    } finally {
      setIsTesting(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading email configuration...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white text-xl">
            <Settings className="w-6 h-6" />
            Email Configuration
          </CardTitle>
          <p className="text-white/80">Configure SMTP settings for sending demo confirmations</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {message && (
            <Alert
              className={
                message.type === "success"
                  ? "bg-green-500/10 border-green-500/20 text-green-200"
                  : message.type === "info"
                    ? "bg-blue-500/10 border-blue-500/20 text-blue-200"
                    : "bg-red-500/10 border-red-500/20 text-red-200"
              }
            >
              {message.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : message.type === "info" ? (
                <Info className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="smtp_host" className="text-white font-medium">
                SMTP Host *
              </Label>
              <Input
                id="smtp_host"
                value={config.smtp_host}
                onChange={(e) => setConfig((prev) => ({ ...prev, smtp_host: e.target.value }))}
                placeholder="smtp.gmail.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp_port" className="text-white font-medium">
                SMTP Port *
              </Label>
              <Input
                id="smtp_port"
                type="number"
                value={config.smtp_port}
                onChange={(e) => setConfig((prev) => ({ ...prev, smtp_port: Number.parseInt(e.target.value) }))}
                placeholder="587"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp_user" className="text-white font-medium">
                SMTP Username *
              </Label>
              <Input
                id="smtp_user"
                value={config.smtp_user}
                onChange={(e) => setConfig((prev) => ({ ...prev, smtp_user: e.target.value }))}
                placeholder="your-email@gmail.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp_password" className="text-white font-medium">
                SMTP Password *
              </Label>
              <Input
                id="smtp_password"
                type="password"
                value={config.smtp_password}
                onChange={(e) => setConfig((prev) => ({ ...prev, smtp_password: e.target.value }))}
                placeholder="Your app password"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="from_email" className="text-white font-medium">
                From Email *
              </Label>
              <Input
                id="from_email"
                type="email"
                value={config.from_email}
                onChange={(e) => setConfig((prev) => ({ ...prev, from_email: e.target.value }))}
                placeholder="noreply@inoora.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="from_name" className="text-white font-medium">
                From Name
              </Label>
              <Input
                id="from_name"
                value={config.from_name}
                onChange={(e) => setConfig((prev) => ({ ...prev, from_name: e.target.value }))}
                placeholder="Inoora Demo Scheduler"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
              />
            </div>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-200 rounded-lg mt-4">
            <h4 className="font-semibold mb-2">Email Configuration Tips:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>
                For Gmail, use <code>smtp.gmail.com</code> as host and port <code>587</code>
              </li>
              <li>Gmail requires an "App Password" instead of your regular password</li>
              <li>
                For Outlook/Office 365, use <code>smtp.office365.com</code> and port <code>587</code>
              </li>
              <li>Make sure your email provider allows SMTP access</li>
              <li>Some providers may require you to enable "Less secure apps" or create specific app passwords</li>
            </ul>
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="lg"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving Configuration...
              </>
            ) : (
              <>
                <Settings className="w-4 h-4 mr-2" />
                Save Configuration
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white text-xl">
            <Mail className="w-6 h-6" />
            Test Email Configuration
          </CardTitle>
          <p className="text-white/80">Send a test email to verify your configuration</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test_email" className="text-white font-medium">
              Test Email Address
            </Label>
            <Input
              id="test_email"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
            />
          </div>

          <Button
            onClick={handleTest}
            disabled={isTesting || !config.smtp_host}
            variant="outline"
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
            size="lg"
          >
            {isTesting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending Test Email...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Test Email
              </>
            )}
          </Button>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-200 rounded-lg text-sm">
            <strong>Note:</strong> Make sure to save your configuration before testing. The test will attempt to send an
            email directly using your SMTP settings.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
