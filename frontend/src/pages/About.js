import React from 'react';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Sécurité',
      description: 'Plateforme sécurisée avec validation des annonces et protection des données sensibles',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      title: 'Ciblage Précis',
      description: 'Filtres avancés pour trouver exactement ce que vous cherchez selon vos critères',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: 'Communication Directe',
      description: 'Messagerie intégrée pour échanger directement avec les vendeurs ou acheteurs',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      title: 'Transparence',
      description: 'Informations détaillées sur chaque entreprise avec données financières vérifiées',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: 'Alertes Personnalisées',
      description: 'Recevez des notifications pour les nouvelles opportunités qui vous intéressent',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    {
      title: 'Mise en Avant',
      description: 'Options premium pour maximiser la visibilité de votre entreprise',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
  ];

  const secteurs = [
    'Industrie', 'Agriculture', 'Services', 'Commerce',
    'Tourisme & Hôtellerie', 'Transport & Logistique', 'Santé',
    'Technologies', 'Éducation', 'BTP & Construction', 'Franchise', 'Startups',
  ];

  const steps = [
    { number: '1', title: 'Inscription', description: 'Créez votre compte vendeur ou acheteur en quelques minutes' },
    { number: '2', title: 'Publication / Recherche', description: 'Publiez votre entreprise ou recherchez des opportunités' },
    { number: '3', title: 'Échange', description: 'Communiquez directement via notre messagerie sécurisée' },
    { number: '4', title: 'Transaction', description: 'Finalisez votre transaction en toute sécurité' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-white/20 rounded-2xl">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">À Propos d'Entreprises TN</h1>
          <p className="text-primary-100 text-lg md:text-xl">
            La première plateforme tunisienne dédiée à l'achat et la vente d'entreprises
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Mission */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Notre Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            Entreprises TN a pour mission de faciliter la transmission d'entreprises en Tunisie
            en créant un marché digital sécurisé et transparent. Nous mettons en relation les
            propriétaires d'entreprises souhaitant vendre avec des investisseurs et entrepreneurs
            à la recherche d'opportunités d'acquisition.
          </p>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Pourquoi Choisir Entreprises TN ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card hover:shadow-floating transition-all duration-300">
                <div className="w-14 h-14 mb-4 flex items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Secteurs */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Nos Secteurs</h2>
          <p className="text-gray-700 mb-6">Nous couvrons tous les secteurs d'activité en Tunisie :</p>
          <div className="flex flex-wrap gap-3">
            {secteurs.map((secteur) => (
              <span
                key={secteur}
                className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-primary-700 border border-primary-200 text-sm font-medium"
              >
                {secteur}
              </span>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Comment Ça Marche ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.number} className="card text-center">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary-500 text-white text-xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Prêt à Commencer ?</h2>
          <p className="text-primary-100 mb-6">
            Rejoignez des centaines d'entrepreneurs et investisseurs sur notre plateforme
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="btn-primary bg-white !text-primary-600 hover:!bg-primary-50"
              onClick={() => navigate('/register')}
            >
              Créer un compte
            </button>
            <button
              className="btn-secondary !bg-transparent !text-white !border-white hover:!bg-white/10"
              onClick={() => navigate('/entreprises')}
            >
              Voir les opportunités
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
