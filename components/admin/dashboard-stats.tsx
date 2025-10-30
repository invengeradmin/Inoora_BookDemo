"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Calendar, TrendingUp, CheckCircle } from "lucide-react"
import type { DemoSession, Agent } from "@/types/database"

interface DashboardStatsProps {
  sessions: DemoSession[]
  agents: Agent[]
}

export function DashboardStats({ sessions, agents }: DashboardStatsProps) {
  const stats = {
    total: sessions.length,
    confirmed: sessions.filter((s) => s.status === "confirmed").length,
    completed: sessions.filter((s) => s.status === "completed").length,
    cancelled: sessions.filter((s) => s.status === "cancelled").length,
    rescheduled: sessions.filter((s) => s.status === "rescheduled").length,
    thisWeek: sessions.filter((s) => {
      const sessionDate = new Date(s.demo_date)
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return sessionDate >= weekAgo && sessionDate <= now
    }).length,
    upcoming: sessions.filter((s) => {
      const sessionDate = new Date(s.demo_date)
      return sessionDate > new Date() && s.status === "confirmed"
    }).length,
  }

  const conversionRate = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : "0"

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Confirmed</p>
                <p className="text-3xl font-bold text-green-700">{stats.confirmed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Upcoming</p>
                <p className="text-3xl font-bold text-blue-700">{stats.upcoming}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-orange-700">{conversionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Session Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Confirmed</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${stats.total > 0 ? (stats.confirmed / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-white font-semibold w-8">{stats.confirmed}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/80">Completed</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-white font-semibold w-8">{stats.completed}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/80">Rescheduled</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full"
                      style={{ width: `${stats.total > 0 ? (stats.rescheduled / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-white font-semibold w-8">{stats.rescheduled}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/80">Cancelled</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${stats.total > 0 ? (stats.cancelled / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-white font-semibold w-8">{stats.cancelled}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <div className="text-2xl font-bold text-white">{agents.length}</div>
                <div className="text-sm text-white/80">Active Agents</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <div className="text-2xl font-bold text-white">{stats.thisWeek}</div>
                <div className="text-sm text-white/80">This Week</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {sessions.length > 0
                    ? Math.round(sessions.reduce((acc, s) => acc + s.duration, 0) / sessions.length)
                    : 0}
                  m
                </div>
                <div className="text-sm text-white/80">Avg Duration</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {new Set(sessions.map((s) => s.customer_company)).size}
                </div>
                <div className="text-sm text-white/80">Companies</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
