import { NextResponse } from "next/server"
import { getEmailConfig } from "@/lib/database"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { testEmail } = await request.json()

    if (!testEmail) {
      return NextResponse.json(
        { success: false, message: "Test email address is required" },
        { status: 400 }
      )
    }

    // 🔹 Fetch active email configuration from Postgres
    const emailConfig = await getEmailConfig()
    if (!emailConfig) {
      return NextResponse.json({
        success: false,
        message: "Email configuration not found. Please save SMTP settings first.",
      })
    }

    // 🔹 Create transporter
    const transporter = nodemailer.createTransport({
      host: emailConfig.smtp_host,
      port: emailConfig.smtp_port,
      secure: emailConfig.smtp_port === 465,
      auth: {
        user: emailConfig.smtp_user,
        pass: emailConfig.smtp_password,
      },
    })

    // 🔹 Test HTML message
    const htmlContent = `
      <div style="font-family:Segoe UI,Arial,sans-serif;padding:20px;">
        <h2 style="color:#4F46E5;">Inoora Demo Scheduler</h2>
        <p>This is a <strong>test email</strong> sent using your current SMTP configuration.</p>
        <p>If you're reading this, your email setup works! 🎉</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
        <p style="font-size:13px;color:#6b7280;">Sent automatically from your Inoora demo admin panel.</p>
      </div>
    `

    // 🔹 Attempt to send the email
    await transporter.sendMail({
      from: `${emailConfig.from_name || "Inoora Demo Scheduler"} <${emailConfig.from_email}>`,
      to: testEmail,
      subject: "✅ Inoora Test Email",
      html: htmlContent,
    })

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${testEmail}`,
    })
  } catch (error: any) {
    console.error("Test email error:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Failed to send test email: ${error.message || String(error)}`,
      },
      { status: 500 }
    )
  }
}
