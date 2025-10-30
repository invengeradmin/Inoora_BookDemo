"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, CalendarIcon, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step2Props {
  selectedTimezone: string
  selectedDate: Date | null
  selectedTime: string
  onDateSelect: (date: Date | null) => void
  onTimeSelect: (time: string) => void
  onNext: () => void
  onBack: () => void
}

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]

export function Step2Calendar({
  selectedTimezone,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  onNext,
  onBack,
}: Step2Props) {
  const [blockedSlots, setBlockedSlots] = useState<Set<string>>(new Set())
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (selectedDate) {
      loadSlotAvailability(selectedDate)
    }
  }, [selectedDate])

  const loadSlotAvailability = async (date: Date) => {
    try {
      setIsLoading(true)
      const dateStr = date.toISOString().split("T")[0]

      // Load blocked and booked slots for the selected date
      const response = await fetch(`/api/check-availability?date=${dateStr}`)
      const data = await response.json()

      if (data.success) {
        setBlockedSlots(new Set(data.blockedSlots))
        setBookedSlots(new Set(data.bookedSlots))
      }
    } catch (error) {
      console.error("Failed to load slot availability:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isSlotAvailable = (time: string) => {
    if (!selectedDate) return false
    const slotKey = `${selectedDate.toISOString().split("T")[0]}_${time}`
    return !blockedSlots.has(slotKey) && !bookedSlots.has(slotKey)
  }

  const getSlotStatus = (time: string) => {
    if (!selectedDate) return "unavailable"
    const slotKey = `${selectedDate.toISOString().split("T")[0]}_${time}`

    if (blockedSlots.has(slotKey)) return "blocked"
    if (bookedSlots.has(slotKey)) return "booked"
    return "available"
  }

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      onNext()
    }
  }

  const getTimezoneLabel = (timezone: string) => {
    const labels = {
      "America/New_York": "Eastern Time",
      "America/Chicago": "Central Time",
      "America/Denver": "Mountain Time",
      "America/Los_Angeles": "Pacific Time",
      "Europe/London": "GMT",
      "Europe/Paris": "CET",
      "Asia/Dubai": "GST",
      "Asia/Kolkata": "IST",
      "Asia/Singapore": "SGT",
      "Asia/Tokyo": "JST",
      "Australia/Sydney": "AET",
    }
    return labels[timezone] || timezone
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Timezone
        </Button>
        <h1 className="text-4xl font-bold text-gray-900">
          Pick Your
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Perfect </span>
          Time Slot
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose a date and time that works best for you. All times shown in {getTimezoneLabel(selectedTimezone)}.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <CalendarIcon className="w-5 h-5 text-purple-600" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateSelect}
              disabled={(date) => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                return date < today || date.getDay() === 0 || date.getDay() === 6
              }}
              className="rounded-lg border-0 shadow-inner bg-white"
              classNames={{
                day_selected:
                  "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-blue-700",
                day_today: "bg-purple-100 text-purple-900 font-semibold",
              }}
            />
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Clock className="w-5 h-5 text-purple-600" />
              Available Times
            </CardTitle>
            {selectedDate && (
              <p className="text-sm text-gray-600">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Please select a date first</p>
              </div>
            ) : isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading available times...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((time) => {
                  const status = getSlotStatus(time)
                  const isSelected = selectedTime === time

                  return (
                    <Button
                      key={time}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      disabled={status !== "available"}
                      onClick={() => onTimeSelect(time)}
                      className={cn(
                        "h-10 text-sm font-medium transition-all",
                        isSelected &&
                          "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-sm",
                        status === "available" &&
                          !isSelected &&
                          "border-gray-200 hover:border-purple-300 hover:bg-purple-50",
                        status === "blocked" &&
                          "opacity-30 cursor-not-allowed bg-gray-200 border-gray-300 text-gray-400",
                        status === "booked" &&
                          "opacity-50 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-500",
                      )}
                    >
                      {time}
                      {status === "blocked" && <AlertCircle className="w-3 h-3 ml-1" />}
                    </Button>
                  )
                })}
              </div>
            )}

            {selectedDate && (
              <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-xs text-blue-800">
                  <div className="font-semibold mb-1">Legend:</div>
                  <div className="flex flex-wrap gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                      Available
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                      Booked
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-200 border border-gray-300 rounded opacity-30"></div>
                      Blocked
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary & Continue */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="text-xl">Your Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="opacity-90">Timezone:</span>
                  <span className="font-semibold text-sm">{getTimezoneLabel(selectedTimezone)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-90">Date:</span>
                  <span className="font-semibold text-sm">
                    {selectedDate
                      ? selectedDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-90">Time:</span>
                  <span className="font-semibold">{selectedTime || "Not selected"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
            <CardContent className="p-6 text-center space-y-4">
              <div className="text-lg font-semibold text-gray-900">Ready to Continue?</div>
              <div className="text-sm text-gray-600">
                {selectedDate && selectedTime
                  ? "Perfect! Let's get your contact details."
                  : "Please select both date and time to continue."}
              </div>
              <Button
                onClick={handleContinue}
                disabled={!selectedDate || !selectedTime}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-semibold shadow-lg"
              >
                Continue to Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
