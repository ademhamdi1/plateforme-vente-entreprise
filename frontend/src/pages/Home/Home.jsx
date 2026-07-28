import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EntrepriseService from '../../services/entreprise.service';
import './Home.css';

const Home = () => {
  const [featuredEntreprises, setFeaturedEntreprises] = useState([]);
  const [recentEntreprises, setRecentEntreprises] = useState([]);
  const [stats, setStats] = useState({
    totalEntreprises: 0,
    totalUsers: 0,
    totalTransactions: 0,
    sectorsCount: 12
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Featured entreprises
      const featured = await EntrepriseService.getAll({ est_mise_en_avant: true, limit: 6 });
      setFeaturedEntreprises(featured.results || featured);

      // Recent entreprises
      const recent = await EntrepriseService.getAll({ limit: 8, ordering: '-created_at' });
      setRecentEntreprises(recent.results || recent);

      // Stats
      const allData = await EntrepriseService.getAll({});
      setStats({
        totalEntreprises: allData.count || (Array.isArray(allData) ? allData.length : 0),
        totalUsers: 150, // Placeholder
        totalTransactions: 45, // Placeholder
        sectorsCount: 12
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <img src="/images/logo.png" alt="BusinessBuy" className="hero-logo" />
          <h1>Trouvez l'entreprise idéale en Tunisie</h1>
          <p>
            La première plateforme tunisienne pour acheter, vendre et trouver 
            des investisseurs pour votre entreprise. Rejoignez des centaines d'entrepreneurs !
          </p>
          <div className="hero-buttons">
            <Link to="/entreprises" className="btn btn-primary">
              Parcourir les entreprises
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Créer un compte gratuitement
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Rechercher une entreprise, secteur, région..."
              className="search-input"
            />
            <Link to="/entreprises" className="btn btn-primary">Rechercher</Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>Explorez par secteur</h2>
          <div className="categories-quick-grid">
            <Link to="/categories?secteur=informatique" className="category-quick-card">
              <span className="category-quick-icon">💻</span>
              <span>Informatique</span>
            </Link>
            <Link to="/categories?secteur=commerce" className="category-quick-card">
              <span className="category-quick-icon">🛒</span>
              <span>Commerce</span>
            </Link>
            <Link to="/categories?secteur=tourisme" className="category-quick-card">
              <span className="category-quick-icon">🏨</span>
              <span>Tourisme</span>
            </Link>
            <Link to="/categories?secteur=sante" className="category-quick-card">
              <span className="category-quick-icon">🏥</span>
              <span>Santé</span>
            </Link>
            <Link to="/categories?secteur=industrie" className="category-quick-card">
              <span className="category-quick-icon">🏭</span>
              <span>Industrie</span>
            </Link>
            <Link to="/categories?secteur=services" className="category-quick-card">
              <span className="category-quick-icon">💼</span>
              <span>Services</span>
            </Link>
          </div>
          <div className="view-all">
            <Link to="/categories" className="btn btn-secondary">
              Voir toutes les catégories →
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.totalEntreprises}+</div>
              <div className="stat-label">Entreprises disponibles</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalUsers}+</div>
              <div className="stat-label">Utilisateurs actifs</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalTransactions}+</div>
              <div className="stat-label">Transactions réussies</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.sectorsCount}</div>
              <div className="stat-label">Secteurs d'activité</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Entreprises */}
      <section className="featured-section">
        <div className="container">
          <h2>Entreprises en vedette</h2>
          {loading ? (
            <p className="loading">Chargement des entreprises...</p>
          ) : (
            <div className="entreprise-grid">
              {featuredEntreprises.map((entreprise) => (
                <div key={entreprise.id} className="entreprise-card">
                  {entreprise.logo && (
                    <img src={entreprise.logo} alt={entreprise.nom} />
                  )}
                  <div>
                    <h3>{entreprise.nom}</h3>
                    <p className="region">{entreprise.region} - {entreprise.ville}</p>
                    <p className="price">{Number(entreprise.prix_demande).toLocaleString()} TND</p>
                    <Link to={`/entreprises/${entreprise.slug}`} className="btn btn-primary">
                      Voir les détails →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="view-all">
            <Link to="/entreprises" className="btn btn-secondary btn-large">
              Voir toutes les entreprises
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Entreprises */}
      <section className="recent-section">
        <div className="container">
          <h2>Récemment publiées</h2>
          {loading ? (
            <p className="loading">Chargement...</p>
          ) : (
            <div className="entreprise-grid">
              {recentEntreprises.slice(0, 4).map((entreprise) => (
                <div key={entreprise.id} className="entreprise-card">
                  <h3>{entreprise.nom}</h3>
                  <p className="region">{entreprise.region} - {entreprise.ville}</p>
                  <p className="description">{entreprise.description?.substring(0, 80)}...</p>
                  <p className="price">{Number(entreprise.prix_demande).toLocaleString()} TND</p>
                  <Link to={`/entreprises/${entreprise.slug}`} className="btn btn-primary">
                    Voir détails
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2>Ce que disent nos clients</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p className="testimonial-text">
                "J'ai vendu mon restaurant en seulement 3 semaines grâce à cette plateforme. 
                Service professionnel et accompagnement exceptionnel!"
              </p>
              <div className="testimonial-author">
                <strong>Mohamed Ben Ali</strong>
                <span>Propriétaire de restaurant, Tunis</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p className="testimonial-text">
                "Plateforme intuitive et sécurisée. J'ai trouvé l'entreprise parfaite pour mon 
                investissement. Je recommande vivement!"
              </p>
              <div className="testimonial-author">
                <strong>Leila Jmal</strong>
                <span>Investisseur, Sousse</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p className="testimonial-text">
                "Interface moderne et simple. Les filtres de recherche m'ont aidé à trouver 
                exactement ce que je cherchais dans mon secteur."
              </p>
              <div className="testimonial-author">
                <strong>Karim Sassi</strong>
                <span>Entrepreneur, Sfax</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Pourquoi nous choisir ?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <p><strong>100% Sécurisé</strong><br/>Transactions et données protégées avec chiffrement SSL</p>
            </div>
            <div className="feature-card">
              <p><strong>Recherche Ciblée</strong><br/>Filtres avancés par secteur, région et budget</p>
            </div>
            <div className="feature-card">
              <p><strong>Professionnel</strong><br/>Environnement business de qualité certifié</p>
            </div>
            <div className="feature-card">
              <p><strong>Support 24/7</strong><br/>Accompagnement personnalisé à chaque étape</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
