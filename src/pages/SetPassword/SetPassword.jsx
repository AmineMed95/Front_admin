import { useEffect, useState } from 'react'
import { getAdminByToken, activateAccount } from '../../services/adminService'
import './SetPassword.css'

/**
 * Account activation page.
 * Reached via the link sent in the welcome email (?token=...).
 * Automatically validates the token and activates the account.
 * The agent's password was already generated and delivered by email.
 */
function SetPassword({ token, onActivated }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [admin, setAdmin]   = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    getAdminByToken(token)
      .then((found) => {
        setAdmin(found)
        return activateAccount(token)
      })
      .then(() => setStatus('success'))
      .catch((err) => {
        setErrorMsg(err.message)
        setStatus('error')
      })
  }, [token])

  /* ── Loading ── */
  if (status === 'loading') {
    return (
      <div className="sp-wrapper">
        <div className="sp-card sp-card--centered">
          <div className="sp-spinner" />
          <p className="sp-loading-text">Activation du compte en cours...</p>
        </div>
      </div>
    )
  }

  /* ── Error ── */
  if (status === 'error') {
    return (
      <div className="sp-wrapper">
        <div className="sp-card sp-card--centered">
          <div className="sp-icon sp-icon--error">✕</div>
          <h1>Lien invalide</h1>
          <p className="sp-sub">{errorMsg}</p>
          <p className="sp-hint">
            Contactez votre super administrateur pour obtenir un nouveau lien d'activation.
          </p>
        </div>
      </div>
    )
  }

  /* ── Success ── */
  return (
    <div className="sp-wrapper">
      <div className="sp-card sp-card--centered">
        <div className="sp-icon sp-icon--success">✓</div>

        <h1>Compte activé !</h1>

        {admin && (
          <p className="sp-greeting">
            Bienvenue, <strong>{admin.firstName} {admin.lastName}</strong>.
          </p>
        )}

        <div className="sp-info-box">
          <p>Votre compte est maintenant actif.</p>
          <p>
            Connectez-vous avec votre <strong>email</strong> et le{' '}
            <strong>mot de passe</strong> reçu dans l'email d'activation.
          </p>
        </div>

        <div className="sp-security-tip">
          🔒 Pour votre sécurité, changez votre mot de passe dès votre première connexion.
        </div>

        <button className="sp-btn-primary" onClick={onActivated}>
          Se connecter
        </button>
      </div>
    </div>
  )
}

export default SetPassword
