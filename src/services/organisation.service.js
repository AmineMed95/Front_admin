// src/services/organisation.service.js

const BASE_URL = import.meta.env.VITE_API_URL 

// ─── LOGO URL HELPER ───────────────────────────────────────────────────────
// Normalises whatever path Multer stored into a full usable URL.
// Handles: "uploads/logos/x.png" | "./uploads/logos/x.png" | "uploads\\logos\\x.png"

export function getLogoUrl(path) {
  if (!path) return null
  const clean = path
    .replace(/\\/g, '/')   // Windows backslashes → forward slashes
    .replace(/^\.\//, '')  // strip leading "./"
  return `${BASE_URL}/${clean}`
}

// ─── HEADERS ───────────────────────────────────────────────────────────────
import { getHeaders, getMultipartHeaders } from './api'
import i18n from '../i18n/index.js'

// ─── LIST ──────────────────────────────────────────────────────────────────

export async function getOrganisations() {
  const res = await fetch(`${BASE_URL}/organisations/get-list`, {
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error(i18n.t('errors.fetchOrgsFailed'))
  return res.json()
}

// ─── GET ONE ───────────────────────────────────────────────────────────────

export async function getOrganisation(id) {
  const res = await fetch(`${BASE_URL}/organisations/get-organisation/${id}`, {
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error(i18n.t('errors.orgNotFound', { id }))
  return res.json()
}

// ─── CREATE ────────────────────────────────────────────────────────────────

export async function createOrganisation(data) {
  const res = await fetch(`${BASE_URL}/organisations/create`, {
    method: 'POST',
    headers: getMultipartHeaders(),
    body: data,
  })
  const body = await res.json()
  if (!res.ok) throw new Error(body?.message ?? i18n.t('errors.createFailed'))
  return body
}

// ─── UPDATE ────────────────────────────────────────────────────────────────

export async function updateOrganisation(id, data) {
  const res = await fetch(`${BASE_URL}/organisations/update/${id}`, {
    method: 'PATCH',
    headers: getMultipartHeaders(),
    body: data,
  })
  const body = await res.json()
  if (!res.ok) throw new Error(body?.message ?? i18n.t('errors.updateFailed'))
  return body
}

// ─── DELETE ────────────────────────────────────────────────────────────────

export async function deleteOrganisation(id) {
  const res = await fetch(`${BASE_URL}/organisations/delete/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
  const body = await res.json()
  if (!res.ok) throw new Error(body?.message ?? i18n.t('errors.deleteFailed'))
  return body
}