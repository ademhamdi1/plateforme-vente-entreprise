import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AdminActualites() {
  const navigate = useNavigate();
  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState(null);

  // Form state
  const emptyForm = {
    titre: '',
    contenu: '',
    est_publiee: false,
    date_publication: '',
  };
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const userType = localStorage.getItem('user_type');
    if (userType !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadActualites();
  }, [navigate]);

  const loadActualites = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/entreprises/actualites/');
      const data = response.data;
      setActualites(Array.isArray(data) ? data : (data?.results || []));
    } catch (err) {
      console.error('Erreur lors du chargement des actualités:', err);
      setError('Erreur lors du chargement des actualités');
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingSlug(null);
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEditModal = (actualite) => {
    setEditingSlug(actualite.slug);
    setFormData({
      titre: actualite.titre || '',
      contenu: actualite.contenu || '',
      est_publiee: !!actualite.est_publiee,
      date_publication: actualite.date_publication
        ? toDateTimeLocalValue(actualite.date_publication)
        : '',
    });
    setImageFile(null);
    setImagePreview(actualite.image_url || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSlug(null);
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Le fichier sélectionné n'est pas une image valide");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5 MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append('titre', formData.titre);
    fd.append('contenu', formData.contenu);
    fd.append('est_publiee', formData.est_publiee ? 'true' : 'false');

    // date_publication: defaults to now if empty
    if (formData.date_publication) {
      fd.append('date_publication', formData.date_publication);
    } else if (!editingSlug) {
      fd.append('date_publication', new Date().toISOString());
    }

    if (imageFile) {
      fd.append('image', imageFile);
    }

    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titre.trim() || !formData.contenu.trim()) {
      alert('Le titre et le contenu sont obligatoires');
      return;
    }

    try {
      setSubmitting(true);
      const payload = buildFormData();
      const headers = { 'Content-Type': 'multipart/form-data' };

      if (editingSlug) {
        await api.put(`/entreprises/actualites/${editingSlug}/`, payload, { headers });
        alert('Actualité modifiée avec succès');
      } else {
        await api.post('/entreprises/actualites/', payload, { headers });
        alert('Actualité créée avec succès');
      }

      closeModal();
      loadActualites();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      const msg =
        err.response?.data?.titre?.[0] ||
        err.response?.data?.contenu?.[0] ||
        err.response?.data?.detail ||
        'Erreur lors de la sauvegarde de l\'actualité';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm('Voulez-vous supprimer cette actualité ? Cette action est irréversible.')) {
      return;
    }

    try {
      await api.delete(`/entreprises/actualites/${slug}/`);
      alert('Actualité supprimée avec succès');
      loadActualites();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      const msg =
        err.response?.data?.detail ||
        'Erreur lors de la suppression de l\'actualité';
      alert(msg);
    }
  };

  // ===== Helpers =====

  const toDateTimeLocalValue = (dateString) => {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return '';
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncate = (text, max = 120) => {
    if (!text) return '';
    return text.length <= max ? text : text.substring(0, max) + '...';
  };

  // ===== Render =====

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center min-h-[200px] text-gray-500">
            <svg
              className="animate-spin h-6 w-6 mr-2 text-primary-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Chargement...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/admin')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white text-primary-600 border-2 border-primary-500 font-semibold hover:bg-primary-50 active:scale-95 transition-all duration-200 w-fit"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Retour au dashboard
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <svg
                className="h-7 w-7 text-primary-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5"
                />
              </svg>
              Gestion des Actualités
            </h1>
          </div>
          <button onClick={openCreateModal} className="btn-primary inline-flex items-center justify-center gap-2">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nouvelle actualité
          </button>
        </div>

        {error && (
          <div className="text-danger-700 bg-danger-50 border border-danger-200 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {/* List */}
        {actualites.length === 0 ? (
          <div className="empty-state">
            <div className="flex-shrink-0 h-16 w-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-primary-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune actualité</h3>
            <p className="text-gray-600">Créez votre première actualité en cliquant sur "Nouvelle actualité".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {actualites.map((actualite) => (
              <div key={actualite.id} className="card flex flex-col">
                {/* Image + body */}
                {actualite.image_url && (
                  <div className="aspect-[16/9] overflow-hidden rounded-t-2xl bg-gray-100 -mx-6 -mt-6 mb-4">
                    <img
                      src={actualite.image_url}
                      alt={actualite.titre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{actualite.titre}</h3>
                  {actualite.est_publiee ? (
                    <span className="badge-success whitespace-nowrap">
                      <svg
                        className="h-3 w-3 inline mr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Publié
                    </span>
                  ) : (
                    <span className="badge-warning whitespace-nowrap">
                      <svg
                        className="h-3 w-3 inline mr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Brouillon
                    </span>
                  )}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3">
                  {truncate(actualite.contenu, 200)}
                </p>

                <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
                  <span className="inline-flex items-center gap-1">
                    <svg
                      className="h-4 w-4 text-primary-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                    {actualite.auteur_nom || 'Admin'}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                      />
                    </svg>
                    {formatDate(actualite.date_publication)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100 mt-auto">
                  <button
                    onClick={() => openEditModal(actualite)}
                    className="btn-secondary inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm"
                  >
                    <svg
                      className="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
                      />
                    </svg>
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(actualite.slug)}
                    className="btn-danger inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm"
                  >
                    <svg
                      className="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Create / Edit */}
        {modalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-2xl shadow-floating max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <svg
                    className="h-6 w-6 text-primary-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5"
                    />
                  </svg>
                  {editingSlug ? "Modifier l'actualité" : 'Nouvelle actualité'}
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Fermer"
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Titre */}
                <div>
                  <label htmlFor="titre" className="label">
                    Titre *
                  </label>
                  <input
                    id="titre"
                    name="titre"
                    type="text"
                    value={formData.titre}
                    onChange={handleInputChange}
                    placeholder="Titre de l'actualité"
                    required
                    className="input"
                  />
                </div>

                {/* Contenu */}
                <div>
                  <label htmlFor="contenu" className="label">
                    Contenu *
                  </label>
                  <textarea
                    id="contenu"
                    name="contenu"
                    value={formData.contenu}
                    onChange={handleInputChange}
                    placeholder="Contenu de l'actualité..."
                    rows="6"
                    required
                    className="input resize-none"
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="label">Image (optionnelle)</label>
                  <input
                    type="file"
                    id="actualiteImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {!imagePreview ? (
                    <label
                      htmlFor="actualiteImage"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors"
                    >
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <svg
                          className="h-8 w-8 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                          />
                        </svg>
                        <span className="font-medium text-primary-600">Cliquez pour ajouter une image</span>
                        <span className="text-xs text-gray-400">PNG, JPG (max 5 MB)</span>
                      </div>
                    </label>
                  ) : (
                    <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-xl bg-gray-50">
                      <img
                        src={imagePreview}
                        alt="Aperçu"
                        className="h-24 w-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="btn-danger inline-flex items-center gap-2"
                      >
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165"
                          />
                        </svg>
                        Supprimer l'image
                      </button>
                    </div>
                  )}
                </div>

                {/* Date publication */}
                <div>
                  <label htmlFor="date_publication" className="label">
                    Date de publication (optionnel - défaut: maintenant)
                  </label>
                  <input
                    id="date_publication"
                    name="date_publication"
                    type="datetime-local"
                    value={formData.date_publication}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>

                {/* Est publiée */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="est_publiee"
                    checked={formData.est_publiee}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-700">Publier cette actualité</span>
                </label>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={closeModal} className="btn-secondary">
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary inline-flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {editingSlug ? 'Enregistrer' : 'Créer'}
                      </>
                    )}
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

export default AdminActualites;
