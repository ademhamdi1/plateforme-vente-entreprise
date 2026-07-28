import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import NotificationService from '../../services/notification.service';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsAuthenticated(AuthService.isAuthenticated());
    setUser(AuthService.getUser());
    
    if (AuthService.isAuthenticated()) {
      fetchUnreadCount();
      // Refresh count every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const fetchUnreadCount = async () => {
    try {
      const data = await NotificationService.getUnreadCount();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
            <img src="/images/logo.png" alt="BusinessBuy" className="navbar-logo-full" />
          </Link>

          <button
            type="button"
            className={`navbar-toggle${menuOpen ? ' active' : ''}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Basculer le menu de navigation"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul
            className={`navbar-menu${menuOpen ? ' open' : ''}`}
            onClick={(e) => {
              // Close the mobile dropdown when any link/button is tapped.
              if (e.target.closest('a, button')) setMenuOpen(false);
            }}
          >
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/entreprises">Entreprises</Link></li>
            <li><Link to="/categories">Catégories</Link></li>
            
            {isAuthenticated ? (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/messages">💬 Messages</Link></li>
                {user?.user_type === 'vendeur' && (
                  <li><Link to="/contact-requests">📋 Demandes</Link></li>
                )}
                <li className="notification-link">
                  <Link to="/notifications">
                    🔔
                    {unreadCount > 0 && (
                      <span className="notification-badge">{unreadCount}</span>
                    )}
                  </Link>
                </li>
                {user?.user_type === 'vendeur' && (
                  <li>
                    <Link to="/entreprises/create" className="btn btn-primary">
                      Publier une annonce
                    </Link>
                  </li>
                )}
                <li>
                  <button onClick={handleLogout} className="btn btn-secondary">
                    Déconnexion
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login">Connexion</Link></li>
                <li>
                  <Link to="/register" className="btn btn-primary">
                    Inscription
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
