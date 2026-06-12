import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './ResetPassword.css'
import { resetPassword } from '../../services/auth.service.js'

function ResetPassword({ onSuccess, tokenProp }) {
  const { t } = useTranslation()

  const [form, setForm] = useState({
    token: tokenProp || '',
    password: '',
    confirm_password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!tokenProp) {
      const params = new URLSearchParams(window.location.search)
      const urlToken = params.get('token')
      if (urlToken) {
        setForm((prev) => ({ ...prev, token: urlToken }))
      }
    }
  }, [tokenProp])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' })
  }

  const getStrengthLabel = (score) => {
    if (score <= 2) return { level: 1, label: t('resetPassword.strength.weak'),   color: '#ef4444' }
    if (score === 3) return { level: 2, label: t('resetPassword.strength.medium'), color: '#f97316' }
    if (score === 4) return { level: 3, label: t('resetPassword.strength.good'),   color: '#eab308' }
    return               { level: 4, label: t('resetPassword.strength.strong'),  color: '#22c55e' }
  }

  const validate = () => {
    const errors = {}
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=\\[\]\/~`]).{8,}$/

    if (!form.token.trim()) {
      errors.token = t('resetPassword.tokenRequired')
    }
    if (!passwordRegex.test(form.password)) {
      errors.password = t('resetPassword.passwordInvalid')
    }
    if (form.password !== form.confirm_password) {
      errors.confirm_password = t('resetPassword.passwordMismatch')
    }
    return errors
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

  const strength = getPasswordStrength(form.password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setLoading(true)
    setError('')
    try {
      await resetPassword(form.token, form.password, form.confirm_password)
      setSuccess(true)
    } catch (err) {
      setError(err.message || t('resetPassword.errorDefault'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rp-wrapper">
      <div className="rp-card">
        <div className="rp-header">
          <div className="rp-logo">A</div>
          <h1 className="rp-title">{t('resetPassword.title')}</h1>
          <p className="rp-subtitle">{t('resetPassword.subtitle')}</p>
        </div>

        {success ? (
          <div className="rp-success-box">
            <div className="rp-success-icon">✅</div>
            <h2 className="rp-success-title">{t('resetPassword.successTitle')}</h2>
            <p className="rp-success-text">{t('resetPassword.successText')}</p>
            <button className="btn-login-redirect" onClick={onSuccess}>
              {t('resetPassword.loginRedirect')}
            </button>
          </div>
        ) : (
          <form className="rp-form" onSubmit={handleSubmit}>

            {!form.token && (
              <div className="form-group">
                <label htmlFor="token">{t('resetPassword.tokenLabel')}</label>
                <input
                  id="token"
                  name="token"
                  type="text"
                  placeholder={t('resetPassword.tokenPlaceholder')}
                  value={form.token}
                  onChange={handleChange}
                />
                {fieldErrors.token && (
                  <span className="field-error">{fieldErrors.token}</span>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">{t('resetPassword.newPassword')}</label>
              <div className="input-password">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={t('resetPassword.showHidePassword')}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              {form.password && strength && (
                <div className="password-strength">
                  <div className="strength-bars">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="strength-bar"
                        style={{ backgroundColor: i <= strength.level ? strength.color : undefined }}
                      />
                    ))}
                  </div>
                  <span className="strength-label" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
              )}

              {fieldErrors.password && (
                <span className="field-error">{fieldErrors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password">{t('resetPassword.confirmPassword')}</label>
              <div className="input-password">
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.confirm_password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={t('resetPassword.showHidePassword')}
                >
                  {showConfirm ? '🙈' : '👁️'}
                </button>
              </div>
              {fieldErrors.confirm_password && (
                <span className="field-error">{fieldErrors.confirm_password}</span>
              )}
            </div>

            {error && (
              <div className="rp-error">
                <span className="rp-error-icon">⚠</span>
                {error}
              </div>
            )}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner" />
                  {t('resetPassword.updating')}
                </span>
              ) : (
                t('resetPassword.submit')
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPassword
