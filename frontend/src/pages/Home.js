import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import entrepriseService from '../services/entrepriseService';
import { temoignageService } from '../services/temoignageService';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [recentEntreprises, setRecentEntreprises] = useState([]);
  const [featuredEntreprises, setFeaturedEntreprises] = useState([]);
  const [temoignages, setTemoignages] = useState([]);
  const [currentTemoignageIndex, setCurrentTemoignageIndex] = useState(0);
  const [stats, setStats] = useState({
    totalEntreprises: 0,
    totalVendeurs: 0,
    totalAcheteurs: 0,
    regions: 24,
  });
  const [searchFilters, setSearchFilters] = useState({
    secteur: '',
    region: '',
    prix_max: '',
  });

  const isAuthenticated = localStorage.getItem('access_token');

  useEffect(() => {
    loadData();
  }, []);

  // Auto-rotation carousel
  useEffect(() => {
    if (temoignages.length > 0) {
      const interval = setInterval(() => {
        setCurrentTemoignageIndex((prev) => (prev + 1) % temoignages.length);
      }, 5000); // Change every 5 seconds
      return () => clearInterval(interval);
    }
  }, [temoignages.length]);

  const loadData = async () => {
    try {
      // Load recent entreprises from PostgreSQL
      const entreprises = await entrepriseService.getAll();
      // Ensure entreprises is an array
      const entreprisesList = Array.isArray(entreprises) ? entreprises : [];
      // Get 3 most recent
      setRecentEntreprises(entreprisesList.slice(0, 3));
      
      // Load featured entreprises from PostgreSQL
      try {
        const featured = await entrepriseService.getFeatured();
        setFeaturedEntreprises(featured || []);
      } catch (err) {
        console.error('Error loading featured:', err);
        setFeaturedEntreprises([]);
      }
      
      // Load témoignages from PostgreSQL
      try {
        const temoignagesData = await temoignageService.getTemoignagesPublics();
        setTemoignages(temoignagesData || []);
      } catch (err) {
        console.error('Error loading testimonials:', err);
        setTemoignages([]);
      }
      
      // Calculate stats from real data
      setStats({
        totalEntreprises: entreprisesList.length,
        totalVendeurs: new Set(entreprisesList.map(e => e.vendeur)).size,
        totalAcheteurs: 0, // Will be calculated when we have acheteur activity
        regions: 24,
      });
    } catch (err) {
      console.error('Error loading data:', err);
      setRecentEntreprises([]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchFilters({
      ...searchFilters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to liste with filters
    const params = new URLSearchParams();
    if (searchFilters.secteur) params.append('secteur', searchFilters.secteur);
    if (searchFilters.region) params.append('region', searchFilters.region);
    if (searchFilters.prix_max) params.append('prix_max', searchFilters.prix_max);
    navigate(`/entreprises?${params.toString()}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getSecteurLabel = (value) => {
    const secteurs = {
      'industrie': 'Industrie',
      'agriculture': 'Agriculture',
      'services': 'Services',
      'commerce': 'Commerce',
      'tourisme': 'Tourisme',
      'transport': 'Transport',
      'sante': 'Santé',
      'informatique': 'Informatique',
      'education': 'Éducation',
      'btp': 'BTP',
      'franchise': 'Franchise',
      'startup': 'Startups',
      'autre': 'Autres',
    };
    return secteurs[value] || value;
  };

  const secteurs = [
    { value: 'industrie', label: 'Industrie' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'services', label: 'Services' },
    { value: 'commerce', label: 'Commerce' },
    { value: 'tourisme', label: 'Tourisme' },
    { value: 'transport', label: 'Transport' },
    { value: 'sante', label: 'Santé' },
    { value: 'informatique', label: 'Informatique' },
    { value: 'education', label: 'Éducation' },
    { value: 'btp', label: 'BTP' },
    { value: 'franchise', label: 'Franchise' },
    { value: 'startup', label: 'Startups' },
    { value: 'autre', label: 'Autres' },
  ];

  const regions = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan',
    'Bizerte', 'Béja', 'Jendouba', 'Le Kef', 'Siliana', 'Sousse',
    'Monastir', 'Mahdia', 'Sfax', 'Kairouan', 'Kasserine', 'Sidi Bouzid',
    'Gabès', 'Médenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kébili',
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>BusinessBuy</h1>
          <p className="hero-subtitle">
            Première plateforme tunisienne pour acheter, vendre et trouver 
            des investisseurs pour votre entreprise
          </p>

          {/* Search Bar */}
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="search-fields">
              <select
                name="secteur"
                value={searchFilters.secteur}
                onChange={handleSearchChange}
                className="search-input"
              >
                <option value="">Tous les secteurs</option>
                {secteurs.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>

              <select
                name="region"
                value={searchFilters.region}
                onChange={handleSearchChange}
                className="search-input"
              >
                <option value="">Toutes les régions</option>
                {regions.map(r => (
                  <option key={r.toLowerCase()} value={r.toLowerCase()}>{r}</option>
                ))}
              </select>

              <input
                type="number"
                name="prix_max"
                value={searchFilters.prix_max}
                onChange={handleSearchChange}
                placeholder="Prix max (TND)"
                className="search-input"
                min="0"
              />

              <button type="submit" className="btn btn-search">
                🔍 Rechercher
              </button>
            </div>
          </form>

          <div className="hero-buttons">
            <Link to="/entreprises" className="btn btn-primary">
              Parcourir les entreprises
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-secondary">
                Créer un compte
              </Link>
            )}
            {isAuthenticated && (
              <Link to="/publier" className="btn btn-secondary">
                Publier une entreprise
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section - Real data from PostgreSQL */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.totalEntreprises}</div>
              <div className="stat-label">Entreprises</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalVendeurs}</div>
              <div className="stat-label">Vendeurs</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">13</div>
              <div className="stat-label">Secteurs</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.regions}</div>
              <div className="stat-label">Régions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Entreprises - Real data from PostgreSQL */}
      {featuredEntreprises.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <h2>⭐ Entreprises mises en avant</h2>
            <p className="section-subtitle">Opportunités premium sélectionnées</p>
            <div className="featured-grid">
              {featuredEntreprises.map((entreprise) => (
                <div 
                  key={entreprise.id} 
                  className="featured-card"
                  onClick={() => navigate(`/entreprises/${entreprise.slug}`)}
                >
                  <div className="featured-badge">⭐ Premium</div>
                  <div className="featured-header">
                    <h3>{entreprise.nom_masque ? '🔒 Confidentiel' : entreprise.nom}</h3>
                    <span className="featured-sector-badge">{getSecteurLabel(entreprise.secteur)}</span>
                  </div>
                  <p className="featured-description">
                    {entreprise.description.substring(0, 120)}...
                  </p>
                  <div className="featured-details">
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span>{entreprise.region}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">👥</span>
                      <span>{entreprise.nombre_employes} employés</span>
                    </div>
                  </div>
                  <div className="featured-footer">
                    <span className="featured-price">{formatPrice(entreprise.prix_demande)}</span>
                    <span className="featured-link">Découvrir →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Entreprises - Real data from PostgreSQL */}
      {recentEntreprises.length > 0 && (
        <section className="recent-section">
          <div className="container">
            <h2>📌 Entreprises récemment publiées</h2>
            <div className="recent-grid">
              {recentEntreprises.map((entreprise) => (
                <div 
                  key={entreprise.id} 
                  className="recent-card"
                  onClick={() => navigate(`/entreprises/${entreprise.slug}`)}
                >
                  <div className="recent-header">
                    <h3>{entreprise.nom_masque ? '🔒 Confidentiel' : entreprise.nom}</h3>
                    <span className="recent-badge">{getSecteurLabel(entreprise.secteur)}</span>
                  </div>
                  <p className="recent-description">
                    {entreprise.description.substring(0, 100)}...
                  </p>
                  <div className="recent-footer">
                    <span className="recent-price">{formatPrice(entreprise.prix_demande)}</span>
                    <span className="recent-link">Voir détails →</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="recent-cta">
              <Link to="/entreprises" className="btn btn-secondary">
                Voir toutes les entreprises →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Pourquoi nous choisir ?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>100% Sécurisé</h3>
              <p>Transactions et données protégées</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Recherche Ciblée</h3>
              <p>Filtres avancés par secteur et région</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Professionnel</h3>
              <p>Environnement business de qualité</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📞</div>
              <h3>Support 24/7</h3>
              <p>Accompagnement personnalisé</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Data from PostgreSQL */}
      {temoignages.length > 0 && (
        <section className="testimonials-section">
          <div className="container">
            <h2>💬 Ce que disent nos clients</h2>
            <div className="testimonials-carousel">
              <div className="testimonial-card">
                <div className="testimonial-stars">
                  {temoignages[currentTemoignageIndex].etoiles}
                </div>
                <p className="testimonial-text">
                  "{temoignages[currentTemoignageIndex].contenu}"
                </p>
                <div className="testimonial-author">
                  <strong>{temoignages[currentTemoignageIndex].utilisateur_nom}</strong>
                  <span className="testimonial-role">
                    {temoignages[currentTemoignageIndex].user_type === 'vendeur' ? 'Vendeur' : 'Acheteur'}
                  </span>
                  {temoignages[currentTemoignageIndex].entreprise_concernee && (
                    <span className="testimonial-company">
                      {temoignages[currentTemoignageIndex].entreprise_concernee}
                    </span>
                  )}
                </div>
              </div>

              {/* Carousel dots */}
              {temoignages.length > 1 && (
                <div className="testimonial-dots">
                  {temoignages.map((_, index) => (
                    <button
                      key={index}
                      className={`dot ${index === currentTemoignageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentTemoignageIndex(index)}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Prêt à vendre votre entreprise ?</h2>
          <p>Publiez votre annonce et trouvez des acheteurs qualifiés</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-cta">
              Commencer maintenant →
            </Link>
            {isAuthenticated && (
              <Link to="/soumettre-avis" className="btn btn-cta-secondary">
                💬 Laisser un avis
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
