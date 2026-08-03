import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer - Desktop only (hidden on mobile since we have BottomTabBar)
 * Migrated to Tailwind CSS
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  const linkClass = "text-gray-400 hover:text-primary-400 transition-colors text-sm cursor-pointer";

  return (
    <footer className="hidden md:block bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/logo.png" alt="BusinessBuy" className="h-9 w-9 rounded-lg" />
              <span className="text-xl font-extrabold text-white">BusinessBuy</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              La première plateforme tunisienne dédiée à l'achat et la vente d'entreprises.
              Un marché digital sécurisé pour tous les secteurs d'activité.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/" className={linkClass}>Accueil</Link></li>
              <li><Link to="/entreprises" className={linkClass}>Entreprises</Link></li>
              <li><Link to="/about" className={linkClass}>À Propos</Link></li>
              <li><Link to="/contact" className={linkClass}>Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Ressources</h4>
            <ul className="space-y-2">
              <li><Link to="/actualites" className={linkClass}>Actualités</Link></li>
              <li><Link to="/faq" className={linkClass}>FAQ</Link></li>
              <li><Link to="/abonnement" className={linkClass}>Plans & Tarifs</Link></li>
              <li><Link to="/soumettre-avis" className={linkClass}>Témoignages</Link></li>
              <li><Link to="/register" className={linkClass}>Créer un compte</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                contact@entreprises-tn.com
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +216 XX XXX XXX
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Tunis, Tunisie
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">&copy; {currentYear} BusinessBuy. Tous droits réservés.</p>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/cgu" className={linkClass}>CGU</Link>
            <span className="text-gray-600">-</span>
            <Link to="/politique-confidentialite" className={linkClass}>Confidentialité</Link>
            <span className="text-gray-600">-</span>
            <Link to="/mentions-legales" className={linkClass}>Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
