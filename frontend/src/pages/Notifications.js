import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../services/notificationService';
import { toast } from 'react-toastify';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => { loadNotifications(); }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Erreur:', err);
      toast.error('Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.est_lue) {
        await notificationService.marquerCommeLue(notification.id);
        setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, est_lue: true } : n));
      }
      if (notification.lien) navigate(notification.lien);
    } catch (err) { console.error('Erreur:', err); }
  };

  const handleMarquerToutLu = async () => {
    try {
      await notificationService.marquerToutCommeLu();
      setNotifications(prev => prev.map(n => ({ ...n, est_lue: true })));
      toast.success('Toutes les notifications sont marquées comme lues');
    } catch (err) {
      console.error('Erreur:', err);
      toast.error('Erreur lors du marquage');
    }
  };

  const NOTIF_ICONS = {
    'entreprise_validee': { color: 'bg-success-100 text-success-600', path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    'entreprise_refusee': { color: 'bg-danger-100 text-danger-600', path: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
    'nouveau_message': { color: 'bg-primary-100 text-primary-600', path: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    'nouveau_contact': { color: 'bg-primary-100 text-primary-600', path: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    'entreprise_favori': { color: 'bg-warning-100 text-warning-600', path: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    'abonnement_expire': { color: 'bg-warning-100 text-warning-600', path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    'system': { color: 'bg-gray-100 text-gray-500', path: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  };

  const getIcon = (type) => NOTIF_ICONS[type] || NOTIF_ICONS.system;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.est_lue;
    if (filter === 'read') return n.est_lue;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.est_lue).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <svg className="animate-spin w-12 h-12 text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1>Notifications</h1>
            <p>{unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Toutes lues'}</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={handleMarquerToutLu}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 text-white text-sm font-semibold hover:bg-white/30 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Tout marquer lu
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {[
            { key: 'all', label: `Toutes (${notifications.length})` },
            { key: 'unread', label: `Non lues (${unreadCount})` },
            { key: 'read', label: `Lues (${notifications.length - unreadCount})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filter === tab.key ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}
        {filteredNotifications.length === 0 ? (
          <div className="empty-state min-h-[40vh]">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-gray-500 text-sm">
              {filter === 'unread' && "Vous n'avez aucune notification non lue."}
              {filter === 'read' && "Vous n'avez aucune notification lue."}
              {filter === 'all' && 'Vous recevrez ici toutes vos notifications importantes.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map(notification => {
              const icon = getIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-soft ${
                    !notification.est_lue ? 'bg-primary-50/50 border-primary-200' : 'bg-white border-gray-100'
                  }`}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${icon.color}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon.path} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{notification.titre}</h4>
                      {!notification.est_lue && <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{formatDate(notification.created_at)}</span>
                      {notification.type_display && <span className="px-2 py-0.5 rounded-full bg-gray-100">{notification.type_display}</span>}
                    </div>
                  </div>
                  {notification.lien && (
                    <svg className="w-5 h-5 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
