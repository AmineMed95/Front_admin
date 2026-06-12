import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './KycDossierModal.css'
import { getKycRecordByClient, updateKycStatus } from '../../services/kyc.service'

function KycDossierModal({ clientId, onClose, onUpdated }) {
  const { t } = useTranslation()
  const [record,   setRecord]   = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [updating, setUpdating] = useState(false)
  const [zoomImage, setZoomImage] = useState(null)

  useEffect(() => { fetchKyc() }, [clientId])

  const fetchKyc = async () => {
    try {
      setLoading(true)
      const data = await getKycRecordByClient(clientId)
      setRecord(data?.data ?? data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (status) => {
    try {
      setUpdating(true)
      await updateKycStatus(record.id, status)
      await fetchKyc()
      onUpdated?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  const score = Math.round((record?.facialMatchingScore || 0) * 100)

  return (
    <>
      <div className="kyc-overlay" onClick={onClose}>
        <div className="kyc-modal" onClick={(e) => e.stopPropagation()}>

          <div className="kyc-header">
            <div>
              <h2>{t('kycDossierModal.title')}</h2>
              <p>{t('kycDossierModal.subtitle')}</p>
            </div>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>

          <div className="kyc-body">

            {loading && <div className="kyc-state">{t('kycDossierModal.loading')}</div>}
            {error   && <div className="kyc-error">{error}</div>}

            {record && (
              <>
                <div className="profile-card">
                  <div className="avatar">
                    {record.client?.firstName?.[0]}
                    {record.client?.lastName?.[0]}
                  </div>
                  <div className="profile-info">
                    <h3>{record.client?.firstName} {record.client?.lastName}</h3>
                    <p>{record.client?.email}</p>
                  </div>
                  <div className="score-box">
                    <span>{t('kycDossierModal.faceMatch')}</span>
                    <div className="score">{score}%</div>
                    <div className="bar">
                      <div className="bar-fill" style={{ width: `${score}%` }} />
                    </div>
                  </div>
                </div>

                <div className="kyc-grid">
                  <div className="card">
                    <h4>{t('kycDossierModal.cinData')}</h4>
                    <div className="info">
                      <p><b>{t('kycDossierModal.cin')}:</b> {record.cinData?.cin}</p>
                      <p><b>{t('kycDossierModal.name')}:</b> {record.cinData?.firstName} {record.cinData?.lastName}</p>
                      <p><b>{t('kycDossierModal.birth')}:</b> {record.cinData?.birthDate}</p>
                      <p><b>{t('kycDossierModal.place')}:</b> {record.cinData?.lieu}</p>
                      <p><b>{t('kycDossierModal.address')}:</b> {record.cinData?.address}</p>
                    </div>
                  </div>

                  <div className="card image-card">
                    <h4>{t('kycDossierModal.identityComparison')}</h4>
                    <div className="img-block">
                      <div className="img-title">{t('kycDossierModal.cinDocument')}</div>
                      <img src={record.cinImageUrl} onClick={() => setZoomImage(record.cinImageUrl)} alt="CIN" />
                    </div>
                    <div className="img-block">
                      <div className="img-title">{t('kycDossierModal.selfie')}</div>
                      <img src={record.selfieImageUrl} onClick={() => setZoomImage(record.selfieImageUrl)} alt={t('kycDossierModal.selfie')} />
                    </div>
                  </div>
                </div>

                <div className="actions">
                  {record.status === 'valide' ? (
                    <div className="kyc-approved-badge">{t('kycDossierModal.approved')}</div>
                  ) : record.status === 'non_valide' ? (
                    <div className="kyc-rejected-badge">{t('kycDossierModal.rejected')}</div>
                  ) : (
                    <>
                      <button className="approve-btn" disabled={updating}
                        onClick={() => handleStatusChange('valide')}>
                        {t('kycDossierModal.approve')}
                      </button>
                      <button className="reject-btn" disabled={updating}
                        onClick={() => handleStatusChange('non_valide')}>
                        {t('kycDossierModal.reject')}
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {zoomImage && (
        <div className="zoom-overlay" onClick={() => setZoomImage(null)}>
          <img src={zoomImage} alt="zoom" />
        </div>
      )}
    </>
  )
}

export default KycDossierModal
