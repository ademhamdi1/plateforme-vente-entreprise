import React from 'react';
import './Legal.css';

function MentionsLegales() {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-header">
          <h1>⚖️ Mentions Légales</h1>
          <p className="legal-date">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. Informations légales</h2>
            
            <h3>1.1 Éditeur du site</h3>
            <p>
              <strong>Raison sociale :</strong> BusinessBuy SARL<br />
              <strong>Forme juridique :</strong> Société à Responsabilité Limitée<br />
              <strong>Capital social :</strong> 10 000 TND<br />
              <strong>Siège social :</strong> Tunis, Tunisie<br />
              <strong>Registre du Commerce :</strong> [À compléter]<br />
              <strong>Identifiant fiscal :</strong> [À compléter]<br />
              <strong>Email :</strong> contact@entreprises-tn.com<br />
              <strong>Téléphone :</strong> +216 XX XXX XXX
            </p>

            <h3>1.2 Directeur de publication</h3>
            <p>
              <strong>Nom :</strong> [À compléter]<br />
              <strong>Qualité :</strong> Gérant de BusinessBuy SARL
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Hébergement</h2>
            <p>
              <strong>Hébergeur :</strong> [Nom de l'hébergeur]<br />
              <strong>Adresse :</strong> [Adresse de l'hébergeur]<br />
              <strong>Téléphone :</strong> [Téléphone de l'hébergeur]<br />
              <strong>Site web :</strong> [URL de l'hébergeur]
            </p>
            <p>
              Les données sont hébergées sur des serveurs sécurisés avec sauvegarde quotidienne et 
              redondance géographique.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Propriété intellectuelle</h2>
            
            <h3>3.1 Droits d'auteur</h3>
            <p>
              L'ensemble du contenu présent sur le site BusinessBuy (structure, textes, graphismes, 
              logos, images, sons, logiciels, bases de données) est protégé par le droit d'auteur tunisien 
              et international.
            </p>
            <p>
              Toute reproduction, représentation, modification, publication, adaptation, totale ou partielle, 
              des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans 
              l'autorisation écrite préalable de BusinessBuy, sauf exceptions prévues par la loi.
            </p>

            <h3>3.2 Marques</h3>
            <p>
              Les marques « BusinessBuy », « Entreprises TN » et tous les logos associés sont des marques 
              déposées. Toute reproduction ou utilisation sans autorisation est passible de poursuites.
            </p>

            <h3>3.3 Contenu utilisateur</h3>
            <p>
              En publiant du contenu (annonces, photos, descriptions), vous garantissez détenir tous les 
              droits nécessaires et accordez à BusinessBuy une licence non-exclusive, gratuite et mondiale 
              pour afficher, reproduire et distribuer ce contenu dans le cadre de la fourniture du service.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Protection des données personnelles</h2>
            <p>
              BusinessBuy s'engage à protéger la vie privée de ses utilisateurs conformément à :
            </p>
            <ul>
              <li>La loi organique n° 2004-63 du 27 juillet 2004 relative à la protection des données 
              à caractère personnel (Tunisie)</li>
              <li>Le Règlement Général sur la Protection des Données (RGDP) pour les utilisateurs européens</li>
            </ul>
            <p>
              Pour plus d'informations, consultez notre 
              <a href="/politique-confidentialite"> Politique de Confidentialité</a>.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Cookies</h2>
            <p>
              Le site BusinessBuy utilise des cookies pour améliorer l'expérience utilisateur, réaliser 
              des statistiques de visite et assurer le bon fonctionnement des services.
            </p>
            <p>
              Types de cookies utilisés :
            </p>
            <ul>
              <li><strong>Cookies techniques :</strong> Nécessaires au fonctionnement (authentification, 
              session)</li>
              <li><strong>Cookies analytiques :</strong> Mesure d'audience et statistiques (anonymisés)</li>
              <li><strong>Cookies de préférence :</strong> Sauvegarde de vos choix (langue, paramètres)</li>
            </ul>
            <p>
              Vous pouvez paramétrer votre navigateur pour refuser les cookies ou être informé de leur dépôt. 
              La désactivation des cookies peut limiter certaines fonctionnalités du site.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Responsabilité</h2>
            
            <h3>6.1 Contenu du site</h3>
            <p>
              BusinessBuy s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur 
              le site. Toutefois, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité des 
              informations mises à disposition.
            </p>
            <p>
              Les annonces publiées par les vendeurs sont sous leur seule responsabilité. BusinessBuy agit 
              en tant qu'intermédiaire et ne peut être tenu responsable :
            </p>
            <ul>
              <li>De l'exactitude des informations fournies par les vendeurs</li>
              <li>De la validité juridique des transactions</li>
              <li>Des litiges entre acheteurs et vendeurs</li>
              <li>Des dommages directs ou indirects résultant de l'utilisation du site</li>
            </ul>

            <h3>6.2 Disponibilité du service</h3>
            <p>
              BusinessBuy s'efforce d'assurer la disponibilité du service 24h/24 et 7j/7, mais ne peut 
              garantir une continuité absolue en raison de :
            </p>
            <ul>
              <li>Maintenances programmées ou d'urgence</li>
              <li>Pannes techniques ou problèmes d'hébergement</li>
              <li>Cas de force majeure</li>
            </ul>

            <h3>6.3 Liens externes</h3>
            <p>
              Le site peut contenir des liens vers des sites tiers. BusinessBuy n'exerce aucun contrôle 
              sur ces sites et décline toute responsabilité quant à leur contenu, leur disponibilité ou 
              leur politique de confidentialité.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Utilisation du service</h2>
            
            <h3>7.1 Règles d'utilisation</h3>
            <p>
              L'utilisateur s'engage à utiliser le service de manière loyale et conforme à sa destination. 
              Il est notamment interdit de :
            </p>
            <ul>
              <li>Publier des informations fausses, trompeuses ou frauduleuses</li>
              <li>Usurper l'identité d'autrui ou créer de faux comptes</li>
              <li>Diffuser du contenu illégal, diffamatoire ou portant atteinte aux droits d'autrui</li>
              <li>Tenter de pirater ou d'accéder illégalement au système</li>
              <li>Utiliser des robots, scrapers ou outils automatisés sans autorisation</li>
              <li>Spammer ou harceler d'autres utilisateurs</li>
              <li>Contourner les systèmes de paiement ou de sécurité</li>
            </ul>

            <h3>7.2 Sanctions</h3>
            <p>
              Tout manquement aux règles d'utilisation peut entraîner :
            </p>
            <ul>
              <li>Avertissement</li>
              <li>Suspension temporaire du compte</li>
              <li>Suppression définitive du compte</li>
              <li>Poursuites judiciaires en cas d'infraction grave</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>8. Droit applicable et juridiction</h2>
            <p>
              Les présentes mentions légales et l'utilisation du site BusinessBuy sont régies par le droit 
              tunisien.
            </p>
            <p>
              En cas de litige, une tentative de résolution amiable sera privilégiée. À défaut d'accord, 
              les tribunaux de Tunis seront seuls compétents.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Crédits</h2>
            
            <h3>9.1 Conception et développement</h3>
            <p>
              <strong>Développement :</strong> Équipe BusinessBuy<br />
              <strong>Technologies :</strong> React.js, Django, PostgreSQL<br />
              <strong>Design :</strong> [À compléter]
            </p>

            <h3>9.2 Ressources tierces</h3>
            <ul>
              <li><strong>Paiements :</strong> Stripe (stripe.com)</li>
              <li><strong>Icônes :</strong> Émojis Unicode</li>
              <li><strong>Polices :</strong> Système (Arial, sans-serif)</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>10. Conditions particulières</h2>
            
            <h3>10.1 Abonnements</h3>
            <p>
              Les conditions spécifiques aux abonnements payants (Premium, Professionnel) sont détaillées 
              dans nos <a href="/cgu">Conditions Générales d'Utilisation</a>.
            </p>

            <h3>10.2 Messagerie interne</h3>
            <p>
              L'utilisation de la messagerie est soumise à nos règles de modération. Les échanges peuvent 
              être surveillés pour prévenir les abus et fraudes.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Déclarations légales</h2>
            
            <h3>11.1 Conformité RGPD</h3>
            <p>
              Pour les utilisateurs résidant dans l'Union Européenne, BusinessBuy est conforme au RGPD 
              (Règlement UE 2016/679).
            </p>

            <h3>11.2 Instance de contrôle</h3>
            <p>
              Les traitements de données personnelles effectués par BusinessBuy sont déclarés auprès de :
            </p>
            <p>
              <strong>Instance Nationale de Protection des Données Personnelles (INPDP)</strong><br />
              Site web : www.inpdp.tn
            </p>
          </section>

          <section className="legal-section">
            <h2>12. Accessibilité</h2>
            <p>
              BusinessBuy s'efforce de rendre son site accessible au plus grand nombre, y compris les 
              personnes en situation de handicap. Nous travaillons continuellement à améliorer l'accessibilité 
              de notre plateforme.
            </p>
            <p>
              En cas de difficulté d'accès, contactez-nous : accessibilite@entreprises-tn.com
            </p>
          </section>

          <section className="legal-section">
            <h2>13. Modification des mentions légales</h2>
            <p>
              BusinessBuy se réserve le droit de modifier à tout moment les présentes mentions légales. 
              Les modifications entrent en vigueur dès leur publication sur le site. La date de dernière 
              mise à jour est indiquée en haut de ce document.
            </p>
          </section>

          <section className="legal-section">
            <h2>14. Contact</h2>
            <p>
              Pour toute question concernant ces mentions légales ou le fonctionnement du site :
            </p>
            <ul>
              <li><strong>Email général :</strong> contact@entreprises-tn.com</li>
              <li><strong>Email juridique :</strong> legal@entreprises-tn.com</li>
              <li><strong>Email technique :</strong> support@entreprises-tn.com</li>
              <li><strong>Téléphone :</strong> +216 XX XXX XXX</li>
              <li><strong>Adresse postale :</strong> BusinessBuy SARL, Tunis, Tunisie</li>
            </ul>
          </section>

          <div className="legal-footer">
            <p>
              <strong>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</strong>
            </p>
            <p>
              Ces mentions légales font partie intégrante des conditions d'utilisation du site BusinessBuy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MentionsLegales;
