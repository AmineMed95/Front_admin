import { useState } from 'react'
import './CreateAdminModal.css'

// admin prop = null → create mode | object → edit mode
function CreateAdminModal({ onClose, onSubmit, admin = null }) {
  const isEdit = admin !== null

  const [form, setForm] = useState(
    isEdit
      ? {
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          organization: admin.organization,
          phone: admin.phone || '',
        }
      : {
          firstName: '',
          lastName: '',
          email: '',
          organization: '',
          phone: '',
        }
  )

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  /* ─────────────────────────────
     VALIDATION
  ───────────────────────────── */

  const validate = () => {
    const errs = {}

    // First name
    if (!form.firstName.trim()) {
      errs.firstName = 'Champ requis'
    }

    // Last name
    if (!form.lastName.trim()) {
      errs.lastName = 'Champ requis'
    }

    // Email
    if (!form.email.trim()) {
      errs.email = 'Champ requis'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Email invalide'
    }

    // Organization
    if (!form.organization.trim()) {
      errs.organization = 'Champ requis'
    }

    // Phone (Tunisia)
    if (!form.phone.trim()) {
      errs.phone = 'Champ requis'
    } else {
      // remove spaces
      const cleanedPhone = form.phone.replace(/\s/g, '')

      // Tunisia regex:
      // 22333444
      // +21622333444
      const tunisianPhoneRegex = /^(\+216)?[0-9]{8}$/

      if (!tunisianPhoneRegex.test(cleanedPhone)) {
        errs.phone =
          'Numéro tunisien invalide (8 chiffres)'
      }
    }

    return errs
  }

  /* ─────────────────────────────
     HANDLE CHANGE
  ───────────────────────────── */

  const handleChange = (e) => {
    let { name, value } = e.target

    // Restrict phone characters
    if (name === 'phone') {
      value = value.replace(/[^\d+ ]/g, '')
    }

    setForm({
      ...form,
      [name]: value,
    })

    // clear field error
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      })
    }
  }

  /* ─────────────────────────────
     SUBMIT
  ───────────────────────────── */

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errs = validate()

    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setLoading(true)

    await onSubmit(form)

    setLoading(false)
  }

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="modal-header">
          <h2>
            {isEdit
              ? 'Modifier le compte admin'
              : 'Créer un compte admin'}
          </h2>

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
          {/* FIRST / LAST NAME */}
          <div className="form-row">
            <Field
              label="Prénom"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              error={errors.firstName}
              placeholder="Ex: Karim"
            />

            <Field
              label="Nom"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              error={errors.lastName}
              placeholder="Ex: Benali"
            />
          </div>

          {/* EMAIL */}
          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="admin@example.com"
          />

          {/* PHONE */}
          <Field
            label="Téléphone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="22333444"
          />

          {/* ORGANIZATION */}
          <Field
            label="Nom de l'organisation"
            name="organization"
            value={form.organization}
            onChange={handleChange}
            error={errors.organization}
            placeholder="Ex: ACME Corp"
          />

          {/* INFO */}
          {!isEdit && (
            <div className="info-banner">
              <span className="info-icon">
                📧
              </span>

              <p>
                Un{' '}
                <strong>
                  mot de passe généré
                  automatiquement
                </strong>{' '}
                et un{' '}
                <strong>
                  lien d'activation
                </strong>{' '}
                seront envoyés par email à
                l'agent. Il pourra se connecter
                directement avec ces informations.
              </p>
            </div>
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
              className="btn-create"
              disabled={loading}
            >
              {loading
                ? isEdit
                  ? 'Enregistrement...'
                  : 'Création...'
                : isEdit
                ? 'Enregistrer'
                : "Créer et envoyer l'email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

      /* ─────────────────────────────
        FIELD COMPONENT
      ───────────────────────────── */

      function Field({
        label,
        name,
        type = 'text',
        value,
        onChange,
        error,
        placeholder,
      }) {
        return (
          <div className="field">
            <label htmlFor={name}>{label}</label>
            <input
              id={name}
              name={name}
              type={type}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className={error ? 'input-error' : ''}
              autoComplete="off"
            />
            {error && (
              <span className="field-error">
                {error}
              </span>
            )}
          </div>
        )
      }

export default CreateAdminModal