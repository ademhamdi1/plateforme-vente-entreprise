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
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.body.classList.add('mobile-menu-open');
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.classList.remove('mobile-menu-open');
    }

    return () => {
      document.body.classList.remove('mobile-menu-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const fetchUnreadCount = async () => {
    try {
      const data = await NotificationService.getUnreadCount();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  const getNavLinkClass = (path) => {
    const isActive = path === '/'
      ? location.pathname === path
      : location.pathname === path || location.pathname.startsWith(`${path}/`);

    return isActive ? 'active' : undefined;
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUser(null);
    closeMenu();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            <img src="/images/logo.png" alt="BusinessBuy" className="navbar-logo-full" />
          </Link>

          <button
            type="button"
            className={`navbar-toggle${menuOpen ? ' active' : ''}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <button
            type="button"
            className={`navbar-backdrop${menuOpen ? ' open' : ''}`}
            onClick={closeMenu}
            aria-label="Fermer le menu"
            tabIndex={menuOpen ? 0 : -1}
          />

          <div
            id="site-navigation"
            className={`navbar-drawer${menuOpen ? ' open' : ''}`}
          >
            <div className="navbar-drawer-header">
              <Link to="/" className="navbar-drawer-brand" onClick={closeMenu}>
                <img src="/images/logo.png" alt="BusinessBuy" />
              </Link>
              <button
                type="button"
                className="navbar-close"
                onClick={closeMenu}
                aria-label="Fermer le menu"
              >
                <span></span>
                <span></span>
              </button>
            </div>

            <ul
              className="navbar-menu"
              onClick={(e) => {
                if (e.target.closest('a, button')) closeMenu();
              }}
            >
              <li><Link to="/" className={getNavLinkClass('/')}>Accueil</Link></li>
              <li><Link to="/entreprises" className={getNavLinkClass('/entreprises')}>Entreprises</Link></li>
              <li><Link to="/categories" className={getNavLinkClass('/categories')}>Catégories</Link></li>

              {isAuthenticated ? (
                <>
                  <li><Link to="/dashboard" className={getNavLinkClass('/dashboard')}>Dashboard</Link></li>
                  <li><Link to="/messages" className={getNavLinkClass('/messages')}>Messages</Link></li>
                  {user?.user_type === 'vendeur' && (
                    <li><Link to="/contact-requests" className={getNavLinkClass('/contact-requests')}>Demandes</Link></li>
                  )}
                  <li className="notification-link">
                    <Link to="/notifications" className={getNavLinkClass('/notifications')}>
                      Notifications
                      {unreadCount > 0 && (
                        <span className="notification-badge">{unreadCount}</span>
                      )}
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="btn btn-secondary">
                      Déconnexion
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className={getNavLinkClass('/login')}>Connexion</Link></li>
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
      </div>
    </nav>
  );
};

export default Navbar;
