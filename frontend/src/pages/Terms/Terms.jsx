import React from 'react';
import './Terms.css';

const Terms = () => {
  return (
    <div className="terms-page">
      <div className="container">
        <h1>Conditions d'Utilisation</h1>
        <p className="update-date">Dernière mise à jour: 22 Juillet 2026</p>

        <div className="terms-content">
          <section className="terms-section">
            <h2>1. Acceptation des conditions</h2>
            <p>
              En accédant et en utilisant Entreprises Platform (ci-après "la Plateforme"), vous acceptez 
              d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez 
              ne pas utiliser la Plateforme.
            </p>
          </section>

          <section className="terms-section">
            <h2>2. Description du service</h2>
            <p>
              Entreprises Platform est une plateforme en ligne qui met en relation des vendeurs 
              d'entreprises avec des acheteurs potentiels en Tunisie. Nous facilitons la publication 
              d'annonces et la communication entre les parties, mais ne sommes pas partie prenante 
              des transactions.
            </p>
          </section>

          <section className="terms-section">
            <h2>3. Inscription et compte utilisateur</h2>
            <ul>
              <li>Vous devez avoir au moins 18 ans pour créer un compte</li>
              <li>Vous êtes responsable de la confidentialité de vos identifiants</li>
              <li>Vous devez fournir des informations exactes et à jour</li>
              <li>Un compte par personne ou entreprise est autorisé</li>
              <li>Nous nous réservons le droit de suspendre ou supprimer tout compte en cas de violation</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>4. Publication d'annonces</h2>
            <h3>Les vendeurs s'engagent à:</h3>
            <ul>
              <li>Fournir des informations véridiques et exactes sur leur entreprise</li>
              <li>Ne publier que des entreprises dont ils sont légalement propriétaires ou mandataires</li>
              <li>Mettre à jour ou retirer les annonces une fois l'entreprise vendue</li>
              <li>Respecter les lois tunisiennes en matière de cession d'entreprise</li>
              <li>Ne pas publier de contenu illégal, frauduleux ou trompeur</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>5. Obligations des utilisateurs</h2>
            <h3>Vous vous engagez à NE PAS:</h3>
            <ul>
              <li>Utiliser la Plateforme à des fins illégales</li>
              <li>Publier de fausses informations</li>
              <li>Harceler, menacer ou intimider d'autres utilisateurs</li>
              <li>Usurper l'identité d'une autre personne ou entreprise</li>
              <li>Collecter des données d'autres utilisateurs sans leur consentement</li>
              <li>Tenter d'accéder aux systèmes de la Plateforme de manière non autorisée</li>
              <li>Utiliser des robots, scrapers ou autres moyens automatisés</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>6. Tarification et paiements</h2>
            <p>
              L'utilisation de base de la Plateforme est gratuite. Des services premium sont disponibles 
              via différents plans d'abonnement. Les prix sont affichés en dinars tunisiens (TND) et 
              incluent toutes les taxes applicables.
            </p>
            <ul>
              <li>Les paiements sont traités de manière sécurisée</li>
              <li>Les abonnements sont renouvelés automatiquement sauf annulation</li>
              <li>Aucun remboursement n'est accordé pour les périodes non utilisées</li>
              <li>Nous nous réservons le droit de modifier nos tarifs avec préavis</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>7. Propriété intellectuelle</h2>
            <p>
              Tous les contenus de la Plateforme (logos, textes, graphiques, design) sont protégés par 
              les droits d'auteur et appartiennent à Entreprises Platform ou ses partenaires. Vous ne 
              pouvez pas copier, reproduire ou distribuer ces contenus sans autorisation écrite.
            </p>
          </section>

          <section className="terms-section">
            <h2>8. Limitation de responsabilité</h2>
            <p>
              Entreprises Platform agit uniquement comme intermédiaire. Nous ne sommes pas responsables:
            </p>
            <ul>
              <li>De l'exactitude des informations fournies par les vendeurs</li>
              <li>Des transactions effectuées entre acheteurs et vendeurs</li>
              <li>Des litiges pouvant survenir entre utilisateurs</li>
              <li>Des pertes financières liées à l'utilisation de la Plateforme</li>
              <li>Des interruptions de service temporaires</li>
            </ul>
            <p className="important-note">
              Note: Il est fortement recommandé de faire appel à des professionnels (avocats, comptables, 
              experts) avant toute transaction d'achat ou de vente d'entreprise.
            </p>
          </section>

          <section className="terms-section">
            <h2>9. Protection des données</h2>
            <p>
              Nous respectons votre vie privée. Consultez notre 
              <a href="/privacy"> Politique de Confidentialité</a> pour plus d'informations sur 
              la collecte et l'utilisation de vos données personnelles.
            </p>
          </section>

          <section className="terms-section">
            <h2>10. Modération et suppression</h2>
            <p>
              Nous nous réservons le droit de:
            </p>
            <ul>
              <li>Modérer, refuser ou supprimer toute annonce non conforme</li>
              <li>Suspendre ou supprimer tout compte en cas de violation</li>
              <li>Signaler aux autorités toute activité suspecte ou illégale</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>11. Modifications des conditions</h2>
            <p>
              Nous pouvons modifier ces conditions à tout moment. Les utilisateurs seront informés 
              des changements importants. L'utilisation continue de la Plateforme après modification 
              constitue une acceptation des nouvelles conditions.
            </p>
          </section>

          <section className="terms-section">
            <h2>12. Résiliation</h2>
            <p>
              Vous pouvez fermer votre compte à tout moment. Nous pouvons également résilier votre 
              accès à la Plateforme en cas de violation des présentes conditions, avec ou sans préavis.
            </p>
          </section>

          <section className="terms-section">
            <h2>13. Droit applicable et juridiction</h2>
            <p>
              Ces conditions sont régies par le droit tunisien. Tout litige sera soumis à la 
              juridiction exclusive des tribunaux de Tunis, Tunisie.
            </p>
          </section>

          <section className="terms-section">
            <h2>14. Contact</h2>
            <p>
              Pour toute question concernant ces conditions d'utilisation, contactez-nous:
            </p>
            <ul>
              <li>Email: legal@entreprises.tn</li>
              <li>Téléphone: +216 71 123 456</li>
              <li>Adresse: 123 Avenue de la République, Tunis 1000, Tunisie</li>
            </ul>
          </section>
        </div>

        <div className="acceptance-box">
          <p>
            En utilisant Entreprises Platform, vous reconnaissez avoir lu, compris et accepté 
            l'intégralité de ces conditions d'utilisation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
