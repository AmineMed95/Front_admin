import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { changePassword } from '../../services/admin.service'
import './ChangePasswordModal.css'

function ChangePasswordModal({ onClose }) {
  const { t } = useTranslation()

  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })

  const [show, setShow] = useState({ current: false, new: false, confirm: false })
  const [status,  setStatus]  = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setStatus(null)
  }

  const toggleShow = (field) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }))

  const getStrengthLabel = (score) => {
    if (score <= 2) return { level: 1, label: t('changePasswordModal.strength.weak'),   color: '#ef4444' }
    if (score === 3) return { level: 2, label: t('changePasswordModal.strength.medium'), color: '#f97316' }
    if (score === 4) return { level: 3, label: t('changePasswordModal.strength.good'),   color: '#eab308' }
    return               { level: 4, label: t('changePasswordModal.strength.strong'),  color: '#22c55e' }
  }

  const getPasswordStrength = (pwd) => {
    if (!pwd) return null
    let score = 0
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[a-z]/.test(pwd)) score++
    if (/\d/.test(pwd)) score++
    if (/[!@#$%^&*(),.?":{}|<>_\-+=\\[\]\/~`]/.test(pwd)) score++
    return getStrengthLabel(score)
  }

  const validate = () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=\\[\]\/~`]).{8,}$/

    if (!form.current_password || !form.new_password || !form.confirm_password) {
      return t('changePasswordModal.validation.allRequired')
    }
    if (!passwordRegex.test(form.new_password)) {
      return t('changePasswordModal.validation.passwordInvalid')
    }
    if (form.new_password !== form.confirm_password) {
      return t('changePasswordModal.validation.passwordMismatch')
    }
    if (form.current_password === form.new_password) {
      return t('changePasswordModal.validation.samePassword')
    }
    return null
  }

  const strength = getPasswordStrength(form.new_password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const error = validate()
    if (error) { setStatus({ type: 'error', message: error }); return }

    setLoading(true)
    setStatus(null)

    const result = await changePassword({
      current_password: form.current_password,
      new_password: form.new_password,
    })

    setLoading(false)

    if (result.success) {
      setStatus({ type: 'success', message: t('changePasswordModal.success') })
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('user')
      setForm({ current_password: '', new_password: '', confirm_password: '' })
      onClose()
      setTimeout(() => { window.location.href = '/login' }, 1000)
    } else {
      setStatus({ type: 'error', message: result.message })
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">

        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-icon">🔒</div>
            <div>
              <h2 className="modal-title">{t('changePasswordModal.title')}</h2>
              <p className="modal-subtitle">{t('changePasswordModal.subtitle')}</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label={t('changePasswordModal.close')}>✕</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit} noValidate>

          <div className="form-group">
            <label htmlFor="current_password">{t('changePasswordModal.currentPassword')}</label>
            <div className="input-password">
              <input
                id="current_password" name="current_password"
                type={show.current ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.current_password} onChange={handleChange}
                autoComplete="current-password"
              />
              <button type="button" className="toggle-password" onClick={() => toggleShow('current')} tabIndex={-1}>
                {show.current ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="new_password">{t('changePasswordModal.newPassword')}</label>
            <div className="input-password">
              <input
                id="new_password" name="new_password"
                type={show.new ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.new_password} onChange={handleChange}
                autoComplete="new-password"
              />
              <button type="button" className="toggle-password" onClick={() => toggleShow('new')} tabIndex={-1}>
                {show.new ? '🙈' : '👁️'}
              </button>
            </div>

            {form.new_password && strength && (
              <div className="password-strength">
                <div className="strength-bars">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="strength-bar"
                      style={{ backgroundColor: i <= strength.level ? strength.color : '#e5e7eb' }} />
                  ))}
                </div>
                <span className="strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password">{t('changePasswordModal.confirmPassword')}</label>
            <div className="input-password">
              <input
                id="confirm_password" name="confirm_password"
                type={show.confirm ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.confirm_password} onChange={handleChange}
                autoComplete="new-password"
              />
              <button type="button" className="toggle-password" onClick={() => toggleShow('confirm')} tabIndex={-1}>
                {show.confirm ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {status && (
            <p className={`form-msg form-msg--${status.type}`}>
              {status.type === 'success' ? '✅' : '⚠️'} {status.message}
            </p>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              {t('changePasswordModal.btnCancel')}
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? t('changePasswordModal.btnUpdating') : t('changePasswordModal.btnUpdate')}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default ChangePasswordModal
