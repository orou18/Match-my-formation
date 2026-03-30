# 📋 PLAN DE TEST COMPLET DU SITE - PAS À PAS

## ÉTAPE 1: Vérifier l'authentification

### 1.1 Test Inscription Étudiant (Nouveau)

**Objectif:** Créer un nouveau compte étudiant avec email/password

**Test steps:**

```
1. Ouvrir: http://localhost:3000/fr/register
2. Remplir le formulaire:
   - Nom: "Étudiant Test"
   - Email: "etudiant.test@example.com"
   - Password: "Azerty123!"
   - Confirmez: "Azerty123!"
3. Cliquer "S'inscrire"
4. ✅ Vérifier: Redirection vers dashboard étudiant
5. ✅ Vérifier: Token stocké en localStorage
```

**Données s'attend:**

- Dashboard étudiant accessible à `/fr/dashboard/student`
- Sections vides (aucun cours assigné = comportement dynamique)
- Avatar par défaut
- Pas de progression affichée

---

### 1.2 Test Connexion Employé

**Objectif:** Se connecter comme employé avec credentials du creator

**Test steps:**

```
1. Obtenir credentials du creator pour employé:
   - Login: EMP_xxx (généré à la création)
   - Password: xxx123! (généré à la création)
   - À récupérer depuis dashboard creator: /designer/employee

2. Ouvrir: http://localhost:3000/fr/auth/employee/login
3. Remplir:
   - Login ID: [EMP_ID du creator]
   - Password: [PASSWORD du creator]
4. Cliquer "Connexion"
5. ✅ Vérifier: Redirection vers dashboard employé
6. ✅ Vérifier: Token employee stocké en localStorage.employee_token
```

---

## ÉTAPE 2: Dashboard Étudiant (Nouveau)

### 2.1 Affichage Dynamique

**Objectif:** Vérifier que les sections vides sont bien affichées pour nouveau student

**Test states:**

```
🟢 État: Nouvel étudiant (aucun parcours assigné)

Sections visibles:
□ Header: "Tableau de bord étudiant"
□ Welcome section avec gradient
□ Stats:
  - Cours inscrits: 0
  - En progression: 0
  - Terminés: 0
  - Time total: 0h 0m
  - Certificats: 0

□ Search bar fonctionnelle (même si vide)

□ Section "Mes formations":
  - Message vide: "Aucune formation trouvée"
  - Sub-message: "Votre formateur n'a pas encore ajouté de formations"
  - Icon vide: BookOpen
```

**Test steps:**

```
1. Frefresh page du dashboard étudiant
2. Observer l'affichage vide mais correct
3. ✅ Vérifier: Pas d'erreurs en console
4. ✅ Vérifier: Images chargent correctement
5. ✅ Vérifier: Boutons sont interactifs
```

---

### 2.2 Recherche et Filtres

**Test steps:**

```
1. Taper "test" dans la barre de recherche
2. ✅ Vérifier: Message "Aucune formation trouvée"
3. Cliquer "Filtrer" button
4. ✅ Vérifier: Comportement attendu
5. Nettoyer la recherche
```

---

## ÉTAPE 3: Système de Chat

### 3.1 Chat dans la page vidéo

**Objectif:** Vérifier que le chat est intégré et fonctionne

**Test steps:**

```
1. Ouvrir une vidéo existante:
   http://localhost:3000/fr/video/1/watch

2. En bas à droite, voir les onglets:
   ☐ Actions (Like, Share)
   ☐ Chat (MessageSquare icon)

3. Cliquer sur l'onglet "Chat"
4. ✅ Vérifier: ChatContainer s'affiche

5. Interface du chat:
   □ Header: "Questions & Discussions" (gradient)
   □ Zone de messages (initialement vide)
   □ Input area avec textarea
   □ Toggle "Marquer comme une question"
   □ Bouton "Envoyer"
```

### 3.2 Poster une Question

**Test steps:**

