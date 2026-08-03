import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', password2: '',
    first_name: '', last_name: '', user_type: 'acheteur', phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.password2) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      await authService.register(formData);
      await authService.login(formData.username, formData.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Register error:', err);
      setError(
        err.response?.data?.username?.[0] ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.password?.[0] ||
        'Erreur lors de l\'inscription. Vérifiez vos informations.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px-64px)] md:min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8 bg-gradient-to-br from-primary-50 to-gray-100">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500 shadow-floating mb-3">
            <img src="/images/logo.png" alt="BusinessBuy" className="h-10 w-10 rounded-xl" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Inscription</h1>
          <p className="text-gray-500 text-sm mt-1">Créez votre compte gratuitement</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 md:p-8">
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-danger-50 border border-danger-200 text-danger-700 text-sm">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User type selector */}
            <div>
              <label className="label">Je suis *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, user_type: 'acheteur' })}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    formData.user_type === 'acheteur'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-semibold">Acheteur</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, user_type: 'vendeur' })}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    formData.user_type === 'vendeur'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-semibold">Vendeur</span>
                </button>
              </div>
            </div>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Prénom *</label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Prénom" required className="input" />
              </div>
              <div>
                <label className="label">Nom *</label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Nom" required className="input" />
              </div>
            </div>

            <div>
              <label className="label">Nom d'utilisateur *</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Nom d'utilisateur unique" required autoComplete="username" className="input" />
            </div>

            <div>
              <label className="label">Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="votre@email.com" required autoComplete="email" className="input" />
            </div>

            <div>
              <label className="label">Téléphone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="20 123 456" className="input" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Mot de passe *</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min 8 caractères" required autoComplete="new-password" minLength="8" className="input" />
              </div>
              <div>
                <label className="label">Confirmer *</label>
                <input type="password" name="password2" value={formData.password2} onChange={handleChange} placeholder="Retapez" required autoComplete="new-password" className="input" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Inscription...
                </>
              ) : 'S\'inscrire'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
