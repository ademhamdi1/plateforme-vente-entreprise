import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <img src="/images/logo.png" alt="BusinessBuy" className="footer-logo" />
            <p>
              La première plateforme tunisienne de référence pour l'achat, 
              la vente et la recherche d'investisseurs pour tous types d'entreprises.
            </p>
          </div>

          <div className="footer-section">
            <h4>Navigation</h4>
            <ul>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/entreprises">Entreprises</Link></li>
              <li><Link to="/about">À propos</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Pour les utilisateurs</h4>
            <ul>
              <li><Link to="/register">Créer un compte</Link></li>
              <li><Link to="/login">Se connecter</Link></li>
              <li><Link to="/dashboard">Tableau de bord</Link></li>
              <li><Link to="/entreprises/create">Publier une entreprise</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Légal</h4>
            <ul>
              <li><Link to="/terms">Conditions d'utilisation</Link></li>
              <li><Link to="/privacy">Politique de confidentialité</Link></li>
              <li><Link to="/cookies">Politique des cookies</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: contact@entreprises.tn</p>
            <p>Tél: +216 71 123 456</p>
            <p>Adresse: Tunis, Tunisie</p>
            <p>Horaires: Lun-Ven 9h-18h</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 BusinessBuy. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
