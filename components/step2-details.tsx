"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, User, Mail, Phone, Globe, Building, Shield } from "lucide-react"
import type { BookingDetails } from "@/types"
import { countries } from "@/lib/data"

interface Step2Props {
  bookingDetails: BookingDetails
  onUpdate: (details: Partial<BookingDetails>) => void
  onNext: () => void
  onBack: () => void
}

export function Step2Details({ bookingDetails, onUpdate, onNext, onBack }: Step2Props) {
  const [formData, setFormData] = useState({
    name: bookingDetails.name || "",
    email: bookingDetails.email || "",
    phone: bookingDetails.phone || "",
    country: bookingDetails.country || "",
    company: bookingDetails.company || "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleContinue = () => {
    onUpdate(formData)
    onNext()
  }

  const isFormValid = formData.name && formData.email && formData.phone && formData.country && formData.company

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Schedule
        </Button>
        <h1 className="text-4xl font-bold text-gray-900">
          Tell Us About
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Yourself</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Help us personalize your demo experience by sharing a few details about you and your business.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <User className="w-6 h-6 text-purple-600" />
              Your Information
            </CardTitle>
            <p className="text-gray-600">All fields are required to proceed</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your.email@company.com"
                  className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Phone & Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Country
                </Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                  <SelectTrigger className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Company */}
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Company Name
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="Your company name"
                className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            {/* Privacy Notice */}
            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
              <Shield className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-purple-800">
                <div className="font-semibold mb-1">Your privacy matters</div>
                <div>
                  We'll only use this information to personalize your demo and follow up on your inquiry. We never share
                  your data with third parties.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="text-xl">Demo Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="opacity-90">Date:</span>
                  <span className="font-semibold">
                    {bookingDetails.date?.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-90">Time:</span>
                  <span className="font-semibold">{bookingDetails.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-90">Duration:</span>
                  <span className="font-semibold">{bookingDetails.duration} minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-90">Expert:</span>
                  <span className="font-semibold">{bookingDetails.agent?.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
            <CardContent className="p-6 text-center space-y-4">
              <div className="text-lg font-semibold text-gray-900">Ready to Confirm?</div>
              <div className="text-sm text-gray-600">
                {isFormValid
                  ? "Perfect! Let's review everything before we confirm your demo."
                  : "Please fill in all required fields to continue."}
              </div>
              <Button
                onClick={handleContinue}
                disabled={!isFormValid}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-semibold shadow-lg"
              >
                Continue to Confirmation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
