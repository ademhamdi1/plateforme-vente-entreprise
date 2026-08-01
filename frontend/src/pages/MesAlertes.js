import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { alerteService } from '../services/alerteService';
import './MesAlertes.css';

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
        alert('✅ Alerte mise à jour avec succès!');
      } else {
        await alerteService.creerAlerte(dataToSend);
        alert('✅ Alerte créée avec succès!');
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
      alert('✅ Alerte supprimée');
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
      <div className="mes-alertes-page">
        <div className="container">
          <div className="loading">⏳ Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mes-alertes-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>🔔 Mes Alertes</h1>
            <p className="subtitle">Recevez des notifications pour les nouvelles opportunités</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingAlerte(null);
              resetForm();
              setShowModal(true);
            }}
          >
            + Créer une alerte
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {alertes.length === 0 ? (
          <div className="empty-state">
            <p>📭 Vous n'avez pas encore créé d'alertes</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              Créer ma première alerte
            </button>
          </div>
        ) : (
          <div className="alertes-grid">
            {alertes.map((alerte) => (
              <div key={alerte.id} className={`alerte-card ${!alerte.active ? 'inactive' : ''}`}>
                <div className="alerte-header">
                  <h3>{alerte.nom_alerte}</h3>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={alerte.active}
                      onChange={() => handleToggle(alerte.id)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="alerte-criteres">
                  {alerte.secteur && (
                    <span className="critere">📁 {secteurs.find(s => s.value === alerte.secteur)?.label}</span>
                  )}
                  {alerte.region && (
                    <span className="critere">📍 {getRegionLabel(alerte.region)}</span>
                  )}
                  {alerte.prix_min && (
                    <span className="critere">💰 Min: {alerte.prix_min} TND</span>
                  )}
                  {alerte.prix_max && (
                    <span className="critere">💰 Max: {alerte.prix_max} TND</span>
                  )}
                  {alerte.type_transaction && (
                    <span className="critere">🔄 {alerte.type_transaction.replace(/_/g, ' ')}</span>
                  )}
                </div>

                <div className="alerte-footer">
                  <span className="frequence">
                    🔔 {alerte.frequence_display}
                  </span>
                  <div className="alerte-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleEdit(alerte)}
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleDelete(alerte.id)}
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Créer/Modifier */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>{editingAlerte ? 'Modifier l\'alerte' : 'Créer une alerte'}</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nom de l'alerte *</label>
                  <input
                    type="text"
                    name="nom_alerte"
                    value={formData.nom_alerte}
                    onChange={handleInputChange}
                    placeholder="Ex: Restaurants à Tunis"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Secteur</label>
                    <select name="secteur" value={formData.secteur} onChange={handleInputChange}>
                      <option value="">Tous les secteurs</option>
                      {secteurs.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Région</label>
                    <select name="region" value={formData.region} onChange={handleInputChange}>
                      <option value="">Toutes les régions</option>
                      {regions.map(r => (
                        <option key={r} value={r}>{getRegionLabel(r)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Prix minimum (TND)</label>
                    <input
                      type="number"
                      name="prix_min"
                      value={formData.prix_min}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Prix maximum (TND)</label>
                    <input
                      type="number"
                      name="prix_max"
                      value={formData.prix_max}
                      onChange={handleInputChange}
                      placeholder="1000000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Fréquence des notifications</label>
                  <select name="frequence" value={formData.frequence} onChange={handleInputChange}>
                    <option value="immediat">Immédiat</option>
                    <option value="quotidien">Quotidien</option>
                    <option value="hebdomadaire">Hebdomadaire</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingAlerte ? 'Mettre à jour' : 'Créer l\'alerte'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MesAlertes;
