import { getHeaders } from './api'
import i18n from '../i18n/index.js'

const API_URL = import.meta.env.VITE_API_URL

const mapClient = (client) => ({
  id: client.id,
  firstName: client.first_name,
  lastName: client.last_name,
  email: client.email,
  phone: client.phone,
  accessCode: client.access_code,
  isCodeUsed: client.is_code_used,
  createdBy: client.created_by,
  createdAt: client.created_at,
  has_kyc: client.has_kyc,
  kyc: client.kyc
    ? {
        id: client.kyc.id,
        status: client.kyc.status,
        facialMatchingScore: client.kyc.facialMatchingScore,
        cinImageUrl: client.kyc.cinImageUrl,
        selfieImageUrl: client.kyc.selfieImageUrl,
        createdAt: client.kyc.createdAt,
        cinData: client.kyc.cinData
          ? {
              cin: client.kyc.cinData.cin,
              firstName: client.kyc.cinData.firstName,
              lastName: client.kyc.cinData.lastName,
              birthDate: client.kyc.cinData.birthDate,
              lieu: client.kyc.cinData.lieu,
              address: client.kyc.cinData.address,
            }
          : null,
      }
    : null,
})

export async function getClients() {
  const res = await fetch(`${API_URL}/clients/list`, {
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error(i18n.t('errors.fetchClientsFailed'))
  const data = await res.json()
  return data.map(mapClient)
}
export async function createClient(form) {
  const res = await fetch(`${API_URL}/clients/create`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      phone: form.phone,
      send_via: form.sendVia, // 1 = email, 2 = SMS, etc.
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.message || i18n.t('errors.createClientFailed'))
  }

  return mapClient(data)
}