const API_URL = 'http://localhost:3000'

/**
 * Logs in the user and stores the JWT token in localStorage.
 */
export async function login({ email, password }) {

    console.log('email, password'  ,email, password)
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Email ou mot de passe incorrect.')
  }

  const data = await response.json()

  // Store token & user info in localStorage
  localStorage.setItem('token', data.access_token)
  localStorage.setItem('user', JSON.stringify(data.user))

  return data
}

    /**
     * Logs out the user by clearing localStorage.
     */
    export async function logout() {
    try {
        await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        })
    } catch (err) {
        // Silently fail — we still clear localStorage regardless
        console.warn('Logout API call failed:', err)
    } finally {
        // Always clear localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }
    }
/**
 * Returns the stored JWT token.
 */
export function getToken() {
  return localStorage.getItem('token')
}

/**
 * Returns the stored user object.
 */
export function getUser() {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

/**
 * Returns true if the user is authenticated.
 */
export function isAuthenticated() {
  return !!localStorage.getItem('token')
}