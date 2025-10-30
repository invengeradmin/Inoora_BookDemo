"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Phone,
  Building,
  Globe,
  Edit,
  Check,
  Sparkles,
  Copy,
  Clock,
} from "lucide-react"
import type { BookingDetails, Session } from "@/types"
import { formatDate, generateSessionId, sendConfirmationEmail } from "@/lib/utils"
import Link from "next/link"
interface Step3Props {
  bookingDetails: BookingDetails
  onBack: () => void
  onEdit: (step: number) => void
  onComplete: (session: Session) => void
}

export function Step3Confirmation({ bookingDetails, onBack, onEdit, onComplete }: Step3Props) {
  const [isBooking, setIsBooking] = useState(false)
  const [isBooked, setIsBooked] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
async function handleContactSupport(sessionId: string) {
  const res = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: "info@inoora.ai",
      subject: `Session ${sessionId}`,
      content: `Hi team,\n\nMy session ID is ${sessionId}.`,
      sessionId,
      sentBy: "system",
    }),
  })

  const result = await res.json()
  if (result.success) {
    alert("✅ Your message has been sent to Inoora Support!")
  } else {
    alert("⚠️ Failed to send message: " + result.message)
  }
}
 const handleConfirmBooking = async () => {
  try {
    console.log("🟣 Starting demo confirmation...")
    setIsBooking(true)

    // Optional visual delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newSessionId = generateSessionId()
    setSessionId(newSessionId)

    const session: Session = {
      id: newSessionId,
      bookingDetails,
      status: "confirmed",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log("🟢 Generated session:", session)

    const emailResult = await sendConfirmationEmail(newSessionId, bookingDetails)
    console.log("📧 Email send result:", emailResult)

    if (emailResult?.success) {
      console.log("🎉 Email sent successfully, updating UI...")
      setIsBooked(true)
    } else {
      console.error("❌ Email failed:", emailResult)
      alert("Email could not be sent. Please try again.")
    }
  } catch (err) {
    console.error("❌ Booking confirmation failed:", err)
    alert("Something went wrong while confirming your demo. Please try again.")
  } finally {
    setIsBooking(false)
  }
}


  const copySessionId = () => {
    if (!sessionId) return
    navigator.clipboard.writeText(sessionId)
  }

  // ✅ Show confirmation UI after successful booking
  if (isBooked) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* ✅ Success animation */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <Check className="w-10 h-10 text-white" />
            </div>
            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto animate-ping opacity-20" />
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-gray-900">
              Demo{" "}
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                Confirmed!
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              🎉 Awesome! Your demo slot is reserved. Our experts will reach out to you via email with the full
              details and meeting information.
            </p>
          </div>
        </div>

        {/* ✅ Session Details */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 max-w-2xl mx-auto">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Session Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <div className="text-sm text-gray-600 mb-2">Your Session ID</div>
              <div className="flex items-center justify-center gap-2">
                <div className="text-2xl font-mono font-bold text-purple-600 break-all">{sessionId}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copySessionId}
                  className="text-purple-600 hover:bg-purple-100 flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xs text-gray-500 mt-1">Keep this ID for your records</div>
            </div>

            {/* Meeting Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-sm">Date & Time</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">{bookingDetails.date && formatDate(bookingDetails.date)}</div>
                  <div className="text-xs text-gray-600">{bookingDetails.time}</div>
                </div>
              </div>

              {/* <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-sm">Your Expert</span>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={bookingDetails.agent?.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">
                      {bookingDetails.agent?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-sm">{bookingDetails.agent?.name}</span>
                </div>
              </div> */}
            </div>
          </CardContent>
        </Card>

        {/* ✅ Support section */}
<Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-white max-w-2xl mx-auto">
  <CardContent className="p-4 text-center">
    <div className="text-lg font-semibold text-gray-900 mb-2">Need to Make Changes?</div>
    <div className="text-gray-600 mb-3 text-sm">
      Contact our support team with your session ID:{" "}
      <span className="font-mono font-semibold text-purple-600 break-all">{sessionId}</span>
    </div>

    <div className="flex justify-center gap-3">
      {/* Sends via backend and logs in DB */}
      <Button variant="outline" size="sm" onClick={() => handleContactSupport(sessionId)}>
        <Mail className="w-4 h-4 mr-2" />
        Email Support
      </Button>

      {/* Opens dialer directly */}
      <a
        href="tel:+918971991555"
        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
      >
        <Phone className="w-4 h-4 mr-2" />
        Call Us
      </a>
    </div>
  </CardContent>
</Card>


      </div>
    )
  }

  // 🟣 Default booking review screen
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-3">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Details
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          Almost{" "}
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">There!</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Please review your booking details one final time before we confirm your personalized demo.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Meeting Details */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
              Meeting Details
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(1)} className="text-purple-600 hover:bg-purple-50">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <Avatar className="w-12 h-12 ring-2 ring-white shadow-md">
                <AvatarImage src={bookingDetails.agent?.avatar || "/placeholder.svg"} alt={bookingDetails.agent?.name} />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  {bookingDetails.agent?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-bold text-gray-900">{bookingDetails.agent?.name}</div>
                <div className="text-purple-600 font-medium text-sm">{bookingDetails.agent?.title}</div>
                <div className="text-xs text-gray-600">{bookingDetails.agent?.timezone}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <Calendar className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                <div className="font-semibold text-gray-900 text-sm">
                  {bookingDetails.date && formatDate(bookingDetails.date)}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <Clock className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                <div className="font-semibold text-gray-900 text-sm">{bookingDetails.time}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Info */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-purple-600" />
              Your Information
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(2)} className="text-purple-600 hover:bg-purple-50">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <InfoItem icon={<User />} label="Name" value={bookingDetails.name} />
              <InfoItem icon={<Mail />} label="Email" value={bookingDetails.email} small />
              <InfoItem icon={<Phone />} label="Phone" value={bookingDetails.phone} />
              <InfoItem icon={<Globe />} label="Country" value={bookingDetails.country} />
            </div>
            <InfoItem icon={<Building />} label="Company" value={bookingDetails.company} />
          </CardContent>
        </Card>
      </div>

      {/* Confirm button */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div>
              <div className="text-xl font-bold mb-2">Ready to Confirm Your Demo?</div>
              <div className="text-sm opacity-90">
                We'll send you a calendar invite and meeting details right after confirmation.
              </div>
            </div>

            <Button
              onClick={handleConfirmBooking}
              disabled={isBooking}
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-50 font-bold text-lg px-8 py-3 h-auto shadow-lg"
            >
              {isBooking ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mr-3"></div>
                  Confirming Your Demo...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-3" />
                  Confirm & Schedule Demo
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper component for user info lines
function InfoItem({
  icon,
  label,
  value,
  small = false,
}: {
  icon: React.ReactNode
  label: string
  value: string
  small?: boolean
}) {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
      <div className="w-4 h-4 text-gray-500">{icon}</div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className={`font-semibold ${small ? "text-xs" : "text-sm"} break-all`}>{value}</div>
      </div>
    </div>
  )
}
