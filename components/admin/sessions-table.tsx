"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Building,
  Globe,
  Save,
  Send,
  CheckCircle,
  AlertCircle,
  UserPlus,
} from "lucide-react"
import { updateDemoSession, deleteDemoSession, assignAgentToSession } from "@/lib/database"
import { sendCustomEmail } from "@/lib/email"
import type { DemoSession, Agent } from "@/types/database"

interface SessionsTableProps {
  sessions: DemoSession[]
  agents: Agent[]
  onSessionUpdate: () => void
  onRefresh: () => void
  currentAgent?: Agent | null
  isSuper: boolean
}

const statusOptions = [
  { value: "confirmed", label: "Confirmed", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { value: "completed", label: "Completed", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "success_pending", label: "Success Pending", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { value: "on_hold_waiting", label: "On Hold", color: "bg-orange-100 text-orange-800 border-orange-200" },
  { value: "interested", label: "Interested", color: "bg-green-100 text-green-800 border-green-200" },
  { value: "need_in_depth_demo", label: "Needs Deep Dive", color: "bg-purple-100 text-purple-800 border-purple-200" },
  { value: "onboard", label: "Onboard", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  { value: "regret", label: "Regret", color: "bg-red-100 text-red-800 border-red-200" },
  { value: "cancelled", label: "Cancelled", color: "bg-gray-100 text-gray-800 border-gray-200" },
  { value: "rescheduled", label: "Rescheduled", color: "bg-amber-100 text-amber-800 border-amber-200" },
]

export function SessionsTable({
  sessions,
  agents,
  onSessionUpdate,
  onRefresh,
  currentAgent,
  isSuper,
}: SessionsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingSession, setEditingSession] = useState<DemoSession | null>(null)
  const [emailingSession, setEmailingSession] = useState<DemoSession | null>(null)
  const [assigningSession, setAssigningSession] = useState<DemoSession | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [isAssigning, setIsAssigning] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [emailData, setEmailData] = useState({
    subject: "",
    content: "",
  })

  const [selectedAgentId, setSelectedAgentId] = useState("")

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      searchTerm === "" ||
      session.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.customer_company.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || session.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find((option) => option.value === status)
    return statusOption?.color || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getStatusLabel = (status: string) => {
    const statusOption = statusOptions.find((option) => option.value === status)
    return statusOption?.label || status
  }

  const handleUpdateSession = async (sessionId: string, updates: Partial<DemoSession>) => {
    try {
      setIsUpdating(true)
      setMessage(null)
      await updateDemoSession(sessionId, updates)
      setMessage({ type: "success", text: "Session updated successfully!" })
      onSessionUpdate()
      setEditingSession(null)
    } catch (error) {
      console.error("Failed to update session:", error)
      setMessage({ type: "error", text: "Failed to update session" })
    } finally {
      setIsUpdating(false)
    }
  }

 const handleAssignAgent = async () => {
  if (!assigningSession || !selectedAgentId) return

  try {
    setIsAssigning(true)
    setMessage(null)

    const res = await fetch("/api/sessions/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: assigningSession.id,
        agentId: selectedAgentId,
      }),
    })

    const data = await res.json()

    if (!data.success) throw new Error(data.message || "Failed to assign agent")

    setMessage({ type: "success", text: "Agent assigned successfully!" })

    // 🔄 Ensure data reloads after assignment
    await onSessionUpdate()
    await onRefresh?.()

    // Reset UI
    setAssigningSession(null)
    setSelectedAgentId("")
  } catch (error) {
    console.error("Failed to assign agent:", error)
    setMessage({ type: "error", text: "Failed to assign agent" })
  } finally {
    setIsAssigning(false)
  }
}
  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return

    try {
      setMessage(null)
      await deleteDemoSession(sessionId)
      setMessage({ type: "success", text: "Session deleted successfully!" })
      onSessionUpdate()
    } catch (error) {
      console.error("Failed to delete session:", error)
      setMessage({ type: "error", text: "Failed to delete session" })
    }
  }

  const handleSendEmail = async () => {
    if (!emailingSession || !currentAgent) return

    try {
      setIsSendingEmail(true)
      setMessage(null)

      const result = await sendCustomEmail({
        to: emailingSession.customer_email,
        subject: emailData.subject,
        content: emailData.content,
        sessionId: emailingSession.id,
        sentBy: currentAgent.id,
      })

      if (result.success) {
        setMessage({ type: "success", text: "Email sent successfully!" })
        setEmailData({ subject: "", content: "" })
        setEmailingSession(null)
      } else {
        setMessage({ type: "error", text: result.message || "Failed to send email" })
      }
    } catch (error) {
      console.error("Failed to send email:", error)
      setMessage({ type: "error", text: "Failed to send email" })
    } finally {
      setIsSendingEmail(false)
    }
  }

  const getEmailTemplates = (session: DemoSession) => [
    {
      name: "Meeting Confirmation",
      subject: `Meeting Confirmation - ${session.id}`,
      content: `Hi ${session.customer_name},

I hope this email finds you well. I wanted to confirm our upcoming demo session scheduled for ${new Date(session.demo_date).toLocaleDateString()} at ${session.demo_time}.

During our ${session.duration}-minute session, we'll be covering:
- Overview of Inoora's key features
- How it can address your specific business needs
- Live demonstration tailored to your requirements
- Q&A session

Please let me know if you have any questions or if you need to reschedule.

Looking forward to our meeting!

Best regards,
${currentAgent?.name || "Your Inoora Team"}`,
    },
    {
      name: "Follow-up",
      subject: `Thank you for your time - ${session.id}`,
      content: `Hi ${session.customer_name},

Thank you for taking the time to attend our demo session today. I hope you found it valuable and informative.

As discussed, I'm attaching some additional resources that might be helpful for your evaluation process.

Please don't hesitate to reach out if you have any questions or would like to schedule a follow-up meeting.

Best regards,
${currentAgent?.name || "Your Inoora Team"}`,
    },
    {
      name: "Meeting Link",
      subject: `Meeting Link - ${session.id}`,
      content: `Hi ${session.customer_name},

Here's the meeting link for our demo session scheduled for ${new Date(session.demo_date).toLocaleDateString()} at ${session.demo_time}:

Meeting Link: [Your meeting link here]
Meeting ID: [Meeting ID]
Passcode: [Passcode if needed]

Please join the meeting 5 minutes early to ensure we can start on time.

Looking forward to speaking with you!

Best regards,
${currentAgent?.name || "Your Inoora Team"}`,
    },
  ]

  return (
    <div className="space-y-6">
      {message && (
        <Alert
          className={
            message.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-200"
              : "bg-red-500/10 border-red-500/20 text-red-200"
          }
        >
          {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <Input
                placeholder="Search sessions, names, companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      <div className="grid gap-6">
        {filteredSessions.map((session) => (
          <Card key={session.id} className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-4">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">{session.id}</CardTitle>
                  <p className="text-sm text-gray-600">
                    Created:{" "}
                    {new Date(session.created_at).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <Badge className={`${getStatusColor(session.status)} border font-semibold`}>
                  {getStatusLabel(session.status)}
                </Badge>
                {!session.agent_id && (
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200">Unassigned</Badge>
                )}
              </div>
              <div className="flex gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEmailingSession(session)}
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Send Email to {session.customer_name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Email Templates</Label>
                        <Select
                          onValueChange={(value) => {
                            const template = getEmailTemplates(session)[Number.parseInt(value)]
                            setEmailData({ subject: template.subject, content: template.content })
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a template (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {getEmailTemplates(session).map((template, index) => (
                              <SelectItem key={index} value={index.toString()}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email-subject">Subject</Label>
                        <Input
                          id="email-subject"
                          value={emailData.subject}
                          onChange={(e) => setEmailData((prev) => ({ ...prev, subject: e.target.value }))}
                          placeholder="Email subject"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email-content">Message</Label>
                        <Textarea
                          id="email-content"
                          value={emailData.content}
                          onChange={(e) => setEmailData((prev) => ({ ...prev, content: e.target.value }))}
                          placeholder="Email content"
                          className="min-h-[200px]"
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={handleSendEmail}
                          disabled={isSendingEmail || !emailData.subject || !emailData.content}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          {isSendingEmail ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Send Email
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEmailingSession(null)
                            setEmailData({ subject: "", content: "" })
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {isSuper && !session.agent_id && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAssigningSession(session)}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Assign Agent
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Assign Agent to {session.id}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Select Agent</Label>
                          <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose an agent" />
                            </SelectTrigger>
                            <SelectContent>
                              {agents.map((agent) => (
                                <SelectItem key={agent.id} value={agent.id}>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="w-6 h-6">
                                      <AvatarImage src={agent.avatar_url || "/placeholder.svg"} />
                                      <AvatarFallback className="text-xs">
                                        {agent.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{agent.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            onClick={handleAssignAgent}
                            disabled={isAssigning || !selectedAgentId}
                            className="flex-1"
                          >
                            {isAssigning ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Assigning...
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Assign Agent
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setAssigningSession(null)
                              setSelectedAgentId("")
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingSession(session)}
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Session: {session.id}</DialogTitle>
                    </DialogHeader>
                    {editingSession && (
                      <SessionEditForm
                        session={editingSession}
                        onUpdate={handleUpdateSession}
                        isUpdating={isUpdating}
                        onCancel={() => setEditingSession(null)}
                      />
                    )}
                  </DialogContent>
                </Dialog>

                {isSuper && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSession(session.id)}
                    className="border-red-200 text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2 text-lg text-gray-900">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    Meeting Details
                  </h4>
                  <div className="space-y-3">
                    {session.agent ? (
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <Avatar className="w-10 h-10 ring-2 ring-white shadow-md">
                          <AvatarImage src={session.agent.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                           {session.agent?.name
  ? session.agent.name
      .split(" ")
      .map((n) => n[0])
      .join("")
  : "NA"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-900">{session.agent.name}</div>
                          <div className="text-sm text-gray-600">{session.agent.title}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="text-orange-800 font-medium">No agent assigned</div>
                        <div className="text-sm text-orange-600">This session needs to be assigned to an agent</div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-xs text-gray-500">Date</div>
                          <div className="font-semibold text-sm">
                            {new Date(session.demo_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-xs text-gray-500">Time</div>
                          <div className="font-semibold text-sm">
                            {session.demo_time} ({session.duration}m)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2 text-lg text-gray-900">
                    <User className="w-5 h-5 text-purple-600" />
                    Customer Details
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-xs text-gray-500">Name</div>
                          <div className="font-semibold text-sm">{session.customer_name}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-xs text-gray-500">Email</div>
                          <div className="font-semibold text-sm">{session.customer_email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-xs text-gray-500">Phone</div>
                          <div className="font-semibold text-sm">{session.customer_phone}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-xs text-gray-500">Country</div>
                          <div className="font-semibold text-sm">{session.customer_country}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Building className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-500">Company</div>
                        <div className="font-semibold text-sm">{session.customer_company}</div>
                      </div>
                    </div>
                    {session.notes && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Notes</div>
                        <div className="text-sm">{session.notes}</div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-12 text-center">
            <div className="text-white/60 text-lg">No sessions found matching your criteria.</div>
            <div className="text-white/40 text-sm mt-2">Try adjusting your search or filter settings.</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function SessionEditForm({
  session,
  onUpdate,
  isUpdating,
  onCancel,
}: {
  session: DemoSession
  onUpdate: (sessionId: string, updates: Partial<DemoSession>) => void
  isUpdating: boolean
  onCancel: () => void
}) {
  const [status, setStatus] = useState(session.status)
  const [notes, setNotes] = useState(session.notes || "")

  const handleSave = () => {
   onUpdate(session.id, { status, notes, updated_at: new Date().toISOString() })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700">Session Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700">Notes</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this session..."
          className="min-h-[100px]"
        />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={isUpdating}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          size="lg"
        >
          {isUpdating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onCancel} size="lg">
          Cancel
        </Button>
      </div>
    </div>
  )
}
