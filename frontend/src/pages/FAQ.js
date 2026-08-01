import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FAQ.css';

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
    <div className="faq-page">
      <div className="container">
        <div className="faq-hero">
          <h1>❓ Foire Aux Questions (FAQ)</h1>
          <p>Trouvez rapidement des réponses à vos questions</p>
        </div>

        <div className="faq-content">
          {faqData.map((category, catIndex) => (
            <div key={catIndex} className="faq-category">
              <h2 className="category-title">{category.category}</h2>
              <div className="questions-list">
                {category.questions.map((item, qIndex) => {
                  const index = `${catIndex}-${qIndex}`;
                  const isOpen = openIndex === index;

                  return (
                    <div
                      key={qIndex}
                      className={`faq-item ${isOpen ? 'open' : ''}`}
                    >
                      <button
                        className="faq-question"
                        onClick={() => toggleQuestion(catIndex, qIndex)}
                      >
                        <span>{item.q}</span>
                        <span className="faq-icon">{isOpen ? '−' : '+'}</span>
                      </button>
                      {isOpen && (
                        <div className="faq-answer">
                          <p>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="faq-cta">
          <h3>Vous ne trouvez pas votre réponse ?</h3>
          <p>Notre équipe est là pour vous aider</p>
          <button
            className="btn btn-primary"
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
