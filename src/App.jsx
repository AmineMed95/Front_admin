import { useState } from 'react'
import Login from './pages/Login/Login'
import AdminList from './pages/AdminList/AdminList'
import AdminStats from './pages/AdminStats/AdminStats'
import Dashboard from './pages/Dashboard/Dashboard'
import SetPassword from './pages/SetPassword/SetPassword'
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

/** Activation token:  ?token=xxx  (account creation) */
function getActivationToken() {
  return new URLSearchParams(window.location.search).get('token')
}

/** Reset token:  ?reset_token=xxx  (forgot-password email link) */
function getResetToken() {
  return new URLSearchParams(window.location.search).get('reset_token')
}

function clearTokenFromUrl() {
  const url = new URL(window.location)
  url.searchParams.delete('token')
  url.searchParams.delete('reset_token')
  window.history.replaceState({}, '', url)
}

// ── App ──────────────────────────────────────────────────────────────────────

function App() {
  const user = getUser()
  const role = user?.role

  const [page, setPage] = useState(() => {
    // Priority 1 — password-reset link from email  (?reset_token=xxx)
    if (getResetToken()) return 'reset-password'

    // Priority 2 — account activation link  (?token=xxx)
    if (getActivationToken()) return 'set-password'

    // Priority 3 — already logged in
    if (isAuthenticated()) return 'dashboard'

    return 'login'
  })

  const [selectedAdmin, setSelectedAdmin] = useState(null)

  const activationToken = getActivationToken()
  const resetToken      = getResetToken()

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
  // Triggered by ?reset_token= in the email link
  // =========================
  if (page === 'reset-password') {
    return (
      <ResetPassword
        tokenProp={resetToken || undefined}
        onSuccess={() => {
          clearTokenFromUrl()
          setPage('login')
        }}
      />
    )
  }

  // =========================
  // FORGOT PASSWORD PAGE
  // Triggered by clicking "Mot de passe oublié" on Login
  // =========================
  if (page === 'forgot-password') {
    return (
      <ForgotPassword
        onBack={() => setPage('login')}
      />
    )
  }

  // =========================
  // SET PASSWORD PAGE
  // =========================
  if (page === 'set-password' && activationToken) {
    return (
      <SetPassword
        token={activationToken}
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
