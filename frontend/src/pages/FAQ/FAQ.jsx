import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Questions Générales",
      questions: [
        {
          q: "Qu'est-ce qu'Entreprises Platform ?",
          a: "Entreprises Platform est la première plateforme tunisienne dédiée à la vente et l'achat d'entreprises. Nous mettons en relation vendeurs et acheteurs d'entreprises dans un environnement sécurisé et professionnel."
        },
        {
          q: "Comment fonctionne la plateforme ?",
          a: "Les vendeurs créent un compte, publient une annonce avec les détails de leur entreprise. Les acheteurs peuvent consulter les annonces, filtrer selon leurs critères et contacter directement les vendeurs via notre messagerie sécurisée."
        },
        {
          q: "Est-ce que le service est gratuit ?",
          a: "Oui! Nous offrons un plan gratuit permettant de publier une annonce limitée. Pour plus de visibilité et de fonctionnalités avancées, nous proposons des plans Premium et Professionnel."
        }
      ]
    },
    {
      category: "Pour les Vendeurs",
      questions: [
        {
          q: "Comment publier mon entreprise ?",
          a: "Créez un compte vendeur, cliquez sur 'Publier une entreprise', remplissez le formulaire avec toutes les informations (financières, opérationnelles, etc.), ajoutez des photos et soumettez. Votre annonce sera validée sous 24-48h."
        },
        {
          q: "Quelles informations dois-je fournir ?",
          a: "Nom de l'entreprise, secteur d'activité, localisation, prix demandé, chiffre d'affaires, nombre d'employés, description détaillée. Vous pouvez masquer certaines informations sensibles."
        },
        {
          q: "Puis-je masquer le nom de mon entreprise ?",
          a: "Oui! Nous offrons des options de confidentialité vous permettant de masquer le nom exact, l'adresse précise et d'autres informations sensibles jusqu'au premier contact."
        },
        {
          q: "Combien de temps reste mon annonce en ligne ?",
          a: "Avec le plan gratuit: 30 jours. Avec Premium: 90 jours. Avec Professionnel: illimité jusqu'à la vente."
        }
      ]
    },
    {
      category: "Pour les Acheteurs",
      questions: [
        {
          q: "Comment trouver une entreprise ?",
          a: "Utilisez notre barre de recherche et filtres avancés (secteur, région, prix, CA, nombre d'employés, etc.). Vous pouvez aussi sauvegarder vos recherches et recevoir des alertes."
        },
        {
          q: "Comment contacter un vendeur ?",
          a: "Créez un compte acheteur gratuit, consultez la fiche entreprise et cliquez sur 'Contacter le vendeur'. Envoyez votre message via notre messagerie sécurisée."
        },
        {
          q: "Les informations sont-elles fiables ?",
          a: "Nous vérifions toutes les annonces avant publication. Cependant, nous recommandons toujours de faire votre propre due diligence et de consulter des experts (comptables, avocats) avant toute transaction."
        },
        {
          q: "Puis-je comparer plusieurs entreprises ?",
          a: "Oui! Utilisez la fonction 'Sauvegarder' pour créer une liste de favoris que vous pouvez consulter et comparer à tout moment."
        }
      ]
    },
    {
      category: "Abonnements et Paiement",
      questions: [
        {
          q: "Quels sont les différents plans ?",
          a: "Plan Gratuit (1 annonce, 30 jours), Plan Premium (annonces illimitées, mise en avant, statistiques avancées), Plan Professionnel (tous les avantages + badge vérifié + accompagnement personnalisé)."
        },
        {
          q: "Comment payer mon abonnement ?",
          a: "Nous acceptons les cartes bancaires, virements bancaires et paiement mobile. Le paiement est sécurisé et vos données sont chiffrées."
        },
        {
          q: "Puis-je annuler mon abonnement ?",
          a: "Oui, vous pouvez annuler à tout moment depuis votre tableau de bord. En cas d'annulation, votre plan reste actif jusqu'à la fin de la période payée."
        },
        {
          q: "Y a-t-il une commission sur la vente ?",
          a: "Non! Nous ne prenons aucune commission sur les transactions. Vous payez uniquement l'abonnement de votre choix."
        }
      ]
    },
    {
      category: "Sécurité et Confidentialité",
      questions: [
        {
          q: "Mes données sont-elles sécurisées ?",
          a: "Oui! Nous utilisons le chiffrement SSL, authentification sécurisée et sauvegarde automatique. Vos données personnelles ne sont jamais partagées sans votre consentement."
        },
        {
          q: "Comment gérez-vous la confidentialité ?",
          a: "Vous contrôlez ce que vous partagez. Options de masquage disponibles pour nom, adresse et informations sensibles. Les coordonnées des acheteurs ne sont visibles qu'après un premier contact."
        },
        {
          q: "Que faites-vous contre les fausses annonces ?",
          a: "Validation manuelle de chaque annonce, vérification des documents, système de signalement et modération active. Les fausses annonces sont supprimées et les comptes sanctionnés."
        }
      ]
    }
  ];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  let globalIndex = 0;

  return (
    <div className="faq-page">
      <div className="container">
        <h1>❓ Questions Fréquentes</h1>
        <p className="subtitle">Trouvez rapidement des réponses à vos questions</p>

        <div className="faq-content">
          {faqs.map((category, catIndex) => (
            <div key={catIndex} className="faq-category">
              <h2>{category.category}</h2>
              <div className="faq-list">
                {category.questions.map((faq, qIndex) => {
                  const currentIndex = globalIndex++;
                  const isOpen = openIndex === currentIndex;
                  
                  return (
                    <div key={qIndex} className={`faq-item ${isOpen ? 'open' : ''}`}>
                      <button
                        className="faq-question"
                        onClick={() => toggleQuestion(currentIndex)}
                      >
                        <span>{faq.q}</span>
                        <span className="faq-icon">{isOpen ? '−' : '+'}</span>
                      </button>
                      {isOpen && (
                        <div className="faq-answer">
                          <p>{faq.a}</p>
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
          <h2>Vous ne trouvez pas votre réponse ?</h2>
          <p>Notre équipe est là pour vous aider</p>
          <a href="/contact" className="btn btn-primary btn-large">
            Contactez-nous
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
