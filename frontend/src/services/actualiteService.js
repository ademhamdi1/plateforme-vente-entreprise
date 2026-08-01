import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ActualiteService {
  /**
   * Récupérer toutes les actualités publiées
   */
  async getActualites() {
    const response = await axios.get(`${API_URL}/entreprises/actualites/`);
    return response.data;
  }

  /**
   * Récupérer les 5 actualités les plus récentes
   */
  async getActualitesRecentes() {
    const response = await axios.get(`${API_URL}/entreprises/actualites/recentes/`);
    return response.data;
  }

  /**
   * Récupérer une actualité par son slug
   */
  async getActualite(slug) {
    const response = await axios.get(`${API_URL}/entreprises/actualites/${slug}/`);
    return response.data;
  }
}

export default new ActualiteService();
