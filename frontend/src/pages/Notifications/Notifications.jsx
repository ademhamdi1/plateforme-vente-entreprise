import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import NotificationService from '../../services/notification.service';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await NotificationService.getAll();
      setNotifications(data.results || data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications(notifications.map(notif =>
        notif.id === id ? { ...notif, est_lu: true } : notif
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications(notifications.map(notif => ({ ...notif, est_lu: true })));
      toast.success('Toutes les notifications sont marquées comme lues');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Erreur lors du marquage');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message': return '💬';
      case 'alerte_matched': return '🎯';
      case 'annonce_validee': return '✅';
      case 'annonce_refusee': return '❌';
      case 'nouvelle_demande': return '📩';
      default: return '🔔';
    }
  };

  return (
    <div className="notifications-page">
      <div className="container">
        <div className="notifications-header">
          <h1>🔔 Notifications</h1>
          <button
            className="btn btn-secondary"
            onClick={handleMarkAllAsRead}
            disabled={notifications.every(n => n.est_lu)}
          >
            Tout marquer comme lu
          </button>
        </div>

        {loading ? (
          <p className="loading">Chargement des notifications...</p>
        ) : notifications.length === 0 ? (
          <div className="no-notifications">
            <h3>Aucune notification</h3>
            <p>Vous n'avez pas encore de notifications.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.est_lu ? 'unread' : ''}`}
                onClick={() => !notification.est_lu && handleMarkAsRead(notification.id)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <h3>{notification.titre}</h3>
                  <p>{notification.message}</p>
                  <span className="notification-date">
                    {new Date(notification.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                {notification.lien && (
                  <Link to={notification.lien} className="notification-link-btn">
                    Voir →
                  </Link>
                )}
                {!notification.est_lu && <div className="unread-dot"></div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
