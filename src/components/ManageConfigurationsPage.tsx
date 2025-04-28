import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './ManageConfigurationsPage.css'

const ManageConfigurationsPage: React.FC = () => {
  const [configName, setConfigName] = useState('')
  const [language, setLanguage] = useState('')
  const [inputFormat, setInputFormat] = useState('')
  const [outputFormat, setOutputFormat] = useState('')
  const [configurations, setConfigurations] = useState<any[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null) //  su anda hangi kayıt editleniyor?
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const storedConfigs = JSON.parse(localStorage.getItem('configurations') || '[]')
    setConfigurations(storedConfigs)
  }, [])

  const handleAddOrUpdateConfiguration = () => {
    if (!configName || !language || !inputFormat || !outputFormat) {
      alert('Please fill in all fields!')
      return
    }

    const newConfig = { configName, language, inputFormat, outputFormat }
    let updatedConfigs

    if (editingIndex !== null) {
      // 🔥 Eğer edit modundaysa eski kaydı güncelliyoruz
      updatedConfigs = [...configurations]
      updatedConfigs[editingIndex] = newConfig
      setEditingIndex(null) // Edit moddan çıkıyoruz
    } else {
      // Yeni ekliyorsa
      updatedConfigs = [...configurations, newConfig]
    }

    setConfigurations(updatedConfigs)
    localStorage.setItem('configurations', JSON.stringify(updatedConfigs))

    // Alanları temizle
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
    setEditingIndex(index) // 🔥 Edit moduna geçiyoruz
  }

  const handleDeleteConfiguration = (index: number) => {
    const updatedConfigs = configurations.filter((_, i) => i !== index)
    setConfigurations(updatedConfigs)
    localStorage.setItem('configurations', JSON.stringify(updatedConfigs))

    // Eğer o anda editliyorsak ve silinen index ise edit moddan çık
    if (editingIndex === index) {
      setEditingIndex(null)
      setConfigName('')
      setLanguage('')
      setInputFormat('')
      setOutputFormat('')
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  const filteredConfigurations = configurations.filter(config =>
    config.configName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="manage-config-container">
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
        <input
          type="text"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
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
        <button onClick={handleBack}>Back</button>
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
            <strong>{config.configName}</strong> ({config.language}) | Input: {config.inputFormat} | Output: {config.outputFormat}
            <div style={{ marginTop: '5px' }}>
              <button className="edit-button" onClick={() => handleEditConfiguration(index)}>Edit</button>
              <button className="delete-button" onClick={() => handleDeleteConfiguration(index)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ManageConfigurationsPage
