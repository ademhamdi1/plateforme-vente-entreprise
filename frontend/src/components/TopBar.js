import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * TopBar - Fixed top bar (mobile app style)
 * - Left: hamburger to open SideDrawer
 * - Center: logo
 * - Right: notification bell + message icon (if authenticated)
 */
function TopBar({ onOpenDrawer, unreadCount = 0, notificationCount = 0 }) {
  const isAuthenticated = localStorage.getItem('access_token');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white shadow-nav md:h-16">
      <div className="flex items-center justify-between h-full px-3 md:px-6">
        {/* Left: Hamburger */}
        <button
          onClick={onOpenDrawer}
          className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:bg-gray-100 active:scale-90 transition-all"
          aria-label="Ouvrir le menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Center: Logo */}
        <Link to="/" className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <img src="/images/logo.png" alt="BusinessBuy" className="h-8 w-8 md:h-9 md:w-9 rounded-lg object-cover" />
          <span className="hidden sm:inline text-lg md:text-xl font-extrabold text-primary-600 tracking-tight">
            BusinessBuy
          </span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <Link
                to="/notifications"
                className="relative flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 active:scale-90 transition-all"
                aria-label="Notifications"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-danger-500 rounded-full">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </Link>

              {/* Messages */}
              <Link
                to="/messages"
                className="relative flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 active:scale-90 transition-all"
                aria-label="Messages"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-primary-500 rounded-full">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center px-4 h-10 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 active:scale-95 transition-all"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
