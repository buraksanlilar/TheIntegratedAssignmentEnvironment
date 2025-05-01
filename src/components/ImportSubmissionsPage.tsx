import React, { useState } from 'react'
import './ImportSubmissionsPage.css'

const ImportSubmissionsPage: React.FC = () => {
  const [zipPath, setZipPath] = useState<string | null>(null)
  const [status, setStatus] = useState('')

  const handleSelectZip = async () => {
    const result = await window.api.importZip()
    if (result.success) {
      setZipPath(result.path|| null)
      setStatus('ZIP file extracted successfully!')
    } else {
      setStatus('ZIP extraction cancelled or failed.')
    }
  }

  return (
    <div className="import-submissions-container">
      <h2>Import Student Submissions</h2>
      <button onClick={handleSelectZip}>📂 Select ZIP File</button>
      {zipPath && (
        <p><strong>Selected ZIP:</strong> {zipPath}</p>
      )}
      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </div>
  )
}

export default ImportSubmissionsPage
