import { useState } from 'react'
import './EmailSentModal.css'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button className="btn-copy" onClick={copy}>
      {copied ? '✅ Copié' : '📋 Copier'}
    </button>
  )
}

function EmailSentModal({ admin, activationLink, generatedPassword, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="email-modal-box" onClick={(e) => e.stopPropagation()}>

        {/* Close */}
        <div className="email-modal-header">
          <button className="modal-close" onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        {/* Success icon */}
        <div className="email-success-icon">
          <div className="checkmark-circle">✓</div>
        </div>

        <h2 className="email-modal-title">Email envoyé avec succès</h2>
        <p className="email-modal-subtitle">
          Les informations de connexion ont été envoyées à
        </p>
        <p className="email-address">{admin.email}</p>

        {/* Email preview */}
        <div className="email-preview">
          <div className="email-preview-header">
            <span className="preview-label">📧 Aperçu de l'email</span>
          </div>

          <div className="email-preview-body">
            <p>Bonjour <strong>{admin.firstName} {admin.lastName}</strong>,</p>
            <p>Votre compte administrateur a été créé sur <strong>AdminPanel</strong>.</p>

            {/* Credentials block */}
            <div className="credentials-block">
              <div className="credentials-title">Vos informations de connexion</div>
              <div className="credential-row">
                <span className="cred-label">Organisation</span>
                <span className="cred-value">{admin.organization}</span>
              </div>
              <div className="credential-row">
                <span className="cred-label">Email</span>
                <span className="cred-value">{admin.email}</span>
              </div>
              <div className="credential-row credential-row--password">
                <span className="cred-label">Mot de passe</span>
                <div className="cred-password-wrap">
                  <span className="cred-value cred-password">{generatedPassword}</span>
                  <CopyButton text={generatedPassword} />
                </div>
              </div>
            </div>

            <p className="preview-warning">
              ⚠️ Ce mot de passe a été généré automatiquement. L'agent est invité à le changer après sa première connexion.
            </p>
          </div>
        </div>

        {/* Activation link */}
        <div className="link-section">
          <p className="link-label">Lien d'activation (démo)</p>
          <div className="link-box">
            <span className="link-text">{activationLink}</span>
            <CopyButton text={activationLink} />
          </div>
          <p className="link-hint">
            En production, ce lien est envoyé uniquement par email à l'agent.
          </p>
        </div>

        <button className="btn-done" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  )
}

export default EmailSentModal
