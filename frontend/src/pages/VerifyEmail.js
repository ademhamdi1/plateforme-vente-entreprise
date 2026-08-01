import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

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
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          {status === 'loading' && (
            <>
              <div className="verification-icon">⏳</div>
              <h1>Vérification en cours...</h1>
              <p>Veuillez patienter</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="verification-icon success">✅</div>
              <h1>Email vérifié !</h1>
              <p className="success">{message}</p>
              <p>Redirection vers la connexion...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="verification-icon error">❌</div>
              <h1>Erreur de vérification</h1>
              <p className="error">{message}</p>
              <button
                className="btn btn-primary btn-block"
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
