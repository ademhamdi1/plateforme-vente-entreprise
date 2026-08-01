"""
Tests pour l'application entreprises
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Entreprise, EntrepriseImage, EntrepriseDocument
from .favoris_models import Favori
from .messaging_models import Conversation, Message
from datetime import datetime, timedelta
from django.utils import timezone

User = get_user_model()


class EntrepriseModelTests(TestCase):
    """Tests du modèle Entreprise"""
    
    def setUp(self):
        self.vendeur = User.objects.create_user(
            username='vendeur',
            email='vendeur@test.com',
            password='pass123',
            user_type='vendeur'
        )
    
    def test_create_entreprise(self):
        """Test création entreprise"""
        entreprise = Entreprise.objects.create(
            nom='Test Entreprise',
            description='Description test',
            secteur='commerce',
            region='tunis',
            ville='Tunis',
            prix_demande=100000,
            vendeur=self.vendeur,
            statut='brouillon'
        )
        self.assertEqual(entreprise.nom, 'Test Entreprise')
        self.assertEqual(entreprise.nombre_vues, 0)
        self.assertIsNotNone(entreprise.slug)
    
    def test_increment_views(self):
        """Test incrémentation des vues"""
        entreprise = Entreprise.objects.create(
            nom='Test Entreprise',
            description='Description test',
            secteur='commerce',
            region='tunis',
            ville='Tunis',
            prix_demande=100000,
            vendeur=self.vendeur
        )
        initial_views = entreprise.nombre_vues
        entreprise.increment_views()
        entreprise.refresh_from_db()
        self.assertEqual(entreprise.nombre_vues, initial_views + 1)
    
    def test_mise_en_avant_active(self):
        """Test vérification mise en avant active"""
        entreprise = Entreprise.objects.create(
            nom='Test Entreprise',
            description='Description test',
            secteur='commerce',
            region='tunis',
            ville='Tunis',
            prix_demande=100000,
            vendeur=self.vendeur,
            est_mise_en_avant=True,
            date_debut_mise_en_avant=timezone.now(),
            date_fin_mise_en_avant=timezone.now() + timedelta(days=30)
        )
        self.assertTrue(entreprise.est_active_mise_en_avant)
    
    def test_mise_en_avant_expiree(self):
        """Test mise en avant expirée"""
        entreprise = Entreprise.objects.create(
            nom='Test Entreprise',
            description='Description test',
            secteur='commerce',
            region='tunis',
            ville='Tunis',
            prix_demande=100000,
            vendeur=self.vendeur,
            est_mise_en_avant=True,
            date_debut_mise_en_avant=timezone.now() - timedelta(days=60),
            date_fin_mise_en_avant=timezone.now() - timedelta(days=30)
        )
        self.assertFalse(entreprise.est_active_mise_en_avant)


class EntrepriseAPITests(TestCase):
    """Tests API Entreprises"""
    
    def setUp(self):
        self.client = APIClient()
        self.vendeur = User.objects.create_user(
            username='vendeur',
            email='vendeur@test.com',
            password='pass123',
            user_type='vendeur'
        )
        self.acheteur = User.objects.create_user(
            username='acheteur',
            email='acheteur@test.com',
            password='pass123',
            user_type='acheteur'
        )
        self.entreprise = Entreprise.objects.create(
            nom='Test Entreprise',
            description='Description test',
            secteur='commerce',
            region='tunis',
            ville='Tunis',
            prix_demande=100000,
            vendeur=self.vendeur,
            statut='publiee',
            published_at=timezone.now()
        )
    
    def test_list_entreprises_public(self):
        """Test liste entreprises accessible sans auth"""
        url = '/api/entreprises/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_create_entreprise_vendeur_only(self):
        """Test seul vendeur peut créer entreprise"""
        self.client.force_authenticate(user=self.vendeur)
        url = '/api/entreprises/create/'
        data = {
            'nom': 'Nouvelle Entreprise',
            'description': 'Description',
            'secteur': 'services',
            'region': 'sousse',
            'ville': 'Sousse',
            'prix_demande': 50000
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_create_entreprise_acheteur_forbidden(self):
        """Test acheteur ne peut pas créer entreprise"""
        self.client.force_authenticate(user=self.acheteur)
        url = '/api/entreprises/create/'
        data = {
            'nom': 'Nouvelle Entreprise',
            'description': 'Description',
            'secteur': 'services',
            'region': 'sousse',
            'ville': 'Sousse',
            'prix_demande': 50000
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_detail_entreprise_increments_views(self):
        """Test détail entreprise incrémente vues"""
        initial_views = self.entreprise.nombre_vues
        url = f'/api/entreprises/{self.entreprise.slug}/'
        self.client.get(url)
        self.entreprise.refresh_from_db()
        self.assertEqual(self.entreprise.nombre_vues, initial_views + 1)


class FavorisTests(TestCase):
    """Tests du système de favoris"""
    
    def setUp(self):
        self.client = APIClient()
        self.vendeur = User.objects.create_user(
            username='vendeur',
            email='vendeur@test.com',
            password='pass123',
            user_type='vendeur'
        )
        self.acheteur = User.objects.create_user(
            username='acheteur',
            email='acheteur@test.com',
            password='pass123',
            user_type='acheteur'
        )
        self.entreprise = Entreprise.objects.create(
            nom='Test Entreprise',
            description='Description',
            secteur='commerce',
            region='tunis',
            ville='Tunis',
            prix_demande=100000,
            vendeur=self.vendeur,
            statut='publiee'
        )
    
    def test_add_favori(self):
        """Test ajout aux favoris"""
        self.client.force_authenticate(user=self.acheteur)
        url = '/api/entreprises/favoris/add/'
        data = {'entreprise_slug': self.entreprise.slug}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            Favori.objects.filter(
                acheteur=self.acheteur,
                entreprise=self.entreprise
            ).exists()
        )
    
    def test_remove_favori(self):
        """Test retrait des favoris"""
        Favori.objects.create(
            acheteur=self.acheteur,
            entreprise=self.entreprise
        )
        self.client.force_authenticate(user=self.acheteur)
        url = f'/api/entreprises/favoris/{self.entreprise.slug}/remove/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(
            Favori.objects.filter(
                acheteur=self.acheteur,
                entreprise=self.entreprise
            ).exists()
        )
    
    def test_vendeur_cannot_add_own_entreprise(self):
        """Test vendeur ne peut pas ajouter sa propre entreprise"""
        self.client.force_authenticate(user=self.vendeur)
        url = '/api/entreprises/favoris/add/'
        data = {'entreprise_slug': self.entreprise.slug}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class MessagingTests(TestCase):
    """Tests du système de messagerie"""
    
    def setUp(self):
        self.client = APIClient()
        self.vendeur = User.objects.create_user(
            username='vendeur',
            email='vendeur@test.com',
            password='pass123',
            user_type='vendeur'
        )
        self.acheteur = User.objects.create_user(
            username='acheteur',
            email='acheteur@test.com',
            password='pass123',
            user_type='acheteur'
        )
        self.entreprise = Entreprise.objects.create(
            nom='Test Entreprise',
            description='Description',
            secteur='commerce',
            region='tunis',
            ville='Tunis',
            prix_demande=100000,
            vendeur=self.vendeur,
            statut='publiee'
        )
    
    def test_create_conversation(self):
        """Test création conversation"""
        self.client.force_authenticate(user=self.acheteur)
        url = '/api/entreprises/messages/conversations/create/'
        data = {'entreprise_slug': self.entreprise.slug}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            Conversation.objects.filter(
                entreprise=self.entreprise,
                acheteur=self.acheteur,
                vendeur=self.vendeur
            ).exists()
        )
    
    def test_send_message(self):
        """Test envoi message"""
        conversation = Conversation.objects.create(
            entreprise=self.entreprise,
            acheteur=self.acheteur,
            vendeur=self.vendeur
        )
        self.client.force_authenticate(user=self.acheteur)
        url = f'/api/entreprises/messages/conversations/{conversation.id}/send/'
        data = {'content': 'Message de test'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            Message.objects.filter(
                conversation=conversation,
                sender=self.acheteur,
                content='Message de test'
            ).exists()
        )
    
    def test_unread_messages_count(self):
        """Test comptage messages non lus"""
        conversation = Conversation.objects.create(
            entreprise=self.entreprise,
            acheteur=self.acheteur,
            vendeur=self.vendeur
        )
        Message.objects.create(
            conversation=conversation,
            sender=self.acheteur,
            content='Message 1',
            is_read=False
        )
        Message.objects.create(
            conversation=conversation,
            sender=self.acheteur,
            content='Message 2',
            is_read=False
        )
        
        self.client.force_authenticate(user=self.vendeur)
        url = '/api/entreprises/messages/unread-count/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['unread_count'], 2)


class SearchFilterTests(TestCase):
    """Tests des filtres de recherche"""
    
    def setUp(self):
        self.client = APIClient()
        self.vendeur = User.objects.create_user(
            username='vendeur',
            email='vendeur@test.com',
            password='pass123',
            user_type='vendeur'
        )
        
        # Créer plusieurs entreprises
        Entreprise.objects.create(
            nom='Commerce Tunis',
            description='Description',
            secteur='commerce',
            region='tunis',
            ville='Tunis',
            prix_demande=50000,
            vendeur=self.vendeur,
            statut='publiee'
        )
        Entreprise.objects.create(
            nom='Services Sousse',
            description='Description',
            secteur='services',
            region='sousse',
            ville='Sousse',
            prix_demande=150000,
            vendeur=self.vendeur,
            statut='publiee'
        )
    
    def test_filter_by_secteur(self):
        """Test filtre par secteur"""
        url = '/api/entreprises/?secteur=commerce'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        # Vérifier qu'on reçoit au moins une entreprise commerce
        commerce_count = sum(1 for e in results if e['secteur'] == 'commerce')
        self.assertGreater(commerce_count, 0)
    
    def test_filter_by_region(self):
        """Test filtre par région"""
        url = '/api/entreprises/?region=tunis'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        # Vérifier qu'on reçoit au moins une entreprise à Tunis
        tunis_count = sum(1 for e in results if e['region'] == 'tunis')
        self.assertGreater(tunis_count, 0)
    
    def test_filter_by_prix_max(self):
        """Test filtre par prix maximum"""
        url = '/api/entreprises/?prix_max=100000'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        # Vérifier qu'on reçoit au moins une entreprise <= 100000
        affordable_count = sum(1 for e in results if float(e['prix_demande']) <= 100000)
        self.assertGreater(affordable_count, 0)



class ActualiteTests(TestCase):
    """Tests du système d'actualités"""
    
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username='admin',
            email='admin@test.com',
            password='pass123',
            user_type='admin',
            is_staff=True
        )
        from .actualite_models import Actualite
        self.actualite = Actualite.objects.create(
            titre='Test Actualité',
            contenu='Contenu de test',
            auteur=self.admin,
            est_publiee=True,
            date_publication=timezone.now()
        )
    
    def test_list_actualites_public(self):
        """Test liste actualités accessible sans auth"""
        url = '/api/entreprises/actualites/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_actualite_slug_generation(self):
        """Test génération automatique du slug"""
        from .actualite_models import Actualite
        actualite = Actualite.objects.create(
            titre='Nouvelle Actualité Test',
            contenu='Contenu',
            auteur=self.admin
        )
        self.assertIsNotNone(actualite.slug)
        self.assertIn('nouvelle-actualite-test', actualite.slug)
    
    def test_actualite_detail(self):
        """Test détail actualité"""
        url = f'/api/entreprises/actualites/{self.actualite.slug}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class AdminViewsTests(TestCase):
    """Tests des vues admin"""
    
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username='admin',
            email='admin@test.com',
            password='pass123',
            user_type='admin',
            is_staff=True
        )
        self.vendeur = User.objects.create_user(
            username='vendeur',
            email='vendeur@test.com',
            password='pass123',
            user_type='vendeur'
        )
        self.entreprise_attente = Entreprise.objects.create(
            nom='Entreprise en attente',
            description='Description',
            secteur='commerce',
            region='tunis',
            ville='Tunis',
            prix_demande=100000,
            vendeur=self.vendeur,
            statut='en_attente'
        )
    
    def test_admin_list_entreprises_attente(self):
        """Test admin peut voir entreprises en attente"""
        self.client.force_authenticate(user=self.admin)
        url = '/api/entreprises/admin/en-attente/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_non_admin_cannot_access_admin_views(self):
        """Test non-admin ne peut pas accéder aux vues admin"""
        self.client.force_authenticate(user=self.vendeur)
        url = '/api/entreprises/admin/en-attente/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_admin_valider_entreprise(self):
        """Test admin peut valider une entreprise"""
        self.client.force_authenticate(user=self.admin)
        url = f'/api/entreprises/admin/{self.entreprise_attente.slug}/valider/'
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.entreprise_attente.refresh_from_db()
        self.assertEqual(self.entreprise_attente.statut, 'publiee')
        self.assertIsNotNone(self.entreprise_attente.published_at)
    
    def test_admin_refuser_entreprise(self):
        """Test admin peut refuser une entreprise"""
        self.client.force_authenticate(user=self.admin)
        url = f'/api/entreprises/admin/{self.entreprise_attente.slug}/refuser/'
        data = {'raison_refus': 'Informations incomplètes'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.entreprise_attente.refresh_from_db()
        self.assertEqual(self.entreprise_attente.statut, 'refusee')
        self.assertEqual(self.entreprise_attente.raison_refus, 'Informations incomplètes')
    
    def test_admin_mettre_en_avant(self):
        """Test admin peut mettre en avant une entreprise"""
        # Publier l'entreprise d'abord
        self.entreprise_attente.statut = 'publiee'
        self.entreprise_attente.published_at = timezone.now()
        self.entreprise_attente.save()
        
        self.client.force_authenticate(user=self.admin)
        url = f'/api/entreprises/admin/{self.entreprise_attente.slug}/mettre-en-avant/'
        data = {'duree_jours': 30}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.entreprise_attente.refresh_from_db()
        self.assertTrue(self.entreprise_attente.est_mise_en_avant)
        self.assertIsNotNone(self.entreprise_attente.date_debut_mise_en_avant)
    
    def test_admin_statistiques(self):
        """Test admin peut voir statistiques globales"""
        self.client.force_authenticate(user=self.admin)
        url = '/api/entreprises/admin/statistiques/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_entreprises', response.data)
        self.assertIn('total_vendeurs', response.data)


