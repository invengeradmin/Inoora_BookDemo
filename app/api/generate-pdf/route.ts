import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { sessions } = await request.json()

    // Simple PDF generation using basic HTML to PDF conversion
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Inoora Demo Sessions Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { color: #667eea; font-size: 24px; font-weight: bold; }
          .subtitle { color: #666; margin-top: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #667eea; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .stats { margin-top: 30px; }
          .stat-item { display: inline-block; margin-right: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Inoora Demo Sessions Report</div>
          <div class="subtitle">Generated on: ${new Date().toLocaleDateString()}</div>
          <div class="subtitle">Total Sessions: ${sessions.length}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Customer</th>
              <th>Company</th>
              <th>Email</th>
              <th>Date</th>
              <th>Time</th>
              <th>Duration</th>
              <th>Agent</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${sessions
              .map(
                (session: any) => `
              <tr>
                <td>${session.id}</td>
                <td>${session.customer_name}</td>
                <td>${session.customer_company}</td>
                <td>${session.customer_email}</td>
                <td>${new Date(session.demo_date).toLocaleDateString()}</td>
                <td>${session.demo_time}</td>
                <td>${session.duration}m</td>
                <td>${session.agent?.name || "N/A"}</td>
                <td>${session.status}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="stats">
          <h3>Summary Statistics</h3>
          <div class="stat-item">Confirmed: ${sessions.filter((s: any) => s.status === "confirmed").length}</div>
          <div class="stat-item">Completed: ${sessions.filter((s: any) => s.status === "completed").length}</div>
          <div class="stat-item">Cancelled: ${sessions.filter((s: any) => s.status === "cancelled").length}</div>
        </div>
      </body>
      </html>
    `

    // Return HTML content that can be printed as PDF by the browser
    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `inline; filename="inoora-demo-sessions-report-${new Date().toISOString().split("T")[0]}.html"`,
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to generate report", error: error.message },
      { status: 500 },
    )
  }
}
