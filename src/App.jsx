import { useState } from 'react'
import Login from './pages/Login/Login'
import AdminList from './pages/AdminList/AdminList'
import AdminStats from './pages/AdminStats/AdminStats'
import Dashboard from './pages/Dashboard/Dashboard'
import SetPassword from './pages/SetPassword/SetPassword'

function getActivationToken() {
  return new URLSearchParams(window.location.search).get('token')
}

function clearTokenFromUrl() {
  const url = new URL(window.location)
  url.searchParams.delete('token')
  window.history.replaceState({}, '', url)
}

function App() {
  const [page, setPage] = useState(() =>
    getActivationToken() ? 'set-password' : 'login'
  )
  const [selectedAdmin, setSelectedAdmin] = useState(null)

  const token = getActivationToken()

  const handleViewStats = (admin) => {
    setSelectedAdmin(admin)
    setPage('admin-stats')
  }

  if (page === 'set-password' && token) {
    return (
      <SetPassword
        token={token}
        onActivated={() => {
          clearTokenFromUrl()
          setPage('login')
        }}
      />
    )
  }

  if (page === 'login') {
    return <Login onLogin={() => setPage('dashboard')} />
  }

  if (page === 'dashboard') {
    return <Dashboard onNavigate={setPage} />
  }

  if (page === 'admins') {
    return <AdminList onNavigate={setPage} onViewStats={handleViewStats} />
  }

  if (page === 'admin-stats' && selectedAdmin) {
    return <AdminStats admin={selectedAdmin} onNavigate={setPage} />
  }

  return <Dashboard onNavigate={setPage} />
}

export default App
