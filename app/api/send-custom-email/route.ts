// import { type NextRequest, NextResponse } from "next/server"
// import { createServerClient } from "@/lib/supabase"
// import { logEmail } from "@/lib/database"
// import nodemailer from "nodemailer"

// export async function POST(request: NextRequest) {
//   try {
//     const { to, subject, content, sessionId, sentBy } = await request.json()

//     const supabase = createServerClient()

//     const { data: emailConfig } = await supabase.from("email_config").select("*").eq("is_active", true).single()

//     if (!emailConfig) {
//       return NextResponse.json({ success: false, message: "Email not configured" })
//     }

//     // Fix: createTransport instead of createTransporter
//     const transporter = nodemailer.createTransport({
//       host: emailConfig.smtp_host,
//       port: emailConfig.smtp_port,
//       secure: emailConfig.smtp_port === 465,
//       auth: {
//         user: emailConfig.smtp_user,
//         pass: emailConfig.smtp_password,
//       },
//     })

//     const htmlContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="utf-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <meta name="color-scheme" content="light dark">
//         <title>${subject}</title>
//         <style>
//           /* Light mode styles (default) */
//           :root {
//             color-scheme: light dark;
//           }
          
//           .email-container {
//             max-width: 600px;
//             margin: 0 auto;
//             background-color: #ffffff;
//             font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//           }
          
//           .header {
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             padding: 30px;
//             text-align: center;
//           }
          
//           .logo-container {
//             background-color: rgba(255,255,255,0.1);
//             width: 60px;
//             height: 60px;
//             border-radius: 15px;
//             margin: 0 auto 15px;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//           }
          
//           .logo-text {
//             color: white;
//             font-size: 24px;
//             font-weight: bold;
//           }
          
//           .header-title {
//             color: white;
//             margin: 0;
//             font-size: 24px;
//             font-weight: 700;
//           }
          
//           .content {
//             padding: 40px 30px;
//             background-color: #ffffff;
//             color: #4a5568;
//             line-height: 1.6;
//             font-size: 16px;
//           }
          
//           .footer {
//             background-color: #f7fafc;
//             padding: 30px;
//             text-align: center;
//             border-top: 1px solid #e2e8f0;
//           }
          
//           .footer-text {
//             color: #718096;
//             margin: 0;
//             font-size: 14px;
//           }
          
//           .footer-brand {
//             color: #2d3748;
//             font-weight: bold;
//           }
          
//           .footer-divider {
//             margin-top: 20px;
//             padding-top: 20px;
//             border-top: 1px solid #e2e8f0;
//           }
          
//           .footer-copyright {
//             color: #a0aec0;
//             margin: 0;
//             font-size: 12px;
//           }
          
//           /* Dark mode styles */
//           @media (prefers-color-scheme: dark) {
//             .email-container {
//               background-color: #1a202c;
//             }
            
//             .content {
//               background-color: #1a202c;
//               color: #a0aec0;
//             }
            
//             .footer {
//               background-color: #2d3748;
//               border-top: 1px solid #4a5568;
//             }
            
//             .footer-text {
//               color: #a0aec0;
//             }
            
//             .footer-brand {
//               color: #e2e8f0;
//             }
            
//             .footer-divider {
//               border-top: 1px solid #4a5568;
//             }
            
//             .footer-copyright {
//               color: #718096;
//             }
//           }
          
//           /* Force dark mode for specific email clients */
//           [data-ogsc] .email-container {
//             background-color: #1a202c !important;
//           }
          
//           [data-ogsc] .content {
//             background-color: #1a202c !important;
//             color: #a0aec0 !important;
//           }
          
//           [data-ogsc] .footer {
//             background-color: #2d3748 !important;
//             border-top: 1px solid #4a5568 !important;
//           }
          
//           [data-ogsc] .footer-text {
//             color: #a0aec0 !important;
//           }
          
//           [data-ogsc] .footer-brand {
//             color: #e2e8f0 !important;
//           }
          
//           [data-ogsc] .footer-copyright {
//             color: #718096 !important;
//           }
//         </style>
//       </head>
//       <body style="margin: 0; padding: 0; background-color: #f8fafc;">
//         <div class="email-container">
//           <!-- Header -->
//           <div class="header">
//             <div class="logo-container">
//               <div class="logo-text">I</div>
//             </div>
//             <h1 class="header-title">Inoora Demo</h1>
//           </div>
          
//           <!-- Content -->
//           <div class="content">
//             ${content.replace(/\n/g, "<br>")}
//           </div>
          
//           <!-- Footer -->
//           <div class="footer">
//             <p class="footer-text">
//               Best regards,<br>
//               <span class="footer-brand">The Inoora Team</span>
//             </p>
//             <div class="footer-divider">
//               <p class="footer-copyright">
//                 © 2024 Inoora. All rights reserved.
//               </p>
//             </div>
//           </div>
//         </div>
//       </body>
//       </html>
//     `

//     await transporter.sendMail({
//       from: `${emailConfig.from_name} <${emailConfig.from_email}>`,
//       to,
//       subject,
//       html: htmlContent,
//     })

//     // Log the email
//     if (sessionId && sentBy) {
//       await logEmail({
//         session_id: sessionId,
//         from_email: emailConfig.from_email,
//         to_email: to,
//         subject,
//         content,
//         sent_by: sentBy,
//       })
//     }

//     return NextResponse.json({ success: true, message: "Email sent successfully" })
//   } catch (error) {
//     console.error("Custom email sending error:", error)
//     return NextResponse.json({ success: false, message: "Failed to send email" })
//   }
// }

import { NextResponse } from "next/server"
import { query } from "@/lib/postgres"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const { to, subject, content, sessionId, sentBy } = await req.json()

    // ✅ Fetch email config from Postgres (no Supabase)
    const { rows } = await query(`SELECT * FROM email_config WHERE is_active = true LIMIT 1`)
    const emailConfig = rows[0]

    if (!emailConfig) {
      return NextResponse.json({ success: false, message: "Email not configured" })
    }

    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      host: emailConfig.smtp_host,
      port: emailConfig.smtp_port,
      secure: emailConfig.smtp_port === 465,
      auth: {
        user: emailConfig.smtp_user,
        pass: emailConfig.smtp_password,
      },
    })

    const htmlContent = `
      <html>
        <body style="font-family:Segoe UI;padding:20px;">
          <h2>${subject}</h2>
          <p>${content.replace(/\n/g, "<br>")}</p>
          <p>— The Inoora Team</p>
        </body>
      </html>
    `

    await transporter.sendMail({
      from: `${emailConfig.from_name} <${emailConfig.from_email}>`,
      to,
      subject,
      html: htmlContent,
    })

    // ✅ Log email (optional)
    if (sessionId && sentBy) {
    await query(
  `INSERT INTO email_logs (session_id, from_email, to_email, subject, content, sent_by)
   VALUES ($1, $2, $3, $4, $5, $6)`,
  [sessionId, emailConfig.from_email, to, subject, content, sentBy]
)

    }

    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error: any) {
    console.error("Email send error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send email" },
      { status: 500 }
    )
  }
}
