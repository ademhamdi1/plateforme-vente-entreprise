import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import PublierEntreprise from './pages/PublierEntreprise';
import ModifierEntreprise from './pages/ModifierEntreprise';
import ListeEntreprises from './pages/ListeEntreprises';
import DetailEntreprise from './pages/DetailEntreprise';
import Messages from './pages/Messages';
import ConversationDetail from './pages/ConversationDetail';
import Favoris from './pages/Favoris';
import GestionMedias from './pages/GestionMedias';
import Abonnement from './pages/Abonnement';
import Statistiques from './pages/Statistiques';
import Notifications from './pages/Notifications';
import SoumettreAvis from './pages/SoumettreAvis';
import AdminTemoignages from './pages/AdminTemoignages';
import AdminEntreprisesPubliees from './pages/AdminEntreprisesPubliees';
import AdminFAQ from './pages/AdminFAQ';
import AdminUsers from './pages/AdminUsers';
import AdminFinances from './pages/AdminFinances';
import AdminActualites from './pages/AdminActualites';
import Profil from './pages/Profil';
import MesAlertes from './pages/MesAlertes';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Actualites from './pages/Actualites';
import ActualiteDetail from './pages/ActualiteDetail';
import Comparateur from './pages/Comparateur';
import CGU from './pages/CGU';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import MentionsLegales from './pages/MentionsLegales';
import VerifyEmail from './pages/VerifyEmail';
import RequestPasswordReset from './pages/RequestPasswordReset';
import ResetPassword from './pages/ResetPassword';

// Components
import TopBar from './components/TopBar';
import BottomTabBar from './components/BottomTabBar';
import SideDrawer from './components/SideDrawer';
import Footer from './components/Footer';

// Services
import { messagingService } from './services/messagingService';
import { notificationService } from './services/notificationService';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  const isAuthenticated = localStorage.getItem('access_token');

  useEffect(() => {
    if (isAuthenticated) {
      loadUnreadCount();
      loadNotificationCount();
      const interval = setInterval(() => {
        loadUnreadCount();
        loadNotificationCount();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadUnreadCount = async () => {
    try {
      const count = await messagingService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Erreur chargement messages non lus:', err);
    }
  };

  const loadNotificationCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setNotificationCount(count);
    } catch (err) {
      console.error('Erreur chargement notifications:', err);
    }
  };

  return (
    <Router>
      <div className="App">
        <TopBar
          onOpenDrawer={() => setDrawerOpen(true)}
          unreadCount={unreadCount}
          notificationCount={notificationCount}
        />
        <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/publier" element={<PublierEntreprise />} />
            <Route path="/modifier/:slug" element={<ModifierEntreprise />} />
            <Route path="/entreprises" element={<ListeEntreprises />} />
            <Route path="/entreprises/:slug" element={<DetailEntreprise />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:id" element={<ConversationDetail />} />
            <Route path="/favoris" element={<Favoris />} />
            <Route path="/medias/:slug" element={<GestionMedias />} />
            <Route path="/abonnement" element={<Abonnement />} />
            <Route path="/statistiques/:slug" element={<Statistiques />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/soumettre-avis" element={<SoumettreAvis />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/alertes" element={<MesAlertes />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/actualites" element={<Actualites />} />
            <Route path="/actualites/:slug" element={<ActualiteDetail />} />
            <Route path="/comparateur" element={<Comparateur />} />
            <Route path="/admin/temoignages" element={<AdminTemoignages />} />
            <Route path="/admin/entreprises-publiees" element={<AdminEntreprisesPubliees />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/finances" element={<AdminFinances />} />
            <Route path="/admin/faq" element={<AdminFAQ />} />
            <Route path="/admin/actualites" element={<AdminActualites />} />
            <Route path="/cgu" element={<CGU />} />
            <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/verify-email/:uidb64/:token" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<RequestPasswordReset />} />
            <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
          </Routes>
        </main>

        <Footer />
        <BottomTabBar />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
