const API_URL = 'http://localhost:3000'

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

const mapAdmin = (admin) => ({
  id: admin.id,
  firstName: admin.first_name,
  lastName: admin.last_name,
  email: admin.email,
  organization: admin.organization_name,
  phone: admin.phone,      
  createdAt: admin.created_at,
  status: admin.status?.code === 'actif' ? 'active' : 'pending',
  activationToken: admin.activation_token,
})

export async function getAdmins() {
  const res = await fetch(`${API_URL}/users/get-list-admin`, {
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error('Failed to fetch admins')
  const data = await res.json()
  return data.map(mapAdmin)
}

export async function createAdmin({ firstName, lastName, email, organization, phone }) {
  const res = await fetch(`${API_URL}/users/create-admin`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      email,
      organization_name: organization,
      phone : phone,
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'Failed to create admin')
  }
  return res.json()
}

export async function updateAdmin(id, { firstName, lastName, email, organization, phone }) {
  const res = await fetch(`${API_URL}/users/update-admin/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      email,
      organization_name: organization,
      phone,
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'Failed to update admin')
  }
  const data = await res.json()
  return mapAdmin(data.data)  
}

export async function deleteAdmin(id) {
  const res = await fetch(`${API_URL}/users/delete-admin/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'Failed to delete admin')
  }
  return res.json()
}