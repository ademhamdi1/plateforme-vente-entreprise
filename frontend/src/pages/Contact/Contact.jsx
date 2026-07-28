import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simuler l'envoi du message
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message envoyé avec succès! Nous vous répondrons bientôt.');
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: ''
      });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        <h1>Contactez-nous</h1>
        <p className="subtitle">Notre équipe est là pour répondre à toutes vos questions</p>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Informations de contact</h2>
            
            <div className="info-card">
              <div className="info-icon"></div>
              <div>
                <h3>Email</h3>
                <p>contact@entreprises.tn</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon"></div>
              <div>
                <h3>Téléphone</h3>
                <p>+216 71 123 456</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon"></div>
              <div>
                <h3>Adresse</h3>
                <p>123 Avenue de la République<br/>Tunis 1000, Tunisie</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon"></div>
              <div>
                <h3>Horaires</h3>
                <p>Lundi - Vendredi: 9h - 18h<br/>Samedi: 9h - 13h</p>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Envoyez-nous un message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Nom complet *</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  placeholder="Votre nom et prénom"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="votre.email@exemple.com"
                />
              </div>

              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="+216 XX XXX XXX"
                />
              </div>

              <div className="form-group">
                <label>Sujet *</label>
                <select
                  name="sujet"
                  value={formData.sujet}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="question_generale">Question générale</option>
                  <option value="support_technique">Support technique</option>
                  <option value="abonnement">Abonnement et tarification</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="reclamation">Réclamation</option>
                  <option value="partenariat">Opportunité de partenariat</option>
                </select>
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Décrivez votre demande en détail..."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
                {loading ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
