import React from 'react';
import './Legal.css';

function CGU() {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-header">
          <h1>📜 Conditions Générales d'Utilisation</h1>
          <p className="legal-date">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. Présentation de la plateforme</h2>
            <p>
              BusinessBuy (ci-après « la Plateforme ») est une plateforme en ligne dédiée à la mise en relation 
              entre vendeurs et acheteurs d'entreprises en Tunisie. Elle permet aux propriétaires d'entreprises 
              de publier des annonces de vente et aux investisseurs de rechercher des opportunités d'acquisition.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Acceptation des conditions</h2>
            <p>
              En accédant et en utilisant la Plateforme, vous acceptez sans réserve les présentes Conditions 
              Générales d'Utilisation (CGU). Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser 
              nos services.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Inscription et compte utilisateur</h2>
            <h3>3.1 Création de compte</h3>
            <p>
              Pour accéder à certaines fonctionnalités, vous devez créer un compte en fournissant des 
              informations exactes, complètes et à jour. Vous êtes responsable de maintenir la confidentialité 
              de vos identifiants de connexion.
            </p>
            
            <h3>3.2 Types de comptes</h3>
            <ul>
              <li><strong>Compte Acheteur :</strong> Permet de consulter les annonces, contacter les vendeurs, 
              sauvegarder des favoris et créer des alertes de recherche.</li>
              <li><strong>Compte Vendeur :</strong> Permet de publier des annonces de vente d'entreprises, 
              gérer les demandes de contact et accéder aux statistiques.</li>
            </ul>

            <h3>3.3 Vérification</h3>
            <p>
              Nous nous réservons le droit de vérifier l'identité des utilisateurs et de demander des 
              justificatifs supplémentaires pour les annonces d'entreprises.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Publication d'annonces</h2>
            <h3>4.1 Responsabilité du vendeur</h3>
            <p>
              En publiant une annonce, vous garantissez que :
            </p>
            <ul>
              <li>Vous êtes légalement autorisé à vendre l'entreprise</li>
              <li>Les informations fournies sont exactes et véridiques</li>
              <li>Vous disposez des droits sur les photos et documents publiés</li>
              <li>L'annonce ne contient pas de contenu illégal, frauduleux ou trompeur</li>
            </ul>

            <h3>4.2 Modération</h3>
            <p>
              Toutes les annonces sont soumises à validation par notre équipe avant publication. Nous nous 
              réservons le droit de refuser, modifier ou supprimer toute annonce ne respectant pas nos règles.
            </p>

            <h3>4.3 Durée de publication</h3>
            <p>
              La durée de publication dépend de votre plan d'abonnement. Les annonces peuvent être 
              renouvelées ou supprimées à tout moment par le vendeur.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Plans d'abonnement et paiements</h2>
            <h3>5.1 Offres disponibles</h3>
            <ul>
              <li><strong>Gratuit :</strong> Accès limité (2 annonces maximum)</li>
              <li><strong>Premium :</strong> Fonctionnalités avancées (10 annonces, mise en avant)</li>
              <li><strong>Professionnel :</strong> Accès illimité avec services premium</li>
            </ul>

            <h3>5.2 Paiements</h3>
            <p>
              Les paiements sont traités de manière sécurisée via Stripe. En souscrivant à un abonnement 
              payant, vous acceptez nos conditions de paiement et autorisez le prélèvement automatique 
              jusqu'à résiliation.
            </p>

            <h3>5.3 Remboursement</h3>
            <p>
              Les abonnements ne sont pas remboursables. Vous pouvez annuler votre abonnement à tout moment, 
              mais vous conserverez l'accès jusqu'à la fin de la période payée.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Utilisation de la messagerie</h2>
            <p>
              La messagerie interne permet aux acheteurs et vendeurs de communiquer. Il est interdit d'utiliser 
              la messagerie pour :
            </p>
            <ul>
              <li>Envoyer des spams ou contenus publicitaires non sollicités</li>
              <li>Partager des informations frauduleuses ou trompeuses</li>
              <li>Harceler ou menacer d'autres utilisateurs</li>
              <li>Contourner les systèmes de paiement de la plateforme</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. Propriété intellectuelle</h2>
            <p>
              Tous les éléments de la Plateforme (design, logo, textes, graphiques) sont protégés par les 
              droits de propriété intellectuelle. Toute reproduction sans autorisation est interdite.
            </p>
            <p>
              En publiant du contenu (photos, descriptions), vous accordez à BusinessBuy une licence 
              non-exclusive d'utilisation pour afficher et promouvoir vos annonces sur la plateforme.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Confidentialité des données</h2>
            <p>
              Nous nous engageons à protéger vos données personnelles conformément à notre 
              <a href="/politique-confidentialite"> Politique de Confidentialité</a> et à la législation 
              tunisienne sur la protection des données.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Limitation de responsabilité</h2>
            <p>
              BusinessBuy agit en tant qu'intermédiaire de mise en relation. Nous ne sommes pas partie 
              prenante dans les transactions entre acheteurs et vendeurs. Par conséquent :
            </p>
            <ul>
              <li>Nous ne garantissons pas l'exactitude des informations publiées par les vendeurs</li>
              <li>Nous ne sommes pas responsables des litiges entre utilisateurs</li>
              <li>Nous ne garantissons pas la conclusion d'une transaction</li>
              <li>Chaque utilisateur est responsable de ses propres vérifications juridiques et financières</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>10. Suspension et résiliation</h2>
            <p>
              Nous nous réservons le droit de suspendre ou de résilier votre compte en cas de :
            </p>
            <ul>
              <li>Violation des présentes CGU</li>
              <li>Comportement frauduleux ou abusif</li>
              <li>Non-paiement des services souscrits</li>
              <li>Activité suspecte ou illégale</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>11. Modification des CGU</h2>
            <p>
              Nous nous réservons le droit de modifier les présentes CGU à tout moment. Les utilisateurs 
              seront informés par email des changements importants. L'utilisation continue de la plateforme 
              après modification vaut acceptation des nouvelles conditions.
            </p>
          </section>

          <section className="legal-section">
            <h2>12. Droit applicable et juridiction</h2>
            <p>
              Les présentes CGU sont régies par le droit tunisien. En cas de litige, les tribunaux de Tunis 
              seront seuls compétents.
            </p>
          </section>

          <section className="legal-section">
            <h2>13. Contact</h2>
            <p>
              Pour toute question concernant ces CGU, vous pouvez nous contacter :
            </p>
            <ul>
              <li>Email : legal@entreprises-tn.com</li>
              <li>Adresse : Tunis, Tunisie</li>
              <li>Téléphone : +216 XX XXX XXX</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default CGU;
