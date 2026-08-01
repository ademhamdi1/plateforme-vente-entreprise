import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

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
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <h1>🔐 Mot de passe oublié ?</h1>
          <p className="auth-subtitle">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>

          {success ? (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h3>Email envoyé !</h3>
              <p>
                Si un compte existe avec cet email, vous recevrez un lien de réinitialisation 
                dans quelques minutes.
              </p>
              <p className="info-text">
                Vérifiez également votre dossier spam/courrier indésirable.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className="error">{error}</div>}

              <div className="form-group">
                <label>Adresse email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
              </button>
            </form>
          )}

          <p className="auth-footer">
            <Link to="/login">← Retour à la connexion</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RequestPasswordReset;
