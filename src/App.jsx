import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/Landing'
import PricingPage from './pages/Pricing'
import AuthPage from './pages/Auth'
import ValueDemoPage from './pages/ValueDemo'
import DashboardLayout from './pages/dashboard/Layout'
import OverviewPage from './pages/dashboard/Overview'
import MemoriesPage from './pages/dashboard/Memories'
import GitMemoryPage from './pages/dashboard/GitMemory'
import AgentsPage from './pages/dashboard/Agents'
import PlaygroundPage from './pages/dashboard/Playground'
import UsagePage from './pages/dashboard/Usage'
import SettingsPage from './pages/dashboard/Settings'

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [demoDone, setDemoDone] = useState(false)

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/auth" element={<AuthPage onAuth={() => setAuthed(true)} />} />
      <Route
        path="/welcome"
        element={
          authed
            ? <ValueDemoPage onFinish={() => setDemoDone(true)} />
            : <Navigate to="/auth" />
        }
      />
      <Route
        path="/dashboard"
        element={authed ? <DashboardLayout /> : <Navigate to="/auth" />}
      >
        <Route index element={<OverviewPage />} />
        <Route path="memories" element={<MemoriesPage />} />
        <Route path="git" element={<GitMemoryPage />} />
        <Route path="playground" element={<PlaygroundPage />} />
        <Route path="agents" element={<AgentsPage />} />
        <Route path="usage" element={<UsagePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}
