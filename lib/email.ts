import { getEmailConfig } from "./database"

export const sendDemoConfirmation = async (sessionData: any) => {
  try {
    console.log("📧 Preparing demo confirmation for:", sessionData.customer_email)

    // Send confirmation to customer
    const customerResponse = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: sessionData.customer_email,
        subject: `🎉 Your Inoora Demo is Confirmed - Session ${sessionData.id}`,
        sessionId: sessionData.id,
        sentBy: "system",
        content: `
          Hi ${sessionData.customer_name || "there"},
          <br/><br/>
          Your Inoora demo has been scheduled successfully.
          <br/>📅 <strong>Date:</strong> ${sessionData.demo_date}
          <br/>🕒 <strong>Time:</strong> ${sessionData.demo_time}
          <br/><br/>We look forward to meeting you!

        `,
      }),
    })

    const customerResult = await customerResponse.json()
    console.log("✅ Customer email result:", customerResult)

    // Notify assigned agent
    if (sessionData.agents?.email) {
      const agentResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: sessionData.agents.email,
          subject: `📅 New Demo Assigned - ${sessionData.id}`,
          sessionId: sessionData.id,
          sentBy: "system",
          content: `
            Hello ${sessionData.agents.name || "Agent"},
            <br/><br/>
            A new demo has been scheduled and assigned to you.
            <br/>🧍 Customer: ${sessionData.customer_name}
            <br/>📅 Date: ${sessionData.demo_date}
            <br/>🕒 Time: ${sessionData.demo_time}
            <br/><br/>Please check your dashboard for more details.
          `,
        }),
      })

      const agentResult = await agentResponse.json()
      console.log("✅ Agent email result:", agentResult)
    }

    return customerResult
  } catch (error: any) {
    console.error("❌ Email sending failed:", error)
    return { success: false, message: `Failed to send email: ${error.message || String(error)}` }
  }
}


export const sendCustomEmail = async (emailData: {
  to: string
  subject: string
  content: string
  sessionId?: string
  sentBy?: string
}) => {
  try {
    const response = await fetch("/api/send-custom-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailData),
    })

    return await response.json()
  } catch (error: any) {
    console.error("❌ Custom email sending failed:", error)
    return { success: false, message: `Failed to send email: ${error.message || String(error)}` }
  }
}

export const testEmailConfiguration = async (testEmail: string) => {
  try {
    const response = await fetch("/api/test-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testEmail }),
    })

    return await response.json()
  } catch (error: any) {
    console.error("❌ Email test failed:", error)
    return { success: false, message: `Failed to test email: ${error.message || String(error)}` }
  }
}
