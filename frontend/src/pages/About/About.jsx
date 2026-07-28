import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <h1>À propos d'Entreprises Platform</h1>
        
        <section className="about-section">
          <h2>Notre Mission</h2>
          <p>
            Entreprises Platform est la première plateforme tunisienne dédiée à la mise en relation 
            entre vendeurs et acheteurs d'entreprises. Notre mission est de créer un marché digital 
            sécurisé permettant aux propriétaires d'entreprises de publier leurs sociétés à vendre 
            et aux investisseurs ou entrepreneurs de rechercher des opportunités d'acquisition selon 
            différents critères.
          </p>
        </section>

        <section className="about-section">
          <h2>Notre Vision</h2>
          <p>
            Devenir la référence incontournable pour toutes les transactions d'entreprises en Tunisie, 
            en offrant un environnement professionnel, sécurisé et transparent aux entrepreneurs, 
            investisseurs et sociétés de conseil.
          </p>
        </section>

        <section className="about-section">
          <h2>Nos Valeurs</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Sécurité</h3>
              <p>Protection maximale des données et des transactions</p>
            </div>
            <div className="value-card">
              <h3>Transparence</h3>
              <p>Information claire et complète pour tous</p>
            </div>
            <div className="value-card">
              <h3>Efficacité</h3>
              <p>Processus rapide et simplifié</p>
            </div>
            <div className="value-card">
              <h3>Professionnalisme</h3>
              <p>Service de haute qualité certifié</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>En Chiffres</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-number">150+</div>
              <div className="stat-label">Entreprises disponibles</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">250+</div>
              <div className="stat-label">Utilisateurs actifs</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">45+</div>
              <div className="stat-label">Transactions réussies</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">12</div>
              <div className="stat-label">Secteurs couverts</div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Pourquoi Nous Choisir ?</h2>
          <ul className="benefits-list">
            <li>Plateforme 100% tunisienne adaptée au marché local</li>
            <li>Interface intuitive et moderne</li>
            <li>Filtres de recherche avancés</li>
            <li>Messagerie sécurisée intégrée</li>
            <li>Confidentialité des informations sensibles</li>
            <li>Support client réactif et professionnel</li>
            <li>Processus de validation rigoureux</li>
            <li>Plans d'abonnement flexibles</li>
          </ul>
        </section>

        <section className="about-section cta-section">
          <h2>Prêt à commencer ?</h2>
          <p>Rejoignez des centaines d'entrepreneurs qui nous font confiance</p>
          <div className="cta-buttons">
            <a href="/register" className="btn btn-primary btn-large">
              Créer un compte gratuitement
            </a>
            <a href="/contact" className="btn btn-secondary btn-large">
              Nous contacter
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
