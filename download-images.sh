#!/bin/bash

# Script de téléchargement d'images libres de droits pour Match My Formation
# Images optimisées pour tourisme/hôtellerie/formation

echo "📸 Téléchargement des images libres de droits..."

# Création des dossiers
mkdir -p frontend/public/images/{hero,courses,dashboard,icons,backgrounds}

# Téléchargement des images hero (format optimisé)
echo "🎨 Téléchargement images hero..."
curl -L "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop&crop=entropy&auto=format" -o frontend/public/images/hero/education-tourism.jpg
curl -L "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop&crop=entropy&auto=format" -o frontend/public/images/hero/hospitality-training.jpg
curl -L "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=600&fit=crop&crop=entropy&auto=format" -o frontend/public/images/hero/professional-formation.jpg

# Téléchargement images cours
echo "📚 Téléchargement images cours..."
curl -L "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop&crop=entropy&auto=format" -o frontend/public/images/courses/hotel-management.jpg
curl -L "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=400&fit=crop&crop=entropy&auto=format" -o frontend/public/images/courses/culinary-arts.jpg
curl -L "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&crop=entropy&auto=format" -o frontend/public/images/courses/customer-service.jpg
curl -L "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop&crop=entropy&auto=format" -o frontend/public/images/courses/tourism-guide.jpg

# Téléchargement images dashboard
echo "📊 Téléchargement images dashboard..."
curl -L "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop&crop=entropy&auto=format" -o frontend/public/images/dashboard/students-learning.jpg
curl -L "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=entropy&auto=format" -o frontend/public/images/dashboard/instructor.jpg
curl -L "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop&crop=entropy&auto=format" -o frontend/public/images/dashboard/certification.jpg

# Téléchargement icônes et backgrounds
echo "🎯 Téléchargement icônes et backgrounds..."
curl -L "https://images.unsplash.com/photo-1558591710-4b4a1ae21f2e?w=1920&h=1080&fit=crop&crop=entropy&auto=format" -o frontend/public/images/backgrounds/pattern-tourism.jpg
curl -L "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&crop=entropy&auto=format" -o frontend/public/images/backgrounds/pattern-education.jpg

# Création d'un placeholder pour les vidéos
echo "🎥 Création placeholders vidéos..."
mkdir -p frontend/public/videos
echo "# Vidéos de démonstration pour formation tourisme/hôtellerie" > frontend/public/videos/README.md

# Optimisation des images (conversion en WebP si possible)
echo "⚡ Optimisation des images..."
for file in frontend/public/images/**/*.jpg; do
  if [ -f "$file" ]; then
    # Création versions WebP
    webp_file="${file%.jpg}.webp"
    if ! [ -f "$webp_file" ]; then
      echo "Conversion: $file -> $webp_file"
      # Note: cwebp doit être installé pour cette conversion
      # cwebp -q 80 "$file" -o "$webp_file" 2>/dev/null || echo "cwebp non disponible, utilisation des JPG"
    fi
  fi
done

echo "✅ Téléchargement terminé !"
echo "📁 Images disponibles dans frontend/public/images/"
echo "🎨 Utilisez les images dans vos composants React avec :"
echo "   <Image src='/images/hero/education-tourism.jpg' alt='Formation tourisme' width={1200} height={600} />"
