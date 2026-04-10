// Script de test pour les actions groupées médias
const testMediaActions = async () => {
  console.log('🧪 Test des actions groupées médias...');
  
  // Test 1: Créer des médias de test
  console.log('\n1️⃣ Création de médias de test...');
  const testMedia = [
    {
      id: 'media1',
      name: 'Image test.jpg',
      type: 'image',
      url: '/test-image.jpg',
      size: '2.5 MB',
      format: 'JPEG',
      createdAt: new Date().toISOString(),
      tags: ['test', 'image'],
      isFavorite: false,
      metadata: {}
    },
    {
      id: 'media2', 
      name: 'Video test.mp4',
      type: 'video',
      url: '/test-video.mp4',
      size: '15.3 MB',
      format: 'MP4',
      duration: '02:30',
      createdAt: new Date().toISOString(),
      tags: ['test', 'video'],
      isFavorite: true,
      metadata: {}
    }
  ];

  // Test 2: Copier des médias
  console.log('\n2️⃣ Test de copie...');
  try {
    const copyResponse = await fetch('http://localhost:3000/api/creator/media/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'copy',
        itemIds: ['media1', 'media2']
      })
    });
    
    if (copyResponse.ok) {
      const copyData = await copyResponse.json();
      console.log('✅ Copie réussie:', copyData.message);
      console.log('📋 Médias copiés:', copyData.items?.length || 0);
    } else {
      console.log('❌ Erreur copie:', copyResponse.status);
    }
  } catch (error) {
    console.log('❌ Erreur API copie:', error.message);
  }

  // Test 3: Déplacer des médias
  console.log('\n3️⃣ Test de déplacement...');
  try {
    const moveResponse = await fetch('http://localhost:3000/api/creator/media/batch', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'move',
        itemIds: ['media1'],
        targetPath: '/Archives/'
      })
    });
    
    if (moveResponse.ok) {
      const moveData = await moveResponse.json();
      console.log('✅ Déplacement réussi:', moveData.message);
    } else {
      console.log('❌ Erreur déplacement:', moveResponse.status);
    }
  } catch (error) {
    console.log('❌ Erreur API déplacement:', error.message);
  }

  // Test 4: Archiver des médias
  console.log('\n4️⃣ Test d\'archivage...');
  try {
    const archiveResponse = await fetch('http://localhost:3000/api/creator/media/batch', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'archive',
        itemIds: ['media2']
      })
    });
    
    if (archiveResponse.ok) {
      const archiveData = await archiveResponse.json();
      console.log('✅ Archivage réussi:', archiveData.message);
    } else {
      console.log('❌ Erreur archivage:', archiveResponse.status);
    }
  } catch (error) {
    console.log('❌ Erreur API archivage:', error.message);
  }

  // Test 5: Supprimer des médias
  console.log('\n5️⃣ Test de suppression...');
  try {
    const deleteResponse = await fetch('http://localhost:3000/api/creator/media/batch', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemIds: ['media1']
      })
    });
    
    if (deleteResponse.ok) {
      const deleteData = await deleteResponse.json();
      console.log('✅ Suppression réussie:', deleteData.message);
    } else {
      console.log('❌ Erreur suppression:', deleteResponse.status);
    }
  } catch (error) {
    console.log('❌ Erreur API suppression:', error.message);
  }

  console.log('\n🎉 Tests terminés !');
  console.log('📝 Accédez à http://localhost:3000/fr/dashboard/creator/media pour tester manuellement');
};

// Exécuter les tests
testMediaActions();
