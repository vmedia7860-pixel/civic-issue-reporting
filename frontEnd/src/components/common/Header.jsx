import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from './Button'
import './Header.css'

export default function Header() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🏛️ Civic Issues
          </motion.div>
        </Link>
        <nav className="header-nav">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/reports" 
            className={`nav-link ${isActive('/reports') ? 'active' : ''}`}
          >
            My Reports
          </Link>
          <Link 
            to="/map" 
            className={`nav-link ${isActive('/map') ? 'active' : ''}`}
          >
            Map
          </Link>
          <Link 
            to="/admin" 
            className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
          >
            Admin
          </Link>
        </nav>
        <Link to="/create">
          <Button variant="primary">Report Issue</Button>
        </Link>
      </div>
    </header>
  )
}

