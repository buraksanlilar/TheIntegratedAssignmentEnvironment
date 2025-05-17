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
    const storedConfigs = JSON.parse(localStorage.getItem('configurations') || '[]')
    setConfigurations(storedConfigs)
  }, [])

  const handleAddOrUpdateConfiguration = () => {
    if (!configName || !language || !inputFormat || !outputFormat) {
      setErrorMsg('Please fill in all fields!')
      return
    }

    const newConfig = { configName, language, inputFormat, outputFormat }
    let updatedConfigs

    if (editingIndex !== null) {
      updatedConfigs = [...configurations]
      updatedConfigs[editingIndex] = newConfig
      setEditingIndex(null)
    } else {
      updatedConfigs = [...configurations, newConfig]
    }

    setConfigurations(updatedConfigs)
    localStorage.setItem('configurations', JSON.stringify(updatedConfigs))

    setConfigName('')
    setLanguage('')
    setInputFormat('')
    setOutputFormat('')
  }

  const handleEditConfiguration = (index: number) => {
    const config = configurations[index]
    setConfigName(config.configName)
    setLanguage(config.language)
    setInputFormat(config.inputFormat)
    setOutputFormat(config.outputFormat)
    setEditingIndex(index)
  }

  const confirmDeleteConfiguration = (index: number) => {
    setToDeleteIndex(index)
  }

  const doDeleteConfiguration = () => {
    if (toDeleteIndex === null) return
    const updatedConfigs = configurations.filter((_, i) => i !== toDeleteIndex)
    setConfigurations(updatedConfigs)
    localStorage.setItem('configurations', JSON.stringify(updatedConfigs))
    if (editingIndex === toDeleteIndex) {
      setEditingIndex(null)
      setConfigName('')
      setLanguage('')
      setInputFormat('')
      setOutputFormat('')
    }
    setToDeleteIndex(null)
  }

  const cancelDelete = () => setToDeleteIndex(null)
  const closeError = () => setErrorMsg(null)

  const handleBack = () => {
    navigate('/')
  }

  const filteredConfigurations = configurations.filter(config =>
    config.configName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="manage-config-container">
      <button className="back-button-top-left" onClick={handleBack}>Back</button>

      <h2>Manage Configurations</h2>

      <div className="form-group">
        <label>Configuration Name:</label>
        <input
          type="text"
          value={configName}
          onChange={(e) => setConfigName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Language:</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="">Select Language</option>
          <option value="C">C</option>
          <option value="Java">Java</option>
          <option value="Python">Python</option>
        </select>
      </div>

      <div className="form-group">
        <label>Input Format:</label>
        <input
          type="text"
          value={inputFormat}
          onChange={(e) => setInputFormat(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Expected Output Format:</label>
        <input
          type="text"
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value)}
        />
      </div>

      <div className="button-row">
        <button onClick={handleAddOrUpdateConfiguration}>
          {editingIndex !== null ? 'Update Configuration' : 'Add Configuration'}
        </button>
      </div>

      <h3>Existing Configurations</h3>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search configurations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <ul>
        {filteredConfigurations.map((config, index) => (
          <li key={index}>
            <span>
              <strong>{config.configName}</strong> ({config.language}) | Input: {config.inputFormat} | Output: {config.outputFormat}
            </span>
            <div>
              <button className="edit-button" onClick={() => handleEditConfiguration(index)}>Edit</button>
              <button className="delete-button" onClick={() => confirmDeleteConfiguration(index)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* === ERROR MODAL === */}
      {errorMsg && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>{errorMsg}</p>
            <div className="confirm-actions">
              <button onClick={closeError}>OK</button>
            </div>
          </div>
        </div>
      )}

      {/* === DELETE CONFIRMATION MODAL === */}
      {toDeleteIndex !== null && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>Are you sure you want to delete configuration &quot;{configurations[toDeleteIndex].configName}&quot;?</p>
            <div className="confirm-actions">
              <button onClick={doDeleteConfiguration}>Yes, Delete</button>
              <button onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageConfigurationsPage
