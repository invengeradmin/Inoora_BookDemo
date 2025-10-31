"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Building,
  Globe,
  Edit,
  Trash2,
  Search,
  Filter,
  BarChart3,
} from "lucide-react"
import type { Session } from "@/types"
import { formatDate } from "@/lib/utils"

interface AdminPanelProps {
  sessions: Session[]
  onUpdateSession: (sessionId: string, updates: Partial<Session>) => void
  onDeleteSession: (sessionId: string) => void
}

export function AdminPanel({ sessions, onUpdateSession, onDeleteSession }: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [filteredSessions, setFilteredSessions] = useState<Session[]>(sessions)

  useEffect(() => {
    let filtered = sessions

    if (searchTerm) {
      filtered = filtered.filter(
        (session) =>
          session.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          session.bookingDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          session.bookingDetails.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          session.bookingDetails.company.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((session) => session.status === statusFilter)
    }

    setFilteredSessions(filtered)
  }, [sessions, searchTerm, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "rescheduled":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const stats = {
    total: sessions.length,
    confirmed: sessions.filter((s) => s.status === "confirmed").length,
    cancelled: sessions.filter((s) => s.status === "cancelled").length,
    rescheduled: sessions.filter((s) => s.status === "rescheduled").length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Admin
          <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent"> Dashboard</span>
        </h1>
        <p className="text-xl text-purple-200">Manage demo sessions and track booking analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.total}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Total Sessions
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-green-50">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">{stats.confirmed}</div>
            <div className="text-sm text-emerald-700">Confirmed</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-50 to-yellow-50">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">{stats.rescheduled}</div>
            <div className="text-sm text-amber-700">Rescheduled</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-xl bg-gradient-to-br from-red-50 to-pink-50">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{stats.cancelled}</div>
            <div className="text-sm text-red-700">Cancelled</div>
          </CardContent>
        </Card>
      </div>

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
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="rescheduled">Rescheduled</SelectItem>
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
                    {session.createdAt.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <Badge className={`${getStatusColor(session.status)} border font-semibold`}>
                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </Badge>
              </div>
              <div className="flex gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
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
                    <SessionEditForm session={session} onUpdate={(updates) => onUpdateSession(session.id, updates)} />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteSession(session.id)}
                  className="border-red-200 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
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
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Avatar className="w-10 h-10 ring-2 ring-white shadow-md">
                        <AvatarImage src={session.bookingDetails.agent?.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                          {session.bookingDetails.agent?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900">{session.bookingDetails.agent?.name}</div>
                        <div className="text-sm text-gray-600">{session.bookingDetails.agent?.title}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-xs text-gray-500">Date</div>
                          <div className="font-semibold text-sm">
                            {session.bookingDetails.date && formatDate(session.bookingDetails.date)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-xs text-gray-500">Time</div>
                          <div className="font-semibold text-sm">
                            {session.bookingDetails.time} ({session.bookingDetails.duration}m)
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
                          <div className="font-semibold text-sm">{session.bookingDetails.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-xs text-gray-500">Email</div>
                          <div className="font-semibold text-sm">{session.bookingDetails.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-xs text-gray-500">Phone</div>
                          <div className="font-semibold text-sm">{session.bookingDetails.phone}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-xs text-gray-500">Country</div>
                          <div className="font-semibold text-sm">{session.bookingDetails.country}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Building className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-500">Company</div>
                        <div className="font-semibold text-sm">{session.bookingDetails.company}</div>
                      </div>
                    </div>
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

function SessionEditForm({ session, onUpdate }: { session: Session; onUpdate: (updates: Partial<Session>) => void }) {
  const [status, setStatus] = useState(session.status)
function SessionEditForm({
  session,
  onUpdate,
}: {
  session: Session
  onUpdate: (sessionId: string, updates: Partial<Session>) => void
}) {
  const [status, setStatus] = useState(session.status)

 function SessionEditForm({
  session,
  onUpdate,
}: {
  session: Session
  onUpdate: (sessionId: string, updates: Partial<Session>) => void
}) {
  const [status, setStatus] = useState(session.status)

  const handleSave = () => {
    onUpdate(session.id, { status, updatedAt: new Date() })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700">Session Status</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="confirmed">✅ Confirmed</SelectItem>
            <SelectItem value="cancelled">❌ Cancelled</SelectItem>
            <SelectItem value="rescheduled">📅 Rescheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        size="lg"
      >
        Save Changes
      </Button>
    </div>
  )
}

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700">Session Status</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="confirmed">✅ Confirmed</SelectItem>
            <SelectItem value="cancelled">❌ Cancelled</SelectItem>
            <SelectItem value="rescheduled">📅 Rescheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        size="lg"
      >
        Save Changes
      </Button>
    </div>
  )
}


  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700">Session Status</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="confirmed">✅ Confirmed</SelectItem>
            <SelectItem value="cancelled">❌ Cancelled</SelectItem>
            <SelectItem value="rescheduled">📅 Rescheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        size="lg"
      >
        Save Changes
      </Button>
    </div>
  )
}
