import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0); // Scroll vers le haut
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>🏢 Entreprises TN</h3>
            <p className="footer-description">
              La première plateforme tunisienne dédiée à l'achat et la vente d'entreprises.
              Un marché digital sécurisé pour tous les secteurs d'activité.
            </p>
          </div>

          <div className="footer-section">
            <h4>Navigation</h4>
            <ul className="footer-links">
              <li><span onClick={() => handleNavigation('/')} style={{cursor: 'pointer'}}>Accueil</span></li>
              <li><span onClick={() => handleNavigation('/entreprises')} style={{cursor: 'pointer'}}>Entreprises</span></li>
              <li><span onClick={() => handleNavigation('/about')} style={{cursor: 'pointer'}}>À Propos</span></li>
              <li><span onClick={() => handleNavigation('/contact')} style={{cursor: 'pointer'}}>Contact</span></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Ressources</h4>
            <ul className="footer-links">
              <li><span onClick={() => handleNavigation('/actualites')} style={{cursor: 'pointer'}}>Actualités</span></li>
              <li><span onClick={() => handleNavigation('/faq')} style={{cursor: 'pointer'}}>FAQ</span></li>
              <li><span onClick={() => handleNavigation('/abonnement')} style={{cursor: 'pointer'}}>Plans & Tarifs</span></li>
              <li><span onClick={() => handleNavigation('/soumettre-avis')} style={{cursor: 'pointer'}}>Témoignages</span></li>
              <li><span onClick={() => handleNavigation('/register')} style={{cursor: 'pointer'}}>Créer un compte</span></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <ul className="footer-contact">
              <li>📧 contact@entreprises-tn.com</li>
              <li>📞 +216 XX XXX XXX</li>
              <li>📍 Tunis, Tunisie</li>
              <li>⏰ Lun - Ven: 9h00 - 18h00</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Entreprises TN. Tous droits réservés.</p>
          <div className="footer-legal">
            <span onClick={() => handleNavigation('/cgu')} style={{cursor: 'pointer'}}>CGU</span>
            <span className="separator">•</span>
            <span onClick={() => handleNavigation('/politique-confidentialite')} style={{cursor: 'pointer'}}>Confidentialité</span>
            <span className="separator">•</span>
            <span onClick={() => handleNavigation('/mentions-legales')} style={{cursor: 'pointer'}}>Mentions légales</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
