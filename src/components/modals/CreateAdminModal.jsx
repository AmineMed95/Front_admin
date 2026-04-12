import { useState } from 'react'
import './CreateAdminModal.css'

// admin prop = null → create mode | object → edit mode
function CreateAdminModal({ onClose, onSubmit, admin = null }) {
  const isEdit = admin !== null

  const [form, setForm] = useState(
    isEdit
      ? { firstName: admin.firstName, lastName: admin.lastName, email: admin.email, organization: admin.organization }
      : { firstName: '', lastName: '', email: '', organization: '' }
  )
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.firstName.trim()) errs.firstName = 'Champ requis'
    if (!form.lastName.trim()) errs.lastName = 'Champ requis'
    if (!form.email.trim()) errs.email = 'Champ requis'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email invalide'
    if (!form.organization.trim()) errs.organization = 'Champ requis'
    return errs
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await onSubmit(form)
    setLoading(false)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Modifier le compte admin' : 'Créer un compte admin'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <Field label="Prénom" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} placeholder="Ex: Karim" />
            <Field label="Nom" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} placeholder="Ex: Benali" />
          </div>

          <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="admin@example.com" />
          <Field label="Nom de l'organisation" name="organization" value={form.organization} onChange={handleChange} error={errors.organization} placeholder="Ex: ACME Corp" />

          {!isEdit && (
            <div className="info-banner">
              <span className="info-icon">📧</span>
              <p>
                Un <strong>mot de passe généré automatiquement</strong> et un{' '}
                <strong>lien d'activation</strong> seront envoyés par email à l'agent.
                Il pourra se connecter directement avec ces informations.
              </p>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              Annuler
            </button>
            <button type="submit" className="btn-create" disabled={loading}>
              {loading
                ? (isEdit ? 'Enregistrement...' : 'Création...')
                : (isEdit ? 'Enregistrer' : 'Créer et envoyer l\'email')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, name, type = 'text', value, onChange, error, placeholder }) {
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
      {error && <span className="field-error">{error}</span>}
    </div>
  )
}

export default CreateAdminModal
