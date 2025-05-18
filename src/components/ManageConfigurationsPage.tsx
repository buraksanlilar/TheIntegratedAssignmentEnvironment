import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './ManageConfigurationsPage.css'

const ManageConfigurationsPage: React.FC = () => {
  const [configName, setConfigName] = useState('')
  const [language, setLanguage] = useState('')
  const [inputFormat, setInputFormat] = useState('')
  const [outputFormat, setOutputFormat] = useState('')
  const [configurations, setConfigurations] = useState<any[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [toDeleteIndex, setToDeleteIndex] = useState<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('configurations') || '[]')
    setConfigurations(stored)
  }, [])

  const handleAddOrUpdate = () => {
    if (!configName || !language || !inputFormat || !outputFormat) {
      setErrorMsg('Please fill in all fields!')
      return
    }
    const newConfig = { configName, language, inputFormat, outputFormat }
    const updated = [...configurations]
    if (editingIndex !== null) {
      updated[editingIndex] = newConfig
    } else {
      updated.push(newConfig)
    }
    setConfigurations(updated)
    localStorage.setItem('configurations', JSON.stringify(updated))
    setConfigName('')
    setLanguage('')
    setInputFormat('')
    setOutputFormat('')
    setEditingIndex(null)
  }

  const handleEdit = (index: number) => {
    const c = configurations[index]
    setConfigName(c.configName)
    setLanguage(c.language)
    setInputFormat(c.inputFormat)
    setOutputFormat(c.outputFormat)
    setEditingIndex(index)
  }

  const confirmDelete = (index: number) => {
    setToDeleteIndex(index)
  }

  const doDelete = () => {
    if (toDeleteIndex === null) return
    const updated = configurations.filter((_, i) => i !== toDeleteIndex)
    setConfigurations(updated)
    localStorage.setItem('configurations', JSON.stringify(updated))
    setToDeleteIndex(null)
    if (editingIndex === toDeleteIndex) {
      setEditingIndex(null)
      setConfigName('')
      setLanguage('')
      setInputFormat('')
      setOutputFormat('')
    }
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(configurations, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'configurations.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e: any) => {
      const file = e.target.files[0]
      if (!file) return
      try {
        const text = await file.text()
        const imported = JSON.parse(text)
        if (!Array.isArray(imported)) throw new Error('Invalid file format.')
        setConfigurations(imported)
        localStorage.setItem('configurations', JSON.stringify(imported))
      } catch (err: any) {
        setErrorMsg('Import failed: ' + err.message)
      }
    }
    input.click()
  }

  return (
    <div className="manage-config-container">
      <button className="back-button-top-left" onClick={() => navigate('/')}>Back</button>

      <h2>Manage Configurations</h2>

      <div className="form-group">
        <label>Configuration Name:</label>
        <input value={configName} onChange={e => setConfigName(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Language:</label>
        <select value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="">Select Language</option>
          <option value="C">C</option>
          <option value="Java">Java</option>
          <option value="Python">Python</option>
        </select>
      </div>

      <div className="form-group">
        <label>Input Format:</label>
        <input value={inputFormat} onChange={e => setInputFormat(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Expected Output Format:</label>
        <input value={outputFormat} onChange={e => setOutputFormat(e.target.value)} />
      </div>

      <div className="button-row">
        <button onClick={handleAddOrUpdate}>
          {editingIndex !== null ? 'Update Configuration' : 'Add Configuration'}
        </button>
        <button onClick={handleImport}>📥 Import</button>
        <button onClick={handleExport}>📤 Export</button>
      </div>

      <h3>Existing Configurations</h3>
      <div className="search-bar">
        <input
          placeholder="Search configurations..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <ul>
        {configurations
          .filter(c => c.configName.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((c, i) => (
            <li key={i}>
              <span>
                <strong>{c.configName}</strong> ({c.language}) | Input: {c.inputFormat} | Output: {c.outputFormat}
              </span>
              <div>
                <button className="edit-button" onClick={() => handleEdit(i)}>Edit</button>
                <button className="delete-button" onClick={() => confirmDelete(i)}>Delete</button>
              </div>
            </li>
          ))}
      </ul>

      {errorMsg && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>{errorMsg}</p>
            <div className="confirm-actions">
              <button onClick={() => setErrorMsg(null)}>OK</button>
            </div>
          </div>
        </div>
      )}

      {toDeleteIndex !== null && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>Are you sure you want to delete "{configurations[toDeleteIndex].configName}"?</p>
            <div className="confirm-actions">
              <button onClick={doDelete}>Yes, Delete</button>
              <button onClick={() => setToDeleteIndex(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageConfigurationsPage
