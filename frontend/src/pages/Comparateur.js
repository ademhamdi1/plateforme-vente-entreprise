import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import entrepriseService from '../services/entrepriseService';
import './Comparateur.css';

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
      <div className="comparateur-container">
        <div className="loading">Chargement de la comparaison...</div>
      </div>
    );
  }

  if (error || entreprises.length === 0) {
    return (
      <div className="comparateur-container">
        <div className="error-message">{error || 'Aucune entreprise trouvée'}</div>
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Retour
        </button>
      </div>
    );
  }

  return (
    <div className="comparateur-container">
      <div className="comparateur-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Retour
        </button>
        <h1>Comparaison d'entreprises</h1>
        <p>Comparez {entreprises.length} entreprises côte à côte</p>
      </div>

      <div className="comparateur-scroll">
        <table className="comparateur-table">
          <thead>
            <tr>
              <th className="criteria-column">Critères</th>
              {entreprises.map((entreprise) => (
                <th key={entreprise.id} className="entreprise-column">
                  {getLogoUrl(entreprise) && (
                    <img
                      src={getLogoUrl(entreprise)}
                      alt={entreprise.nom}
                      className="entreprise-logo"
                    />
                  )}
                  <h3>{entreprise.nom}</h3>
                  <button
                    onClick={() => navigate(`/entreprises/${entreprise.slug}`)}
                    className="view-detail-btn"
                  >
                    Voir détails
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Prix */}
            <tr>
              <td className="criteria-label">💰 Prix demandé</td>
              {entreprises.map((e) => (
                <td key={e.id} className="value-cell highlight">
                  {formatPrice(e.prix)}
                </td>
              ))}
            </tr>

            {/* Secteur */}
            <tr className="row-alt">
              <td className="criteria-label">🏢 Secteur d'activité</td>
              {entreprises.map((e) => (
                <td key={e.id} className="value-cell">
                  {e.secteur_display}
                </td>
              ))}
            </tr>

            {/* Région */}
            <tr>
              <td className="criteria-label">📍 Localisation</td>
              {entreprises.map((e) => (
                <td key={e.id} className="value-cell">
                  {e.region_display}, {e.ville}
                </td>
              ))}
            </tr>

            {/* Chiffre d'affaires */}
            <tr className="row-alt">
              <td className="criteria-label">📊 Chiffre d'affaires</td>
              {entreprises.map((e) => (
                <td key={e.id} className="value-cell">
                  {formatPrice(e.chiffre_affaires)}
                </td>
              ))}
            </tr>

            {/* Résultat net */}
            <tr>
              <td className="criteria-label">💵 Résultat net</td>
              {entreprises.map((e) => (
                <td key={e.id} className="value-cell">
                  {formatPrice(e.resultat_net)}
                </td>
              ))}
            </tr>

            {/* Nombre d'employés */}
            <tr className="row-alt">
              <td className="criteria-label">👥 Employés</td>
              {entreprises.map((e) => (
                <td key={e.id} className="value-cell">
                  {formatNumber(e.nombre_employes)}
                </td>
              ))}
            </tr>

            {/* Année de création */}
            <tr>
              <td className="criteria-label">📅 Année de création</td>
              {entreprises.map((e) => (
                <td key={e.id} className="value-cell">
                  {e.annee_creation || 'Non renseigné'}
                </td>
              ))}
            </tr>

            {/* Surface */}
            <tr className="row-alt">
              <td className="criteria-label">📏 Surface (m²)</td>
              {entreprises.map((e) => (
                <td key={e.id} className="value-cell">
                  {formatNumber(e.surface_m2)}
                </td>
              ))}
            </tr>

            {/* Type de transaction */}
            <tr>
              <td className="criteria-label">🔄 Type de transaction</td>
              {entreprises.map((e) => (
                <td key={e.id} className="value-cell">
                  {e.type_transaction_display}
                </td>
              ))}
            </tr>

            {/* Statut */}
            <tr className="row-alt">
              <td className="criteria-label">✅ Statut</td>
              {entreprises.map((e) => (
                <td key={e.id} className="value-cell">
                  <span className={`status-badge ${e.statut}`}>
                    {e.statut_display}
                  </span>
                </td>
              ))}
            </tr>

            {/* Actions */}
            <tr>
              <td className="criteria-label">Actions</td>
              {entreprises.map((e) => (
                <td key={e.id} className="value-cell">
                  <button
                    onClick={() => navigate(`/entreprises/${e.slug}`)}
                    className="action-btn primary"
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
  );
}

export default Comparateur;
