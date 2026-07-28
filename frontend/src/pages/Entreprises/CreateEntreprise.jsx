import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EntrepriseService from '../../services/entreprise.service';
import './Entreprise.css';

const CreateEntreprise = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    secteur: '',
    historique: '',
    region: '',
    ville: '',
    prix_demande: '',
    chiffre_affaires: '',
    nombre_employes: '',
    annee_creation: '',
    type_transaction: 'vente_totale',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await EntrepriseService.create(formData);
      toast.success('Entreprise créée avec succès !');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erreur lors de la création de l\'entreprise');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-entreprise-page">
      <div className="container">
        <h1>Publier une entreprise</h1>

        <form onSubmit={handleSubmit} className="entreprise-form">
          <div className="form-section">
            <h2>Informations générales</h2>

            <div className="form-group">
              <label>Nom de l'entreprise *</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                required
              />
            </div>

            <div className="form-group">
              <label>Secteur d'activité *</label>
              <select
                name="secteur"
                value={formData.secteur}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner un secteur</option>
                <option value="industrie">Industrie</option>
                <option value="agriculture">Agriculture</option>
                <option value="services">Services</option>
                <option value="commerce">Commerce</option>
                <option value="tourisme">Tourisme et hôtellerie</option>
                <option value="transport">Transport et logistique</option>
                <option value="sante">Santé</option>
                <option value="informatique">Informatique et technologie</option>
                <option value="education">Éducation et formation</option>
                <option value="btp">BTP et construction</option>
                <option value="franchise">Franchise</option>
                <option value="startup">Startup</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div className="form-group">
              <label>Historique de l'entreprise</label>
              <textarea
                name="historique"
                value={formData.historique}
                onChange={handleChange}
                rows="4"
                placeholder="Racontez l'histoire de votre entreprise, son évolution, ses réalisations..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Région *</label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="tunis">Tunis</option>
                  <option value="ariana">Ariana</option>
                  <option value="ben_arous">Ben Arous</option>
                  <option value="manouba">Manouba</option>
                  <option value="nabeul">Nabeul</option>
                  <option value="zaghouan">Zaghouan</option>
                  <option value="bizerte">Bizerte</option>
                  <option value="beja">Béja</option>
                  <option value="jendouba">Jendouba</option>
                  <option value="le_kef">Le Kef</option>
                  <option value="siliana">Siliana</option>
                  <option value="sousse">Sousse</option>
                  <option value="monastir">Monastir</option>
                  <option value="mahdia">Mahdia</option>
                  <option value="sfax">Sfax</option>
                  <option value="kairouan">Kairouan</option>
                  <option value="kasserine">Kasserine</option>
                  <option value="sidi_bouzid">Sidi Bouzid</option>
                  <option value="gabes">Gabès</option>
                  <option value="medenine">Médenine</option>
                  <option value="tataouine">Tataouine</option>
                  <option value="gafsa">Gafsa</option>
                  <option value="tozeur">Tozeur</option>
                  <option value="kebili">Kébili</option>
                </select>
              </div>

              <div className="form-group">
                <label>Ville *</label>
                <input
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Informations financières</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Prix demandé (TND) *</label>
                <input
                  type="number"
                  name="prix_demande"
                  value={formData.prix_demande}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Chiffre d'affaires (TND)</label>
                <input
                  type="number"
                  name="chiffre_affaires"
                  value={formData.chiffre_affaires}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Informations opérationnelles</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Nombre d'employés</label>
                <input
                  type="number"
                  name="nombre_employes"
                  value={formData.nombre_employes}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Année de création</label>
                <input
                  type="number"
                  name="annee_creation"
                  value={formData.annee_creation}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Type de transaction *</label>
              <select
                name="type_transaction"
                value={formData.type_transaction}
                onChange={handleChange}
                required
              >
                <option value="vente_totale">Vente totale</option>
                <option value="vente_partielle">Vente partielle</option>
                <option value="recherche_associe">Recherche d'associé</option>
                <option value="levee_fonds">Levée de fonds</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={loading}
          >
            {loading ? 'Publication...' : 'Publier l\'entreprise'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEntreprise;
