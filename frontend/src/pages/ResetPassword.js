import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function ResetPassword() {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    new_password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.new_password !== formData.confirm_password) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.new_password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setLoading(false);
      return;
    }

    try {
      await api.post('/users/password-reset-confirm/', {
        uid: uidb64,
        token: token,
        new_password: formData.new_password,
      });

      alert('Mot de passe réinitialisé avec succès!');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Nouveau mot de passe</h1>
            <p className="text-gray-600 mt-2">
              Choisissez un nouveau mot de passe sécurisé
            </p>
          </div>

          {error && (
            <div className="mb-5 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label" htmlFor="new_password">Nouveau mot de passe *</label>
              <input
                type="password"
                id="new_password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                placeholder="Minimum 8 caractères"
                required
                autoComplete="new-password"
                minLength="8"
                className="input"
              />
              <small className="block mt-1.5 text-sm text-gray-500 inline-flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Utilisez au moins 8 caractères avec des lettres, chiffres et symboles
              </small>
            </div>

            <div>
              <label className="label" htmlFor="confirm_password">Confirmer le mot de passe *</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Retapez le mot de passe"
                required
                autoComplete="new-password"
                className="input"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