```
1. Connecté en tant qu'étudiant
2. Dans le chat de la vidéo, écrire: "Ceci est une question test"
3. Cocher "Marquer comme une question"
4. Cliquer "Envoyer"
5. ✅ Vérifier:
   - Message apparaît immédiatement
   - Votre message apparaît à droite (blue bubble)
   - Note: "Répondu" ou "En attente" visible
   - Badge "Question" orange visible
6. ✅ Vérifier: Pas d'erreur en console
```

### 3.3 Like sur Message

**Test steps:**

```
1. Voir votre message posté
2. Cliquer le ❤️ icon
3. ✅ Vérifier: Likes compteur augmente
4. Cliquer à nouveau
5. ✅ Vérifier: Likes compteur augmente encore
```

---

## ÉTAPE 4: Dashboard Employé

### 4.1 Authentification Employé

**Test steps:**

```
1. Se connecter comme employé
2. ✅ Vérifier: Redirect vers /fr/dashboard/employee
3. ✅ Vérifier: Header affiche "Espace Employé"
4. ✅ Vérifier: Nom employé affiché
5. ✅ Vérifier: Bouton "Déconnexion" visible
```

### 4.2 Données Employé

**Test steps:**

```
1. Vérifier welcome section:
   - "Bienvenue, [Nom Employé]"
   - "Continuez votre progression dans le domaine [domain]"
   - Dernière connexion affichée (format français)

2. ✅ Vérifier: Stats cards:
   - Total des cours (du creator)
   - Cours terminés (0 pour nouveau)
   - Temps de visionnage (0h 0m)
   - Certificats (0 pour nouveau)
```

### 4.3 Courses Affichées

**Test steps:**

```
1. ✅ Vérifier: Grille de cours du creator
2. Chaque carte affiche:
   - Thumbnail (image cover)
   - Titre
   - Description
   - Views
   - Date publiée
   - Durée
3. Cliquer sur une course card
4. ✅ Vérifier: Navigation vers la vidéo watch page
```

---

## ÉTAPE 5: Chat Creator Notifications

### 5.1 Creator Notifications

**Objectif:** Vérifier que le creator voit les questions des étudiants

**Test steps:**

```
1. Connecté EN TANT QUE CREATOR
2. Aller à: /api/creator/chat/notifications
3. ✅ Vérifier: Voir la liste des questions unanswered
4. Structure de chaque notification:
   {
     "id": 123,
     "video_id": 1,
     "video_title": "Titre de la vidéo",
     "student": { "id", "name", "email", "profile_picture" },
     "question": "Texte de la question",
     "status": "pending" ou "answered",
     "replies_count": 0,
     "created_at": "ISO date"
   }
```

### 5.2 Creator Répondre à Question (Manuel)

**Test steps:**

```
1. Creator va sur la vidéo où il y a une question
2. Ouvre le chat (onglet "Chat")
3. Voit la question de l'étudiant
4. Clique "Répondre" sous la question
5. ✅ Vérifier: Input field devient specifique pour réponse
6. Tape sa réponse
7. Clique "Envoyer"
8. ✅ Vérifier:
   - Message du creator apparaît sous la question
   - Status change à "Répondu" (vert)
   - Badge "Creator" mauve visible sur réponse
```

---

## ÉTAPE 6: Test de Performance

### 6.1 Chat Polling

**Objectif:** Vérifier que le polling toutes les 3 secondes fonctionne

**Test steps:**

```
1. Ouvrir Chat container
2. Ouvrir DevTools > Network
3. ✅ Vérifier: Appels GET /api/videos/{id}/messages toutes les ~3 secondes
4. Poster un nouveau message depuis autre onglet
5. ✅ Vérifier: Nuovo message apparaît dans l'autre tab après ~3 secondes
```

### 6.2 Rapid Messaging

**Test steps:**

```
1. Envoyer 5 messages rapidement
2. ✅ Vérifier: Tous apparaissent sans erreur
3. ✅ Vérifier: Page reste responsive
4. ✅ Vérifier: Pas de lag/freeze
```

---

## ÉTAPE 7: Validation Complète

### 7.1 Checklist Visuelle

