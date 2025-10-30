// import { NextResponse } from "next/server"
// import { query } from "@/lib/postgres"
// import nodemailer from "nodemailer"

// // Main API handler
// export async function POST(req: Request) {
//   try {
//     const { to, subject, content, sessionId, sentBy } = await req.json()

//     // 1️⃣ Fetch active email configuration from Postgres
//     const { rows } = await query(`SELECT * FROM email_config WHERE is_active = true LIMIT 1`)
//     const emailConfig = rows[0]

//     if (!emailConfig) {
//       return NextResponse.json({ success: false, message: "Email not configured" })
//     }

//     // 2️⃣ Create transporter
//     const transporter = nodemailer.createTransport({
//       host: emailConfig.smtp_host,
//       port: emailConfig.smtp_port,
//       secure: emailConfig.smtp_port === 465, // true for SSL (465), false for STARTTLS (587)
//       auth: {
//         user: emailConfig.smtp_user,
//         pass: emailConfig.smtp_password,
//       },
//     })

//     // 3️⃣ Compose HTML body
//     const htmlContent = `
//       <!DOCTYPE html>
//       <html>
//       <body style="font-family:'Segoe UI',Arial,sans-serif;padding:20px;color:#333;">
//         <div style="max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:10px;">
//           <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);
//                       color:#fff;padding:20px;border-radius:10px 10px 0 0;">
//             <h2 style="margin:0;">${subject}</h2>
//           </div>
//           <div style="padding:20px;">
//             ${content.replace(/\n/g, "<br>")}
//             <p style="margin-top:30px;color:#555;">— The Inoora Team</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `

//     // 4️⃣ Send the email
//     await transporter.sendMail({
//       from: `${emailConfig.from_name} <${emailConfig.from_email}>`,
//       to,
//       subject,
//       html: htmlContent,
//     })

//     console.log(`✅ Email sent successfully to ${to}`)

//     // 5️⃣ Log the email (safe for UUID/text mix)
//     try {
//       await query(
//         `INSERT INTO email_logs (session_id, from_email, to_email, subject, content, sent_by)
//          VALUES ($1, $2, $3, $4, $5, $6)`,
//         [
//           sessionId || null,
//           emailConfig.from_email,
//           to,
//           subject,
//           content,
//           // 🟢 Only log UUIDs, store NULL otherwise
//           sentBy && /^[0-9a-f-]{36}$/i.test(sentBy) ? sentBy : null,
//         ]
//       )
//       console.log("📬 Email log recorded successfully")
//     } catch (logError: any) {
//       console.warn("⚠️ Email log failed:", logError.message)
//     }

//     // ✅ Return success
//     return NextResponse.json({ success: true, message: "Email sent successfully" })
//   } catch (error: any) {
//     console.error("❌ Email send error:", error)
//     return NextResponse.json(
//       { success: false, message: error.message || "Failed to send email" },
//       { status: 500 }
//     )
//   }
  
// }

import { NextResponse } from "next/server"
import { query } from "@/lib/postgres"
import nodemailer from "nodemailer"

// -----------------------------------------------------------------------------
//  /api/send-email
// -----------------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const { to, subject, content, sessionId, sentBy } = await req.json()

    if (!to || !subject || !content) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (to, subject, content)" },
        { status: 400 }
      )
    }

    // 1️⃣ Fetch active email configuration
    const { rows } = await query(`SELECT * FROM email_config WHERE is_active = true LIMIT 1`)
    const emailConfig = rows[0]

    if (!emailConfig) {
      return NextResponse.json({ success: false, message: "Email configuration not found" })
    }

    // 2️⃣ Initialize transporter (STARTTLS or SSL based on port)
    const transporter = nodemailer.createTransport({
      host: emailConfig.smtp_host,
      port: emailConfig.smtp_port,
      secure: emailConfig.smtp_port === 465, // SSL = true, STARTTLS = false
      auth: {
        user: emailConfig.smtp_user,
        pass: emailConfig.smtp_password,
      },
      tls: {
        // Allow self-signed certs in dev mode (optional)
        rejectUnauthorized: process.env.NODE_ENV === "production",
      },
    })

    // 3️⃣ Build email body (HTML + plain-text fallback)
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <body style="font-family:'Segoe UI',Arial,sans-serif;padding:20px;color:#333;background-color:#f8fafc;">
          <div style="max-width:600px;margin:auto;background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
            <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);
                        color:#fff;padding:20px;">
              <h2 style="margin:0;">${subject}</h2>
            </div>
            <div style="padding:20px;line-height:1.6;font-size:15px;color:#444;">
              ${content.replace(/\n/g, "<br>")}
              <p style="margin-top:30px;color:#555;">— The Inoora Team</p>
            </div>
          </div>
        </body>
      </html>
    `

    const textBody = content
      .replace(/<[^>]+>/g, "") // remove HTML tags
      .replace(/\n+/g, "\n")
      .trim()

    // 4️⃣ Send the email
    await transporter.sendMail({
      from: `${emailConfig.from_name} <${emailConfig.from_email}>`,
      to,
      subject,
      text: textBody,
      html: htmlBody,
    })

    console.log(`✅ Email sent successfully to ${to}`)

    // 5️⃣ Log the email safely in DB
    try {
      await query(
        `INSERT INTO email_logs (session_id, from_email, to_email, subject, content, sent_by)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          // Allow NULL if sessionId not provided or invalid
          sessionId && /^[A-Za-z0-9\-]+$/.test(sessionId) ? sessionId : null,
          emailConfig.from_email,
          to,
          subject,
          content,
          // Only log UUIDs, else store NULL
          sentBy && /^[0-9a-f-]{36}$/i.test(sentBy) ? sentBy : null,
        ]
      )
      console.log("📬 Email log recorded successfully")
    } catch (logErr: any) {
      console.warn("⚠️ Email log failed:", logErr.message)
    }

    // ✅ Success response
    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error: any) {
    console.error("❌ Email send error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send email" },
      { status: 500 }
    )
  }
}
