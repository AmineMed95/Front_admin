import { useEffect, useState } from 'react'
import './ClientList.css'

import { getClients, createClient } from '../../services/client.service'

import Sidebar from '../../components/ui/Sidebar/Sidebar'
import CreateClientModal from '../../components/modals/CreateClientModal'

function ClientList({ onNavigate, onLogout }) {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchClients()
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const fetchClients = async () => {
    try {
      setLoading(true)
      const data = await getClients()
      setClients(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des clients.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (form) => {
    try {
      await createClient(form)
      await fetchClients()

      setModal(null)

      showToast('Compte client créé et email envoyé.', 'success')
    } catch (err) {
      setModal(null)

      showToast(
        err.message || 'Erreur lors de la création du client.',
        'error'
      )
    }
  }


  const filtered = clients.filter((client) => {
    const q = search.toLowerCase()
    return (
      `${client.firstName || ''} ${client.lastName || ''}`
        .toLowerCase()
        .includes(q) ||
      (client.email || '').toLowerCase().includes(q) ||
      (client.accessCode || '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="page-layout">
      <Sidebar
        activePage="clients"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="page-content">
        <div className="client-list">

          <div className="client-list-header">
            <div>
              <h2 className="client-list-title">Clients</h2>
              <p className="client-list-sub">
                {filtered.length} client{filtered.length !== 1 ? 's' : ''} au total
              </p>
            </div>

            <div className="client-list-actions">
              <input
                className="client-search"
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                className="btn-primary"
                onClick={() => setModal({ mode: 'create' })}
              >
                + Nouveau client
              </button>
            </div>
          </div>

          {loading && <div className="client-state">Chargement...</div>}
          {error && <div className="client-state error">{error}</div>}

          {!loading && !error && (
            <div className="client-table-wrapper">
              <table className="client-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Code d'accès</th>
                    <th>Statut</th>
                    <th>Créé le</th>
                    <th>Status du dossier</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="client-empty">
                        Aucun client trouvé.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((client) => (
                      <tr key={client.id}>
                        <td>
                          <div className="client-name">
                            <div className="client-avatar">
                              {(client.firstName?.[0] || '').toUpperCase()}
                              {(client.lastName?.[0] || '').toUpperCase()}
                            </div>
                            <span>
                              {client.firstName} {client.lastName}
                            </span>
                          </div>
                        </td>

                        <td>{client.email}</td>
                        <td>{client.phone}</td>

                        <td>
                          <code className="access-code">
                            {client.accessCode}
                          </code>
                        </td>

                        <td>
                          <span
                            className={`status-badge ${
                              client.isCodeUsed ? 'used' : 'unused'
                            }`}
                          >
                            {client.isCodeUsed ? 'Utilisé' : 'Non utilisé'}
                          </span>
                        </td>

                        <td>
                          {client.createdAt
                            ? new Date(client.createdAt).toLocaleDateString('fr-FR')
                            : '-'}
                        </td>
                     <td>
                  <td>
                  {client.has_kyc ? (
                    <button
                      className="btn-consulter btn-success"
                    >
                      ✅ Dossier envoyé
                    </button>
                  ) : (
                    <button
                      className="btn-consulter btn-warning"
                    >
                      ⏳ En attente d’envoi
                    </button>
                  )}
                </td>
                    </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
 
      {/* Create Client Modal */}
      {modal?.mode === 'create' && (
        <CreateClientModal
          onClose={() => setModal(null)}
          onSubmit={handleCreate}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span className="toast-icon">
            {toast.type === 'success' ? '✅' : '❌'}
          </span>
          {toast.message}
        </div>
      )}
    </div>
  )
}

export default ClientList