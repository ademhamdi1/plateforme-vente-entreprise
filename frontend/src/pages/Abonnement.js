import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { abonnementService } from '../services/abonnementService';
import { authService } from '../services/authService';
import paymentService from '../services/paymentService';
import './Abonnement.css';

function Abonnement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [monAbonnement, setMonAbonnement] = useState(null);
  const [plans, setPlans] = useState([]);
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [upgrading, setUpgrading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly'); // monthly ou annual

  useEffect(() => {
    // Vérifier l'authentification
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Vérifier si retour de paiement réussi
    const sessionId = searchParams.get('session_id');
    const cancelled = searchParams.get('cancelled');
    
    if (sessionId) {
      alert('✅ Paiement réussi! Votre abonnement a été activé.');
      navigate('/abonnement', { replace: true });
    } else if (cancelled) {
      alert('❌ Paiement annulé.');
      navigate('/abonnement', { replace: true });
    }

    loadData();
  }, [navigate, searchParams]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Charger depuis PostgreSQL
      const [abonnementData, plansData, historiqueData] = await Promise.all([
        abonnementService.getMonAbonnement(),
        abonnementService.getPlans(),
        abonnementService.getHistoriquePaiements()
      ]);
      
      setMonAbonnement(abonnementData);
      setPlans(plansData);
      setHistorique(historiqueData);
      
    } catch (err) {
      console.error('Erreur chargement:', err);
      setError('Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (plan) => {
    try {
      setUpgrading(true);
      
      const token = authService.getToken();
      if (!token) {
        alert('⚠️ Veuillez vous connecter pour continuer');
        navigate('/login');
        return;
      }
      
      // MODE DEMO - Enregistrement dans PostgreSQL
      const confirmMsg = ` PAIEMENT DEMO\n\n` +
        `Plan: ${plan.nom}\n` +
        `Période: ${selectedPeriod === 'monthly' ? 'Mensuel' : 'Annuel (-20%)'}\n` +
        `Prix: ${selectedPeriod === 'monthly' ? plan.prix_mensuel : (plan.prix_mensuel * 12 * 0.8).toFixed(2)} TND\n\n` +
        `Confirmer?`;
      
      if (window.confirm(confirmMsg)) {
        console.log('Calling paymentService.createDemoPayment...');
        
        // Enregistrer le paiement DEMO dans PostgreSQL
        const result = await paymentService.createDemoPayment(
          plan.plan,
          selectedPeriod,
          token
        );
        
        console.log('Payment result:', result);
        
        setUpgrading(false);
        setSelectedPlan(null);
        
        const successMsg = `✅ PAIEMENT ENREGISTRÉ!\n\n` +
          `Abonnement: ${result.abonnement.plan} (${result.abonnement.statut})\n` +
          `Montant: ${result.paiement.montant} ${result.paiement.devise}\n` +
          `Transaction: ${result.paiement.transaction_id}\n\n` ;
        
        alert(successMsg);
        
        // Recharger les données
        await loadData();
      } else {
        setUpgrading(false);
      }
      
    } catch (err) {
      console.error('Erreur paiement DEMO:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Erreur inconnue';
      alert(`❌ Erreur: ${errorMsg}`);
      setUpgrading(false);
    }
  };

  const handleAnnuler = async () => {
    if (!window.confirm('Annuler le renouvellement automatique de votre abonnement ?')) {
      return;
    }

    try {
      const result = await abonnementService.annulerAbonnement();
      alert(`✅ ${result.message}`);
      await loadData();
    } catch (err) {
      console.error('Erreur annulation:', err);
      alert(err.response?.data?.error || '❌ Impossible d\'annuler l\'abonnement');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="abonnement-page">
        <div className="container">
          <div className="loading">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="abonnement-page">
      <div className="container">
        <div className="abonnement-header">
          <h1>💳 Mon Abonnement</h1>
          <p className="subtitle">Gérez votre abonnement et vos paiements</p>
        </div>

        {error && <div className="error">{error}</div>}

        {/* Abonnement Actuel */}
        {monAbonnement && (
          <div className="current-plan-section">
            <h2>Abonnement actuel</h2>
            <div className="current-plan-card">
              <div className="plan-header">
                <div>
                  <h3>{monAbonnement.plan_display}</h3>
                  <span className={`status-badge ${monAbonnement.statut}`}>
                    {monAbonnement.statut_display}
                  </span>
                </div>
                {monAbonnement.badge_verifie && (
                  <div className="verified-badge">✓ Vérifié</div>
                )}
              </div>

              <div className="plan-details">
                <div className="detail-item">
                  <span className="label">Annonces max:</span>
                  <span className="value">
                    {monAbonnement.max_annonces === 999 ? 'Illimité' : monAbonnement.max_annonces}
                  </span>
                </div>
                
                {monAbonnement.date_fin && (
                  <div className="detail-item">
                    <span className="label">Expire le:</span>
                    <span className="value">{formatDate(monAbonnement.date_fin)}</span>
                  </div>
                )}

                {monAbonnement.jours_restants !== null && (
                  <div className="detail-item">
                    <span className="label">Jours restants:</span>
                    <span className="value highlight">{monAbonnement.jours_restants} jours</span>
                  </div>
                )}
              </div>

              <div className="plan-features">
                {monAbonnement.annonces_mises_en_avant && <span className="feature">✓ Mise en avant</span>}
                {monAbonnement.statistiques_avancees && <span className="feature">✓ Stats avancées</span>}
                {monAbonnement.support_prioritaire && <span className="feature">✓ Support prioritaire</span>}
                {monAbonnement.badge_verifie && <span className="feature">✓ Badge vérifié</span>}
              </div>

              {monAbonnement.plan !== 'gratuit' && monAbonnement.auto_renouvellement && (
                <button className="btn btn-secondary" onClick={handleAnnuler}>
                  Annuler le renouvellement
                </button>
              )}
            </div>
          </div>
        )}

        {/* Plans Disponibles */}
        <div className="plans-section">
          <h2>Changer d'abonnement</h2>
          
          {/* Toggle Période */}
          <div className="period-toggle">
            <button
              className={`toggle-btn ${selectedPeriod === 'monthly' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('monthly')}
            >
              Mensuel
            </button>
            <button
              className={`toggle-btn ${selectedPeriod === 'annual' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('annual')}
            >
              Annuel <span className="discount">-20%</span>
            </button>
          </div>
          
          <div className="plans-grid">
            {plans.map((plan) => {
              const isCurrent = monAbonnement?.plan === plan.plan;
              const priceMonthly = plan.prix_mensuel || 0;
              const priceAnnual = priceMonthly * 12 * 0.8; // 20% discount
              const displayPrice = selectedPeriod === 'monthly' ? priceMonthly : priceAnnual / 12;
              
              return (
                <div 
                  key={plan.plan} 
                  className={`plan-card ${isCurrent ? 'current' : ''} ${plan.plan === 'premium' ? 'featured' : ''}`}
                >
                  {plan.plan === 'premium' && (
                    <div className="featured-badge">🌟 Recommandé</div>
                  )}
                  
                  <h3>{plan.nom}</h3>
                  <div className="price">
                    {priceMonthly === 0 ? (
                      <span className="free">Gratuit</span>
                    ) : (
                      <>
                        <span className="amount">{Number(displayPrice).toFixed(2)}</span>
                        <span className="currency">TND/mois</span>
                        {selectedPeriod === 'annual' && (
                          <p className="annual-total">
                            {Number(priceAnnual).toFixed(2)} TND/an
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <ul className="features-list">
                    {plan.features.map((feature, index) => (
                      <li key={index}>✓ {feature}</li>
                    ))}
                  </ul>

                  {!isCurrent && plan.plan !== 'gratuit' && (
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => setSelectedPlan(plan)}
                      disabled={upgrading}
                    >
                      {upgrading ? 'Chargement...' : `Choisir ${plan.nom}`}
                    </button>
                  )}

                  {isCurrent && (
                    <div className="current-plan-label">Votre plan actuel</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Historique des Paiements */}
        {historique.length > 0 && (
          <div className="historique-section">
            <h2>Historique des paiements</h2>
            <div className="historique-list">
              {historique.map((paiement) => (
                <div key={paiement.id} className="paiement-item">
                  <div className="paiement-info">
                    <h4>{paiement.plan.charAt(0).toUpperCase() + paiement.plan.slice(1)} - {paiement.duree_mois} mois</h4>
                    <p>{formatDate(paiement.created_at)}</p>
                  </div>
                  <div className="paiement-details">
                    <div className="paiement-amount">
                      <span className="amount">{paiement.montant} {paiement.devise}</span>
                      <span className={`status ${paiement.statut}`}>{paiement.statut_display}</span>
                    </div>
                    {paiement.statut === 'reussi' && (
                      <button
                        className="btn-download-invoice"
                        onClick={() => window.open(
                          `${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/users/abonnement/facture/${paiement.id}/`,
                          '_blank'
                        )}
                        title="Télécharger la facture PDF"
                      >
                        📄 Télécharger facture
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Upgrade */}
      {selectedPlan && (
        <div className="modal-overlay" onClick={() => setSelectedPlan(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Passer à {selectedPlan.nom}</h3>
            
            <div className="modal-body">
              <div className="plan-summary">
                <h4>{selectedPlan.nom}</h4>
                <p className="period">{selectedPeriod === 'monthly' ? 'Paiement mensuel' : 'Paiement annuel (-20%)'}</p>
                
                {selectedPeriod === 'monthly' ? (
                  <div className="price-display">
                    <span className="amount">{selectedPlan.prix_mensuel} TND</span>
                    <span className="label">/mois</span>
                  </div>
                ) : (
                  <div className="price-display">
                    <span className="amount">{(selectedPlan.prix_mensuel * 12 * 0.8).toFixed(2)} TND</span>
                    <span className="label">/an</span>
                    <p className="monthly-equiv">
                      Soit {(selectedPlan.prix_mensuel * 0.8).toFixed(2)} TND/mois
                    </p>
                  </div>
                )}
              </div>

              <div className="payment-info">
                <p className="info-icon">🔒</p>
                <p className="info-text">
                  Paiement sécurisé par <strong>Stripe</strong>
                </p>
                <p className="info-subtext">
                  Vos données de paiement sont cryptées et sécurisées. Nous ne stockons aucune information bancaire.
                </p>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={() => handlePayNow(selectedPlan)}
                disabled={upgrading}
              >
                {upgrading ? '⏳ Redirection vers Stripe...' : '💳 Payer maintenant'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedPlan(null)}
                disabled={upgrading}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Abonnement;
