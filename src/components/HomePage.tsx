import React from 'react'
import { useNavigate } from 'react-router-dom'
import './HomePage.css'

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const handleCreateProject = () => {
    navigate('/create')
  }

  const handleOpenProject = () => {
    window.api.openProject()
  }

  const handleManageConfigs = () => {
    navigate('/manage-configurations')
  }

  const handleHelp = () => {
    window.api.openHelp()
  }

  return (
    <div className="home-container">
      <h1>Welcome to IAE</h1>
      <div className="button-grid">
        <button onClick={handleCreateProject}>
          Create New Project
        </button>
        <button onClick={handleOpenProject}>
          Open Existing Project
        </button>
        <button onClick={handleManageConfigs}>
          Manage Configurations
        </button>
        <button onClick={handleHelp}>
          Help
        </button>
      </div>
    </div>
  )
}

export default HomePage
