import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import api from '../services/api';

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

      setSuccess('Profil mis à jour avec succès !');

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
        return 'Acheteur';
      case 'vendeur':
        return 'Vendeur';
      case 'admin':
        return 'Administrateur';
      default:
        return type;
    }
  };

  const getUserTypeBadgeClass = (type) => {
    switch (type) {
      case 'acheteur':
        return 'badge-primary';
      case 'vendeur':
        return 'badge-success';
      case 'admin':
        return 'badge-danger';
      default:
        return 'badge-primary';
    }
  };

  const UserIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-32 w-32 text-primary-600"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="empty-state">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-primary-500 animate-spin mx-auto mb-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8" />
            </svg>
            <p className="text-gray-600">Chargement du profil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="page-header">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Retour
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-primary-600"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            Mon Profil
          </h1>
        </div>

        <div className="card">
          {/* Avatar circle */}
          <div className="flex flex-col items-center pb-6 border-b border-gray-200">
            <div className="h-32 w-32 rounded-full bg-primary-100 flex items-center justify-center mb-4 ring-4 ring-primary-50">
              <UserIcon />
            </div>
            <span className={`${getUserTypeBadgeClass(profile.user_type)} inline-flex items-center gap-1`}>
              {profile.user_type === 'acheteur' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              )}
              {profile.user_type === 'vendeur' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {profile.user_type === 'admin' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.914 11.914 0 0010 1.941 11.916 11.916 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {getUserTypeLabel(profile.user_type)}
            </span>
          </div>

          {error && (
            <div className="mt-6 rounded-md bg-danger-50 border border-danger-200 p-4">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-danger-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-danger-700">{error}</p>
              </div>
            </div>
          )}
          {success && (
            <div className="mt-6 rounded-md bg-success-50 border border-success-200 p-4">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-success-700">{success}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="label">
                  Prénom *
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleChange}
                  required
                  placeholder="Votre prénom"
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="last_name" className="label">
                  Nom *
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={profile.last_name}
                  onChange={handleChange}
                  required
                  placeholder="Votre nom"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                disabled
                className="input bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <small className="mt-1 block text-sm text-gray-500">
                L'email ne peut pas être modifié
              </small>
            </div>

            <div>
              <label htmlFor="phone" className="label">
                Téléphone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                required
                placeholder="+216 12 345 678"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="address" className="label">
                Adresse
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={profile.address}
                onChange={handleChange}
                placeholder="Votre adresse complète"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="city" className="label">
                Ville
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={profile.city}
                onChange={handleChange}
                placeholder="Votre ville"
                className="input"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/dashboard')}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-primary inline-flex items-center justify-center gap-2"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8" />
                    </svg>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 00-1.414-1.414L10 12.586l-2.293-2.293z" />
                    </svg>
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profil;
