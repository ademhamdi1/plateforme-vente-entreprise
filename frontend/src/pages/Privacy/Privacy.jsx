import React from 'react';
import './Privacy.css';

const Privacy = () => {
  return (
    <div className="privacy-page">
      <div className="container">
        <h1>Politique de Confidentialité</h1>
        <p className="update-date">Dernière mise à jour: 22 Juillet 2026</p>

        <div className="privacy-content">
          <section className="privacy-section">
            <h2>1. Introduction</h2>
            <p>
              Entreprises Platform s'engage à protéger la confidentialité de vos données personnelles. 
              Cette politique explique quelles informations nous collectons, comment nous les utilisons, 
              et vos droits en matière de protection des données.
            </p>
            <p>
              Nous respectons la loi tunisienne n° 2004-63 relative à la protection des données à 
              caractère personnel et le Règlement Général sur la Protection des Données (RGPD) européen.
            </p>
          </section>

          <section className="privacy-section">
            <h2>2. Données collectées</h2>
            
            <h3>2.1. Informations que vous nous fournissez</h3>
            <ul>
              <li><strong>Lors de l'inscription:</strong> Nom, prénom, email, téléphone, type d'utilisateur (acheteur/vendeur)</li>
              <li><strong>Profil entreprise:</strong> Nom d'entreprise, CNSS, secteur d'activité, localisation, chiffre d'affaires, nombre d'employés</li>
              <li><strong>Communication:</strong> Messages échangés via la plateforme, demandes de contact</li>
              <li><strong>Paiements:</strong> Informations de facturation (mais pas les données bancaires complètes)</li>
            </ul>

            <h3>2.2. Informations collectées automatiquement</h3>
            <ul>
              <li><strong>Données de navigation:</strong> Adresse IP, type de navigateur, pages visitées, durée des visites</li>
              <li><strong>Cookies:</strong> Voir notre <a href="/cookies">Politique des Cookies</a></li>
              <li><strong>Données d'utilisation:</strong> Recherches effectuées, annonces consultées, favoris</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>3. Utilisation de vos données</h2>
            <p>Nous utilisons vos données personnelles pour:</p>
            <ul>
              <li>Créer et gérer votre compte utilisateur</li>
              <li>Publier et gérer vos annonces d'entreprises</li>
              <li>Faciliter la communication entre acheteurs et vendeurs</li>
              <li>Traiter vos paiements et gérer vos abonnements</li>
              <li>Vous envoyer des notifications importantes</li>
              <li>Personnaliser votre expérience sur la plateforme</li>
              <li>Améliorer nos services et fonctionnalités</li>
              <li>Prévenir la fraude et assurer la sécurité</li>
              <li>Respecter nos obligations légales</li>
              <li>Vous envoyer des offres commerciales (avec votre consentement)</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>4. Base légale du traitement</h2>
            <p>Nous traitons vos données sur la base de:</p>
            <ul>
              <li><strong>Exécution du contrat:</strong> Pour fournir nos services</li>
              <li><strong>Consentement:</strong> Pour les communications marketing</li>
              <li><strong>Intérêt légitime:</strong> Pour améliorer nos services et prévenir la fraude</li>
              <li><strong>Obligation légale:</strong> Pour respecter la loi (comptabilité, fiscalité)</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>5. Partage de vos données</h2>
            <p>
              Nous ne vendons jamais vos données personnelles. Nous pouvons les partager uniquement dans 
              les cas suivants:
            </p>
            <ul>
              <li><strong>Avec d'autres utilisateurs:</strong> Les informations de votre profil et annonces sont visibles publiquement</li>
              <li><strong>Prestataires de services:</strong> Hébergement, paiement, analytics (avec accords de confidentialité)</li>
              <li><strong>Autorités légales:</strong> Si requis par la loi ou pour protéger nos droits</li>
              <li><strong>Fusion/Acquisition:</strong> En cas de vente de notre entreprise (vous serez informé)</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>6. Durée de conservation</h2>
            <p>Nous conservons vos données personnelles:</p>
            <ul>
              <li><strong>Compte actif:</strong> Tant que votre compte existe</li>
              <li><strong>Après suppression:</strong> 30 jours pour récupération possible</li>
              <li><strong>Données comptables:</strong> 10 ans (obligation légale)</li>
              <li><strong>Cookies:</strong> Maximum 13 mois</li>
            </ul>
            <p>
              Vous pouvez demander la suppression de vos données à tout moment (sauf obligations légales).
            </p>
          </section>

          <section className="privacy-section">
            <h2>7. Vos droits</h2>
            <p>Conformément à la loi, vous disposez des droits suivants:</p>
            <ul>
              <li><strong>Droit d'accès:</strong> Obtenir une copie de vos données</li>
              <li><strong>Droit de rectification:</strong> Corriger vos données inexactes</li>
              <li><strong>Droit à l'effacement:</strong> Supprimer vos données</li>
              <li><strong>Droit à la limitation:</strong> Limiter le traitement de vos données</li>
              <li><strong>Droit à la portabilité:</strong> Recevoir vos données dans un format structuré</li>
              <li><strong>Droit d'opposition:</strong> Vous opposer au traitement de vos données</li>
              <li><strong>Droit de retirer le consentement:</strong> À tout moment pour le marketing</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous à: <a href="mailto:privacy@entreprises.tn">privacy@entreprises.tn</a>
            </p>
          </section>

          <section className="privacy-section">
            <h2>8. Sécurité de vos données</h2>
            <p>Nous mettons en place des mesures de sécurité robustes:</p>
            <ul>
              <li>Chiffrement des données sensibles (SSL/TLS)</li>
              <li>Authentification sécurisée avec tokens JWT</li>
              <li>Accès restreint aux données personnelles</li>
              <li>Sauvegardes régulières</li>
              <li>Surveillance et détection des intrusions</li>
              <li>Formation du personnel à la protection des données</li>
            </ul>
            <p className="important-note">
              Note: Aucun système n'est 100% sécurisé. Nous vous encourageons à choisir un mot de passe 
              fort et à ne jamais le partager.
            </p>
          </section>

          <section className="privacy-section">
            <h2>9. Cookies et technologies similaires</h2>
            <p>
              Nous utilisons des cookies pour améliorer votre expérience. Pour plus d'informations, 
              consultez notre <a href="/cookies">Politique des Cookies</a> détaillée.
            </p>
          </section>

          <section className="privacy-section">
            <h2>10. Transfert international de données</h2>
            <p>
              Vos données sont principalement hébergées en Tunisie. Certains de nos prestataires 
              (hébergement, analytics) peuvent être situés hors de Tunisie. Dans ce cas, nous nous 
              assurons qu'ils offrent un niveau de protection adéquat.
            </p>
          </section>

          <section className="privacy-section">
            <h2>11. Données des mineurs</h2>
            <p>
              Nos services ne sont pas destinés aux personnes de moins de 18 ans. Nous ne collectons 
              pas sciemment de données de mineurs. Si nous découvrons qu'un mineur a créé un compte, 
              nous le supprimerons immédiatement.
            </p>
          </section>

          <section className="privacy-section">
            <h2>12. Marketing et communications</h2>
            <p>
              Avec votre consentement, nous pouvons vous envoyer:
            </p>
            <ul>
              <li>Newsletters avec nouveautés et conseils</li>
              <li>Alertes sur entreprises correspondant à vos critères</li>
              <li>Offres promotionnelles</li>
            </ul>
            <p>
              Vous pouvez vous désabonner à tout moment via le lien dans chaque email ou dans les 
              paramètres de votre compte.
            </p>
          </section>

          <section className="privacy-section">
            <h2>13. Modifications de cette politique</h2>
            <p>
              Nous pouvons modifier cette politique de temps en temps. Les modifications importantes 
              seront notifiées par email ou via un message sur la plateforme. Nous vous encourageons 
              à consulter régulièrement cette page.
            </p>
          </section>

          <section className="privacy-section">
            <h2>14. Contact et réclamations</h2>
            <p>Pour toute question concernant vos données personnelles:</p>
            <ul>
              <li>Email: <a href="mailto:privacy@entreprises.tn">privacy@entreprises.tn</a></li>
              <li>Téléphone: +216 71 123 456</li>
              <li>Adresse: 123 Avenue de la République, Tunis 1000, Tunisie</li>
            </ul>
            <p>
              Si vous estimez que vos droits n'ont pas été respectés, vous pouvez déposer une réclamation 
              auprès de l'Instance Nationale de Protection des Données Personnelles (INPDP) en Tunisie.
            </p>
          </section>
        </div>

        <div className="consent-box">
          <p>
            En utilisant Entreprises Platform, vous consentez à la collecte et à l'utilisation de vos 
            données personnelles conformément à cette politique de confidentialité.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
