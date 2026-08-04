import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import entrepriseService from '../services/entrepriseService';

function Comparateur() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    loadEntreprises();
  }, [searchParams]);

  const loadEntreprises = async () => {
    try {
      setLoading(true);
      // Récupérer les slugs depuis les paramètres URL
      const slugs = searchParams.get('slugs');

      if (!slugs) {
        setError('Aucune entreprise à comparer');
        setLoading(false);
        return;
      }

      const slugList = slugs.split(',').filter(s => s.trim());

      if (slugList.length < 2) {
        setError('Veuillez sélectionner au moins 2 entreprises à comparer');
        setLoading(false);
        return;
      }

      if (slugList.length > 4) {
        setError('Vous pouvez comparer jusqu\'à 4 entreprises maximum');
        setLoading(false);
        return;
      }

      // Charger les entreprises depuis PostgreSQL
      const entreprisesPromises = slugList.map(slug =>
        entrepriseService.getEntreprise(slug).catch(err => {
          console.error(`Erreur pour ${slug}:`, err);
          return null;
        })
      );

      const entreprisesData = await Promise.all(entreprisesPromises);
      const validEntreprises = entreprisesData.filter(e => e !== null);

      if (validEntreprises.length === 0) {
        setError('Aucune entreprise trouvée');
      } else {
        setEntreprises(validEntreprises);
      }
    } catch (err) {
      console.error('Erreur chargement:', err);
      setError('Erreur lors du chargement des entreprises');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Non renseigné';
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND'
    }).format(price);
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return 'Non renseigné';
    return new Intl.NumberFormat('fr-TN').format(num);
  };

  const getLogoUrl = (entreprise) => {
    const logo = entreprise.images?.find(img => img.is_logo);
    return logo?.image_url || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin w-10 h-10 text-primary-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 font-medium">Chargement de la comparaison...</p>
        </div>
      </div>
    );
  }

  if (error || entreprises.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card text-center">
            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-gray-700 mb-6">{error || 'Aucune entreprise trouvée'}</p>
            <button onClick={() => navigate(-1)} className="btn-secondary">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusBadgeClass = (statut) => {
    switch (statut) {
      case 'publie':
      case 'active':
        return 'badge-success';
      case 'en_attente':
      case 'pending':
        return 'badge-warning';
      case 'rejete':
      case 'vendu':
        return 'badge-danger';
      default:
        return 'badge-primary';
    }
  };

  const rows = [
    {
      icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>),
      label: 'Prix demandé',
      render: (e) => formatPrice(e.prix),
      highlight: true,
    },
    {
      icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>),
      label: 'Secteur d\'activité',
      render: (e) => e.secteur_display,
    },
    {
      icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>),
      label: 'Localisation',
      render: (e) => `${e.region_display}, ${e.ville}`,
    },
    {
      icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>),
      label: 'Chiffre d\'affaires',
      render: (e) => formatPrice(e.chiffre_affaires),
    },
    {
      icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>),
      label: 'Résultat net',
      render: (e) => formatPrice(e.resultat_net),
    },
    {
      icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>),
      label: 'Employés',
      render: (e) => formatNumber(e.nombre_employes),
    },
    {
      icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>),
      label: 'Année de création',
      render: (e) => e.annee_creation || 'Non renseigné',
    },
    {
      icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>),
      label: 'Surface (m²)',
      render: (e) => formatNumber(e.surface_m2),
    },
    {
      icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>),
      label: 'Type de transaction',
      render: (e) => e.type_transaction_display,
    },
    {
      icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
      label: 'Statut',
      render: (e) => (
        <span className={statusBadgeClass(e.statut)}>
          {e.statut_display}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="page-header">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-primary-100 hover:text-white mb-3 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>
          <h1>Comparaison d'entreprises</h1>
          <p>Comparez {entreprises.length} entreprises côte à côte</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="overflow-x-auto rounded-2xl bg-white shadow-card border border-gray-100">
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10 min-w-[200px]">
                  Critères
                </th>
                {entreprises.map((entreprise) => (
                  <th key={entreprise.id} className="p-4 text-center min-w-[200px] align-top">
                    {getLogoUrl(entreprise) && (
                      <img
                        src={getLogoUrl(entreprise)}
                        alt={entreprise.nom}
                        className="w-16 h-16 mx-auto mb-3 object-cover rounded-xl border border-gray-200"
                      />
                    )}
                    <h3 className="text-base font-bold text-gray-900 mb-3">{entreprise.nom}</h3>
                    <button
                      onClick={() => navigate(`/entreprises/${entreprise.slug}`)}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Voir détails
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 1 ? 'bg-gray-50' : ''}>
                  <td className="p-4 font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-primary-500">{row.icon}</span>
                      <span>{row.label}</span>
                    </div>
                  </td>
                  {entreprises.map((e) => (
                    <td
                      key={e.id}
                      className={`p-4 text-center ${row.highlight ? 'bg-primary-50 font-bold text-primary-700' : 'text-gray-700'}`}
                    >
                      {row.render(e)}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Actions row */}
              <tr>
                <td className="p-4 font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10">Actions</td>
                {entreprises.map((e) => (
                  <td key={e.id} className="p-4 text-center">
                    <button
                      onClick={() => navigate(`/entreprises/${e.slug}`)}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Voir l'annonce
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Comparateur;
