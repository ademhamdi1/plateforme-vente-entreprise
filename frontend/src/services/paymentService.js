import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/**
 * Service pour gérer les paiements Stripe
 * Données sauvegardées dans PostgreSQL
 */

/**
 * Obtenir la clé publique Stripe
 * @returns {Promise<string>} Stripe public key
 */
export const getStripePublicKey = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/payment/public-key/`);
    return response.data.publicKey;
  } catch (error) {
    console.error('Erreur obtention clé Stripe:', error);
    throw error;
  }
};

/**
 * Créer une session de paiement Stripe Checkout
 * @param {string} plan - 'basic', 'premium', 'enterprise'
 * @param {string} period - 'monthly' ou 'annual'
 * @param {string} token - JWT token
 * @returns {Promise<Object>} {sessionId, checkoutUrl}
 */
export const createCheckoutSession = async (plan, period, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/payment/create-checkout-session/`,
      { plan, period },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur création session Stripe:', error);
    throw error;
  }
};

/**
 * Créer un Payment Intent Stripe
 * @param {string} plan - 'basic', 'premium', 'enterprise'
 * @param {string} period - 'monthly' ou 'annual'
 * @param {string} token - JWT token
 * @returns {Promise<Object>} {clientSecret, paymentIntentId}
 */
export const createPaymentIntent = async (plan, period, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/payment/create-payment-intent/`,
      { plan, period },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur création Payment Intent:', error);
    throw error;
  }
};

/**
 * Enregistrer un paiement DEMO dans PostgreSQL
 * @param {string} plan - 'basic', 'premium', 'professionnel'
 * @param {string} period - 'monthly' ou 'annual'
 * @param {string} token - JWT token
 * @returns {Promise<Object>}
 */
export const createDemoPayment = async (plan, period, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/payment/demo/`,
      { plan, period },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur paiement DEMO:', error);
    throw error;
  }
};

const paymentService = {
  getStripePublicKey,
  createCheckoutSession,
  createPaymentIntent,
  createDemoPayment,
};

export default paymentService;
