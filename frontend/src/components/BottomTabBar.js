import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * BottomTabBar - Mobile-only fixed bottom tab bar (mobile app style)
 * Hidden on desktop (md:hidden)
 *
 * Tabs:
 *   - Home (all users)
 *   - Entreprises (all users - search)
 *   - Publier (vendeurs only - center FAB-style button)
 *   - Messages (authenticated only)
 *   - Profil (authenticated) / Login (guest)
 */
function BottomTabBar() {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('access_token');
  const userType = localStorage.getItem('user_type');

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const tabClass = (path) =>
    `flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors ${
      isActive(path) ? 'text-primary-600' : 'text-gray-400'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-stretch h-full px-1">
        {/* Home */}
        <Link to="/" className={tabClass('/')}>
          <svg className="w-5 h-5" fill={isActive('/') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-medium">Accueil</span>
        </Link>

        {/* Entreprises */}
        <Link to="/entreprises" className={tabClass('/entreprises')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-[10px] font-medium">Explorer</span>
        </Link>

        {/* Publier (vendeur center button) */}
        {isAuthenticated && userType === 'vendeur' && (
          <Link to="/publier" className="flex flex-col items-center justify-center px-2">
            <div className={`flex items-center justify-center w-12 h-12 -mt-4 rounded-2xl shadow-floating transition-all active:scale-90 ${
              isActive('/publier') ? 'bg-primary-700' : 'bg-primary-500'
            }`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className={`text-[10px] font-medium mt-0.5 ${isActive('/publier') ? 'text-primary-600' : 'text-gray-400'}`}>
              Publier
            </span>
          </Link>
        )}

        {/* Messages (authenticated) or Actualites (guest) */}
        {isAuthenticated ? (
          <Link to="/messages" className={tabClass('/messages')}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-[10px] font-medium">Messages</span>
          </Link>
        ) : (
          <Link to="/actualites" className={tabClass('/actualites')}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span className="text-[10px] font-medium">Actus</span>
          </Link>
        )}

        {/* Profil / Login */}
        {isAuthenticated ? (
          <Link to="/profil" className={tabClass('/profil')}>
            <svg className="w-5 h-5" fill={isActive('/profil') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-medium">Profil</span>
          </Link>
        ) : (
          <Link to="/login" className={tabClass('/login')}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-medium">Compte</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default BottomTabBar;
