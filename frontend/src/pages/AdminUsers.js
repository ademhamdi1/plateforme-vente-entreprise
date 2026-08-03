import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminUserService from '../services/adminUserService';

function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all');

  useEffect(() => {
    const userType = localStorage.getItem('user_type');
    if (userType !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadUsers();
  }, [navigate]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminUserService.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      alert('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (user) => {
    const action = user.is_active ? 'suspendre' : 'réactiver';
    if (!window.confirm(`Voulez-vous ${action} cet utilisateur ?`)) {
      return;
    }
    try {
      await adminUserService.toggleActive(user.id);
      alert(`Utilisateur ${action} avec succès`);
      loadUsers();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la modification du statut');
    }
  };

  const handleToggleVerify = async (user) => {
    const action = user.is_verified ? 'déverifier' : 'vérifier';
    if (!window.confirm(`Voulez-vous ${action} cet utilisateur ?`)) {
      return;
    }
    try {
      await adminUserService.toggleVerify(user.id);
      alert(`Utilisateur ${action} avec succès`);
      loadUsers();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la modification de la vérification');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Voulez-vous supprimer l'utilisateur "${user.username}" ? Cette action est irréversible.`)) {
      return;
    }
    try {
      await adminUserService.delete(user.id);
      alert('Utilisateur supprimé avec succès');
      loadUsers();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const filteredUsers = users.filter((user) => {
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      (user.username && user.username.toLowerCase().includes(term)) ||
      (user.email && user.email.toLowerCase().includes(term));
    const matchesType = typeFilter === 'all' || user.user_type === typeFilter;
    const matchesActive =
      activeFilter === 'all' ||
      (activeFilter === 'true' && user.is_active) ||
      (activeFilter === 'false' && !user.is_active);
    const matchesVerified =
      verifiedFilter === 'all' ||
      (verifiedFilter === 'true' && user.is_verified) ||
      (verifiedFilter === 'false' && !user.is_verified);
    return matchesSearch && matchesType && matchesActive && matchesVerified;
  });

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
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col gap-3 mb-8">
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
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
            Gestion des Utilisateurs
          </h1>
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
            Retour Dashboard
          </button>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1">
              <label htmlFor="search" className="label">Recherche</label>
              <input
                id="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nom ou email..."
                className="input"
              />
            </div>
            <div>
              <label htmlFor="typeFilter" className="label">Type d'utilisateur</label>
              <select
                id="typeFilter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="input"
              >
                <option value="all">Tous</option>
                <option value="vendeur">Vendeur</option>
                <option value="acheteur">Acheteur</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label htmlFor="activeFilter" className="label">Statut actif</label>
              <select
                id="activeFilter"
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="input"
              >
                <option value="all">Tous</option>
                <option value="true">Actif</option>
                <option value="false">Suspendu</option>
              </select>
            </div>
            <div>
              <label htmlFor="verifiedFilter" className="label">Statut vérifié</label>
              <select
                id="verifiedFilter"
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value)}
                className="input"
              >
                <option value="all">Tous</option>
                <option value="true">Vérifié</option>
                <option value="false">Non vérifié</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-gray-600">
          {filteredUsers.length} utilisateur(s) trouvé(s)
        </div>

        {/* Users Table */}
        {filteredUsers.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-12 text-center">
            <svg
              className="h-12 w-12 text-gray-300 mb-3"
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
            <p className="text-gray-600 font-medium">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <div className="card overflow-x-auto p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">
                    Utilisateur
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">
                    Email
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">
                    Type
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">
                    Vérifié
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">
                    Actif
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">
                    Créé le
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{user.username}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 capitalize">
                        {user.user_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.is_verified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          Vérifié
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                          Non vérifié
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {user.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                          Suspendu
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                        : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          onClick={() => handleToggleActive(user)}
                          className={user.is_active ? 'btn-danger' : 'btn-primary'}
                          title={user.is_active ? 'Suspendre' : 'Réactiver'}
                        >
                          {user.is_active ? 'Suspendre' : 'Réactiver'}
                        </button>
                        <button
                          onClick={() => handleToggleVerify(user)}
                          className="btn-secondary"
                          title={user.is_verified ? 'Déverifier' : 'Vérifier'}
                        >
                          {user.is_verified ? 'Déverifier' : 'Vérifier'}
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="btn-danger"
                          title="Supprimer"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
