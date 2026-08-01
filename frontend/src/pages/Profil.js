import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import api from '../services/api';
import './Profil.css';

function Profil() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    user_type: '',
  });

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadProfile();
  }, [navigate]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await authService.getProfile();
      setProfile({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        user_type: data.user_type || '',
      });
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!profile.first_name || !profile.last_name) {
      setError('Le prénom et le nom sont obligatoires');
      return;
    }

    if (!profile.phone) {
      setError('Le numéro de téléphone est obligatoire');
      return;
    }

    try {
      setSaving(true);
      // Update profile - saved to PostgreSQL
      await api.patch('/users/profile/', {
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
      });

      setSuccess('✅ Profil mis à jour avec succès !');
      
      // Reload profile after 1 second
      setTimeout(() => {
        loadProfile();
        setSuccess('');
      }, 2000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.detail || 'Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  const getUserTypeLabel = (type) => {
    switch (type) {
      case 'acheteur':
        return '👤 Acheteur';
      case 'vendeur':
        return '💼 Vendeur';
      case 'admin':
        return '🛡️ Administrateur';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="profil-page">
        <div className="container">
          <div className="loading">⏳ Chargement du profil...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profil-page">
      <div className="container">
        <div className="page-header">
          <button onClick={() => navigate('/dashboard')} className="btn-back">
            ← Retour
          </button>
          <h1>👤 Mon Profil</h1>
        </div>

        <div className="profil-card">
          <div className="user-type-badge">
            {getUserTypeLabel(profile.user_type)}
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="profil-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">Prénom *</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleChange}
                  required
                  placeholder="Votre prénom"
                />
              </div>

              <div className="form-group">
                <label htmlFor="last_name">Nom *</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={profile.last_name}
                  onChange={handleChange}
                  required
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                disabled
                className="input-disabled"
              />
              <small className="form-help">L'email ne peut pas être modifié</small>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Téléphone *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                required
                placeholder="+216 12 345 678"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Adresse</label>
              <input
                type="text"
                id="address"
                name="address"
                value={profile.address}
                onChange={handleChange}
                placeholder="Votre adresse complète"
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">Ville</label>
              <input
                type="text"
                id="city"
                name="city"
                value={profile.city}
                onChange={handleChange}
                placeholder="Votre ville"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/dashboard')}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? '⏳ Enregistrement...' : '💾 Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profil;
