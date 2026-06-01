import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Sidebar from '../../components/ui/Sidebar/Sidebar'
import { getUser, setUser } from '../../services/auth.service'
import ChangePasswordModal from '../../components/modals/ChangePasswordModal'
import UpdateInfoModal from '../../components/modals/UpdateInfoModal'
import { changeLanguage } from '../../i18n/index.js'
import './Settings.css'

function Settings({ onNavigate, onLogout }) {
  const { t, i18n } = useTranslation()
  const [currentUser, setCurrentUser] = useState(getUser())

  const fullName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : t('common.loading')
  const initials = currentUser
    ? `${currentUser.firstName?.[0] ?? ''}${currentUser.lastName?.[0] ?? ''}`.toUpperCase()
    : 'U'
  const role = currentUser?.role ?? 'admin'

  const [modal, setModal] = useState(null)

  const handleUpdated = (updatedAdmin) => {
    setUser(updatedAdmin)
    setCurrentUser(getUser())
  }

  const handleLanguageChange = (lang) => {
    changeLanguage(lang)
  }

  return (
    <div className="page-layout">
      <Sidebar
        activePage="settings"
        onNavigate={onNavigate}
        onLogout={onLogout}
        user={currentUser}
      />

      <main className="page-content">
        <div className="settings-page">

          <div className="settings-page-header">
            <div>
              <h1 className="settings-page-title">{t('settings.title')}</h1>
              <p className="settings-page-sub">{t('settings.subtitle')}</p>
            </div>
            <div className="settings-profile-pill">
              <div className="settings-pill-avatar">{initials}</div>
              <div>
                <p className="settings-pill-name">{fullName}</p>
                <p className="settings-pill-role">{role}</p>
              </div>
            </div>
          </div>

          {role === 'admin' && (
            <section className="settings-section">
              <h2 className="settings-section-title">{t('settings.profile.title')}</h2>
              <div className="settings-cards">
                <div className="settings-card">
                  <div className="settings-card-icon settings-card-icon--purple">✏️</div>
                  <div className="settings-card-body">
                    <p className="settings-card-label">{t('settings.profile.personalInfo')}</p>
                    <p className="settings-card-desc">{t('settings.profile.personalInfoDesc')}</p>
                  </div>
                  <button className="settings-card-btn" onClick={() => setModal('update-info')}>
                    {t('settings.btnEdit')}
                  </button>
                </div>
              </div>
            </section>
          )}

          <section className="settings-section">
            <h2 className="settings-section-title">{t('settings.security.title')}</h2>
            <div className="settings-cards">
              <div className="settings-card">
                <div className="settings-card-icon settings-card-icon--blue">🔒</div>
                <div className="settings-card-body">
                  <p className="settings-card-label">{t('settings.security.password')}</p>
                  <p className="settings-card-desc">{t('settings.security.passwordDesc')}</p>
                </div>
                <button className="settings-card-btn" onClick={() => setModal('change-password')}>
                  {t('settings.btnEdit')}
                </button>
              </div>
            </div>
          </section>

          <section className="settings-section">
            <h2 className="settings-section-title">{t('settings.preferences.title')}</h2>
            <div className="settings-cards">
              <div className="settings-card">
                <div className="settings-card-icon settings-card-icon--gray">🌍</div>
                <div className="settings-card-body">
                  <p className="settings-card-label">{t('settings.preferences.language')}</p>
                  <p className="settings-card-desc">{t('settings.preferences.languageDesc')}</p>
                </div>
                <select
                className="lang-select"
                value={i18n.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                {['fr', 'en', 'ar'].map((lang) => (
                  <option key={lang} value={lang}>
                    {t(`settings.languages.${lang}`)}
                  </option>
                ))}
              </select>
              </div>
            </div>
          </section>

        </div>
      </main>

      {modal === 'change-password' && (
        <ChangePasswordModal onClose={() => setModal(null)} />
      )}
      {modal === 'update-info' && (
        <UpdateInfoModal
          onClose={() => setModal(null)}
          onUpdated={(updated) => {
            handleUpdated(updated)
            setModal(null)
          }}
        />
      )}
    </div>
  )
}

export default Settings
