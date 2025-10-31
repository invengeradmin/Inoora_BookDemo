"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Ban, CalendarIcon, Clock, Trash2, Plus, CheckCircle, AlertCircle } from "lucide-react"

interface BlockedSlot {
  id: string
  date: string
  time: string
  reason?: string
  blocked_by?: string
  created_at: string
}

const timeSlots = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30"
]

interface SlotBlockingProps {
  onRefresh: () => void
}

export function SlotBlocking({ onRefresh }: SlotBlockingProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState("")
  const [reason, setReason] = useState("")
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    loadBlockedSlots()
  }, [])

  // ✅ Use API routes instead of server imports
  const loadBlockedSlots = async () => {
    try {
      const res = await fetch("/api/slots", { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load slots")
      const data = await res.json()
      setBlockedSlots(data)
    } catch (error) {
      console.error("Error getting blocked slots:", error)
    }
  }

  const handleBlockSlot = async () => {
    if (!selectedDate || !selectedTime) {
      setMessage({ type: "error", text: "Please select both date and time" })
      return
    }

    const dateStr = selectedDate.toISOString().split("T")[0]
    const existingBlock = blockedSlots.find((s) => s.date === dateStr && s.time === selectedTime)
    if (existingBlock) {
      setMessage({ type: "error", text: "This slot is already blocked" })
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch("/api/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dateStr,
          time: selectedTime,
          reason: reason || "Blocked by admin",
        }),
      })

      if (!res.ok) throw new Error("Failed to block slot")
      setMessage({ type: "success", text: "Slot blocked successfully!" })
      setReason("")
      setSelectedTime("")
      await loadBlockedSlots()
      onRefresh()
    } catch (error) {
      console.error("Failed to block slot:", error)
      setMessage({ type: "error", text: "Failed to block slot" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnblockSlot = async (id: string) => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/slots/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to unblock slot")
      setMessage({ type: "success", text: "Slot unblocked successfully!" })
      await loadBlockedSlots()
      onRefresh()
    } catch (error) {
      console.error("Failed to unblock slot:", error)
      setMessage({ type: "error", text: "Failed to unblock slot" })
    } finally {
      setIsLoading(false)
    }
  }

  const getBlockedSlotsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return blockedSlots.filter((s) => s.date === dateStr)
  }

  const isSlotBlocked = (time: string) => {
    if (!selectedDate) return false
    const dateStr = selectedDate.toISOString().split("T")[0]
    return blockedSlots.some((s) => s.date === dateStr && s.time === time)
  }

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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CalendarIcon className="w-5 h-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                return date < today
              }}
              className="rounded-lg border-0 shadow-inner bg-white/10"
              classNames={{
                day_selected: "bg-gradient-to-r from-purple-600 to-blue-600 text-white",
                day_today: "bg-purple-100 text-purple-900 font-semibold",
              }}
            />
          </CardContent>
        </Card>

        {/* Block Slot */}
        <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Ban className="w-5 h-5" />
              Block Time Slot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDate && (
              <>
                <div className="space-y-2">
                  <Label className="text-white">Select Time</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        disabled={isSlotBlocked(time)}
                        onClick={() => setSelectedTime(time)}
                        className={`text-xs ${
                          selectedTime === time
                            ? "bg-gradient-to-r from-purple-600 to-blue-600"
                            : isSlotBlocked(time)
                            ? "bg-red-500/20 border-red-500/50 text-red-300 cursor-not-allowed"
                            : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                        }`}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-white">Reason (Optional)</Label>
                  <Input
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g., Team meeting, Holiday"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>

                <Button
                  onClick={handleBlockSlot}
                  disabled={!selectedTime || isLoading}
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Blocking...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Block Slot
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Blocked Slots (per date) */}
        <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="w-5 h-5" />
              Blocked Slots
              {selectedDate && <Badge className="bg-white/20 text-white">{selectedDate.toLocaleDateString()}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div className="space-y-3">
                {getBlockedSlotsForDate(selectedDate).map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                  >
                    <div>
                      <div className="font-semibold text-red-300">{slot.time}</div>
                      {slot.reason && <div className="text-xs text-red-400">{slot.reason}</div>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnblockSlot(slot.id)}
                      className="text-red-300 hover:text-red-200 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {getBlockedSlotsForDate(selectedDate).length === 0 && (
                  <div className="text-center py-4 text-white/60">No blocked slots for this date</div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-white/60">Select a date to view blocked slots</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Blocked Slots */}
      <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">All Blocked Slots ({blockedSlots.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {blockedSlots.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blockedSlots.map((slot) => (
                <div key={slot.id} className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-red-300">
                      {new Date(slot.date).toLocaleDateString()} at {slot.time}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnblockSlot(slot.id)}
                      className="text-red-300 hover:text-red-200 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {slot.reason && <div className="text-sm text-red-400">{slot.reason}</div>}
                  <div className="text-xs text-red-500 mt-2">
                    Blocked on {new Date(slot.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">No blocked slots found</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
