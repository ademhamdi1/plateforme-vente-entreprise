# 🚀 Guide de Déploiement sur le Serveur de Production

## ⚠️ Important
Les corrections ont été pushées sur GitHub avec le tag `dev0.7.2`.
Les images Docker sont prêtes sur GitHub Container Registry.
**Il faut maintenant les déployer sur le serveur.**

---

## 📋 Étapes de Déploiement (5 minutes)

### 1️⃣ Se connecter au serveur via SSH

**Sur Windows PowerShell :**
```powershell
ssh salon@51.75.120.255
```

**Sur Mac/Linux Terminal :**
```bash
ssh salon@51.75.120.255
```

Entrez le mot de passe SSH quand demandé.

---

### 2️⃣ Exécuter les commandes de déploiement

Une fois connecté au serveur, copiez-collez ces commandes **UNE PAR UNE** :

```bash
# Aller dans le dossier du projet
cd /home/salon/plateforme-vente-entreprise

# Récupérer les dernières modifications du code
git fetch --all
git pull origin develop

# Définir la version à déployer
export IMAGE_TAG=dev0.7.2

# Télécharger les nouvelles images Docker depuis GitHub
docker compose -f docker-compose.yml -f docker-compose.prod.yml pull

# Redémarrer les containers avec les nouvelles images
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Attendre 10 secondes que les containers démarrent
sleep 10

# Vérifier que tout tourne correctement
docker compose ps
```

---

### 3️⃣ Vérifier le déploiement

Dans votre navigateur, testez :
- ✅ Page d'accueil : http://51.75.120.255:8080/
- ✅ API : http://51.75.120.255:8080/api/
- ✅ Publication : http://51.75.120.255:8080/publier

---

## 🐛 Corrections Déployées

**Commit : `5aaf25d`**
- ✅ Suppression du champ `est_mise_en_avant` dupliqué dans le modèle Entreprise
- ✅ Ajout du `slug` dans la réponse du serializer `EntrepriseCreateSerializer`
- ✅ Upload d'images maintenant fonctionnel

---

## 📊 Vérifier les Logs (en cas de problème)

Si quelque chose ne fonctionne pas :

```bash
# Voir les logs du backend
docker compose logs backend --tail=100

# Voir les logs du frontend
docker compose logs frontend --tail=50

# Redémarrer un service spécifique
docker compose restart backend
docker compose restart frontend
```

---

## 🔄 Rollback (revenir en arrière)

En cas de problème majeur, revenir à la version précédente :

```bash
export IMAGE_TAG=dev0.7.1
docker compose -f docker-compose.yml -f docker-compose.prod.yml pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## ✅ Checklist de Déploiement

- [ ] Connexion SSH réussie
- [ ] Commandes exécutées sans erreur
- [ ] Containers redémarrés (`docker compose ps` montre "Up")
- [ ] Site accessible sur http://51.75.120.255:8080/
- [ ] Publication d'entreprise fonctionne sans erreur 500
- [ ] Upload d'images fonctionne

---

## 📞 Support

Si tu rencontres des problèmes :
1. Vérifie les logs avec `docker compose logs`
2. Assure-toi que le tag `dev0.7.2` est bien utilisé
3. Vérifie que les images ont été téléchargées : `docker images | grep plateforme`

---

**Date de création** : 5 août 2026  
**Version déployée** : dev0.7.2  
**Commit** : 5aaf25d
