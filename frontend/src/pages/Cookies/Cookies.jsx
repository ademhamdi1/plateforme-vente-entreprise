import React from 'react';
import './Cookies.css';

const Cookies = () => {
  return (
    <div className="cookies-page">
      <div className="container">
        <h1>Politique des Cookies</h1>
        <p className="update-date">Dernière mise à jour: 22 Juillet 2026</p>

        <div className="cookies-content">
          <section className="cookies-section">
            <h2>1. Qu'est-ce qu'un cookie?</h2>
            <p>
              Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, smartphone, 
              tablette) lorsque vous visitez un site web. Les cookies permettent au site de mémoriser 
              vos actions et préférences sur une période donnée.
            </p>
            <p>
              Ils sont essentiels au bon fonctionnement de nombreux sites web et améliorent votre 
              expérience de navigation.
            </p>
          </section>

          <section className="cookies-section">
            <h2>2. Pourquoi utilisons-nous des cookies?</h2>
            <p>Nous utilisons des cookies pour:</p>
            <ul>
              <li>Maintenir votre session de connexion</li>
              <li>Mémoriser vos préférences (langue, filtres de recherche)</li>
              <li>Analyser l'utilisation de notre plateforme</li>
              <li>Améliorer nos services</li>
              <li>Assurer la sécurité de votre compte</li>
              <li>Personnaliser le contenu affiché</li>
            </ul>
          </section>

          <section className="cookies-section">
            <h2>3. Types de cookies que nous utilisons</h2>

            <div className="cookie-type">
              <h3>3.1. Cookies strictement nécessaires</h3>
              <p><span className="badge-essential">Essentiels</span></p>
              <p>
                Ces cookies sont indispensables au fonctionnement du site. Sans eux, certaines 
                fonctionnalités ne pourraient pas fonctionner.
              </p>
              <table className="cookie-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Finalité</th>
                    <th>Durée</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>accessToken</code></td>
                    <td>Authentification de l'utilisateur</td>
                    <td>1 heure</td>
                  </tr>
                  <tr>
                    <td><code>refreshToken</code></td>
                    <td>Renouvellement automatique de session</td>
                    <td>7 jours</td>
                  </tr>
                  <tr>
                    <td><code>csrftoken</code></td>
                    <td>Protection contre les attaques CSRF</td>
                    <td>Session</td>
                  </tr>
                  <tr>
                    <td><code>sessionid</code></td>
                    <td>Gestion de la session utilisateur</td>
                    <td>2 semaines</td>
                  </tr>
                </tbody>
              </table>
              <p className="cookie-note">
                Note: Ces cookies ne peuvent pas être désactivés car ils sont nécessaires au fonctionnement du site.
              </p>
            </div>

            <div className="cookie-type">
              <h3>3.2. Cookies analytiques</h3>
              <p><span className="badge-analytics">Analytiques</span></p>
              <p>
                Ces cookies nous aident à comprendre comment les visiteurs utilisent notre site, 
                afin de l'améliorer.
              </p>
              <table className="cookie-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Finalité</th>
                    <th>Durée</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>_ga</code></td>
                    <td>Google Analytics - Distinguer les utilisateurs</td>
                    <td>2 ans</td>
                  </tr>
                  <tr>
                    <td><code>_gid</code></td>
                    <td>Google Analytics - Distinguer les utilisateurs</td>
                    <td>24 heures</td>
                  </tr>
                  <tr>
                    <td><code>_gat</code></td>
                    <td>Google Analytics - Limiter le taux de requêtes</td>
                    <td>1 minute</td>
                  </tr>
                </tbody>
              </table>
              <p className="cookie-note">
                Vous pouvez refuser ces cookies dans les paramètres ci-dessous.
              </p>
            </div>

            <div className="cookie-type">
              <h3>3.3. Cookies fonctionnels</h3>
              <p><span className="badge-functional">Fonctionnels</span></p>
              <p>
                Ces cookies permettent de mémoriser vos choix et de personnaliser votre expérience.
              </p>
              <table className="cookie-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Finalité</th>
                    <th>Durée</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>searchFilters</code></td>
                    <td>Mémoriser vos filtres de recherche</td>
                    <td>30 jours</td>
                  </tr>
                  <tr>
                    <td><code>viewPreference</code></td>
                    <td>Mode d'affichage préféré (liste/grille)</td>
                    <td>1 an</td>
                  </tr>
                  <tr>
                    <td><code>cookieConsent</code></td>
                    <td>Mémoriser votre choix de cookies</td>
                    <td>1 an</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="cookie-type">
              <h3>3.4. Cookies marketing (tiers)</h3>
              <p><span className="badge-marketing">Marketing</span></p>
              <p>
                Ces cookies sont utilisés pour afficher des publicités pertinentes. Nous n'utilisons 
                actuellement pas ce type de cookies, mais nous pourrions le faire à l'avenir avec 
                votre consentement.
              </p>
            </div>
          </section>

          <section className="cookies-section">
            <h2>4. Cookies tiers</h2>
            <p>Certains cookies sont placés par des services tiers que nous utilisons:</p>
            <ul>
              <li><strong>Google Analytics:</strong> Analyse de l'audience</li>
              <li><strong>Cloudflare:</strong> Sécurité et performance</li>
              <li><strong>Stripe/PayPal:</strong> Traitement des paiements (si applicable)</li>
            </ul>
            <p>
              Ces services ont leurs propres politiques de confidentialité que nous vous encourageons 
              à consulter.
            </p>
          </section>

          <section className="cookies-section">
            <h2>5. Durée de conservation</h2>
            <p>Les cookies ont différentes durées de vie:</p>
            <ul>
              <li><strong>Cookies de session:</strong> Supprimés à la fermeture du navigateur</li>
              <li><strong>Cookies persistants:</strong> Restent jusqu'à leur expiration ou suppression manuelle</li>
            </ul>
            <p>
              Durée maximale: 2 ans (conformément aux recommandations CNIL)
            </p>
          </section>

          <section className="cookies-section">
            <h2>6. Gérer vos préférences de cookies</h2>
            
            <h3>6.1. Via notre plateforme</h3>
            <p>
              Vous pouvez gérer vos préférences de cookies directement depuis votre compte dans 
              <strong> Paramètres → Confidentialité → Cookies</strong>.
            </p>

            <h3>6.2. Via votre navigateur</h3>
            <p>Vous pouvez aussi contrôler les cookies via votre navigateur:</p>
            <div className="browser-instructions">
              <div className="browser-item">
                <h4>Google Chrome</h4>
                <p>Paramètres → Confidentialité et sécurité → Cookies et autres données des sites</p>
              </div>
              <div className="browser-item">
                <h4>Firefox</h4>
                <p>Options → Vie privée et sécurité → Cookies et données de sites</p>
              </div>
              <div className="browser-item">
                <h4>Safari</h4>
                <p>Préférences → Confidentialité → Gérer les données de site web</p>
              </div>
              <div className="browser-item">
                <h4>Edge</h4>
                <p>Paramètres → Confidentialité, recherche et services → Cookies</p>
              </div>
            </div>

            <h3>6.3. Outils de gestion des cookies</h3>
            <p>Vous pouvez également utiliser des outils tiers:</p>
            <ul>
              <li><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                Module complémentaire Google Analytics Opt-out
              </a></li>
              <li><a href="https://www.youronlinechoices.com/fr/" target="_blank" rel="noopener noreferrer">
                Your Online Choices
              </a></li>
            </ul>
          </section>

          <section className="cookies-section">
            <h2>7. Conséquences du refus des cookies</h2>
            <p className="important-note">
              Note: Si vous désactivez certains cookies, vous pourriez ne plus avoir accès à certaines 
              fonctionnalités de la plateforme:
            </p>
            <ul>
              <li>Impossible de rester connecté</li>
              <li>Préférences non sauvegardées</li>
              <li>Expérience utilisateur dégradée</li>
              <li>Impossibilité d'effectuer des paiements</li>
            </ul>
          </section>

          <section className="cookies-section">
            <h2>8. Cookies et données personnelles</h2>
            <p>
              Certains cookies peuvent contenir des données personnelles (ex: identifiant utilisateur). 
              Ces données sont traitées conformément à notre 
              <a href="/privacy"> Politique de Confidentialité</a>.
            </p>
          </section>

          <section className="cookies-section">
            <h2>9. Mises à jour de cette politique</h2>
            <p>
              Nous pouvons mettre à jour cette politique de cookies pour refléter des changements 
              dans nos pratiques ou pour des raisons légales. La date de dernière mise à jour est 
              indiquée en haut de cette page.
            </p>
          </section>

          <section className="cookies-section">
            <h2>10. Contact</h2>
            <p>Pour toute question sur notre utilisation des cookies:</p>
            <ul>
              <li>Email: <a href="mailto:privacy@entreprises.tn">privacy@entreprises.tn</a></li>
              <li>Téléphone: +216 71 123 456</li>
              <li>Adresse: 123 Avenue de la République, Tunis 1000, Tunisie</li>
            </ul>
          </section>
        </div>

        <div className="cookie-settings-box">
          <h3>Gérer mes préférences de cookies</h3>
          <p>
            Vous pouvez à tout moment modifier vos préférences de cookies depuis vos paramètres de compte.
          </p>
          <button className="btn-manage-cookies">Gérer mes cookies</button>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
