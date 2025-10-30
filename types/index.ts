export interface Agent {
  id: string
  name: string
  avatar: string
  title: string
  timezone: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface BookingDetails {
  date: Date | null
  time: string
  agent: Agent | null
  duration: number
  name: string
  email: string
  phone: string
  country: string
  company: string
}

export interface Session {
  id: string
  bookingDetails: BookingDetails
  status: "confirmed" | "cancelled" | "rescheduled"
  createdAt: Date
  updatedAt: Date
}
