"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Globe, Clock } from "lucide-react"

interface Step1Props {
  selectedTimezone: string
  onTimezoneSelect: (timezone: string) => void
  onNext: () => void
}

const timezones = [
    { value: "Asia/Kolkata", label: "India Standard Time (IST)", offset: "UTC+5:30" },
      { value: "Asia/Dubai", label: "Gulf Standard Time (GST)", offset: "UTC+4" },
  { value: "America/New_York", label: "Eastern Time (ET)", offset: "UTC-5/-4" },
  { value: "America/Chicago", label: "Central Time (CT)", offset: "UTC-6/-5" },
  { value: "America/Denver", label: "Mountain Time (MT)", offset: "UTC-7/-6" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)", offset: "UTC-8/-7" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)", offset: "UTC+0/+1" },
  { value: "Europe/Paris", label: "Central European Time (CET)", offset: "UTC+1/+2" },


  { value: "Asia/Singapore", label: "Singapore Time (SGT)", offset: "UTC+8" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)", offset: "UTC+9" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)", offset: "UTC+10/+11" },
]

export function Step1Timezone({ selectedTimezone, onTimezoneSelect, onNext }: Step1Props) {
  const [timezone, setTimezone] = useState(selectedTimezone)

  const handleContinue = () => {
    if (timezone) {
      onTimezoneSelect(timezone)
      onNext()
    }
  }

  const getCurrentTime = (tz: string) => {
    try {
      return new Date().toLocaleTimeString("en-US", {
        timeZone: tz,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    } catch {
      return "N/A"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full text-sm font-medium text-purple-700 mb-4">
          <Globe className="w-4 h-4" />
          Schedule Your Demo
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          Let's Find the Perfect
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Time </span>
          for You
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          First, let us know your timezone so we can show you available slots in your local time.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Timezone Selection */}
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Globe className="w-6 h-6 text-purple-600" />
              Select Your Timezone
            </CardTitle>
            <p className="text-gray-600">Choose your timezone to see available demo slots</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="h-14 border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Select your timezone" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value} className="py-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{tz.label}</span>
                        <span className="text-sm text-gray-500">{tz.offset}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {timezone && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Current Time</div>
                    <div className="text-purple-600 font-mono text-lg">{getCurrentTime(timezone)}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-sm text-blue-800">
                <div className="font-semibold mb-2">📅 What to expect:</div>
                <ul className="space-y-1 text-blue-700">
                  <li>• Available demo slots in your timezone</li>
                  <li>• Personalized demo session</li>
                  <li>• Our experts will reach out to you via email with full details</li>
                  <li>• Q&A session included</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Card */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="text-xl">Demo Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="opacity-90">Includes:</span>
                  <span className="font-semibold">Live Demo + Q&A</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-90">Your Timezone:</span>
                  <span className="font-semibold">
                    {timezone ? timezones.find((tz) => tz.value === timezone)?.label.split(" (")[0] : "Not selected"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
            <CardContent className="p-6 text-center space-y-4">
              <div className="text-lg font-semibold text-gray-900">Ready to Continue?</div>
              <div className="text-sm text-gray-600">
                {timezone
                  ? "Perfect! Let's find available dates and times."
                  : "Please select your timezone to continue."}
              </div>
              <Button
                onClick={handleContinue}
                disabled={!timezone}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-semibold shadow-lg"
              >
                Continue to Date Selection
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
