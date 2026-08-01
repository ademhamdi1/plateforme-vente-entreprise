import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/**
 * Service pour envoyer des messages de contact
 * Données sauvegardées dans PostgreSQL
 */

/**
 * Envoyer un message de contact
 * @param {Object} messageData - { nom, email, sujet, message }
 * @returns {Promise}
 */
export const envoyerMessageContact = async (messageData) => {
  try {
    const response = await axios.post(`${API_URL}/users/contact/`, messageData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    throw error;
  }
};

const contactService = {
  envoyerMessageContact,
};

export default contactService;
