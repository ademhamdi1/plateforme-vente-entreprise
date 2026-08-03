import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function VerifyEmail() {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    try {
      const response = await api.get(`/users/verify-email/${uidb64}/${token}/`);
      setStatus('success');
      setMessage(response.data.message);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.error || 'Erreur lors de la vérification');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <svg className="w-9 h-9 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Vérification en cours...</h1>
              <p className="text-gray-600">Veuillez patienter</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Email vérifié !</h1>
              <p className="text-green-700 mb-2">{message}</p>
              <p className="text-gray-600 text-sm">Redirection vers la connexion...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-full bg-red-100 text-red-600">
                <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur de vérification</h1>
              <p className="text-red-600 mb-6">{message}</p>
              <button
                className="btn-primary w-full"
                onClick={() => navigate('/login')}
              >
                Retour à la connexion
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
