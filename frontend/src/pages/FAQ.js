import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FAQ() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      category: 'Général',
      questions: [
        {
          q: 'Qu\'est-ce qu\'Entreprises TN ?',
          a: 'Entreprises TN est la première plateforme tunisienne dédiée à l\'achat et la vente d\'entreprises. Nous mettons en relation vendeurs et acheteurs dans un environnement sécurisé et transparent.'
        },
        {
          q: 'Comment fonctionne la plateforme ?',
          a: 'Les vendeurs publient leurs entreprises à vendre avec toutes les informations nécessaires. Les acheteurs peuvent rechercher, filtrer et contacter directement les vendeurs via notre messagerie sécurisée.'
        },
        {
          q: 'Est-ce gratuit ?',
          a: 'Nous proposons une offre gratuite limitée à 2 annonces. Des offres Premium et Professionnelle sont disponibles pour plus de fonctionnalités et de visibilité.'
        }
      ]
    },
    {
      category: 'Pour les Vendeurs',
      questions: [
        {
          q: 'Comment publier une entreprise ?',
          a: 'Créez un compte vendeur, remplissez le formulaire de publication avec les détails de votre entreprise (finances, opérations, médias), puis soumettez pour validation. Une fois approuvée, votre annonce sera visible.'
        },
        {
          q: 'Mes informations sont-elles confidentielles ?',
          a: 'Oui! Vous pouvez masquer le nom de votre entreprise et l\'adresse exacte. Seuls les acheteurs sérieux qui vous contactent auront accès aux informations complètes.'
        },
        {
          q: 'Combien de temps prend la validation ?',
          a: 'Notre équipe valide les annonces sous 24-48 heures ouvrables. Vous recevrez une notification par email une fois validée ou si des modifications sont nécessaires.'
        },
        {
          q: 'Puis-je modifier mon annonce après publication ?',
          a: 'Oui, vous pouvez modifier votre annonce à tout moment depuis votre tableau de bord.'
        }
      ]
    },
    {
      category: 'Pour les Acheteurs',
      questions: [
        {
          q: 'Comment rechercher une entreprise ?',
          a: 'Utilisez nos filtres avancés (secteur, région, prix, chiffre d\'affaires, etc.) pour trouver des entreprises qui correspondent à vos critères. Vous pouvez aussi créer des alertes personnalisées.'
        },
        {
          q: 'Qu\'est-ce qu\'une alerte personnalisée ?',
          a: 'Les alertes vous permettent de recevoir des notifications automatiques quand une nouvelle entreprise correspond à vos critères de recherche. Vous pouvez choisir la fréquence (immédiat, quotidien, hebdomadaire).'
        },
        {
          q: 'Comment contacter un vendeur ?',
          a: 'Cliquez sur "Contacter le vendeur" sur la fiche de l\'entreprise. Un système de messagerie sécurisé vous permet d\'échanger directement avec le vendeur.'
        },
        {
          q: 'Puis-je sauvegarder des annonces ?',
          a: 'Oui! Utilisez la fonctionnalité "Favoris" pour sauvegarder les entreprises qui vous intéressent et y accéder rapidement.'
        }
      ]
    },
    {
      category: 'Abonnements',
      questions: [
        {
          q: 'Quels sont les plans disponibles ?',
          a: 'Gratuit (2 annonces), Premium (10 annonces + mise en avant + stats), Professionnel (illimité + badge vérifié + support dédié).'
        },
        {
          q: 'Comment upgrader mon abonnement ?',
          a: 'Rendez-vous dans "Mon Abonnement" depuis votre tableau de bord. Choisissez votre plan et la durée souhaitée.'
        },
        {
          q: 'Puis-je annuler mon abonnement ?',
          a: 'Oui, vous pouvez annuler le renouvellement automatique à tout moment. Votre abonnement restera actif jusqu\'à la fin de la période payée.'
        }
      ]
    },
    {
      category: 'Sécurité & Confidentialité',
      questions: [
        {
          q: 'Comment mes données sont-elles protégées ?',
          a: 'Nous utilisons un chiffrement SSL, des serveurs sécurisés et ne partageons jamais vos données personnelles sans votre consentement.'
        },
        {
          q: 'Les transactions sont-elles sécurisées ?',
          a: 'Les paiements d\'abonnement sont traités de manière sécurisée. Pour les transactions d\'entreprises, nous recommandons de faire appel à des professionnels (avocats, notaires).'
        },
        {
          q: 'Comment signaler une annonce suspecte ?',
          a: 'Contactez-nous immédiatement via la page Contact en précisant le lien de l\'annonce. Nous enquêterons dans les plus brefs délais.'
        }
      ]
    }
  ];

  const toggleQuestion = (catIndex, qIndex) => {
    const index = `${catIndex}-${qIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="page-header">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1>Foire Aux Questions (FAQ)</h1>
          </div>
          <p>Trouvez rapidement des réponses à vos questions</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        {faqData.map((category, catIndex) => (
          <div key={catIndex}>
            <h2 className="text-2xl font-bold text-gray-900 mb-5 pb-2 border-b-2 border-primary-200">
              {category.category}
            </h2>
            <div className="space-y-3">
              {category.questions.map((item, qIndex) => {
                const index = `${catIndex}-${qIndex}`;
                const isOpen = openIndex === index;

                return (
                  <div
                    key={qIndex}
                    className={`bg-white rounded-xl border transition-all duration-200 ${isOpen ? 'border-primary-300 shadow-card' : 'border-gray-200'}`}
                  >
                    <button
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                      onClick={() => toggleQuestion(catIndex, qIndex)}
                    >
                      <span>{item.q}</span>
                      <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full ${isOpen ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {isOpen ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-gray-600 leading-relaxed">
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="card text-center bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Vous ne trouvez pas votre réponse ?</h3>
          <p className="text-gray-700 mb-5">Notre équipe est là pour vous aider</p>
          <button
            className="btn-primary"
            onClick={() => navigate('/contact')}
          >
            Contactez-nous
          </button>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
