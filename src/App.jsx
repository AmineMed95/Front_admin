import { useState } from 'react'
import Login from './pages/Login/Login'
import AdminList from './pages/AdminList/AdminList'
import AdminStats from './pages/AdminStats/AdminStats'
import Dashboard from './pages/Dashboard/Dashboard'
import ActivationCompte from './pages/ActivationCompte/ActivationCompte'
import ClientList from './pages/ClientList/ClientList'
import KycRecordList from './pages/KycRecordList/KycRecordList'
import ForgotPassword from './pages/Login/Forgotpassword'
import ResetPassword from './pages/Login/ResetPassword'

import {
  isAuthenticated,
  logout,
  getUser,
} from './services/auth.service'

// ── URL token helpers ────────────────────────────────────────────────────────

function getTokenFromUrl() {
  return new URLSearchParams(window.location.search).get('token')
}

function isResetPasswordPath() {
  return window.location.pathname === '/reset-password'
}

function clearTokenFromUrl() {
  const url = new URL(window.location)
  url.searchParams.delete('token')
  window.history.replaceState({}, '', url)
}

// ── App ──────────────────────────────────────────────────────────────────────

function App() {
  const user = getUser()
  const role = user?.role

  const [page, setPage] = useState(() => {
    const token = getTokenFromUrl()
    if (token && isResetPasswordPath()) return 'reset-password'

    if (token) return 'activation-compte'

    // Priority 3 — already logged in
    if (isAuthenticated()) return 'dashboard'

    return 'login'
  })

  const [selectedAdmin, setSelectedAdmin] = useState(null)

  const token = getTokenFromUrl()

  const handleLogout = () => {
    logout()
    setPage('login')
  }

  const handleViewStats = (admin) => {
    setSelectedAdmin(admin)
    setPage('admin-stats')
  }

  // =========================
  // RESET PASSWORD PAGE
  // /?reset-password?token=...
  // =========================
  if (page === 'reset-password') {
    return (
      <ResetPassword
        tokenProp={token || undefined}
        onSuccess={() => {
          clearTokenFromUrl()
          setPage('login')
        }}
      />
    )
  }

  // =========================
  // FORGOT PASSWORD PAGE
  // =========================
  if (page === 'forgot-password') {
    return (
      <ForgotPassword
        onBack={() => setPage('login')}
      />
    )
  }

  // =========================
  // Activation Compte PAGE
  // /?token=...
  // =========================
  if (page === 'activation-compte' && token) {
    return (
      <ActivationCompte
        token={token}
        onActivated={() => {
          clearTokenFromUrl()
          setPage('login')
        }}
      />
    )
  }

  // =========================
  // LOGIN PAGE
  // =========================
  if (page === 'login') {
    return (
      <Login
        onLogin={() => {
          const loggedUser = getUser()
          if (loggedUser?.role === 'super_admin') {
            setPage('dashboard')
          } else if (loggedUser?.role === 'admin') {
            setPage('dashboard')
          } else {
            setPage('dashboard')
          }
        }}
        onForgotPassword={() => setPage('forgot-password')}
      />
    )
  }

  // =========================
  // DASHBOARD
  // =========================
  if (page === 'dashboard') {
    return (
      <Dashboard
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    )
  }

  // =========================
  // ADMIN LIST
  // ONLY SUPER ADMIN
  // =========================
  if (page === 'admins') {
    if (role !== 'super_admin') {
      return <Dashboard onNavigate={setPage} onLogout={handleLogout} />
    }
    return (
      <AdminList
        onNavigate={setPage}
        onViewStats={handleViewStats}
        onLogout={handleLogout}
      />
    )
  }

  // =========================
  // CLIENT LIST
  // ONLY ADMIN
  // =========================
  if (page === 'clients') {
    if (role !== 'admin') {
      return <Dashboard onNavigate={setPage} onLogout={handleLogout} />
    }
    return (
      <ClientList
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    )
  }

  // =========================
  // KYC RECORDS
  // =========================
  if (page === 'kyc') {
    return (
      <KycRecordList
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    )
  }

  // =========================
  // ADMIN STATS
  // ONLY SUPER ADMIN
  // =========================
  if (page === 'admin-stats' && selectedAdmin) {
    if (role !== 'super_admin') {
      return <Dashboard onNavigate={setPage} onLogout={handleLogout} />
    }
    return (
      <AdminStats
        admin={selectedAdmin}
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    )
  }

  // =========================
  // FALLBACK
  // =========================
  return (
    <Dashboard
      onNavigate={setPage}
      onLogout={handleLogout}
    />
  )
}

export default App