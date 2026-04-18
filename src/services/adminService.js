// Mock admin data — replace with real API calls once backend is ready
let admins = [
  {
    id: '1',
    firstName: 'Karim',
    lastName: 'Benali',
    email: 'karim.benali@acme.com',
    organization: 'ACME Corp',
    createdAt: '2024-11-10T08:30:00Z',
    status: 'active',
    activationToken: null,
  },
  {
    id: '2',
    firstName: 'Sara',
    lastName: 'Meziani',
    email: 'sara.meziani@techsolutions.io',
    organization: 'Tech Solutions',
    createdAt: '2025-01-22T14:15:00Z',
    status: 'active',
    activationToken: null,
  },
  {
    id: '3',
    firstName: 'Amine',
    lastName: 'Djelloul',
    email: 'a.djelloul@globex.dz',
    organization: 'Globex DZ',
    createdAt: '2025-03-05T09:00:00Z',
    status: 'pending',
    activationToken: 'demo-token-for-testing',
  },
]

// Simulate async API delay
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms))

/**
 * Generates a secure random activation token (48 hex chars).
 */
function generateToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Generates a strong random password.
 * Uses crypto.getRandomValues so it's truly random.
 * Format: 12 characters — uppercase, lowercase, digits, special chars.
 * Excluded ambiguous chars (0, O, I, l) for readability.
 */
function generatePassword() {
  const upper   = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lower   = 'abcdefghjkmnpqrstuvwxyz'
  const digits  = '23456789'
  const special = '@#$%&*!?'
  const all     = upper + lower + digits + special

  // Guarantee at least one character from each category
  const pick = (set) => {
    const idx = new Uint8Array(1)
    crypto.getRandomValues(idx)
    return set[idx[0] % set.length]
  }

  const required = [pick(upper), pick(lower), pick(digits), pick(special)]
  const extras   = Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map((b) => all[b % all.length])

  // Shuffle the combined array
  const combined  = [...required, ...extras]
  const sortKeys  = crypto.getRandomValues(new Uint8Array(combined.length))
  return combined
    .map((c, i) => ({ c, k: sortKeys[i] }))
    .sort((a, b) => a.k - b.k)
    .map(({ c }) => c)
    .join('')
}

/* ── CRUD ───────────────────────────────────────── */

export async function getAdmins() {
  await delay()
  return [...admins]
}

/**
 * Creates a new admin account.
 * Returns the new admin INCLUDING the plain-text generatedPassword
 * so it can be shown once in the EmailSentModal / sent via email.
 * In production the plain password is NEVER stored — only the hash is kept.
 */
export async function createAdmin({ firstName, lastName, email, organization }) {
  await delay()
  const activationToken   = generateToken()
  const generatedPassword = generatePassword()

  const newAdmin = {
    id: Date.now().toString(),
    firstName,
    lastName,
    email,
    organization,
    createdAt: new Date().toISOString(),
    status: 'pending',
    activationToken,
    // In production: store hash(generatedPassword), never the plain value
    password: generatedPassword,
  }
  admins = [newAdmin, ...admins]

  // Return a copy that exposes the plain password once (for the email)
  return { ...newAdmin, generatedPassword }
}

export async function updateAdmin(id, { firstName, lastName, email, organization }) {
  await delay()
  admins = admins.map((a) =>
    a.id === id ? { ...a, firstName, lastName, email, organization } : a
  )
  return admins.find((a) => a.id === id)
}

export async function deleteAdmin(id) {
  await delay()
  admins = admins.filter((a) => a.id !== id)
}

/**
 * Resolves the admin that owns this token, or throws if not found.
 */
export async function getAdminByToken(token) {
  await delay(200)
  const admin = admins.find((a) => a.activationToken === token)
  if (!admin) throw new Error('Ce lien est invalide ou a expiré.')
  return admin
}

/**
 * Marks the account as active and consumes the token.
 * The password was already set during createAdmin().
 */
export async function activateAccount(token) {
  await delay()
  const admin = admins.find((a) => a.activationToken === token)
  if (!admin) throw new Error('Ce lien est invalide ou a expiré.')
  admins = admins.map((a) =>
    a.id === admin.id ? { ...a, status: 'active', activationToken: null } : a
  )
  return admins.find((a) => a.id === admin.id)
}
