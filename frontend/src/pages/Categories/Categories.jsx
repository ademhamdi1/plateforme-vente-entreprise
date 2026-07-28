import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import EntrepriseService from '../../services/entreprise.service';
import './Categories.css';

const Categories = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const secteurs = [
    { id: 'industrie', nom: 'Industrie', description: 'Entreprises industrielles et manufacturières' },
    { id: 'agriculture', nom: 'Agriculture', description: 'Agriculture, élevage et agro-alimentaire' },
    { id: 'services', nom: 'Services', description: 'Services aux entreprises et particuliers' },
    { id: 'commerce', nom: 'Commerce', description: 'Commerce de détail et de gros' },
    { id: 'tourisme', nom: 'Tourisme et hôtellerie', description: 'Hôtels, restaurants et tourisme' },
    { id: 'transport', nom: 'Transport et logistique', description: 'Transport de marchandises et personnes' },
    { id: 'sante', nom: 'Santé', description: 'Cliniques, pharmacies et services médicaux' },
    { id: 'informatique', nom: 'Informatique et technologie', description: 'IT, software et services numériques' },
    { id: 'education', nom: 'Éducation et formation', description: 'Écoles, centres de formation' },
    { id: 'btp', nom: 'BTP et construction', description: 'Construction et travaux publics' },
    { id: 'franchise', nom: 'Franchise', description: 'Opportunités de franchise' },
    { id: 'startup', nom: 'Startup', description: 'Startups et entreprises innovantes' },
    { id: 'autre', nom: 'Autre', description: 'Autres secteurs d\'activité' },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const counts = {};
      
      // Récupérer le nombre d'entreprises par secteur
      for (const secteur of secteurs) {
        try {
          const data = await EntrepriseService.getAll({ secteur: secteur.id, limit: 1 });
          counts[secteur.id] = data.count || 0;
        } catch (error) {
          counts[secteur.id] = 0;
        }
      }
      
      setStats(counts);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="categories-page">
      <div className="container">
        <div className="categories-header">
          <h1>Toutes les catégories</h1>
          <p className="subtitle">
            Explorez les entreprises à vendre par secteur d'activité
          </p>
        </div>

        {loading ? (
          <p className="loading">Chargement des catégories...</p>
        ) : (
          <div className="categories-grid">
            {secteurs.map((secteur) => (
              <Link
                key={secteur.id}
                to={`/entreprises?secteur=${secteur.id}`}
                className="category-card"
              >
                <h3>{secteur.nom}</h3>
                <p className="category-description">{secteur.description}</p>
                <div className="category-count">
                  {stats[secteur.id] || 0} {stats[secteur.id] > 1 ? 'entreprises' : 'entreprise'}
                </div>
                <div className="category-arrow">→</div>
              </Link>
            ))}
          </div>
        )}

        <div className="cta-section">
          <h2>Vous ne trouvez pas votre secteur ?</h2>
          <p>Contactez-nous pour ajouter votre secteur d'activité</p>
          <Link to="/contact" className="btn btn-primary btn-large">
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Categories;
