import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { sendDemoConfirmation } from "./email"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSessionId(): string {
  return "DEMO-" + Math.random().toString(36).substr(2, 9).toUpperCase()
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export async function sendConfirmationEmail(sessionId, bookingDetails) {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: bookingDetails.email,
        subject: `🎉 Your Inoora Demo is Confirmed - Session ${sessionId}`,
        content: `
          Hello ${bookingDetails.name},
          Your demo session has been confirmed for ${bookingDetails.date} at ${bookingDetails.time}.
          Session ID: ${sessionId}
        `,
        sessionId,
        sentBy: "system",
      }),
    })

    const result = await response.json()
    console.log("Email confirmation result:", result)
    return result  // ✅ Make sure it returns success/failure
  } catch (err) {
    console.error("Error sending confirmation email:", err)
    return { success: false, message: "Email failed" }
  }
}
