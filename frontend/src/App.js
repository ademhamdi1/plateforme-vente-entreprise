import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import EntrepriseList from './pages/Entreprises/EntrepriseList';
import EntrepriseDetail from './pages/Entreprises/EntrepriseDetail';
import Dashboard from './pages/Dashboard/Dashboard';
import CreateEntreprise from './pages/Entreprises/CreateEntreprise';
import Notifications from './pages/Notifications/Notifications';
import Messages from './pages/Messages/Messages';
import Comparison from './pages/Comparison/Comparison';
import ContactRequests from './pages/ContactRequests/ContactRequests';
import Categories from './pages/Categories/Categories';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import FAQ from './pages/FAQ/FAQ';
import Terms from './pages/Terms/Terms';
import Privacy from './pages/Privacy/Privacy';
import Cookies from './pages/Cookies/Cookies';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/entreprises" element={<EntrepriseList />} />
            <Route path="/entreprises/:slug" element={<EntrepriseDetail />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <Notifications />
                </PrivateRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <PrivateRoute>
                  <Messages />
                </PrivateRoute>
              }
            />
            <Route
              path="/contact-requests"
              element={
                <PrivateRoute>
                  <ContactRequests />
                </PrivateRoute>
              }
            />
            <Route
              path="/entreprises/create"
              element={
                <PrivateRoute>
                  <CreateEntreprise />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
