import './Sidebar.css'

const NAV_ITEMS = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard' },
  { key: 'admins',    icon: '👥', label: 'Admins'    },
  { key: 'settings',  icon: '⚙️', label: 'Paramètres' },
]

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">A</div>
        <span>AdminPanel</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ key, icon, label }) => (
          <button
            key={key}
            className={`nav-item ${activePage === key ? 'active' : ''}`}
            onClick={() => onNavigate(key)}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="avatar">S</div>
        <div className="user-info">
          <span className="user-name">Super Admin</span>
          <span className="user-role">super-admin</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
