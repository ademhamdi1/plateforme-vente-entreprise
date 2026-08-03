import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
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
    try {
      await authService.login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Erreur de connexion. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px-64px)] md:min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8 bg-gradient-to-br from-primary-50 to-gray-100">
      <div className="w-full max-w-md">
        {/* Logo header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500 shadow-floating mb-3">
            <img src="/images/logo.png" alt="BusinessBuy" className="h-10 w-10 rounded-xl" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Connexion</h1>
          <p className="text-gray-500 text-sm mt-1">Accédez à votre compte</p>
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
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre.email@example.com"
                required
                autoComplete="email"
                className="input"
              />
            </div>

            <div>
              <label className="label">Mot de passe</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Votre mot de passe"
                required
                autoComplete="current-password"
                className="input"
              />
              <div className="text-right mt-2">
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Connexion...
                </>
              ) : 'Se connecter'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
