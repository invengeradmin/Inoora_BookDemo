import type { Agent, TimeSlot } from "@/types"

export const agents: Agent[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    title: "Senior Sales Manager",
    timezone: "America/New_York",
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    title: "Product Specialist",
    timezone: "America/Los_Angeles",
  },
  {
    id: "3",
    name: "Emma Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    title: "Customer Success Lead",
    timezone: "Europe/London",
  },
]

export const timeSlots: TimeSlot[] = [
  { time: "09:00", available: true },
  { time: "09:30", available: true },
  { time: "10:00", available: false },
  { time: "10:30", available: true },
  { time: "11:00", available: true },
  { time: "11:30", available: false },
  { time: "12:00", available: true },
  { time: "13:00", available: true },
  { time: "13:30", available: true },
  { time: "14:00", available: true },
  { time: "14:30", available: false },
  { time: "15:00", available: true },
  { time: "15:30", available: true },
  { time: "16:00", available: true },
  { time: "16:30", available: true },
  { time: "17:00", available: true },
]

export const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Netherlands",
  "India",
  "Singapore",
  "Japan",
  "Dubai",
]