class StatistiquesTests(TestCase):
    """Tests du système de statistiques"""
    
    def setUp(self):
        self.vendeur = User.objects.create_user(
            username='vendeur',
            email='vendeur@test.com',
            password='pass123',
            user_type='vendeur'
        )
        self.entreprise = Entreprise.objects.create(
            nom='Test Entreprise',
            description='Description',
            secteur='commerce',
            region='tunis',
            ville='Tunis',
            prix_demande=100000,
            vendeur=self.vendeur,
            statut='publiee'
        )
    
    def test_create_statistique_action(self):
        """Test création statistique action"""
        from .statistiques_models import StatistiqueAction
        action = StatistiqueAction.objects.create(
            entreprise=self.entreprise,
            utilisateur=self.vendeur,
            action='vue',
            ip_address='127.0.0.1'
        )
        self.assertEqual(action.entreprise, self.entreprise)
        self.assertEqual(action.action, 'vue')
    
    def test_statistique_conversion_calcul(self):
        """Test calcul taux de conversion"""
        from .statistiques_models import StatistiqueConversion
        from datetime import date
        
        conversion = StatistiqueConversion.objects.create(
            entreprise=self.entreprise,
            date=date.today(),
            nombre_vues=100,
            nombre_contacts=5
        )
        conversion.calculer_taux()
        self.assertEqual(conversion.taux_conversion, 5.0)
