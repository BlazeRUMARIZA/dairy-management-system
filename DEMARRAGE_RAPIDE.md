# 🚀 Guide de Démarrage Rapide - Dairy Management System

## Configuration Rapide avec XAMPP

### Prérequis
- Node.js 18+ installé
- XAMPP téléchargé et installé
- Un éditeur de code (VS Code recommandé)

---

## 📝 Étapes d'Installation

### 1️⃣ Installer les dépendances

```bash
cd /home/rumariza/dairy-management-system/backend
npm install
```

### 2️⃣ Démarrer MySQL avec XAMPP

**Sur Linux:**
```bash
sudo /opt/lampp/lampp startmysql
```

**Sur Windows:**
- Ouvrir XAMPP Control Panel
- Cliquer "Start" à côté de MySQL

### 3️⃣ Créer la base de données

**Option facile - Via phpMyAdmin:**
1. Aller sur http://localhost/phpmyadmin
2. Cliquer "Nouvelle base de données"
3. Nom: `dairy_management`
4. Cliquer "Créer"

**Option ligne de commande:**
```bash
# Linux
sudo /opt/lampp/bin/mysql -u root -p

# Windows
C:\xampp\mysql\bin\mysql.exe -u root -p

# Puis taper:
CREATE DATABASE dairy_management;
EXIT;
```

### 4️⃣ Configurer l'environnement

```bash
cd backend
cp .env.example .env
```

Le fichier `.env` est déjà configuré pour XAMPP par défaut:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dairy_management
DB_USER=root
DB_PASSWORD=
```

✅ **Pas besoin de modifier si XAMPP n'a pas de mot de passe!**

### 5️⃣ Créer les tables

```bash
npm run db:init
```

Vous devriez voir:
```
✅ MySQL Connected: localhost:3306
✅ All models synchronized successfully
📊 Tables created:
   - users
   - products
   - clients
   - orders
   - batches
   - invoices
```

### 6️⃣ Remplir avec des données de test

```bash
npm run db:seed
```

Cela créera des comptes de test:
- **Admin:** admin@dairy.com / password123
- **Manager:** manager@dairy.com / password123
- **Opérateur:** operator@dairy.com / password123
- **Chauffeur:** driver@dairy.com / password123

### 7️⃣ Démarrer le backend

```bash
npm run dev
```

Vous devriez voir:
```
✅ MySQL Connected: localhost:3306
✅ Database models synchronized
🚀 Server running on port 5000
```

### 8️⃣ Démarrer le frontend

**Dans un nouveau terminal:**
```bash
cd /home/rumariza/dairy-management-system
npm install
npm run dev
```

Le frontend sera disponible sur: **http://localhost:5173**

---

## 🎉 C'est terminé!

Votre application est prête! Ouvrez http://localhost:5173 et connectez-vous avec:
- **Email:** admin@dairy.com
- **Mot de passe:** password123

---

## 🔧 Commandes Utiles

### Backend
```bash
cd backend
npm run dev          # Démarrer en mode développement
npm run db:init      # Créer les tables
npm run db:seed      # Remplir avec des données
npm run db:reset     # Réinitialiser (drop + seed)
```

### Frontend
```bash
npm run dev          # Démarrer en mode développement
npm run build        # Builder pour production
npm run preview      # Prévisualiser le build
```

### XAMPP
```bash
# Linux
sudo /opt/lampp/lampp start        # Démarrer tout
sudo /opt/lampp/lampp startmysql   # Démarrer MySQL seulement
sudo /opt/lampp/lampp stop         # Arrêter
sudo /opt/lampp/lampp status       # Voir le statut
```

---

## ⚠️ Problèmes Courants

### "Port 3306 already in use"
```bash
# Arrêter les autres services MySQL
sudo systemctl stop mysql
# Puis redémarrer XAMPP MySQL
```

### "Cannot connect to database"
1. Vérifier que XAMPP MySQL est démarré
2. Vérifier phpMyAdmin: http://localhost/phpmyadmin
3. Vérifier que la base `dairy_management` existe

### "npm: command not found"
Installer Node.js depuis https://nodejs.org/

### Tables non créées
```bash
# Réinitialiser complètement
npm run db:reset
```

---

## 📚 Documentation Complète

- **Guide XAMPP:** `backend/XAMPP_SETUP_GUIDE.md`
- **Backend README:** `backend/README.md`
- **Migration MySQL:** `MYSQL_MIGRATION_SUMMARY.md`

---

## 🆘 Besoin d'aide?

1. Vérifier le statut XAMPP: `sudo /opt/lampp/lampp status`
2. Vérifier phpMyAdmin: http://localhost/phpmyadmin
3. Vérifier les logs du backend dans le terminal
4. Consulter `backend/XAMPP_SETUP_GUIDE.md` pour plus de détails

---

## ✅ Checklist Rapide

- [ ] Node.js installé
- [ ] XAMPP installé
- [ ] MySQL démarré dans XAMPP
- [ ] Base de données `dairy_management` créée
- [ ] `npm install` exécuté dans /backend
- [ ] `npm install` exécuté à la racine
- [ ] Fichier `.env` créé dans /backend
- [ ] `npm run db:init` exécuté
- [ ] `npm run db:seed` exécuté
- [ ] Backend démarre sans erreur (port 5000)
- [ ] Frontend démarre sans erreur (port 5173)
- [ ] Connexion réussie avec admin@dairy.com

🎊 **Tout est coché? Félicitations, votre système est opérationnel!**
