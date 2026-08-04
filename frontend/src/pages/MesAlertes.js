import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { alerteService } from '../services/alerteService';

function MesAlertes() {
  const navigate = useNavigate();
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAlerte, setEditingAlerte] = useState(null);
  const [formData, setFormData] = useState({
    nom_alerte: '',
    secteur: '',
    region: '',
    prix_min: '',
    prix_max: '',
    ca_min: '',
    ca_max: '',
    nombre_employes_min: '',
    nombre_employes_max: '',
    type_transaction: '',
    frequence: 'immediat',
  });

  const secteurs = [
    { value: 'industrie', label: 'Industrie' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'services', label: 'Services' },
    { value: 'commerce', label: 'Commerce' },
    { value: 'tourisme', label: 'Tourisme et hôtellerie' },
    { value: 'transport', label: 'Transport et logistique' },
    { value: 'sante', label: 'Santé' },
    { value: 'informatique', label: 'Technologies de l\'information' },
    { value: 'education', label: 'Éducation' },
    { value: 'btp', label: 'BTP et construction' },
    { value: 'franchise', label: 'Franchise' },
    { value: 'startup', label: 'Startups' },
    { value: 'autre', label: 'Autres' },
  ];

  const regions = [
    'tunis', 'ariana', 'ben_arous', 'manouba', 'nabeul', 'zaghouan',
    'bizerte', 'beja', 'jendouba', 'le_kef', 'siliana', 'sousse',
    'monastir', 'mahdia', 'sfax', 'kairouan', 'kasserine', 'sidi_bouzid',
    'gabes', 'medenine', 'tataouine', 'gafsa', 'tozeur', 'kebili',
  ];

  useEffect(() => {
    const userType = authService.getUserType();
    if (!authService.isAuthenticated() || userType !== 'acheteur') {
      navigate('/dashboard');
      return;
    }
    loadAlertes();
  }, [navigate]);

  const loadAlertes = async () => {
    try {
      setLoading(true);
      const data = await alerteService.getMesAlertes();
      setAlertes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading alertes:', err);
      setError('Erreur lors du chargement des alertes');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nom_alerte.trim()) {
      setError('Le nom de l\'alerte est obligatoire');
      return;
    }

    // Vérifier qu'au moins un critère est défini
    const hasCriteria = formData.secteur || formData.region || formData.prix_min ||
                       formData.prix_max || formData.ca_min || formData.ca_max ||
                       formData.nombre_employes_min || formData.nombre_employes_max ||
                       formData.type_transaction;

    if (!hasCriteria) {
      setError('Vous devez définir au moins un critère de recherche');
      return;
    }

    try {
      // Préparer les données (enlever les champs vides)
      const dataToSend = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== '' && v !== null)
      );

      if (editingAlerte) {
        await alerteService.updateAlerte(editingAlerte.id, dataToSend);
        alert('Alerte mise à jour avec succès!');
      } else {
        await alerteService.creerAlerte(dataToSend);
        alert('Alerte créée avec succès!');
      }

      setShowModal(false);
      setEditingAlerte(null);
      resetForm();
      loadAlertes();
    } catch (err) {
      console.error('Error saving alerte:', err);
      setError(err.response?.data?.error || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (alerte) => {
    setEditingAlerte(alerte);
    setFormData({
      nom_alerte: alerte.nom_alerte || '',
      secteur: alerte.secteur || '',
      region: alerte.region || '',
      prix_min: alerte.prix_min || '',
      prix_max: alerte.prix_max || '',
      ca_min: alerte.ca_min || '',
      ca_max: alerte.ca_max || '',
      nombre_employes_min: alerte.nombre_employes_min || '',
      nombre_employes_max: alerte.nombre_employes_max || '',
      type_transaction: alerte.type_transaction || '',
      frequence: alerte.frequence || 'immediat',
    });
    setShowModal(true);
  };

  const handleDelete = async (alerteId) => {
    if (!window.confirm('Supprimer cette alerte ?')) return;

    try {
      await alerteService.supprimerAlerte(alerteId);
      alert('Alerte supprimée');
      loadAlertes();
    } catch (err) {
      console.error('Error deleting alerte:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const handleToggle = async (alerteId) => {
    try {
      await alerteService.toggleAlerte(alerteId);
      loadAlertes();
    } catch (err) {
      console.error('Error toggling alerte:', err);
      alert('Erreur lors de la modification');
    }
  };

  const resetForm = () => {
    setFormData({
      nom_alerte: '',
      secteur: '',
      region: '',
      prix_min: '',
      prix_max: '',
      ca_min: '',
      ca_max: '',
      nombre_employes_min: '',
      nombre_employes_max: '',
      type_transaction: '',
      frequence: 'immediat',
    });
  };

  const getRegionLabel = (value) => {
    return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center min-h-[200px] text-gray-500">
            <svg className="animate-spin w-6 h-6 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Chargement...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header banner */}
      <div className="page-header">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3">
              <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Mes Alertes
            </h1>
            <p>Recevez des notifications pour les nouvelles opportunités</p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-600 font-semibold hover:bg-primary-50 active:scale-95 transition-all duration-200"
            onClick={() => {
              setEditingAlerte(null);
              resetForm();
              setShowModal(true);
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Créer une alerte
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="flex items-start gap-2 text-danger-700 bg-danger-50 border border-danger-200 rounded-lg p-4 mb-6">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        {alertes.length === 0 ? (
          <div className="empty-state card">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-gray-600 mb-4">Vous n'avez pas encore créé d'alertes</p>
            <button
              className="btn-primary"
              onClick={() => setShowModal(true)}
            >
              Créer ma première alerte
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alertes.map((alerte) => (
              <div
                key={alerte.id}
                className={`card ${!alerte.active ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{alerte.nom_alerte}</h3>
                  {/* Toggle switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={alerte.active}
                    onClick={() => handleToggle(alerte.id)}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      alerte.active ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200 ${
                        alerte.active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    ></span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {alerte.secteur && (
                    <span className="badge-primary">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                      </svg>
                      {secteurs.find(s => s.value === alerte.secteur)?.label}
                    </span>
                  )}
                  {alerte.region && (
                    <span className="badge-primary">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {getRegionLabel(alerte.region)}
                    </span>
                  )}
                  {alerte.prix_min && (
                    <span className="badge-success">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Min: {alerte.prix_min} TND
                    </span>
                  )}
                  {alerte.prix_max && (
                    <span className="badge-success">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Max: {alerte.prix_max} TND
                    </span>
                  )}
                  {alerte.type_transaction && (
                    <span className="badge-warning">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {alerte.type_transaction.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {alerte.frequence_display}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                      onClick={() => handleEdit(alerte)}
                      title="Modifier"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:text-danger-600 hover:bg-danger-50 transition-colors"
                      onClick={() => handleDelete(alerte.id)}
                      title="Supprimer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Créer/Modifier */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-floating w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                {editingAlerte ? 'Modifier l\'alerte' : 'Créer une alerte'}
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="label">Nom de l'alerte *</label>
                <input
                  type="text"
                  className="input"
                  name="nom_alerte"
                  value={formData.nom_alerte}
                  onChange={handleInputChange}
                  placeholder="Ex: Restaurants à Tunis"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label">Secteur</label>
                  <select
                    className="input"
                    name="secteur"
                    value={formData.secteur}
                    onChange={handleInputChange}
                  >
                    <option value="">Tous les secteurs</option>
                    {secteurs.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Région</label>
                  <select
                    className="input"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                  >
                    <option value="">Toutes les régions</option>
                    {regions.map(r => (
                      <option key={r} value={r}>{getRegionLabel(r)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label">Prix minimum (TND)</label>
                  <input
                    type="number"
                    className="input"
                    name="prix_min"
                    value={formData.prix_min}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="label">Prix maximum (TND)</label>
                  <input
                    type="number"
                    className="input"
                    name="prix_max"
                    value={formData.prix_max}
                    onChange={handleInputChange}
                    placeholder="1000000"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="label">Fréquence des notifications</label>
                <select
                  className="input"
                  name="frequence"
                  value={formData.frequence}
                  onChange={handleInputChange}
                >
                  <option value="immediat">Immédiat</option>
                  <option value="quotidien">Quotidien</option>
                  <option value="hebdomadaire">Hebdomadaire</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  className="btn-secondary flex-1"
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingAlerte ? 'Mettre à jour' : 'Créer l\'alerte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MesAlertes;
