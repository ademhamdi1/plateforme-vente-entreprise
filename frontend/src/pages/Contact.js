import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { envoyerMessageContact } from '../services/contactService';
import './Contact.css';

function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.nom || !formData.email || !formData.message) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSending(true);

    try {
      // Envoyer le message au backend (sauvegardé dans PostgreSQL)
      await envoyerMessageContact(formData);
      
      setSuccess(true);
      setFormData({ nom: '', email: '', sujet: '', message: '' });
      
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
      console.error('Erreur envoi contact:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-hero">
          <h1>📧 Contactez-nous</h1>
          <p>Une question ? Une suggestion ? N'hésitez pas à nous contacter</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Adresse</h3>
              <p>Tunis, Tunisie</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3>Email</h3>
              <p>contact@entreprises-tn.com</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>Téléphone</h3>
              <p>+216 XX XXX XXX</p>
            </div>

            <div className="info-card">
              <div className="info-icon">⏰</div>
              <h3>Horaires</h3>
              <p>Lun - Ven: 9h00 - 18h00</p>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Envoyez-nous un message</h2>
            
            {success && (
              <div className="alert alert-success">
                ✅ Votre message a été envoyé avec succès! Nous vous répondrons dans les plus brefs délais.
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="nom">Nom complet *</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="sujet">Sujet</label>
                <select
                  id="sujet"
                  name="sujet"
                  value={formData.sujet}
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="question">Question générale</option>
                  <option value="support">Support technique</option>
                  <option value="abonnement">Abonnement</option>
                  <option value="partenariat">Partenariat</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Votre message..."
                  rows="6"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={sending}
              >
                {sending ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          </div>
        </div>

        <div className="faq-link">
          <p>Vous cherchez une réponse rapide ?</p>
          <button className="btn btn-secondary" onClick={() => navigate('/faq')}>
            Consultez notre FAQ
          </button>
        </div>
      </div>
    </div>
  );
}

export default Contact;
