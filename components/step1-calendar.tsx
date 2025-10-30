"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Video, Star, ArrowRight, Zap } from "lucide-react"
import type { Agent, BookingDetails } from "@/types"
import type { Agent as DatabaseAgent } from "@/types/database"
import { timeSlots } from "@/lib/data"
import { cn } from "@/lib/utils"

interface Step1Props {
  bookingDetails: BookingDetails
  onUpdate: (details: Partial<BookingDetails>) => void
  onNext: () => void
  agents: DatabaseAgent[]
}

export function Step1Calendar({ bookingDetails, onUpdate, onNext, agents }: Step1Props) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(bookingDetails.date || undefined)
  const [selectedTime, setSelectedTime] = useState(bookingDetails.time)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(bookingDetails.agent)
  const [selectedDuration, setSelectedDuration] = useState(bookingDetails.duration || 30)

  const durations = [
    { value: 15, label: "Quick Chat", icon: "⚡" },
    { value: 30, label: "Standard Demo", icon: "🎯" },
    { value: 45, label: "Deep Dive", icon: "🔍" },
    { value: 60, label: "Full Consultation", icon: "💼" },
  ]

  const handleContinue = () => {
    if (selectedDate && selectedTime && selectedAgent) {
      onUpdate({
        date: selectedDate,
        time: selectedTime,
        agent: selectedAgent,
        duration: selectedDuration,
      })
      onNext()
    }
  }

  const isFormValid = selectedDate && selectedTime && selectedAgent

  return (
    <div className="max-w-7xl mx-auto">
      {/* Compact Hero Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1 rounded-full text-sm font-medium text-purple-700 mb-3">
          <Zap className="w-4 h-4" />
          Book Your Personalized Demo
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Let's Build Something
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Amazing </span>
          Together
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Schedule a personalized demo with our experts and discover how Inoora can transform your business workflow.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Duration Selection - Compact */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="w-4 h-4 text-purple-600" />
              Session Type
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {durations.map((duration) => (
              <div
                key={duration.value}
                className={cn(
                  "p-2 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
                  selectedDuration === duration.value
                    ? "border-purple-500 bg-gradient-to-r from-purple-50 to-blue-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300",
                )}
                onClick={() => setSelectedDuration(duration.value)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{duration.icon}</span>
                    <div>
                      <div className="font-medium text-sm text-gray-900">{duration.label}</div>
                      <div className="text-xs text-gray-600">{duration.value} min</div>
                    </div>
                  </div>
                  {selectedDuration === duration.value && (
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-xs">✓</Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Agent Selection - Compact */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="w-4 h-4 text-purple-600" />
              Your Expert
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className={cn(
                  "p-2 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
                  selectedAgent?.id === agent.id
                    ? "border-purple-500 bg-gradient-to-r from-purple-50 to-blue-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300",
                )}
                onClick={() => setSelectedAgent(agent)}
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar className="w-8 h-8 ring-1 ring-white shadow-sm">
                      <AvatarImage src={agent.avatar_url || "/placeholder.svg"} alt={agent.name} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                        {agent.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {selectedAgent?.id === agent.id && (
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">{agent.name}</div>
                    <div className="text-xs text-gray-600 truncate">{agent.title}</div>
                    <div className="text-xs text-purple-600 font-medium">{agent.timezone}</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Calendar - Compact */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Video className="w-4 h-4 text-purple-600" />
              Pick Your Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
              className="rounded-lg border-0 shadow-inner bg-white scale-90 origin-top"
              classNames={{
                day_selected:
                  "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-blue-700",
                day_today: "bg-purple-100 text-purple-900 font-semibold",
              }}
            />
          </CardContent>
        </Card>

        {/* Time Slots & Continue */}
        <div className="space-y-4">
          {selectedDate && (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="w-4 h-4 text-purple-600" />
                  Available Times
                </CardTitle>
                <p className="text-xs text-gray-600">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.slice(0, 8).map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? "default" : "outline"}
                      size="sm"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={cn(
                        "h-8 text-xs font-medium transition-all",
                        selectedTime === slot.time
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-sm"
                          : "border-gray-200 hover:border-purple-300 hover:bg-purple-50",
                        !slot.available && "opacity-50 cursor-not-allowed",
                      )}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Continue Button */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <div className="text-sm font-semibold">Ready to Continue?</div>
                <div className="text-xs opacity-90">
                  {isFormValid ? "All set! Let's get your details." : "Please select date, time, and expert."}
                </div>
                <Button
                  onClick={handleContinue}
                  disabled={!isFormValid}
                  size="sm"
                  className="w-full bg-white text-purple-600 hover:bg-gray-50 font-semibold h-8"
                >
                  Continue to Details
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
