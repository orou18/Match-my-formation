# Images Libres de Droits - Match My Formation

## 📸 Sources d'Images Libres de Droits

### 1. **Unsplash** (Recommandé)
- URL : https://unsplash.com/
- Licence : Unsplash License (gratuite pour usage commercial)
- Recherche : "hospitality", "tourism", "education", "hotel", "travel"

### 2. **Pexels**
- URL : https://www.pexels.com/
- Licence : Pexels License (gratuite pour usage commercial)
- Recherche : "hotel", "travel", "education", "training"

### 3. **Pixabay**
- URL : https://pixabay.com/
- Licence : Pixabay License (gratuite pour usage commercial)
- Recherche : "hospitality", "tourism", "education"

## 🖼️ Images Recommandées pour le Projet

### Hero Section
- **Tourisme éducatif** : https://unsplash.com/photos/person-holding-map-while-standing-near-mountain-FHnnjk1Y0tY
- **Formation hôtellerie** : https://unsplash.com/photos/person-in-white-long-sleeve-shirt-sitting-on-chair-near-table-7PtA4r_6lXQ
- **Apprentissage moderne** : https://unsplash.com/photos/people-sitting-inside-room-with-laptops-5fNmWej4tAA

### Dashboard Formation
- **Étudiants en formation** : https://unsplash.com/photos/people-sitting-on-chairs-inside-room-XJXWbfOh2sg
- **Formateur professionnel** : https://unsplash.com/photos/man-wearing-blue-long-sleeve-shirt-sitting-on-chair-8bghisqJ6pI
- **Certification** : https://unsplash.com/photos/person-holding-certificate-D8L1g_iCj8g

### Cours et Modules
- **Cuisine hôtellerie** : https://unsplash.com/photos/person-in-white-apron-holding-knife-2FPuvAyqQI0
- **Service client** : https://unsplash.com/photos/woman-wearing-headset-sitting-in-front-of-computer-monitor-fmlCXbA0tJg
- **Management hôtelier** : https://unsplash.com/photos/people-sitting-around-table-5QgIuuBxKwM

### Vidéos (si nécessaire)
- **Formation hôtellerie** : https://www.pexels.com/search/videos/hotel/
- **Tourisme** : https://www.pexels.com/search/videos/travel/
- **Éducation** : https://www.pexels.com/search/videos/education/

## 📥 Téléchargement et Intégration

### Étapes
1. **Télécharger** les images depuis les sources ci-dessus
2. **Renommer** avec des noms explicites
3. **Optimiser** pour le web (compression)
4. **Placer** dans `/frontend/public/images/`
5. **Mettre à jour** les imports dans les composants

### Noms de fichiers recommandés
```
/frontend/public/images/
├── hero-tourism-education.jpg
├── hero-hospitality-training.jpg
├── dashboard-students-learning.jpg
├── course-hotel-management.jpg
├── course-culinary-arts.jpg
├── course-customer-service.jpg
├── certification-success.jpg
├── instructor-professional.jpg
└── background-pattern.jpg
```

## 🎨 Personnalisation

### Filtres et Styles
- **Overlay** : Ajouter des overlays pour améliorer la lisibilité
- **Compression** : Optimiser les images pour le web
- **Formats** : Utiliser WebP pour une meilleure performance
- **Responsive** : Différentes tailles pour mobile/desktop

### Intégration React
```jsx
import Image from 'next/image';

// Usage avec optimisation
<Image
  src="/images/hero-tourism-education.jpg"
  alt="Formation tourisme et hôtellerie"
  width={1200}
  height={600}
  priority
  className="object-cover w-full h-full"
/>
```

## ⚖️ Vérification des Licences

Toutes les images utilisées doivent :
- ✅ Être libres de droits pour usage commercial
- ✅ Ne pas nécessiter d'attribution (ou l'inclure)
- ✅ Ne pas avoir de restrictions de modification
- ✅ Être adaptées au secteur tourisme/hôtellerie/formation

## 🔄 Maintenance

### Mises à jour régulières
- **Vérifier** les licences périodiquement
- **Mettre à jour** les images obsolètes
- **Optimiser** les performances
- **Ajouter** du contenu visuel fraîchement
