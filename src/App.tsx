import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import CreateProjectPage from './components/CreateProjectPage'
import ManageConfigurationsPage from './components/ManageConfigurationsPage'
import OpenProjectPage from './components/OpenProjectPage' // yeni
import ProjectDetailPage from './components/ProjectDetailPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateProjectPage />} />
        <Route path="/manage-configurations" element={<ManageConfigurationsPage />} />
        <Route path="/open" element={<OpenProjectPage />} /> {/* burası yeni */}
        <Route path="/project/:projectName" element={<ProjectDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
