import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { messagingService } from '../services/messagingService';
import { notificationService } from '../services/notificationService';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();
  
  // Check if user is logged in
  const isAuthenticated = localStorage.getItem('access_token');
  const userType = localStorage.getItem('user_type');

  useEffect(() => {
    // Charger le nombre de messages non lus et notifications depuis PostgreSQL
    if (isAuthenticated) {
      loadUnreadCount();
      loadNotificationCount();
      // Rafraîchir toutes les 30 secondes
      const interval = setInterval(() => {
        loadUnreadCount();
        loadNotificationCount();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadUnreadCount = async () => {
    try {
      const count = await messagingService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Erreur chargement messages non lus:', err);
    }
  };

  const loadNotificationCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setNotificationCount(count);
    } catch (err) {
      console.error('Erreur chargement notifications:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_type');
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <img src="/images/logo.png" alt="BusinessBuy" className="navbar-logo-img" />
        </Link>

        <button 
          className={`navbar-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>Accueil</Link>
          </li>
          <li>
            <Link to="/entreprises" onClick={() => setMenuOpen(false)}>Entreprises</Link>
          </li>
          <li>
            <Link to="/actualites" onClick={() => setMenuOpen(false)}>Actualités</Link>
          </li>
          
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              </li>
              <li>
                <Link to="/notifications" onClick={() => setMenuOpen(false)} className="notifications-link">
                  🔔 Notifications
                  {notificationCount > 0 && (
                    <span className="unread-badge-nav">{notificationCount}</span>
                  )}
                </Link>
              </li>
              <li>
                <Link to="/messages" onClick={() => setMenuOpen(false)} className="messages-link">
                  📬 Messages
                  {unreadCount > 0 && (
                    <span className="unread-badge-nav">{unreadCount}</span>
                  )}
                </Link>
              </li>
              <li>
                <Link to="/profil" onClick={() => setMenuOpen(false)}>
                  👤 Mon Profil
                </Link>
              </li>
              {userType === 'acheteur' && (
                <li>
                  <Link to="/favoris" onClick={() => setMenuOpen(false)}>
                    ⭐ Favoris
                  </Link>
                </li>
              )}
              {userType === 'acheteur' && (
                <li>
                  <Link to="/alertes" onClick={() => setMenuOpen(false)}>
                    🔔 Mes Alertes
                  </Link>
                </li>
              )}
              {userType === 'vendeur' && (
                <li>
                  <Link to="/abonnement" onClick={() => setMenuOpen(false)}>
                    💳 Abonnement
                  </Link>
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="btn-logout">
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={() => setMenuOpen(false)}>Connexion</Link>
              </li>
              <li>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary-nav">
                  Inscription
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
