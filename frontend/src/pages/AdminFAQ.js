import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import faqService from '../services/faqService';

const CATEGORIES = [
  { value: 'General', label: 'General' },
  { value: 'Vendeurs', label: 'Vendeurs' },
  { value: 'Acheteurs', label: 'Acheteurs' },
  { value: 'Abonnements', label: 'Abonnements' },
  { value: 'Securite', label: 'Securite' },
];

const EMPTY_FORM = {
  question: '',
  reponse: '',
  categorie: 'General',
  ordre: 0,
  est_publie: false,
};

function AdminFAQ() {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState(null); // null | 'create' | 'edit'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    const userType = localStorage.getItem('user_type');
    if (userType !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadFaqs();
  }, [navigate]);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const data = await faqService.getAllAdmin();
      setFaqs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur chargement FAQ:', err);
      alert('Erreur lors du chargement des questions FAQ');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData(EMPTY_FORM);
    setModalState('create');
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      question: item.question || '',
      reponse: item.reponse || '',
      categorie: item.categorie || 'General',
      ordre: item.ordre ?? 0,
      est_publie: !!item.est_publie,
    });
    setModalState('edit');
  };

  const closeModal = () => {
    setModalState(null);
    setEditingItem(null);
    setFormData(EMPTY_FORM);
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'ordre' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.question.trim() || !formData.reponse.trim()) {
      alert('La question et la réponse sont obligatoires');
      return;
    }

    try {
      if (modalState === 'edit' && editingItem) {
        await faqService.update(editingItem.id, formData);
        alert('Question FAQ modifiée avec succès');
      } else {
        await faqService.create(formData);
        alert('Question FAQ créée avec succès');
      }
      closeModal();
      loadFaqs();
    } catch (err) {
      console.error('Erreur enregistrement FAQ:', err);
      alert("Erreur lors de l'enregistrement de la question");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous supprimer cette question FAQ ? Cette action est irréversible.')) {
      return;
    }

    try {
      await faqService.delete(id);
      alert('Question FAQ supprimée avec succès');
      loadFaqs();
    } catch (err) {
      console.error('Erreur suppression FAQ:', err);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center min-h-[200px] text-gray-500">
            <svg className="animate-spin h-6 w-6 mr-2 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col gap-3 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="h-7 w-7 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Gestion de la FAQ
          </h1>
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white text-primary-600 border-2 border-primary-500 font-semibold hover:bg-primary-50 active:scale-95 transition-all duration-200 w-fit"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Retour Dashboard
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex justify-end mb-6">
          <button
            onClick={openCreateModal}
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter FAQ
          </button>
        </div>

        {/* Table */}
        {faqs.length === 0 ? (
          <div className="card text-center">
            <div className="flex-shrink-0 h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune question FAQ</h3>
            <p className="text-gray-600">Commencez par ajouter une nouvelle question.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">Question</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">Catégorie</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">Ordre</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">Statut</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {faqs.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-900 font-medium">
                        {item.question}
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge badge-primary">
                          {item.categorie_label || item.categorie}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {item.ordre}
                      </td>
                      <td className="px-4 py-3">
                        {item.est_publie ? (
                          <span className="badge-success">
                            <svg className="h-3 w-3 inline mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            Publié
                          </span>
                        ) : (
                          <span className="badge-warning">
                            <svg className="h-3 w-3 inline mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Brouillon
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="btn-secondary inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm"
                          >
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                            </svg>
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="btn-danger inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm"
                          >
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Create / Edit */}
      {modalState && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-floating max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {modalState === 'edit' ? 'Modifier la question' : 'Ajouter une question'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="question" className="label">Question</label>
                <input
                  id="question"
                  name="question"
                  type="text"
                  value={formData.question}
                  onChange={handleChange}
                  className="input"
                  placeholder="Saisissez la question"
                  required
                />
              </div>

              <div>
                <label htmlFor="reponse" className="label">Réponse</label>
                <textarea
                  id="reponse"
                  name="reponse"
                  value={formData.reponse}
                  onChange={handleChange}
                  rows="4"
                  className="input resize-none"
                  placeholder="Saisissez la réponse"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="categorie" className="label">Catégorie</label>
                  <select
                    id="categorie"
                    name="categorie"
                    value={formData.categorie}
                    onChange={handleChange}
                    className="input"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="ordre" className="label">Ordre</label>
                  <input
                    id="ordre"
                    name="ordre"
                    type="number"
                    min="0"
                    value={formData.ordre}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="est_publie"
                  name="est_publie"
                  type="checkbox"
                  checked={formData.est_publie}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="est_publie" className="label mb-0 cursor-pointer">
                  Publier cette question
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  {modalState === 'edit' ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminFAQ;
