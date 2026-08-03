import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * SideDrawer - Mobile-app style slide-out drawer
 * Opens from left, overlays the screen with a backdrop.
 * Contains: user card, primary navigation, role-based links, secondary links.
 */
function SideDrawer({ open, onClose }) {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('access_token');
  const userType = localStorage.getItem('user_type');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_type');
    onClose();
    navigate('/');
  };

  const go = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[300px] max-w-[85vw] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header: brand + close */}
        <div className="flex items-center justify-between px-4 h-14 bg-gradient-to-r from-primary-500 to-primary-700 shrink-0">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="BusinessBuy" className="h-8 w-8 rounded-lg" />
            <span className="text-white font-extrabold text-lg">BusinessBuy</span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-white/90 hover:bg-white/10 active:scale-90 transition-all"
            aria-label="Fermer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable nav body */}
        <div className="flex-1 overflow-y-auto py-2">
          {/* User card (authenticated) */}
          {isAuthenticated && (
            <div className="mx-3 mb-2 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Mon compte</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {userType === 'acheteur' ? 'Acheteur' : userType === 'vendeur' ? 'Vendeur' : 'Administrateur'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Primary navigation */}
          <NavItem icon="home" label="Accueil" onClick={() => go('/')} />
          <NavItem icon="search" label="Explorer les entreprises" onClick={() => go('/entreprises')} />
          <NavItem icon="news" label="Actualités" onClick={() => go('/actualites')} />
          <NavItem icon="scale" label="Comparateur" onClick={() => go('/comparateur')} />

          {/* Divider */}
          <div className="my-2 mx-4 border-t border-gray-100" />

          {/* Authenticated section */}
          {isAuthenticated ? (
            <>
              <NavItem icon="dashboard" label="Dashboard" onClick={() => go('/dashboard')} />
              <NavItem icon="bell" label="Notifications" onClick={() => go('/notifications')} />
              <NavItem icon="mail" label="Messages" onClick={() => go('/messages')} />
              <NavItem icon="user" label="Mon Profil" onClick={() => go('/profil')} />

              {userType === 'acheteur' && (
                <>
                  <NavItem icon="heart" label="Mes Favoris" onClick={() => go('/favoris')} />
                  <NavItem icon="alert" label="Mes Alertes" onClick={() => go('/alertes')} />
                </>
              )}

              {userType === 'vendeur' && (
                <>
                  <NavItem icon="plus" label="Publier une entreprise" onClick={() => go('/publier')} />
                  <NavItem icon="card" label="Abonnement" onClick={() => go('/abonnement')} />
                </>
              )}

              {/* Divider */}
              <div className="my-2 mx-4 border-t border-gray-100" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-danger-600 hover:bg-danger-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Déconnexion
              </button>
            </>
          ) : (
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={() => go('/login')}
                className="w-full flex items-center justify-center h-11 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 active:scale-95 transition-all"
              >
                Connexion
              </button>
              <button
                onClick={() => go('/register')}
                className="w-full flex items-center justify-center h-11 rounded-xl border-2 border-primary-500 text-primary-600 font-semibold hover:bg-primary-50 active:scale-95 transition-all"
              >
                Créer un compte
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="my-2 mx-4 border-t border-gray-100" />

          {/* Secondary links */}
          <NavItem icon="info" label="À Propos" onClick={() => go('/about')} />
          <NavItem icon="phone" label="Contact" onClick={() => go('/contact')} />
          <NavItem icon="question" label="FAQ" onClick={() => go('/faq')} />
        </div>

        {/* Footer version tag */}
        <div className="shrink-0 px-4 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">BusinessBuy v1.0 - Tunisie</p>
        </div>
      </aside>
    </>
  );
}

/* === Sub-component: NavItem === */
const ICONS = {
  home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  news: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
  scale: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
  dashboard: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  bell: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  mail: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  heart: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  alert: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  plus: 'M12 4v16m8-8H4',
  card: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  phone: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  question: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
};

function NavItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
    >
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICONS[icon] || ICONS.info} />
      </svg>
      {label}
    </button>
  );
}

export default SideDrawer;
