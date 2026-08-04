import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import entrepriseService from '../services/entrepriseService';
import { temoignageService } from '../services/temoignageService';

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
  const [secteurCounts, setSecteurCounts] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    secteur: '',
    region: '',
    prix_max: '',
  });

  const isAuthenticated = localStorage.getItem('access_token');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (temoignages.length > 0) {
      const interval = setInterval(() => {
        setCurrentTemoignageIndex((prev) => (prev + 1) % temoignages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [temoignages.length]);

  const loadData = async () => {
    try {
      const entreprises = await entrepriseService.getAll();
      const entreprisesList = Array.isArray(entreprises) ? entreprises : [];
      setRecentEntreprises(entreprisesList.slice(0, 3));

      try {
        const featured = await entrepriseService.getFeatured();
        setFeaturedEntreprises(featured || []);
      } catch (err) {
        console.error('Error loading featured:', err);
        setFeaturedEntreprises([]);
      }

      try {
        const secteurs = await entrepriseService.getSecteurs();
        setSecteurCounts(secteurs || []);
      } catch (err) {
        console.error('Error loading secteurs:', err);
        setSecteurCounts([]);
      }

      try {
        const temoignagesData = await temoignageService.getTemoignagesPublics();
        setTemoignages(temoignagesData || []);
      } catch (err) {
        console.error('Error loading testimonials:', err);
        setTemoignages([]);
      }

      setStats({
        totalEntreprises: entreprisesList.length,
        totalVendeurs: new Set(entreprisesList.map(e => e.vendeur)).size,
        totalAcheteurs: 0,
        regions: 24,
      });
    } catch (err) {
      console.error('Error loading data:', err);
      setRecentEntreprises([]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchFilters({ ...searchFilters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
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
      'industrie': 'Industrie', 'agriculture': 'Agriculture', 'services': 'Services',
      'commerce': 'Commerce', 'tourisme': 'Tourisme', 'transport': 'Transport',
      'sante': 'Santé', 'informatique': 'Informatique', 'education': 'Éducation',
      'btp': 'BTP', 'franchise': 'Franchise', 'startup': 'Startups', 'autre': 'Autres',
    };
    return secteurs[value] || value;
  };

  const secteurs = [
    { value: 'industrie', label: 'Industrie' }, { value: 'agriculture', label: 'Agriculture' },
    { value: 'services', label: 'Services' }, { value: 'commerce', label: 'Commerce' },
    { value: 'tourisme', label: 'Tourisme' }, { value: 'transport', label: 'Transport' },
    { value: 'sante', label: 'Santé' }, { value: 'informatique', label: 'Informatique' },
    { value: 'education', label: 'Éducation' }, { value: 'btp', label: 'BTP' },
    { value: 'franchise', label: 'Franchise' }, { value: 'startup', label: 'Startups' },
    { value: 'autre', label: 'Autres' },
  ];

  const regions = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan',
    'Bizerte', 'Béja', 'Jendouba', 'Le Kef', 'Siliana', 'Sousse',
    'Monastir', 'Mahdia', 'Sfax', 'Kairouan', 'Kasserine', 'Sidi Bouzid',
    'Gabès', 'Médenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kébili',
  ];

  return (
    <div>
      {/* === Hero === */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-20">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            BusinessBuy
          </h1>
          <p className="text-primary-100 text-base md:text-xl max-w-2xl mb-8">
            Première plateforme tunisienne pour acheter, vendre et trouver des investisseurs pour votre entreprise.
          </p>

          {/* Search card */}
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-floating p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select
                name="secteur"
                value={searchFilters.secteur}
                onChange={handleSearchChange}
                className="px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-gray-50"
              >
                <option value="">Tous les secteurs</option>
                {secteurs.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>

              <select
                name="region"
                value={searchFilters.region}
                onChange={handleSearchChange}
                className="px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-gray-50"
              >
                <option value="">Toutes les régions</option>
                {regions.map(r => <option key={r.toLowerCase()} value={r.toLowerCase()}>{r}</option>)}
              </select>

              <input
                type="number"
                name="prix_max"
                value={searchFilters.prix_max}
                onChange={handleSearchChange}
                placeholder="Prix max (TND)"
                className="px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-gray-50"
                min="0"
              />

              <button type="submit" className="btn-primary">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Rechercher
              </button>
            </div>
          </form>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Link to="/entreprises" className="btn-secondary">
              Parcourir les entreprises
            </Link>
            {!isAuthenticated ? (
              <Link to="/register" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-accent-500 text-white font-semibold hover:bg-accent-600 active:scale-95 transition-all">
                Créer un compte
              </Link>
            ) : (
              <Link to="/publier" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-accent-500 text-white font-semibold hover:bg-accent-600 active:scale-95 transition-all">
                Publier une entreprise
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* === Stats === */}
      <section className="bg-gray-50 py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: stats.totalEntreprises, label: 'Entreprises', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
              { num: stats.totalVendeurs, label: 'Vendeurs', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
              { num: '13', label: 'Secteurs', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
              { num: stats.regions, label: 'Régions', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-card border border-gray-100 p-4 md:p-6 text-center">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary-50 text-primary-600 mx-auto mb-2">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-gray-900">{stat.num}</div>
                <div className="text-xs md:text-sm text-gray-500 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Categories === */}
      {secteurCounts.length > 0 && (
        <section className="py-8 md:py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Explorer par secteur</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {secteurCounts.map((s) => (
                <button
                  key={s.secteur}
                  onClick={() => navigate(`/entreprises?secteur=${s.secteur}`)}
                  className="bg-white rounded-xl shadow-card border border-gray-100 p-4 hover:shadow-floating hover:border-primary-200 hover:-translate-y-0.5 transition-all duration-200 text-center group"
                >
                  <div className="text-lg md:text-xl font-extrabold text-primary-600 group-hover:text-primary-700">
                    {s.count}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 font-medium mt-1">
                    {s.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === Featured === */}
      {featuredEntreprises.length > 0 && (
        <section className="py-8 md:py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-6 h-6 text-warning-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Entreprises mises en avant</h2>
            </div>
            <p className="text-gray-500 mb-6 text-sm">Opportunites premium sélectionnées</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredEntreprises.map((entreprise) => (
                <div
                  key={entreprise.id}
                  onClick={() => navigate(`/entreprises/${entreprise.slug}`)}
                  className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 hover:shadow-floating hover:-translate-y-1 transition-all duration-300 cursor-pointer relative"
                >
                  <div className="absolute top-3 right-3 inline-flex items-center px-2 py-0.5 rounded-full bg-warning-100 text-warning-700 text-xs font-bold">
                    Premium
                  </div>
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {entreprise.nom_masque ? 'Confidentiel' : entreprise.nom}
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold">
                      {getSecteurLabel(entreprise.secteur)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {entreprise.description?.substring(0, 120)}...
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {entreprise.region}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {entreprise.nombre_employes} employés
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-lg font-bold text-primary-600">{formatPrice(entreprise.prix_demande)}</span>
                    <span className="text-sm text-primary-600 font-semibold">Découvrir →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === Recent === */}
      {recentEntreprises.length > 0 && (
        <section className="bg-gray-50 py-8 md:py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Récemment publiées</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recentEntreprises.map((entreprise) => (
                <div
                  key={entreprise.id}
                  onClick={() => navigate(`/entreprises/${entreprise.slug}`)}
                  className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 hover:shadow-floating hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      {entreprise.nom_masque ? 'Confidentiel' : entreprise.nom}
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold">
                      {getSecteurLabel(entreprise.secteur)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {entreprise.description?.substring(0, 100)}...
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-lg font-bold text-primary-600">{formatPrice(entreprise.prix_demande)}</span>
                    <span className="text-sm text-primary-600 font-semibold">Voir détails →</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link to="/entreprises" className="btn-secondary">
                Voir toutes les entreprises →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* === Features === */}
      <section className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-8">Pourquoi nous choisir ?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: '100% Sécurisé', desc: 'Transactions et données protégées' },
              { icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', title: 'Recherche Ciblée', desc: 'Filtres avancés par secteur et région' },
              { icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', title: 'Professionnel', desc: 'Environnement business de qualité' },
              { icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z', title: 'Support 24/7', desc: 'Accompagnement personnalisé' },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-card border border-gray-100 p-4 md:p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600 mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm md:text-base">{feature.title}</h3>
                <p className="text-gray-500 text-xs md:text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Testimonials === */}
      {temoignages.length > 0 && (
        <section className="bg-gradient-to-r from-primary-50 to-accent-50 py-8 md:py-12">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-8">Ce que disent nos clients</h2>
            <div className="bg-white rounded-2xl shadow-floating p-6 md:p-8">
              <div className="text-warning-500 text-lg mb-3">
                {temoignages[currentTemoignageIndex]?.etoiles}
              </div>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4 italic">
                "{temoignages[currentTemoignageIndex]?.contenu}"
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold">
                  {temoignages[currentTemoignageIndex]?.utilisateur_nom?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{temoignages[currentTemoignageIndex]?.utilisateur_nom}</p>
                  <p className="text-sm text-gray-500">
                    {temoignages[currentTemoignageIndex]?.user_type === 'vendeur' ? 'Vendeur' : 'Acheteur'}
                    {temoignages[currentTemoignageIndex]?.entreprise_concernee && ` - ${temoignages[currentTemoignageIndex].entreprise_concernee}`}
                  </p>
                </div>
              </div>
            </div>

            {temoignages.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                {temoignages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTemoignageIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentTemoignageIndex ? 'w-8 bg-primary-500' : 'w-2 bg-gray-300'
                    }`}
                    aria-label={`Témoignage ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* === CTA === */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-10 md:py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Prêt à vendre votre entreprise ?</h2>
          <p className="text-primary-100 mb-6">Publiez votre annonce et trouvez des acheteurs qualifiés</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/register" className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-white text-primary-700 font-bold hover:bg-gray-100 active:scale-95 transition-all">
              Commencer maintenant →
            </Link>
            {isAuthenticated && (
              <Link to="/soumettre-avis" className="inline-flex items-center justify-center px-8 py-3 rounded-xl border-2 border-white/40 text-white font-bold hover:bg-white/10 active:scale-95 transition-all">
                Laisser un avis
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
