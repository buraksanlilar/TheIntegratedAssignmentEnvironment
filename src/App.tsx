import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import CreateProjectPage from './components/CreateProjectPage'
import ManageConfigurationsPage from './components/ManageConfigurationsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateProjectPage />} />
        <Route path="/manage-configurations" element={<ManageConfigurationsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
