# Identifiants de connexion pour Match My Formation

## Utilisateurs disponibles

### 🎓 Étudiant
- **Email**: `student@match.com`
- **Mot de passe**: `Azerty123!`
- **Rôle**: student
- **Accès**: Dashboard étudiant

### 👨‍🏫 Formateur (Creator)
- **Email**: `creator@match.com`
- **Mot de passe**: `Azerty123!`
- **Rôle**: creator
- **Accès**: Dashboard creator

### 👤 Administrateur
- **Email**: `admin@match.com`
- **Mot de passe**: `Azerty123!`
- **Rôle**: admin
- **Accès**: Dashboard admin

## 📝 Notes

- Le mot de passe est `Azerty123!` pour tous les utilisateurs
- Ces identifiants sont valables uniquement en environnement de développement
- En production, utilisez des mots de passe sécurisés et uniques

## 🔧 Si problème de connexion

1. Vérifiez que le backend Laravel tourne sur `http://127.0.0.1:8000`
2. Vérifiez que le frontend tourne sur `http://localhost:3001`
3. Redémarrez les deux services si nécessaire
4. Videz le cache du navigateur

## 🚀 Démarrage rapide

```bash
# Backend Laravel
cd /home/kisoumare/Match-my-formation/backend
php artisan serve --host=127.0.0.1 --port=8000

# Frontend Next.js
cd /home/kisoumare/Match-my-formation/frontend
npm run dev
```

Puis allez sur `http://localhost:3001/login` et utilisez les identifiants ci-dessus.
