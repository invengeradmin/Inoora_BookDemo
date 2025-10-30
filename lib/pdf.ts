export const generateSessionsPDF = async (sessions: any[]) => {
  try {
    // Open the report in a new window for printing
    const response = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessions }),
    })

    if (!response.ok) {
      throw new Error(`Failed to generate report: ${response.statusText}`)
    }

    const htmlContent = await response.text()

    // Open in new window and trigger print
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }

    return { success: true }
  } catch (error) {
    console.error("PDF generation failed:", error)
    alert(`Report generation failed: ${error.message}`)
    return { success: false, message: error.message }
  }
}
