import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import entrepriseService from '../../services/entreprise.service';
import { toast } from 'react-toastify';
import './Comparison.css';

const Comparison = () => {
  const [searchParams] = useSearchParams();
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const ids = searchParams.get('ids');
    if (!ids) {
      toast.error('Aucune entreprise à comparer');
      navigate('/entreprises');
      return;
    }

    loadEntreprises(ids.split(','));
  }, [searchParams, navigate]);

  const loadEntreprises = async (ids) => {
    try {
      setLoading(true);
      const promises = ids.map(id => 
        entrepriseService.getAll({ id })
      );
      const responses = await Promise.all(promises);
      const entreprisesData = responses.map(r => r.results[0]).filter(Boolean);
      
      if (entreprisesData.length === 0) {
        toast.error('Aucune entreprise trouvée');
        navigate('/entreprises');
        return;
      }

      setEntreprises(entreprisesData);
    } catch (error) {
      console.error('Erreur chargement entreprises:', error);
      toast.error('Erreur lors du chargement des entreprises');
      navigate('/entreprises');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Non spécifié';
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND'
    }).format(price);
  };

  const ComparisonRow = ({ label, getValue }) => (
    <tr>
      <td className="row-label">{label}</td>
      {entreprises.map((entreprise, index) => (
        <td key={index}>{getValue(entreprise)}</td>
      ))}
    </tr>
  );

  if (loading) {
    return (
      <div className="comparison-page">
        <div className="loading">Chargement de la comparaison...</div>
      </div>
    );
  }

  return (
    <div className="comparison-page">
      <div className="comparison-container">
        <div className="comparison-header">
          <h1>Comparaison d'entreprises</h1>
          <p>{entreprises.length} entreprise(s) sélectionnée(s)</p>
          <button onClick={() => navigate('/entreprises')} className="btn-back">
            ← Retour à la liste
          </button>
        </div>

        <div className="comparison-table-container">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="sticky-column">Critère</th>
                {entreprises.map((entreprise, index) => (
                  <th key={index}>
                    <div className="entreprise-header">
                      {entreprise.logo && (
                        <img src={entreprise.logo} alt={entreprise.nom} />
                      )}
                      <h3>{entreprise.nom}</h3>
                      <button
                        onClick={() => navigate(`/entreprises/${entreprise.slug}`)}
                        className="btn-view"
                      >
                        Voir détails
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <ComparisonRow
                label="Prix demandé"
                getValue={(e) => formatPrice(e.prix_demande)}
              />
              <ComparisonRow
                label="Secteur"
                getValue={(e) => e.secteur_display || e.secteur}
              />
              <ComparisonRow
                label="Région"
                getValue={(e) => e.region_display || e.region}
              />
              <ComparisonRow
                label="Ville"
                getValue={(e) => e.ville || 'Non spécifié'}
              />
              <ComparisonRow
                label="Chiffre d'affaires"
                getValue={(e) => e.chiffre_affaires ? formatPrice(e.chiffre_affaires) : 'Non communiqué'}
              />
              <ComparisonRow
                label="Résultat net"
                getValue={(e) => e.resultat_net ? formatPrice(e.resultat_net) : 'Non communiqué'}
              />
              <ComparisonRow
                label="Nombre d'employés"
                getValue={(e) => e.nombre_employes || 'Non spécifié'}
              />
              <ComparisonRow
                label="Année de création"
                getValue={(e) => e.annee_creation || 'Non spécifié'}
              />
              <ComparisonRow
                label="Surface du local"
                getValue={(e) => e.surface_local ? `${e.surface_local} m²` : 'Non spécifié'}
              />
              <ComparisonRow
                label="Type de transaction"
                getValue={(e) => e.type_transaction_display || e.type_transaction}
              />
              <ComparisonRow
                label="Statut"
                getValue={(e) => e.statut_display || e.statut}
              />
              <ComparisonRow
                label="Vues"
                getValue={(e) => e.nombre_vues || 0}
              />
              <ComparisonRow
                label="Date de publication"
                getValue={(e) => e.published_at ? new Date(e.published_at).toLocaleDateString('fr-FR') : 'Non publié'}
              />
            </tbody>
          </table>
        </div>

        <div className="comparison-actions">
          <button onClick={() => navigate('/entreprises')} className="btn-primary">
            Comparer d'autres entreprises
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comparison;
