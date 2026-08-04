import React from 'react';

function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="page-header">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h1>Politique de Confidentialité</h1>
          </div>
          <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <article className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 md:p-10">
          <div className="prose prose-gray max-w-none
                          prose-headings:text-gray-900 prose-headings:font-bold
                          prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200
                          prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
                          prose-p:text-gray-700 prose-p:leading-relaxed
                          prose-ul:my-4 prose-li:text-gray-700 prose-li:my-1
                          prose-a:text-primary-600 hover:prose-a:text-primary-700
                          prose-strong:text-gray-900">
            <section>
              <h2>1. Introduction</h2>
              <p>
                BusinessBuy (« nous », « notre ») s'engage à protéger la vie privée et les données personnelles
                de ses utilisateurs. Cette Politique de Confidentialité explique comment nous collectons,
                utilisons, partageons et protégeons vos informations personnelles conformément à la législation
                tunisienne sur la protection des données personnelles (Loi organique n° 2004-63).
              </p>
            </section>

            <section>
              <h2>2. Responsable du traitement</h2>
              <p>
                <strong>BusinessBuy</strong><br />
                Adresse : Tunis, Tunisie<br />
                Email : privacy@entreprises-tn.com<br />
                Téléphone : +216 XX XXX XXX
              </p>
            </section>

            <section>
              <h2>3. Données collectées</h2>

              <h3>3.1 Données d'identification</h3>
              <ul>
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Nom d'utilisateur</li>
                <li>Mot de passe (crypté)</li>
              </ul>

              <h3>3.2 Données relatives aux entreprises</h3>
              <p>Pour les vendeurs :</p>
              <ul>
                <li>Informations sur l'entreprise (nom, secteur, localisation)</li>
                <li>Données financières (CA, prix, résultat net)</li>
                <li>Photos et documents</li>
                <li>Historique et description de l'activité</li>
              </ul>

              <h3>3.3 Données de navigation</h3>
              <ul>
                <li>Adresse IP</li>
                <li>Type de navigateur et système d'exploitation</li>
                <li>Pages consultées et durée de visite</li>
                <li>Cookies et technologies similaires</li>
              </ul>

              <h3>3.4 Données de transaction</h3>
              <ul>
                <li>Historique d'abonnements</li>
                <li>Informations de paiement (traitées par Stripe)</li>
                <li>Factures</li>
              </ul>
            </section>

            <section>
              <h2>4. Finalités du traitement</h2>
              <p>Nous utilisons vos données pour :</p>
              <ul>
                <li><strong>Gestion de compte :</strong> Création, authentification et gestion de votre profil</li>
                <li><strong>Publication d'annonces :</strong> Affichage des entreprises à vendre</li>
                <li><strong>Mise en relation :</strong> Faciliter la communication entre acheteurs et vendeurs</li>
                <li><strong>Messagerie :</strong> Permettre l'échange de messages sécurisés</li>
                <li><strong>Paiements :</strong> Traiter les abonnements et facturation</li>
                <li><strong>Notifications :</strong> Envoyer des alertes et communications importantes</li>
                <li><strong>Amélioration du service :</strong> Analyses statistiques et optimisation</li>
                <li><strong>Sécurité :</strong> Prévention de la fraude et protection des utilisateurs</li>
                <li><strong>Obligations légales :</strong> Respect des lois et réglementations</li>
              </ul>
            </section>

            <section>
              <h2>5. Base légale du traitement</h2>
              <p>Le traitement de vos données repose sur :</p>
              <ul>
                <li><strong>Exécution du contrat :</strong> Fourniture des services de la plateforme</li>
                <li><strong>Consentement :</strong> Pour l'envoi de communications marketing (opt-in)</li>
                <li><strong>Intérêt légitime :</strong> Amélioration des services et sécurité</li>
                <li><strong>Obligations légales :</strong> Conservation de données fiscales et comptables</li>
              </ul>
            </section>

            <section>
              <h2>6. Partage des données</h2>
              <p>Nous ne vendons jamais vos données personnelles. Vos informations peuvent être partagées avec :</p>

              <h3>6.1 Autres utilisateurs</h3>
              <ul>
                <li>Vendeurs : Votre nom et coordonnées si vous contactez via la messagerie</li>
                <li>Acheteurs : Informations publiques des annonces</li>
              </ul>

              <h3>6.2 Prestataires de services</h3>
              <ul>
                <li><strong>Stripe :</strong> Traitement des paiements (conforme PCI-DSS)</li>
                <li><strong>Hébergeur :</strong> Stockage sécurisé des données</li>
                <li><strong>Service email :</strong> Envoi de notifications</li>
              </ul>

              <h3>6.3 Autorités légales</h3>
              <p>
                En cas de demande légale (ordonnance judiciaire, réquisition), nous pouvons être amenés
                à communiquer vos données aux autorités compétentes.
              </p>
            </section>

            <section>
              <h2>7. Durée de conservation</h2>
              <ul>
                <li><strong>Compte actif :</strong> Données conservées tant que le compte est actif</li>
                <li><strong>Compte supprimé :</strong> Suppression dans les 30 jours (sauf obligations légales)</li>
                <li><strong>Données fiscales :</strong> 10 ans (obligation légale)</li>
                <li><strong>Logs de connexion :</strong> 1 an (sécurité)</li>
                <li><strong>Cookies :</strong> 13 mois maximum</li>
              </ul>
            </section>

            <section>
              <h2>8. Vos droits</h2>
              <p>Conformément à la loi tunisienne, vous disposez des droits suivants :</p>

              <h3>8.1 Droit d'accès</h3>
              <p>Vous pouvez demander une copie de toutes les données vous concernant.</p>

              <h3>8.2 Droit de rectification</h3>
              <p>Vous pouvez corriger ou mettre à jour vos informations à tout moment.</p>

              <h3>8.3 Droit à l'effacement</h3>
              <p>Vous pouvez demander la suppression de votre compte et de vos données.</p>

              <h3>8.4 Droit d'opposition</h3>
              <p>Vous pouvez vous opposer au traitement de vos données à des fins marketing.</p>

              <h3>8.5 Droit à la portabilité</h3>
              <p>Vous pouvez récupérer vos données dans un format structuré et lisible.</p>

              <h3>8.6 Exercice de vos droits</h3>
              <p>
                Pour exercer ces droits, contactez-nous à : <strong>privacy@entreprises-tn.com</strong><br />
                Nous répondrons sous 30 jours maximum.
              </p>
            </section>

            <section>
              <h2>9. Sécurité des données</h2>
              <p>Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données :</p>
              <ul>
                <li>Chiffrement SSL/TLS pour les transmissions</li>
                <li>Mots de passe cryptés (hashing bcrypt)</li>
                <li>Authentification JWT sécurisée</li>
                <li>Sauvegardes régulières et chiffrées</li>
                <li>Accès restreint aux données (principe du moindre privilège)</li>
                <li>Surveillance et détection des intrusions</li>
                <li>Formation du personnel à la sécurité</li>
              </ul>
            </section>

            <section>
              <h2>10. Cookies</h2>

              <h3>10.1 Types de cookies utilisés</h3>
              <ul>
                <li><strong>Cookies essentiels :</strong> Authentification et fonctionnement du site</li>
                <li><strong>Cookies analytiques :</strong> Statistiques de visite (anonymisées)</li>
                <li><strong>Cookies de préférence :</strong> Sauvegarde de vos choix (langue, etc.)</li>
              </ul>

              <h3>10.2 Gestion des cookies</h3>
              <p>
                Vous pouvez paramétrer votre navigateur pour refuser les cookies. Attention, cela peut
                affecter certaines fonctionnalités du site.
              </p>
            </section>

            <section>
              <h2>11. Transferts internationaux</h2>
              <p>
                Certains de nos prestataires (Stripe, hébergeurs cloud) peuvent stocker des données en dehors
                de la Tunisie. Dans ce cas, nous nous assurons qu'ils offrent un niveau de protection adéquat
                et respectent les standards internationaux (GDPR, clauses contractuelles types).
              </p>
            </section>

            <section>
              <h2>12. Mineurs</h2>
              <p>
                Notre service est destiné aux personnes majeures (18 ans et plus). Nous ne collectons pas
                sciemment de données de mineurs. Si nous prenons connaissance d'une telle collecte, nous
                supprimerons immédiatement les données concernées.
              </p>
            </section>

            <section>
              <h2>13. Modifications de la politique</h2>
              <p>
                Nous pouvons modifier cette Politique de Confidentialité. Les changements importants seront
                notifiés par email et sur la plateforme. La date de dernière mise à jour est indiquée en haut
                de ce document.
              </p>
            </section>

            <section>
              <h2>14. Réclamations</h2>
              <p>
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une réclamation auprès de :
              </p>
              <p>
                <strong>Instance Nationale de Protection des Données Personnelles (INPDP)</strong><br />
                Adresse : Tunis, Tunisie<br />
                Site web : www.inpdp.tn
              </p>
            </section>

            <section>
              <h2>15. Contact</h2>
              <p>
                Pour toute question sur cette politique ou vos données personnelles :
              </p>
              <ul>
                <li>Email : privacy@entreprises-tn.com</li>
                <li>Adresse : BusinessBuy, Tunis, Tunisie</li>
                <li>Téléphone : +216 XX XXX XXX</li>
              </ul>
            </section>

            <div className="mt-10 p-5 rounded-xl bg-primary-50 border border-primary-200">
              <p className="text-gray-800 font-semibold mb-0">
                <strong>En utilisant BusinessBuy, vous acceptez cette Politique de Confidentialité.</strong>
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export default PolitiqueConfidentialite;
