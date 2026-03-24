-- ========================================
-- BASE DE DONNÉES ENRICHIE - MATCH MY FORMATION
-- Fichier SQL pour importation directe
-- ========================================

-- Nettoyage des tables existantes
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS videos;
DROP TABLE IF EXISTS modules;
DROP TABLE IF EXISTS pathways;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS creator_profiles;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- TABLE DES UTILISATEURS
-- ========================================
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'creator', 'student') NOT NULL DEFAULT 'student',
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertion des administrateurs
INSERT INTO users (name, email, password, role, email_verified_at) VALUES
('Admin Principal', 'admin@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'admin', NOW()),
('Marie Laurent', 'marie.laurent@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'admin', NOW());

-- Insertion des créateurs de contenu
INSERT INTO users (name, email, password, role, email_verified_at) VALUES
('Jean Dupont', 'chef@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'creator', NOW()),
('Sophie Martin', 'sommelier@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'creator', NOW()),
('Pierre Bernard', 'restaurant@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'creator', NOW()),
('Marie Dubois', 'hotel@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'creator', NOW()),
('Thomas Petit', 'barman@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'creator', NOW()),
('Claire Robert', 'event@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'creator', NOW()),
('Nicolas Durand', 'catering@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'creator', NOW()),
('Isabelle Leroy', 'tourisme@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'creator', NOW()),
('François Moreau', 'vin@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'creator', NOW()),
('Camille Simon', 'marketing@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'creator', NOW()),
('Antoine Garnier', 'reception@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'creator', NOW()),
('Julie Chevalier', 'spa@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'creator', NOW()),
('David Rousseau', 'cuisine@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'creator', NOW()),
('Eva Lambert', 'digital@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'creator', NOW()),
('Marc Girard', 'safety@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'creator', NOW()),
('Laura Bonnet', 'hr@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'creator', NOW()),
('Kevin Faure', 'tech@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'creator', NOW()),
('Sarah Meyer', 'design@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'creator', NOW()),
('Olivier Blanc', 'finance@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'creator', NOW()),
('Emma Roux', 'quality@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'creator', NOW());

-- Insertion de 50 étudiants (pour commencer)
INSERT INTO users (name, email, password, role, email_verified_at) VALUES
('Alex Martin', 'student1@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Marie Bernard', 'student2@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Thomas Dubois', 'student3@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Julie Robert', 'student4@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Lucas Richard', 'student5@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Léa Petit', 'student6@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Nathan Durand', 'student7@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Chloé Leroy', 'student8@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Hugo Moreau', 'student9@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Emma Simon', 'student10@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Gabriel Laurent', 'student11@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Manon Garcia', 'student12@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Louis Rodriguez', 'student13@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Alice Martinez', 'student14@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Jules Hernandez', 'student15@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Chloé Lopez', 'student16@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Ethan Gonzalez', 'student17@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Inès Wilson', 'student18@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Raphaël Anderson', 'student19@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Lina Thomas', 'student20@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Mathieu Taylor', 'student21@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Zoé Moore', 'student22@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Arthur Jackson', 'student23@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Rose Martin', 'student24@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Paul Lee', 'student25@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Alice Perez', 'student26@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Tom White', 'student27@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Julia Harris', 'student28@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Maxime Clark', 'student29@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Léa Lewis', 'student30@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Noah Robinson', 'student31@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Sofia Walker', 'student32@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Lucas Hall', 'student33@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Camille Allen', 'student34@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Hugo Young', 'student35@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Léa King', 'student36@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Gabriel Wright', 'student37@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Manon Scott', 'student38@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Louis Green', 'student39@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Alice Baker', 'student40@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Jules Nelson', 'student41@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Chloé Carter', 'student42@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Ethan Mitchell', 'student43@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Inès Perez', 'student44@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Raphaël Roberts', 'student45@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Lina Turner', 'student46@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Mathieu Phillips', 'student47@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Zoé Campbell', 'student48@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Arthur Parker', 'student49@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW()),
('Rose Evans', 'student50@matchmyformation.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'student', NOW());

-- ========================================
-- TABLE DES ENTREPRISES
-- ========================================
CREATE TABLE companies (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    industry VARCHAR(255) NOT NULL,
    description TEXT NULL,
    website VARCHAR(255) NULL,
    logo VARCHAR(255) NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO companies (name, address, industry, description, verified) VALUES
('Hôtel Plaza Athénée', 'Paris', '5 étoiles', 'Hôtel de luxe parisien', TRUE),
('Restaurant Guy Savoy', 'Paris', '3 étoiles Michelin', 'Haute cuisine française', TRUE),
('Four Seasons George V', 'Paris', 'Palace', 'Hôtel de prestige', TRUE),
('Le Meurice', 'Paris', 'Palace', 'Hôtel historique', TRUE),
('The Ritz', 'Paris', 'Palace', 'Hôtel légendaire', TRUE),
('Crillon', 'Paris', 'Palace', 'Hôtel de luxe', TRUE),
('Le Bristol', 'Paris', 'Palace', 'Hôtel 5 étoiles', TRUE),
('Mandarin Oriental', 'Paris', '5 étoiles', 'Hôtel asiatique', TRUE),
('Shangri-La', 'Paris', '5 étoiles', 'Hôtel asiatique', TRUE),
('Peninsula Paris', 'Paris', '5 étoiles', 'Hôtel hongkongais', TRUE);

-- ========================================
-- TABLE DES COURS
-- ========================================
CREATE TABLE courses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    level ENUM('beginner', 'intermediate', 'advanced') NOT NULL DEFAULT 'beginner',
    price DECIMAL(10, 2) NOT NULL,
    duration INT NOT NULL, -- en heures
    creator_id BIGINT UNSIGNED NOT NULL,
    image VARCHAR(255) NULL,
    status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO courses (title, description, category, level, price, duration, creator_id, image, status, featured) VALUES
-- Cuisine
('Techniques de Cuisine Française', 'Apprenez les techniques fondamentales de la cuisine française avec un chef étoilé', 'cuisine', 'beginner', 299.99, 40, 3, 'cuisine-francaise.jpg', 'published', TRUE),
('Pâtisserie Professionnelle', 'Maîtrisez l\'art de la pâtisserie française', 'cuisine', 'intermediate', 399.99, 60, 3, 'patisserie.jpg', 'published', TRUE),
('Cuisine Moléculaire', 'Explorez les techniques innovantes de la cuisine moléculaire', 'cuisine', 'advanced', 599.99, 80, 3, 'cuisine-moleculaire.jpg', 'published', FALSE),

-- Œnologie
('Initiation à la Dégustation de Vin', 'Apprenez à déguster et évaluer les vins comme un professionnel', 'oenologie', 'beginner', 199.99, 30, 10, 'degustation-vin.jpg', 'published', TRUE),
('Vins de Bordeaux - Maîtrise', 'Explorez en profondeur les vins de la région de Bordeaux', 'oenologie', 'intermediate', 349.99, 50, 10, 'vins-bordeaux.jpg', 'published', FALSE),
('Vins du Monde', 'Tour d\'horizon des vignobles du monde entier', 'oenologie', 'advanced', 499.99, 70, 10, 'vins-monde.jpg', 'published', FALSE),

-- Service
('Art du Service Restaurant', 'Maîtrisez les techniques de service haut de gamme', 'service', 'beginner', 249.99, 35, 11, 'service-restaurant.jpg', 'published', TRUE),
('Management de Restaurant', 'Gérez efficacement un établissement restaurant', 'service', 'intermediate', 449.99, 55, 11, 'management-restaurant.jpg', 'published', FALSE),

-- Hôtellerie
('Gestion Hôtelière Fondamentale', 'Les bases de la gestion d\'un hôtel', 'hotellerie', 'beginner', 349.99, 45, 4, 'gestion-hoteliere.jpg', 'published', TRUE),
('Revenue Management Hôtelier', 'Optimisez vos revenus hôteliers', 'hotellerie', 'advanced', 599.99, 65, 4, 'revenue-management.jpg', 'published', FALSE),

-- Tourisme
('Guide Touristique Certifié', 'Devenez guide touristique professionnel', 'tourisme', 'beginner', 299.99, 40, 8, 'guide-touristique.jpg', 'published', TRUE),
('Tourisme Durable', 'Le tourisme respectueux de l\'environnement', 'tourisme', 'intermediate', 399.99, 50, 8, 'tourisme-durable.jpg', 'published', FALSE),

-- Marketing
('Marketing Hôtelier Digital', 'Stratégies marketing pour l\'hôtellerie', 'marketing', 'intermediate', 449.99, 55, 10, 'marketing-digital.jpg', 'published', TRUE),
('Réseaux Sociaux pour l\'Hôtellerie', 'Utilisez les réseaux sociaux pour promouvoir votre établissement', 'marketing', 'beginner', 249.99, 30, 10, 'reseaux-sociaux.jpg', 'published', FALSE),

-- Événementiel
('Organisation d\'Événements', 'Planifiez et organisez des événements réussis', 'evenementiel', 'beginner', 349.99, 45, 6, 'organisation-evenements.jpg', 'published', TRUE),
('Gestion de Projets Événementiels', 'Managez des projets événementiels complexes', 'evenementiel', 'advanced', 549.99, 70, 6, 'gestion-projets.jpg', 'published', FALSE);

-- ========================================
-- TABLE DES MODULES
-- ========================================
CREATE TABLE modules (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    course_id BIGINT UNSIGNED NOT NULL,
    `order` INT NOT NULL,
    duration INT NOT NULL, -- en minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Insertion des modules pour chaque cours
INSERT INTO modules (title, description, course_id, `order`, duration) VALUES
-- Modules pour Techniques de Cuisine Française (Course ID: 1)
('Module 1: Introduction et Sécurité', 'Introduction à la cuisine française et règles de sécurité', 1, 1, 45),
('Module 2: Techniques de Coupe', 'Maîtrise des différentes techniques de coupe', 1, 2, 60),
('Module 3: Cuissons de Base', 'Les différentes méthodes de cuisson', 1, 3, 55),
('Module 4: Sauces Fondamentales', 'Préparation des sauces françaises classiques', 1, 4, 50),
('Module 5: Plats Principaux', 'Réalisation de plats principaux français', 1, 5, 65),
('Module 6: Desserts Classiques', 'Desserts traditionnels français', 1, 6, 40),
('Module 7: Présentation', 'Art de la présentation en cuisine', 1, 7, 35),
('Module 8: Hygiène', 'Normes d\'hygiène en cuisine', 1, 8, 30),

-- Modules pour Pâtisserie Professionnelle (Course ID: 2)
('Module 1: Introduction à la Pâtisserie', 'Présentation de la pâtisserie française', 2, 1, 40),
('Module 2: Pâtes de Base', 'Préparation des pâtes fondamentales', 2, 2, 55),
('Module 3: Crèmes et Garnitures', 'Différentes crèmes et garnitures', 2, 3, 50),
('Module 4: Gâteaux Classiques', 'Gâteaux traditionnels français', 2, 4, 60),
('Module 5: Pains et Viennoiseries', 'Art boulanger français', 2, 5, 65),
('Module 6: Chocolaterie', 'Travail du chocolat', 2, 6, 45),
('Module 7: Décoration', 'Techniques de décoration', 2, 7, 50),
('Module 8: Créativité', 'Création de pâtisseries modernes', 2, 8, 55),

-- Modules pour Initiation à la Dégustation de Vin (Course ID: 4)
('Module 1: Histoire du Vin', 'Origine et histoire du vin', 4, 1, 35),
('Module 2: Types de Cépages', 'Présentation des cépages principaux', 4, 2, 40),
('Module 3: Régions Viticoles', 'Les grandes régions viticoles', 4, 3, 45),
('Module 4: Dégustation', 'Techniques de dégustation', 4, 4, 50),
('Module 5: Accords Mets-Vins', 'Comment accorder vin et nourriture', 4, 5, 40),
('Module 6: Service du Vin', 'Service et conservation du vin', 4, 6, 35),

-- Modules pour Gestion Hôtelière Fondamentale (Course ID: 9)
('Module 1: Introduction Hôtellerie', 'Présentation du secteur hôtelier', 9, 1, 40),
('Module 2: Types d\'Hôtels', 'Différentes catégories hôtelières', 9, 2, 35),
('Module 3: Réception', 'Gestion de la réception', 9, 3, 50),
('Module 4: Gestion des Chambres', 'Housekeeping et chambres', 9, 4, 45),
('Module 5: Maintenance', 'Maintenance hôtelière', 9, 5, 30),
('Module 6: Sécurité', 'Sécurité dans l\'hôtellerie', 9, 6, 35),
('Module 7: Marketing Hôtelier', 'Basics du marketing hôtelier', 9, 7, 40),
('Module 8: Gestion Équipe', 'Management du personnel', 9, 8, 45);

-- ========================================
-- TABLE DES VIDÉOS
-- ========================================
CREATE TABLE videos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    url VARCHAR(255) NOT NULL,
    duration INT NOT NULL, -- en secondes
    module_id BIGINT UNSIGNED NOT NULL,
    `order` INT NOT NULL,
    thumbnail VARCHAR(255) NULL,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- Insertion de quelques vidéos pour commencer
INSERT INTO videos (title, description, url, duration, module_id, `order`, thumbnail, views) VALUES
-- Vidéos pour le Module 1: Introduction et Sécurité
('Vidéo 1: Leçon 1 - Introduction et Sécurité', 'Introduction à la cuisine française et règles de sécurité', 'https://example.com/video/1_1', 900, 1, 1, 'thumbnail_1_1.jpg', 245),
('Vidéo 2: Leçon 2 - Équipement de Cuisine', 'Présentation de l\'équipement nécessaire', 'https://example.com/video/1_2', 720, 1, 2, 'thumbnail_1_2.jpg', 189),
('Vidéo 3: Leçon 3 - Règles d\'Hygiène', 'Les règles d\'hygiène fondamentales', 'https://example.com/video/1_3', 600, 1, 3, 'thumbnail_1_3.jpg', 156),

-- Vidéos pour le Module 2: Techniques de Coupe
('Vidéo 4: Leçon 1 - Introduction et Sécurité', 'Techniques de coupe de base', 'https://example.com/video/2_1', 800, 2, 1, 'thumbnail_2_1.jpg', 234),
('Vidéo 5: Leçon 2 - Équipement de Cuisine', 'Coupes en julienne et brunoise', 'https://example.com/video/2_2', 650, 2, 2, 'thumbnail_2_2.jpg', 178),
('Vidéo 6: Leçon 3 - Règles d\'Hygiène', 'Coupes en mirepoix et paysanne', 'https://example.com/video/2_3', 700, 2, 3, 'thumbnail_2_3.jpg', 201),

-- Vidéos pour le Module 1: Histoire du Vin
('Vidéo 7: Leçon 1 - Introduction et Sécurité', 'Origines de la viticulture', 'https://example.com/video/4_1', 750, 4, 1, 'thumbnail_4_1.jpg', 312),
('Vidéo 8: Leçon 2 - Équipement de Cuisine', 'Le vin à travers les âges', 'https://example.com/video/4_2', 680, 4, 2, 'thumbnail_4_2.jpg', 267),
('Vidéo 9: Leçon 3 - Règles d\'Hygiène', 'Grands moments historiques du vin', 'https://example.com/video/4_3', 720, 4, 3, 'thumbnail_4_3.jpg', 289);

-- ========================================
-- TABLE DES INSCRIPTIONS
-- ========================================
CREATE TABLE enrollments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    course_id BIGINT UNSIGNED NOT NULL,
    progress INT DEFAULT 0, -- 0-100
    status ENUM('active', 'completed', 'dropped') DEFAULT 'active',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (user_id, course_id)
);

-- Insertion de quelques inscriptions
INSERT INTO enrollments (user_id, course_id, progress, status, enrolled_at) VALUES
-- Étudiants inscrits aux cours
(23, 1, 45, 'active', '2024-01-15 10:00:00'),
(24, 1, 78, 'active', '2024-01-16 14:30:00'),
(25, 1, 100, 'completed', '2024-01-10 09:15:00'),
(26, 2, 23, 'active', '2024-01-18 16:45:00'),
(27, 2, 56, 'active', '2024-01-12 11:20:00'),
(28, 4, 89, 'active', '2024-01-14 13:10:00'),
(29, 4, 100, 'completed', '2024-01-08 15:30:00'),
(30, 9, 34, 'active', '2024-01-17 10:25:00'),
(31, 9, 67, 'active', '2024-01-13 08:45:00'),
(32, 11, 91, 'active', '2024-01-19 12:00:00'),
(33, 11, 100, 'completed', '2024-01-07 14:20:00'),
(34, 13, 42, 'active', '2024-01-20 16:15:00'),
(35, 13, 73, 'active', '2024-01-11 10:30:00'),
(36, 15, 28, 'active', '2024-01-16 09:45:00'),
(37, 15, 61, 'active', '2024-01-09 13:55:00');

-- ========================================
-- TABLE DES PARCOURS D'APPRENTISSAGE
-- ========================================
CREATE TABLE pathways (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    duration INT NOT NULL, -- en heures
    price DECIMAL(10, 2) NOT NULL,
    courses JSON NOT NULL, -- IDs des cours
    level VARCHAR(50) DEFAULT 'beginner',
    image VARCHAR(255) NULL,
    featured BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO pathways (title, description, duration, price, courses, level, featured) VALUES
('Par Chef Étoilé', 'Devenez chef de cuisine haut de gamme', 180, 1299.99, '[1,2,3]', 'beginner', TRUE),
('Expert en Œnologie', 'Maîtrisez l\'art du vin', 150, 999.99, '[4,5,6]', 'intermediate', TRUE),
('Manager Hôtelier', 'Gérez un établissement hôtelier de prestige', 165, 1399.99, '[9,10,7]', 'intermediate', TRUE),
('Tourisme Durable', 'Spécialiste du tourisme responsable', 90, 699.99, '[11,12]', 'beginner', TRUE),
('Marketing Hôtelier Digital', 'Expert en marketing digital hôtelier', 85, 699.99, '[13,14]', 'intermediate', TRUE);

-- ========================================
-- TABLE DES MESSAGES DE CHAT
-- ========================================
CREATE TABLE chat_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sender_id BIGINT UNSIGNED NOT NULL,
    receiver_id BIGINT UNSIGNED NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insertion de quelques messages de chat
INSERT INTO chat_messages (sender_id, receiver_id, message, is_read, created_at) VALUES
(23, 24, 'Bonjour ! Comment allez-vous ?', TRUE, '2024-01-15 10:30:00'),
(24, 23, 'Très bien merci ! J\'adore ce cours de cuisine.', TRUE, '2024-01-15 10:35:00'),
(25, 26, 'Quelqu\'un a terminé le module 3 ?', FALSE, '2024-01-16 14:20:00'),
(27, 28, 'Je recommande vivement ce parcours d\'œnologie.', TRUE, '2024-01-17 09:15:00'),
(29, 30, 'Les vidéos sont de très bonne qualité.', TRUE, '2024-01-18 16:45:00'),
(31, 32, 'Comment accéder aux ressources supplémentaires ?', FALSE, '2024-01-19 11:30:00'),
(33, 34, 'Félicitations pour votre progression !', TRUE, '2024-01-20 13:10:00'),
(35, 36, 'Le certificat est-il reconnu ?', FALSE, '2024-01-21 10:25:00'),
(37, 38, 'Je suis bloqué à la leçon 5, aidez-moi svp.', TRUE, '2024-01-22 15:40:00'),
(39, 40, 'Excellent contenu, merci !', TRUE, '2024-01-23 08:55:00');

-- ========================================
-- TABLE DES PROFILS DE CRÉATEURS
-- ========================================
CREATE TABLE creator_profiles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    specialization VARCHAR(255) NULL,
    bio TEXT NULL,
    website VARCHAR(255) NULL,
    linkedin VARCHAR(255) NULL,
    twitter VARCHAR(255) NULL,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    students_count INT DEFAULT 0,
    total_revenue DECIMAL(10, 2) DEFAULT 0.00,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_id (user_id)
);

-- Insertion des profils de créateurs
INSERT INTO creator_profiles (user_id, specialization, bio, rating, students_count, total_revenue, verified) VALUES
(3, 'Cuisine Française', 'Chef étoilé avec 15 ans d\'expérience dans la cuisine française haut de gamme.', 4.8, 45, 5678.50, TRUE),
(4, 'Œnologie', 'Sommelier professionnel, MS en sommellerie, expert en vins français.', 4.9, 32, 3456.75, TRUE),
(5, 'Restauration', 'Restaurateur expérimenté, propriétaire de 3 restaurants gastronomiques.', 4.7, 28, 2890.25, TRUE),
(6, 'Hôtellerie', 'Directrice d\'hôtel 5 étoiles, experte en gestion hôtelière de luxe.', 4.8, 51, 6234.00, TRUE),
(7, 'Mixologie', 'Barman professionnel, champion de France de mixologie.', 4.6, 19, 1234.50, FALSE),
(8, 'Événementiel', 'Event manager spécialisé, organisatrice de plus de 100 événements.', 4.7, 36, 4567.25, TRUE),
(9, 'Catering', 'Caterer premium, spécialisé en événements d\'entreprise.', 4.5, 22, 1890.00, FALSE),
(10, 'Tourisme', 'Guide touristique certifié, 20 ans d\'expérience dans le tourisme culturel.', 4.8, 41, 3456.75, TRUE),
(11, 'Œnologie', 'Œnologue expert, spécialiste des vins de Bordeaux et Bourgogne.', 4.9, 38, 4123.50, TRUE),
(12, 'Marketing', 'Spécialiste du marketing hôtelier et digital.', 4.6, 29, 2345.00, FALSE),
(13, 'Réception', 'Réceptionniste d\'hôtel 4 étoiles, experte en accueil client.', 4.7, 24, 1567.25, FALSE),
(14, 'Wellness', 'Spa manager certifiée, experte en wellness et spa thérapie.', 4.5, 18, 1234.00, FALSE),
(15, 'Cuisine', 'Cuisinier spécialisé en cuisine française moderne.', 4.6, 31, 2678.50, FALSE),
(16, 'Tourisme', 'Digital nomad spécialisé dans le tourisme connecté.', 4.4, 15, 987.50, FALSE),
(17, 'Sécurité', 'Safety officer certifié, expert en sécurité hôtelière.', 4.7, 27, 2345.75, FALSE),
(18, 'RH', 'RH spécialisée dans le recrutement hôtelier.', 4.5, 20, 1567.00, FALSE),
(19, 'Technologie', 'Innovateur en technologies hôtelières.', 4.6, 23, 1890.25, FALSE),
(20, 'Design', 'Designer d\'intérieur spécialisé en hôtellerie.', 4.8, 34, 3456.00, TRUE),
(21, 'Finance', 'Expert financier spécialisé en gestion hôtelière.', 4.7, 26, 2345.50, FALSE),
(22, 'Qualité', 'Quality manager certifiée, experte en qualité service.', 4.6, 21, 1678.25, FALSE);

-- ========================================
-- INDEX POUR OPTIMISATION
-- ========================================
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_creator ON courses(creator_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_modules_course ON modules(course_id);
CREATE INDEX idx_videos_module ON videos(module_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_receiver ON chat_messages(receiver_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at);

-- ========================================
-- FIN DU SCRIPT
-- ========================================

-- Message de confirmation
SELECT 'Base de données enrichie Match My Formation créée avec succès !' AS message;
SELECT 'Utilisateurs:' AS info, COUNT(*) AS count FROM users;
SELECT 'Cours:' AS info, COUNT(*) AS count FROM courses;
SELECT 'Modules:' AS info, COUNT(*) AS count FROM modules;
SELECT 'Vidéos:' AS info, COUNT(*) AS count FROM videos;
SELECT 'Inscriptions:' AS info, COUNT(*) AS count FROM enrollments;
SELECT 'Messages:' AS info, COUNT(*) AS count FROM chat_messages;
