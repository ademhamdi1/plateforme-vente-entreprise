import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthService from '../../services/auth.service';
import EntrepriseService from '../../services/entreprise.service';
import AlertService from '../../services/alert.service';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [mesEntreprises, setMesEntreprises] = useState([]);
  const [savedEntreprises, setSavedEntreprises] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    total_views: 0,
    total_messages: 0,
    total_entreprises: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [alertForm, setAlertForm] = useState({
    name: '',
    region: '',
    min_price: '',
    max_price: ''
  });
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    city: '',
    region: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
      
      // Initialize profile form
      setProfileForm({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone: userData.phone || '',
        city: userData.city || '',
        region: userData.region || ''
      });

      if (userData.user_type === 'vendeur') {
        const entreprises = await EntrepriseService.getMine();
        setMesEntreprises(entreprises.results || entreprises);
        
        // Calculate stats
        const totalViews = (entreprises.results || entreprises).reduce((sum, e) => sum + (e.nombre_vues || 0), 0);
        setStats({
          total_views: totalViews,
          total_messages: 0, // To be implemented
          total_entreprises: (entreprises.results || entreprises).length
        });
      } else {
        // Load saved entreprises and alerts for acheteur
        try {
          const userAlerts = await AlertService.getAll();
          setAlerts(userAlerts.results || userAlerts);
        } catch (error) {
          console.error('Error loading alerts:', error);
          setAlerts([]);
        }
        
        try {
          const favorites = await EntrepriseService.getFavorites();
          setSavedEntreprises(favorites.results || favorites);
        } catch (error) {
          console.error('Error loading favorites:', error);
          setSavedEntreprises([]);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) {
      try {
        await EntrepriseService.delete(slug);
        toast.success('Entreprise supprimée avec succès');
        loadUserData();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleAlertFormChange = (e) => {
    setAlertForm({
      ...alertForm,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      await AlertService.create(alertForm);
      toast.success('Alerte créée avec succès !');
      setShowAlertForm(false);
      setAlertForm({
        name: '',
        region: '',
        min_price: '',
        max_price: ''
      });
      loadUserData();
    } catch (error) {
      toast.error('Erreur lors de la création de l\'alerte');
      console.error(error);
    }
  };

  const handleDeleteAlert = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
      try {
        await AlertService.delete(id);
        toast.success('Alerte supprimée avec succès');
        loadUserData();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleToggleAlert = async (id, isActive) => {
    try {
      await AlertService.toggle(id, !isActive);
      toast.success(isActive ? 'Alerte désactivée' : 'Alerte activée');
      loadUserData();
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const handleProfileFormChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordFormChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    // Validation côté client
    if (!profileForm.first_name || !profileForm.last_name) {
      toast.error('Le prénom et le nom sont obligatoires');
      return;
    }
    
    try {
      console.log('Sending profile update:', profileForm);
      const result = await AuthService.updateProfile(profileForm);
      console.log('Profile update result:', result);
      toast.success('Profil mis à jour avec succès !');
      setShowProfileEdit(false);
      loadUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error response:', error.response?.data);
      
      // Gestion améliorée des erreurs
      let errorMessage = 'Erreur lors de la mise à jour du profil';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Si c'est un objet avec des erreurs par champ
        if (typeof errorData === 'object' && !errorData.message && !errorData.error) {
          const errors = [];
          Object.keys(errorData).forEach(key => {
            const value = errorData[key];
            if (Array.isArray(value)) {
              errors.push(`${key}: ${value.join(', ')}`);
            } else {
              errors.push(`${key}: ${value}`);
            }
          });
          errorMessage = errors.join(' | ');
        } else {
          errorMessage = errorData.message || errorData.error || errorData.detail || errorMessage;
        }
      }
      
      toast.error(errorMessage);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (passwordForm.new_password.length < 8) {
      toast.error('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      await AuthService.changePassword(passwordForm.old_password, passwordForm.new_password);
      toast.success('Mot de passe changé avec succès !');
      setShowPasswordEdit(false);
      setPasswordForm({
        old_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      console.error('Password change error:', error);
      console.error('Error response:', error.response?.data);
      
      // Gestion améliorée des erreurs
      let errorMessage = 'Erreur lors du changement de mot de passe';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.detail) {
          // Si c'est un détail simple
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.join(', ');
          } else {
            errorMessage = errorData.detail;
          }
        } else if (typeof errorData === 'object') {
          // Si c'est un objet avec des erreurs par champ
          const errors = [];
          Object.keys(errorData).forEach(key => {
            const value = errorData[key];
            if (Array.isArray(value)) {
              errors.push(...value);
            } else {
              errors.push(value);
            }
          });
          if (errors.length > 0) {
            errorMessage = errors.join(', ');
          }
        }
      }
      
      toast.error(errorMessage);
    }
  };

  const handleRemoveFavorite = async (savedId) => {
    if (window.confirm('Êtes-vous sûr de vouloir retirer cette entreprise de vos favoris ?')) {
      try {
        await EntrepriseService.removeFavorite(savedId);
        toast.success('Entreprise retirée des favoris');
        loadUserData();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Tableau de bord</h1>
            <p>Bienvenue, {user?.first_name || user?.username} !</p>
          </div>
          {user?.user_type === 'vendeur' && (
            <Link to="/entreprises/create" className="btn btn-primary">
              Publier une entreprise
            </Link>
          )}
        </div>

        {/* Stats Cards for Vendeur */}
        {user?.user_type === 'vendeur' && (
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-value">{stats.total_entreprises}</div>
                <div className="stat-label">Entreprises publiées</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-value">{stats.total_views}</div>
                <div className="stat-label">Vues totales</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-value">{stats.total_messages}</div>
                <div className="stat-label">Messages reçus</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-value">{user?.is_verified ? 'Oui' : 'Non'}</div>
                <div className="stat-label">Compte vérifié</div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="dashboard-tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Vue d'ensemble
          </button>
          {user?.user_type === 'vendeur' && (
            <button
              className={`tab ${activeTab === 'entreprises' ? 'active' : ''}`}
              onClick={() => setActiveTab('entreprises')}
            >
              Mes entreprises
            </button>
          )}
          {user?.user_type === 'acheteur' && (
            <>
              <button
                className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
                onClick={() => setActiveTab('saved')}
              >
                Favoris
              </button>
              <button
                className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
                onClick={() => setActiveTab('alerts')}
              >
                Alertes
              </button>
            </>
          )}
          <button
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profil
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="dashboard-card">
              <h2>Bienvenue sur votre espace personnel</h2>
              <p className="welcome-text">
                {user?.user_type === 'vendeur' 
                  ? "Gérez vos annonces, consultez les statistiques et répondez aux demandes des acheteurs potentiels."
                  : "Découvrez les opportunités d'investissement, sauvegardez vos favoris et créez des alertes personnalisées."
                }
              </p>
              <div className="quick-actions">
                <h3>Actions rapides</h3>
                <div className="actions-grid">
                  {user?.user_type === 'vendeur' ? (
                    <>
                      <Link to="/entreprises/create" className="action-card">
                        <span className="action-icon">+</span>
                        <span>Publier une entreprise</span>
                      </Link>
                      <button className="action-card" onClick={() => setActiveTab('entreprises')}>
                        <span className="action-icon">→</span>
                        <span>Voir mes annonces</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/entreprises" className="action-card">
                        <span className="action-icon">→</span>
                        <span>Rechercher une entreprise</span>
                      </Link>
                      <button className="action-card" onClick={() => setActiveTab('saved')}>
                        <span className="action-icon">★</span>
                        <span>Mes favoris</span>
                      </button>
                      <button className="action-card" onClick={() => setActiveTab('alerts')}>
                        <span className="action-icon">!</span>
                        <span>Créer une alerte</span>
                      </button>
                    </>
                  )}
                  <button className="action-card" onClick={() => setActiveTab('profile')}>
                    <span className="action-icon"></span>
                    <span>Paramètres du profil</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Entreprises Tab (Vendeur) */}
          {activeTab === 'entreprises' && user?.user_type === 'vendeur' && (
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Mes entreprises</h2>
                <Link to="/entreprises/create" className="btn btn-primary">
                  + Nouvelle entreprise
                </Link>
              </div>

              {mesEntreprises.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">■</span>
                  <p>Vous n'avez pas encore publié d'entreprise.</p>
                  <Link to="/entreprises/create" className="btn btn-primary">
                    Publier ma première entreprise
                  </Link>
                </div>
              ) : (
                <div className="entreprises-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Statut</th>
                        <th>Prix</th>
                        <th>Vues</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mesEntreprises.map((entreprise) => (
                        <tr key={entreprise.id}>
                          <td>
                            <strong>{entreprise.nom}</strong>
                          </td>
                          <td>
                            <span className={`status-badge ${entreprise.statut}`}>
                              {entreprise.statut === 'publiee' && 'Publiée'}
                              {entreprise.statut === 'en_attente' && 'En attente'}
                              {entreprise.statut === 'brouillon' && 'Brouillon'}
                              {entreprise.statut === 'refusee' && 'Refusée'}
                              {entreprise.statut === 'vendue' && 'Vendue'}
                            </span>
                          </td>
                          <td><strong>{Number(entreprise.prix_demande).toLocaleString()} TND</strong></td>
                          <td>{entreprise.nombre_vues || 0} vues</td>
                          <td>{new Date(entreprise.created_at).toLocaleDateString('fr-TN')}</td>
                          <td className="actions">
                            <Link
                              to={`/entreprises/${entreprise.slug}`}
                              className="btn-icon"
                              title="Voir"
                            >
                              →
                            </Link>
                            <button
                              onClick={() => handleDelete(entreprise.slug)}
                              className="btn-icon delete"
                              title="Supprimer"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Saved Tab (Acheteur) */}
          {activeTab === 'saved' && user?.user_type === 'acheteur' && (
            <div className="dashboard-card">
              <h2>Mes entreprises favorites</h2>
              {savedEntreprises.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">★</span>
                  <p>Vous n'avez pas encore sauvegardé d'entreprises.</p>
                  <Link to="/entreprises" className="btn btn-primary">
                    Parcourir les entreprises
                  </Link>
                </div>
              ) : (
                <div className="saved-list">
                  {savedEntreprises.map((saved) => (
                    <div key={saved.id} className="saved-card">
                      <div className="saved-header">
                        <Link to={`/entreprises/${saved.entreprise.slug}`}>
                          <h3>{saved.entreprise.nom}</h3>
                        </Link>
                        <button
                          className="btn-icon delete"
                          onClick={() => handleRemoveFavorite(saved.id)}
                          title="Retirer des favoris"
                        >
                          ×
                        </button>
                      </div>
                      <div className="saved-info">
                        <p className="location">📍 {saved.entreprise.region} - {saved.entreprise.ville}</p>
                        <p className="price">💰 {Number(saved.entreprise.prix_demande).toLocaleString()} TND</p>
                      </div>
                      <p className="saved-description">
                        {saved.entreprise.description?.substring(0, 120)}...
                      </p>
                      <div className="saved-footer">
                        <span className="saved-date">
                          Ajouté le {new Date(saved.created_at).toLocaleDateString('fr-TN')}
                        </span>
                        <Link
                          to={`/entreprises/${saved.entreprise.slug}`}
                          className="btn btn-primary btn-sm"
                        >
                          Voir détails →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Alerts Tab (Acheteur) */}
          {activeTab === 'alerts' && user?.user_type === 'acheteur' && (
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Mes alertes de recherche</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowAlertForm(!showAlertForm)}
                >
                  {showAlertForm ? 'Annuler' : '+ Créer une alerte'}
                </button>
              </div>

              <p className="info-text">
                Créez des alertes pour être notifié quand une entreprise correspondant à vos critères est publiée.
              </p>

              {/* Alert Creation Form */}
              {showAlertForm && (
                <div className="alert-form-container">
                  <form onSubmit={handleCreateAlert} className="alert-form">
                    <div className="form-group">
                      <label>Nom de l'alerte *</label>
                      <input
                        type="text"
                        name="name"
                        value={alertForm.name}
                        onChange={handleAlertFormChange}
                        placeholder="Ex: Restaurants à Tunis"
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Région</label>
                        <select
                          name="region"
                          value={alertForm.region}
                          onChange={handleAlertFormChange}
                        >
                          <option value="">Toutes les régions</option>
                          <option value="tunis">Tunis</option>
                          <option value="ariana">Ariana</option>
                          <option value="ben_arous">Ben Arous</option>
                          <option value="manouba">Manouba</option>
                          <option value="nabeul">Nabeul</option>
                          <option value="sousse">Sousse</option>
                          <option value="sfax">Sfax</option>
                          <option value="gabes">Gabès</option>
                          <option value="medenine">Médenine</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Prix minimum (TND)</label>
                        <input
                          type="number"
                          name="min_price"
                          value={alertForm.min_price}
                          onChange={handleAlertFormChange}
                          placeholder="Ex: 50000"
                        />
                      </div>

                      <div className="form-group">
                        <label>Prix maximum (TND)</label>
                        <input
                          type="number"
                          name="max_price"
                          value={alertForm.max_price}
                          onChange={handleAlertFormChange}
                          placeholder="Ex: 500000"
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary">
                      Créer l'alerte
                    </button>
                  </form>
                </div>
              )}

              {/* Alerts List */}
              {alerts.length === 0 && !showAlertForm ? (
                <div className="empty-state">
                  <span className="empty-icon">!</span>
                  <p>Vous n'avez pas encore créé d'alertes.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowAlertForm(true)}
                  >
                    + Créer ma première alerte
                  </button>
                </div>
              ) : alerts.length > 0 && (
                <div className="alerts-list">
                  {alerts.map((alert) => (
                    <div key={alert.id} className={`alert-card ${!alert.is_active ? 'inactive' : ''}`}>
                      <div className="alert-header">
                        <h3>{alert.name}</h3>
                        <div className="alert-actions">
                          <button
                            className={`btn-toggle ${alert.is_active ? 'active' : ''}`}
                            onClick={() => handleToggleAlert(alert.id, alert.is_active)}
                            title={alert.is_active ? 'Désactiver' : 'Activer'}
                          >
                            {alert.is_active ? '🔔' : '🔕'}
                          </button>
                          <button
                            className="btn-icon delete"
                            onClick={() => handleDeleteAlert(alert.id)}
                            title="Supprimer"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <div className="alert-criteria">
                        {alert.region && (
                          <span className="criteria-badge">📍 {alert.region}</span>
                        )}
                        {alert.min_price && (
                          <span className="criteria-badge">💰 Min: {Number(alert.min_price).toLocaleString()} TND</span>
                        )}
                        {alert.max_price && (
                          <span className="criteria-badge">💰 Max: {Number(alert.max_price).toLocaleString()} TND</span>
                        )}
                      </div>
                      <div className="alert-status">
                        <span className={`status-badge ${alert.is_active ? 'active' : 'inactive'}`}>
                          {alert.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="alert-date">
                          Créée le {new Date(alert.created_at).toLocaleDateString('fr-TN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="dashboard-card">
              <h2>Informations du profil</h2>
              
              {!showProfileEdit ? (
                <>
                  <div className="profile-info">
                    <div className="info-row">
                      <span className="info-label">Nom complet:</span>
                      <span className="info-value">{user?.first_name} {user?.last_name}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Email:</span>
                      <span className="info-value">{user?.email}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Type de compte:</span>
                      <span className="info-value badge">
                        {user?.user_type === 'vendeur' ? 'Vendeur' : 'Acheteur'}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Téléphone:</span>
                      <span className="info-value">{user?.phone || 'Non renseigné'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Ville:</span>
                      <span className="info-value">{user?.city || 'Non renseignée'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Compte vérifié:</span>
                      <span className="info-value">{user?.is_verified ? 'Oui' : 'Non'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Membre depuis:</span>
                      <span className="info-value">{new Date(user?.created_at).toLocaleDateString('fr-TN')}</span>
                    </div>
                  </div>
                  <div className="profile-actions">
                    <button className="btn btn-secondary" onClick={() => setShowProfileEdit(true)}>
                      Modifier mon profil
                    </button>
                    <button className="btn btn-secondary" onClick={() => setShowPasswordEdit(true)}>
                      Changer mot de passe
                    </button>
                  </div>
                </>
              ) : (
                <div className="profile-edit-form">
                  <form onSubmit={handleUpdateProfile}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Prénom *</label>
                        <input
                          type="text"
                          name="first_name"
                          value={profileForm.first_name}
                          onChange={handleProfileFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Nom *</label>
                        <input
                          type="text"
                          name="last_name"
                          value={profileForm.last_name}
                          onChange={handleProfileFormChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Téléphone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileFormChange}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Ville</label>
                        <input
                          type="text"
                          name="city"
                          value={profileForm.city}
                          onChange={handleProfileFormChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Région</label>
                        <input
                          type="text"
                          name="region"
                          value={profileForm.region}
                          onChange={handleProfileFormChange}
                        />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">
                        Enregistrer
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => setShowProfileEdit(false)}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {showPasswordEdit && (
                <div className="password-edit-overlay">
                  <div className="password-edit-modal">
                    <h3>Changer le mot de passe</h3>
                    <form onSubmit={handleChangePassword}>
                      <div className="form-group">
                        <label>Mot de passe actuel</label>
                        <input
                          type="password"
                          name="old_password"
                          value={passwordForm.old_password}
                          onChange={handlePasswordFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Nouveau mot de passe</label>
                        <input
                          type="password"
                          name="new_password"
                          value={passwordForm.new_password}
                          onChange={handlePasswordFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Confirmer le nouveau mot de passe</label>
                        <input
                          type="password"
                          name="confirm_password"
                          value={passwordForm.confirm_password}
                          onChange={handlePasswordFormChange}
                          required
                        />
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                          Changer le mot de passe
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-secondary"
                          onClick={() => {
                            setShowPasswordEdit(false);
                            setPasswordForm({
                              old_password: '',
                              new_password: '',
                              confirm_password: ''
                            });
                          }}
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
