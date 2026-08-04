import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function RequestPasswordReset() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await api.post('/users/password-reset-request/', { email });
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
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
            <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublié ?</h1>
            <p className="text-gray-600 mt-2">
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Email envoyé !</h3>
              <p className="text-gray-700 mb-3">
                Si un compte existe avec cet email, vous recevrez un lien de réinitialisation
                dans quelques minutes.
              </p>
              <p className="text-sm text-gray-500 inline-flex items-center gap-1.5 justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Vérifiez également votre dossier spam/courrier indésirable.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="label" htmlFor="email">Adresse email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  autoComplete="email"
                  className="input"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
              </button>
            </form>
          )}

          <p className="text-center mt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RequestPasswordReset;
