import jsPDF from 'jspdf'

export class ReportManager {
  static exportToCSV(results: any[], filename: string = 'results.csv') {
    const headers = ['Student ID', 'Status', 'Error', 'Actual Output']
    const rows = results.map(r => [
      r.studentId,
      r.status,
      r.error || '',
      r.actualOutput || ''
    ])

    const csvContent =
      [headers, ...rows]
        .map(row =>
          row
            .map(String)
            .map(v => `"${v.replace(/"/g, '""')}"`)
            .join(',')
        )
        .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.click()
    URL.revokeObjectURL(url)
  }

  static exportToPDF(results: any[], filename: string = 'results.pdf') {
    const doc = new jsPDF()
    doc.setFontSize(14)
    doc.text('Evaluation Results', 14, 20)

    const rowHeight = 10
    const startY = 30

    results.forEach((r, i) => {
      const y = startY + i * rowHeight
      doc.text(r.studentId, 14, y)
      doc.text(r.status, 60, y)
      doc.text((r.error || '').substring(0, 30), 90, y)
      doc.text((r.actualOutput || '').substring(0, 30), 140, y)
    })

    doc.save(filename)
  }
}