import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { abonnementService } from '../services/abonnementService';
import { authService } from '../services/authService';
import paymentService from '../services/paymentService';

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
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    if (!authService.isAuthenticated()) { navigate('/login'); return; }
    const sessionId = searchParams.get('session_id');
    const cancelled = searchParams.get('cancelled');
    if (sessionId) { alert('Paiement réussi! Votre abonnement a été activé.'); navigate('/abonnement', { replace: true }); }
    else if (cancelled) { alert('Paiement annulé.'); navigate('/abonnement', { replace: true }); }
    loadData();
  }, [navigate, searchParams]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [abonnementData, plansData, historiqueData] = await Promise.all([
        abonnementService.getMonAbonnement(), abonnementService.getPlans(), abonnementService.getHistoriquePaiements()
      ]);
      setMonAbonnement(abonnementData); setPlans(plansData); setHistorique(historiqueData);
    } catch (err) { console.error('Erreur:', err); setError('Impossible de charger les données'); }
    finally { setLoading(false); }
  };

  const handlePayNow = async (plan) => {
    try {
      setUpgrading(true);
      const token = authService.getToken();
      if (!token) { navigate('/login'); return; }
      const confirmMsg = `PAIEMENT DEMO\n\nPlan: ${plan.nom}\nPériode: ${selectedPeriod === 'monthly' ? 'Mensuel' : 'Annuel (-20%)'}\nPrix: ${selectedPeriod === 'monthly' ? plan.prix_mensuel : (plan.prix_mensuel * 12 * 0.8).toFixed(2)} TND\n\nConfirmer?`;
      if (window.confirm(confirmMsg)) {
        const result = await paymentService.createDemoPayment(plan.plan, selectedPeriod, token);
        setUpgrading(false); setSelectedPlan(null);
        alert(`Paiement enregistré!\nAbonnement: ${result.abonnement.plan} (${result.abonnement.statut})\nMontant: ${result.paiement.montant} ${result.paiement.devise}`);
        await loadData();
      } else { setUpgrading(false); }
    } catch (err) { console.error('Erreur:', err); alert(`Erreur: ${err.response?.data?.error || err.message}`); setUpgrading(false); }
  };

  const handleAnnuler = async () => {
    if (!window.confirm('Annuler le renouvellement automatique?')) return;
    try { const result = await abonnementService.annulerAbonnement(); alert(result.message); await loadData(); }
    catch (err) { console.error('Erreur:', err); alert(err.response?.data?.error || 'Impossible d\'annuler'); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <svg className="animate-spin w-12 h-12 text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="max-w-5xl mx-auto">
          <h1>Mon Abonnement</h1>
          <p>Gérez votre abonnement et vos paiements</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-danger-50 border border-danger-200 text-danger-700 text-sm">{error}</div>
        )}

        {/* Current Plan */}
        {monAbonnement && (
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Abonnement actuel</h2>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">{monAbonnement.plan_display}</h3>
                <span className={`badge mt-1 ${monAbonnement.statut === 'actif' ? 'badge-success' : 'badge-warning'}`}>{monAbonnement.statut_display}</span>
              </div>
              {monAbonnement.badge_verifie && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Vérifié
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-500">Annonces max</p><p className="text-sm font-bold text-gray-900">{monAbonnement.max_annonces === 999 ? 'Illimité' : monAbonnement.max_annonces}</p></div>
              {monAbonnement.date_fin && <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-500">Expire le</p><p className="text-sm font-bold text-gray-900">{formatDate(monAbonnement.date_fin)}</p></div>}
              {monAbonnement.jours_restants !== null && <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-500">Jours restants</p><p className="text-sm font-bold text-primary-600">{monAbonnement.jours_restants} jours</p></div>}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {monAbonnement.annonces_mises_en_avant && <span className="badge-success">Mise en avant</span>}
              {monAbonnement.statistiques_avancees && <span className="badge-success">Stats avancées</span>}
              {monAbonnement.support_prioritaire && <span className="badge-success">Support prioritaire</span>}
            </div>
            {monAbonnement.plan !== 'gratuit' && monAbonnement.auto_renouvellement && (
              <button onClick={handleAnnuler} className="btn-secondary">Annuler le renouvellement</button>
            )}
          </div>
        )}

        {/* Plans */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Changer d'abonnement</h2>
          {/* Period toggle */}
          <div className="inline-flex p-1 bg-gray-100 rounded-xl mb-6">
            <button onClick={() => setSelectedPeriod('monthly')} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${selectedPeriod === 'monthly' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500'}`}>Mensuel</button>
            <button onClick={() => setSelectedPeriod('annual')} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${selectedPeriod === 'annual' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500'}`}>Annuel <span className="text-success-600">-20%</span></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan) => {
              const isCurrent = monAbonnement?.plan === plan.plan;
              const priceMonthly = plan.prix_mensuel || 0;
              const priceAnnual = priceMonthly * 12 * 0.8;
              const displayPrice = selectedPeriod === 'monthly' ? priceMonthly : priceAnnual / 12;
              return (
                <div key={plan.plan} className={`relative bg-white rounded-2xl border-2 p-6 flex flex-col ${plan.plan === 'premium' ? 'border-primary-500 shadow-floating' : 'border-gray-100 shadow-card'} ${isCurrent ? 'ring-2 ring-success-300' : ''}`}>
                  {plan.plan === 'premium' && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary-500 text-white text-xs font-bold">Recommandé</div>}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.nom}</h3>
                  <div className="mb-4">
                    {priceMonthly === 0 ? (
                      <span className="text-3xl font-extrabold text-gray-900">Gratuit</span>
                    ) : (
                      <div>
                        <span className="text-3xl font-extrabold text-gray-900">{Number(displayPrice).toFixed(0)}</span>
                        <span className="text-sm text-gray-500"> TND/mois</span>
                        {selectedPeriod === 'annual' && <p className="text-xs text-gray-400 mt-1">{Number(priceAnnual).toFixed(0)} TND/an</p>}
                      </div>
                    )}
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-success-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {!isCurrent && plan.plan !== 'gratuit' ? (
                    <button onClick={() => setSelectedPlan(plan)} disabled={upgrading} className="btn-primary w-full">Choisir {plan.nom}</button>
                  ) : isCurrent ? (
                    <div className="text-center py-3 text-sm font-semibold text-success-600">Votre plan actuel</div>
                  ) : <div className="text-center py-3 text-sm text-gray-400">Plan par défaut</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment history */}
        {historique.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Historique des paiements</h2>
            <div className="space-y-3">
              {historique.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{p.plan.charAt(0).toUpperCase() + p.plan.slice(1)} - {p.duree_mois} mois</p>
                    <p className="text-xs text-gray-500">{formatDate(p.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{p.montant} {p.devise}</p>
                      <span className={`text-xs font-semibold ${p.statut === 'reussi' ? 'text-success-600' : 'text-warning-600'}`}>{p.statut_display}</span>
                    </div>
                    {p.statut === 'reussi' && (
                      <button onClick={() => window.open(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/users/abonnement/facture/${p.id}/`, '_blank')}
                        className="inline-flex items-center gap-1 px-3 h-8 rounded-lg bg-primary-50 text-primary-600 text-xs font-semibold hover:bg-primary-100 transition-colors">
                        Facture
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Payment modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedPlan(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Passer à {selectedPlan.nom}</h3>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-500 mb-1">{selectedPeriod === 'monthly' ? 'Paiement mensuel' : 'Paiement annuel (-20%)'}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-primary-600">{selectedPeriod === 'monthly' ? selectedPlan.prix_mensuel : (selectedPlan.prix_mensuel * 12 * 0.8).toFixed(0)}</span>
                <span className="text-sm text-gray-500">TND{selectedPeriod === 'annual' ? '/an' : '/mois'}</span>
              </div>
              {selectedPeriod === 'annual' && <p className="text-xs text-gray-400 mt-1">Soit {(selectedPlan.prix_mensuel * 0.8).toFixed(0)} TND/mois</p>}
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-primary-50 text-sm text-primary-700 mb-4">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Paiement sécurisé
            </div>
            <div className="flex gap-2">
              <button onClick={() => handlePayNow(selectedPlan)} disabled={upgrading} className="btn-primary flex-1">
                {upgrading ? 'Traitement...' : 'Payer maintenant'}
              </button>
              <button onClick={() => setSelectedPlan(null)} disabled={upgrading} className="btn-secondary">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Abonnement;
