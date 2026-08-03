import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { envoyerMessageContact } from '../services/contactService';

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

  const contactInfo = [
    {
      title: 'Adresse',
      value: 'Tunis, Tunisie',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: 'Email',
      value: 'contact@entreprises-tn.com',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Téléphone',
      value: '+216 XX XXX XXX',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
    {
      title: 'Horaires',
      value: 'Lun - Ven: 9h00 - 18h00',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="page-header">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h1>Contactez-nous</h1>
          </div>
          <p>Une question ? Une suggestion ? N'hésitez pas à nous contacter</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-6">
            {contactInfo.map((info) => (
              <div key={info.title} className="card">
                <div className="w-12 h-12 mb-3 flex items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                  {info.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{info.title}</h3>
                <p className="text-gray-600 text-sm">{info.value}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>

              {success && (
                <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Votre message a été envoyé avec succès! Nous vous répondrons dans les plus brefs délais.</span>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label" htmlFor="nom">Nom complet *</label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    required
                    className="input"
                  />
                </div>

                <div>
                  <label className="label" htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    required
                    className="input"
                  />
                </div>

                <div>
                  <label className="label" htmlFor="sujet">Sujet</label>
                  <select
                    id="sujet"
                    name="sujet"
                    value={formData.sujet}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="question">Question générale</option>
                    <option value="support">Support technique</option>
                    <option value="abonnement">Abonnement</option>
                    <option value="partenariat">Partenariat</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="label" htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Votre message..."
                    rows="6"
                    required
                    className="input resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={sending}
                >
                  {sending ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ link */}
        <div className="mt-12 text-center">
          <p className="text-gray-700 mb-4">Vous cherchez une réponse rapide ?</p>
          <button className="btn-secondary" onClick={() => navigate('/faq')}>
            Consultez notre FAQ
          </button>
        </div>
      </div>
    </div>
  );
}

export default Contact;
