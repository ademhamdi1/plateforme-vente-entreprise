import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import faqService from '../services/faqService';

function FAQ() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static fallback data
  const staticFaq = [
    {
      category: 'General',
      questions: [
        { q: "Qu'est-ce que BusinessBuy ?", a: "BusinessBuy est la premiere plateforme tunisienne dediee a l'achat et la vente d'entreprises. Nous mettons en relation vendeurs et acheteurs dans un environnement securise et transparent." },
        { q: 'Comment fonctionne la plateforme ?', a: "Les vendeurs publient leurs entreprises a vendre avec toutes les informations necessaires. Les acheteurs peuvent rechercher, filtrer et contacter directement les vendeurs via notre messagerie securisee." },
        { q: 'Est-ce gratuit ?', a: "Nous proposons une offre gratuite limitee a 2 annonces. Des offres Premium et Professionnelle sont disponibles pour plus de fonctionnalites et de visibilite." },
      ]
    },
    {
      category: 'Vendeurs',
      questions: [
        { q: 'Comment publier une entreprise ?', a: "Creez un compte vendeur, remplissez le formulaire de publication avec les details de votre entreprise, puis soumettez pour validation. Une fois approuvee, votre annonce sera visible." },
        { q: 'Mes informations sont-elles confidentielles ?', a: "Oui! Vous pouvez masquer le nom de votre entreprise et l'adresse exacte. Seuls les acheteurs serieux qui vous contactent auront acces aux informations completes." },
        { q: 'Combien de temps prend la validation ?', a: "Notre equipe valide les annonces sous 24-48 heures ouvrables. Vous recevrez une notification par email une fois validee ou si des modifications sont necessaires." },
        { q: 'Puis-je modifier mon annonce apres publication ?', a: "Oui, vous pouvez modifier votre annonce a tout moment depuis votre tableau de bord." },
      ]
    },
    {
      category: 'Acheteurs',
      questions: [
        { q: 'Comment rechercher une entreprise ?', a: "Utilisez nos filtres avances (secteur, region, prix, chiffre d'affaires, etc.) pour trouver des entreprises qui correspondent a vos criteres." },
        { q: 'Comment contacter un vendeur ?', a: 'Cliquez sur "Contacter le vendeur" sur la fiche de l\'entreprise. Un systeme de messagerie securise vous permet d\'echanger directement avec le vendeur.' },
        { q: 'Puis-je sauvegarder des annonces ?', a: 'Oui! Utilisez la fonctionnalite "Favoris" pour sauvegarder les entreprises qui vous interessent.' },
      ]
    },
    {
      category: 'Abonnements',
      questions: [
        { q: 'Quels sont les plans disponibles ?', a: "Gratuit (2 annonces), Premium (annonces illimitees + mise en avant + stats), Professionnel (illimite + badge verifie + support dedie)." },
        { q: 'Comment upgrader mon abonnement ?', a: 'Rendez-vous dans "Mon Abonnement" depuis votre tableau de bord.' },
        { q: 'Puis-je annuler mon abonnement ?', a: "Oui, vous pouvez annuler le renouvellement automatique a tout moment." },
      ]
    },
    {
      category: 'Securite',
      questions: [
        { q: 'Comment mes donnees sont-elles protegees ?', a: "Nous utilisons un chiffrement SSL, des serveurs securises et ne partageons jamais vos donnees personnelles sans votre consentement." },
        { q: 'Comment signaler une annonce suspecte ?', a: "Contactez-nous immediatement via la page Contact en precisant le lien de l'annonce." },
      ]
    },
  ];

  const categoryLabels = {
    'General': 'General',
    'Vendeurs': 'Pour les Vendeurs',
    'Acheteurs': 'Pour les Acheteurs',
    'Abonnements': 'Abonnements',
    'Securite': 'Securite & Confidentialite',
  };

  useEffect(() => {
    const loadFaq = async () => {
      try {
        const data = await faqService.getAll();
        if (data && data.length > 0) {
          // Group by category
          const grouped = {};
          data.forEach(item => {
            const cat = item.categorie_label || item.categorie || 'General';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push({ q: item.question, a: item.reponse });
          });
          const formatted = Object.keys(grouped).map(cat => ({
            category: categoryLabels[cat] || cat,
            questions: grouped[cat],
          }));
          setFaqData(formatted);
        } else {
          setFaqData(staticFaq);
        }
      } catch (err) {
        console.error('Error loading FAQ:', err);
        setFaqData(staticFaq);
      } finally {
        setLoading(false);
      }
    };
    loadFaq();
  }, []);

  const toggleQuestion = (catIndex, qIndex) => {
    const index = `${catIndex}-${qIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-header">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1>Foire Aux Questions (FAQ)</h1>
          </div>
          <p>Trouvez rapidement des reponses a vos questions</p>
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

        <div className="card text-center bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Vous ne trouvez pas votre reponse ?</h3>
          <p className="text-gray-700 mb-5">Notre equipe est la pour vous aider</p>
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
