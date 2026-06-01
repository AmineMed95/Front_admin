import { useState } from 'react'
import { changePassword } from '../../services/admin.service'
import './ChangePasswordModal.css'

function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))

    setStatus(null)
  }

  const toggleShow = (field) =>
    setShow((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))

  // PASSWORD VALIDATION
  const validate = () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=\\[\]\/~`]).{8,}$/

    if (
      !form.current_password ||
      !form.new_password ||
      !form.confirm_password
    ) {
      return 'Veuillez remplir tous les champs.'
    }

    if (!passwordRegex.test(form.new_password)) {
      return (
        'Le nouveau mot de passe doit contenir au moins 8 caractères, ' +
        'une majuscule, une minuscule, un chiffre et un caractère spécial.'
      )
    }

    if (form.new_password !== form.confirm_password) {
      return 'Les nouveaux mots de passe ne correspondent pas.'
    }

    if (form.current_password === form.new_password) {
      return "Le nouveau mot de passe doit être différent de l'actuel."
    }

    return null
  }

  // PASSWORD STRENGTH
  const getPasswordStrength = (pwd) => {
    if (!pwd) return null

    const hasUpper = /[A-Z]/.test(pwd)
    const hasLower = /[a-z]/.test(pwd)
    const hasNumber = /\d/.test(pwd)

    const hasSpecial =
      /[!@#$%^&*(),.?":{}|<>_\-+=\\[\]\/~`]/.test(
        pwd
      )

    let score = 0

    if (pwd.length >= 8) score++
    if (hasUpper) score++
    if (hasLower) score++
    if (hasNumber) score++
    if (hasSpecial) score++

    if (score <= 2) {
      return {
        level: 1,
        label: 'Faible',
        color: '#ef4444',
      }
    }

    if (score === 3) {
      return {
        level: 2,
        label: 'Moyen',
        color: '#f97316',
      }
    }

    if (score === 4) {
      return {
        level: 3,
        label: 'Bon',
        color: '#eab308',
      }
    }

    return {
      level: 4,
      label: 'Fort',
      color: '#22c55e',
    }
  }

  const strength = getPasswordStrength(
    form.new_password
  )

  const handleSubmit = async (e) => {
    e.preventDefault()

    const error = validate()

    if (error) {
      setStatus({
        type: 'error',
        message: error,
      })

      return
    }

    setLoading(true)
    setStatus(null)

    const result = await changePassword({
      current_password: form.current_password,
      new_password: form.new_password,
    })

    setLoading(false)

    if (result.success) {
  setStatus({
    type: 'success',
    message:
      'Mot de passe modifié avec succès. Déconnexion...',
  })

  // Clear auth tokens
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')

  // Optional: clear user data
  localStorage.removeItem('user')
  sessionStorage.removeItem('user')

      // Reset form
      setForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      })

      // Close modal
      onClose()

      // Redirect to login page
      setTimeout(() => {
        window.location.href = '/login'
      }, 1000)
    } else {
      setStatus({
        type: 'error',
        message: result.message,
      })
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) =>
        e.target === e.currentTarget &&
        onClose()
      }
    >
      <div className="modal-box">

        {/* HEADER */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-icon">🔒</div>

            <div>
              <h2 className="modal-title">
                Changer le mot de passe
              </h2>

              <p className="modal-subtitle">
                Mettez à jour votre mot de passe
                de connexion
              </p>
            </div>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form
          className="modal-form"
          onSubmit={handleSubmit}
          noValidate
        >

          {/* CURRENT PASSWORD */}
          <div className="form-group">
            <label htmlFor="current_password">
              Mot de passe actuel
            </label>

            <div className="input-password">
              <input
                id="current_password"
                name="current_password"
                type={
                  show.current
                    ? 'text'
                    : 'password'
                }
                placeholder="••••••••"
                value={form.current_password}
                onChange={handleChange}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() =>
                  toggleShow('current')
                }
                tabIndex={-1}
              >
                {show.current
                  ? '🙈'
                  : '👁️'}
              </button>
            </div>
          </div>

          {/* NEW PASSWORD */}
          <div className="form-group">
            <label htmlFor="new_password">
              Nouveau mot de passe
            </label>

            <div className="input-password">
              <input
                id="new_password"
                name="new_password"
                type={
                  show.new
                    ? 'text'
                    : 'password'
                }
                placeholder="••••••••"
                value={form.new_password}
                onChange={handleChange}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() =>
                  toggleShow('new')
                }
                tabIndex={-1}
              >
                {show.new
                  ? '🙈'
                  : '👁️'}
              </button>
            </div>

          

            {/* PASSWORD STRENGTH */}
            {form.new_password &&
              strength && (
                <div className="password-strength">
                  <div className="strength-bars">
                    {[1, 2, 3, 4].map(
                      (i) => (
                        <div
                          key={i}
                          className="strength-bar"
                          style={{
                            backgroundColor:
                              i <=
                              strength.level
                                ? strength.color
                                : '#e5e7eb',
                          }}
                        />
                      )
                    )}
                  </div>

                  <span
                    className="strength-label"
                    style={{
                      color:
                        strength.color,
                    }}
                  >
                    {strength.label}
                  </span>
                </div>
              )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="form-group">
            <label htmlFor="confirm_password">
              Confirmer le nouveau mot
              de passe
            </label>

            <div className="input-password">
              <input
                id="confirm_password"
                name="confirm_password"
                type={
                  show.confirm
                    ? 'text'
                    : 'password'
                }
                placeholder="••••••••"
                value={form.confirm_password}
                onChange={handleChange}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() =>
                  toggleShow('confirm')
                }
                tabIndex={-1}
              >
                {show.confirm
                  ? '🙈'
                  : '👁️'}
              </button>
            </div>
          </div>

          {/* STATUS MESSAGE */}
          {status && (
            <p
              className={`form-msg form-msg--${status.type}`}
            >
              {status.type ===
              'success'
                ? '✅'
                : '⚠️'}{' '}
              {status.message}
            </p>
          )}

          {/* ACTIONS */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>

            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading
                ? 'Mise à jour…'
                : 'Mettre à jour'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default ChangePasswordModal