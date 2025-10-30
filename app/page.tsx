"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import {Step1Timezone} from "@/components/step1-timezone"
import {Step2Calendar} from "@/components/step2-calendar"
import {Step2Details} from "@/components/step2-details"
import {Step3Confirmation} from "@/components/step3-confirmation"
import { generateSessionId } from "@/lib/utils"
import Image from "next/image"

interface BookingDetails {
  timezone: string
  date: Date | null
  time: string
  name: string
  email: string
  phone: string
  country: string
  company: string
}

export default function DemoScheduler() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    timezone: "",
    date: null,
    time: "",
    name: "",
    email: "",
    phone: "",
    country: "",
    company: "",
  })

  useEffect(() => {
    document.title = "Inoora demo schedule"
  }, [])

  const handleTimezoneSelect = (timezone: string) => setBookingDetails(prev => ({ ...prev, timezone }))
  const handleDateSelect = (date: Date | null) => setBookingDetails(prev => ({ ...prev, date }))
  const handleTimeSelect = (time: string) => setBookingDetails(prev => ({ ...prev, time }))
  const updateBookingDetails = (updates: Partial<BookingDetails>) => setBookingDetails(prev => ({ ...prev, ...updates }))

  const handleSessionComplete = async () => {
    try {
      setIsLoading(true)
      const sessionId = generateSessionId()
      const sessionData = {
        id: sessionId,
        agent_id: null,
        customer_name: bookingDetails.name,
        customer_email: bookingDetails.email,
        customer_phone: bookingDetails.phone,
        customer_country: bookingDetails.country,
        customer_company: bookingDetails.company,
        demo_date: bookingDetails.date?.toISOString().split("T")[0] || "",
        demo_time: bookingDetails.time,
        duration: 30,
        status: "confirmed" as const,
      }

      const response = await fetch("/api/save-demo-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
      })

      const result = await response.json()
      if (!result.success) throw new Error(result.message)
      return result.data
    } catch (err) {
      console.error("Failed to complete session:", err)
      setError("Failed to complete session. Please try again.")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600">Loading Inoora Demo...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Inoora demo schedule</title>
        <meta name="description" content="Schedule your personalized Inoora demo with our experts" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Image
                  src="/logo1.png"
                  alt="Inoora"
                  width={150}
                  height={150}
                  className="object-contain"
                />

                <div className="flex items-center gap-3">
                  {[
                    { step: 1, label: "Timezone" },
                    { step: 2, label: "Schedule" },
                    { step: 3, label: "Details" },
                    { step: 4, label: "Confirm" },
                  ].map(({ step, label }) => (
                    <div key={step} className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                          currentStep === step
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                            : currentStep > step
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {currentStep > step ? "✓" : step}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          currentStep >= step ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {label}
                      </span>
                      {step < 4 && <div className="w-8 h-px bg-gray-300" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {currentStep === 1 && (
            <Step1Timezone
              selectedTimezone={bookingDetails.timezone}
              onTimezoneSelect={handleTimezoneSelect}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <Step2Calendar
              selectedTimezone={bookingDetails.timezone}
              selectedDate={bookingDetails.date}
              selectedTime={bookingDetails.time}
              onDateSelect={handleDateSelect}
              onTimeSelect={handleTimeSelect}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <Step2Details
              bookingDetails={bookingDetails}
              onUpdate={updateBookingDetails}
              onNext={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <Step3Confirmation
              bookingDetails={bookingDetails}
              onBack={() => setCurrentStep(3)}
              onEdit={(step) => setCurrentStep(step)}
              onComplete={handleSessionComplete}
            />
          )}
        </div>
      </div>
    </>
  )
}
