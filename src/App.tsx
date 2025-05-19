import { HashRouter, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import CreateProjectPage from './components/CreateProjectPage'
import ManageConfigurationsPage from './components/ManageConfigurationsPage'
import OpenProjectPage from './components/OpenProjectPage'
import ProjectDetailPage from './components/ProjectDetailPage'
import HelpPage from './components/HelpPage'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateProjectPage />} />
        <Route path="/manage-configurations" element={<ManageConfigurationsPage />} />
        <Route path="/open" element={<OpenProjectPage />} />
        <Route path="/project/:projectName" element={<ProjectDetailPage />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
