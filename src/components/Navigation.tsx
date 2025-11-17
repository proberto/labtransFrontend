import { Link, useLocation } from 'react-router-dom'

export const Navigation = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav className="app-nav">
      <Link
        to="/reservations"
        className={`nav-link ${isActive('/reservations') ? 'active' : ''}`}
      >
        Reservas
      </Link>
      <Link
        to="/locations"
        className={`nav-link ${isActive('/locations') ? 'active' : ''}`}
      >
        Locais
      </Link>
      <Link
        to="/rooms"
        className={`nav-link ${isActive('/rooms') ? 'active' : ''}`}
      >
        Salas
      </Link>
    </nav>
  )
}