```
☑️ Chat icon visible dans la page vidéo
☑️ Onglets Actions/Chat fonctionnels
☑️ Messages affichés avec userinfo
☑️ Questions marquées avec badge orange
☑️ Likes fonctionnent
☑️ Delete button pour propriétaire
☑️ Edit button pour propriétaire
☑️ Creator badge visible sur réponses
☑️ Status badges corrects (Pending/Répondu/Résolu)
☑️ Responsive sur mobile
☑️ Performance OK
```

### 7.2 Checklist Backend

```
☑️ POST /api/videos/{id}/messages - crée message✅
☑️ GET /api/videos/{id}/messages - récupère✅
☑️ PUT /api/messages/{id} - édite
☑️ DELETE /api/messages/{id} - supprime
☑️ POST /api/messages/{id}/like - like
☑️ GET /api/creator/chat/notifications - notifs✅
☑️ POST /api/creator/chat/messages/{id}/reply - réponse✅
☑️ POST /api/creator/chat/messages/{id}/mark-resolved - résolu✅
```

### 7.3 Checklist Base de Données

```
☑️ chat_messages table créée avec bonnes colonnes
☑️ Données insérées correctement
☑️ Relations user_id -> users
☑️ Relations video_id -> videos
☑️ Reply-to relations fonctionnent
☑️ Indexes sont applicables
☑️ Status enum fonctionne [pending, answered, resolved]
```

---

## ÉTAPE 8: Test sur Déploiement

### 8.1 URL de Production

```
Frontend: https://matchmyformation-frontend.vercel.app
Backend: https://matchmyformation-backend.render.com

Test:
1. Chat via URL prod
2. Vérifier CORS
3. Vérifier auth tokens
4. Vérifier WebSocket (si utilisé)
```

### 8.2 Environnement

```
Frontend .env:
NEXT_PUBLIC_API_URL=https://matchmyformation-backend.render.com

Backend .env:
APP_URL=https://matchmyformation-backend.render.com
SESSION_DOMAIN=.matchmyformation-frontend.vercel.app
```

---

## RÉSULTATS ATTENDUS

### 🟢 Success Criteria

**Chat System:**

- ✅ 100% des messages sont sauvegardés en DB
- ✅ Les questions reçoivent le badge Question
- ✅ Creator reçoit les notifications
- ✅ Replies affichent sous le message principal
- ✅ Status changes au fur et à mesure

**Employee Dashboard:**

- ✅ Charges les courses du creator
- ✅ Shows empty state pour nuevo empleado
- ✅ Permits navigation vers les videos
- ✅ Displays stats dynamiquement

**Student Registration:**

- ✅ Nouveau student peut se connecter
- ✅ Dashboard accessible et vide
- ✅ Peut accéder au chat dans la vidéo

---

## ORDRE D'EXÉCUTION

```
1️⃣  Étape 1 - Authentification (PREREQUISITE)
2️⃣  Étape 2 - Dashboard Étudiant
3️⃣  Étape 3 - Chat
4️⃣  Étape 4 - Dashboard Employé
5️⃣  Étape 5 - Creator Notifications
6️⃣  Étape 6 - Performance
7️⃣  Étape 7 - Validation
8️⃣  Étape 8 - Production
```

---

## PROBLÈMES À RÉSOUDRE SI ERREURS

### Erreur: "Chat messages pas sauvegardés"

- Vérifier: `php artisan migrate` exécuté
- Vérifier: Migration date correcte (2026_01_22)
- Vérifier: ChatMessage model namespace

### Erreur: "Student can't register"

- Vérifier: User table existe
- Vérifier: Password hashing fonctionne
- Vérifier: Email validation

### Erreur: "Employee login fails"

- Vérifier: Employee table existe
- Vérifier: Login_id unique
- Vérifier: Password hasié

### Erreur: "Chat API returns 500"

- Vérifier: ChatMessageController namespace
- Vérifier: Routes import correct
- Vérifier: Database connection

---

**STATUS:** 🟡 EN COURS DE MISE EN PLACE

**Prêt à exécuter les tests!**
