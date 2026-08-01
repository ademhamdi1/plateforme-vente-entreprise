import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <div className="container">
        <div className="hero-section">
          <h1>🏢 À Propos d'Entreprises TN</h1>
          <p className="hero-subtitle">
            La première plateforme tunisienne dédiée à l'achat et la vente d'entreprises
          </p>
        </div>

        <div className="content-section">
          <div className="section">
            <h2>Notre Mission</h2>
            <p>
              Entreprises TN a pour mission de faciliter la transmission d'entreprises en Tunisie 
              en créant un marché digital sécurisé et transparent. Nous mettons en relation les 
              propriétaires d'entreprises souhaitant vendre avec des investisseurs et entrepreneurs 
              à la recherche d'opportunités d'acquisition.
            </p>
          </div>

          <div className="section">
            <h2>Pourquoi Choisir Entreprises TN ?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Sécurité</h3>
                <p>
                  Plateforme sécurisée avec validation des annonces et protection des données sensibles
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3>Ciblage Précis</h3>
                <p>
                  Filtres avancés pour trouver exactement ce que vous cherchez selon vos critères
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💬</div>
                <h3>Communication Directe</h3>
                <p>
                  Messagerie intégrée pour échanger directement avec les vendeurs ou acheteurs
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Transparence</h3>
                <p>
                  Informations détaillées sur chaque entreprise avec données financières vérifiées
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔔</div>
                <h3>Alertes Personnalisées</h3>
                <p>
                  Recevez des notifications pour les nouvelles opportunités qui vous intéressent
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⭐</div>
                <h3>Mise en Avant</h3>
                <p>
                  Options premium pour maximiser la visibilité de votre entreprise
                </p>
              </div>
            </div>
          </div>

          <div className="section">
            <h2>Nos Secteurs</h2>
            <p>Nous couvrons tous les secteurs d'activité en Tunisie :</p>
            <div className="secteurs-list">
              <span className="secteur-tag">🏭 Industrie</span>
              <span className="secteur-tag">🌾 Agriculture</span>
              <span className="secteur-tag">💼 Services</span>
              <span className="secteur-tag">🛒 Commerce</span>
              <span className="secteur-tag">🏨 Tourisme & Hôtellerie</span>
              <span className="secteur-tag">🚚 Transport & Logistique</span>
              <span className="secteur-tag">⚕️ Santé</span>
              <span className="secteur-tag">💻 Technologies</span>
              <span className="secteur-tag">🎓 Éducation</span>
              <span className="secteur-tag">🏗️ BTP & Construction</span>
              <span className="secteur-tag">🔗 Franchise</span>
              <span className="secteur-tag">🚀 Startups</span>
            </div>
          </div>

          <div className="section">
            <h2>Comment Ça Marche ?</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Inscription</h3>
                <p>Créez votre compte vendeur ou acheteur en quelques minutes</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>Publication / Recherche</h3>
                <p>Publiez votre entreprise ou recherchez des opportunités</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Échange</h3>
                <p>Communiquez directement via notre messagerie sécurisée</p>
              </div>
              <div className="step-card">
                <div className="step-number">4</div>
                <h3>Transaction</h3>
                <p>Finalisez votre transaction en toute sécurité</p>
              </div>
            </div>
          </div>

          <div className="cta-section">
            <h2>Prêt à Commencer ?</h2>
            <p>Rejoignez des centaines d'entrepreneurs et investisseurs sur notre plateforme</p>
            <div className="cta-buttons">
              <button className="btn btn-primary" onClick={() => navigate('/register')}>
                Créer un compte
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/entreprises')}>
                Voir les opportunités
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
