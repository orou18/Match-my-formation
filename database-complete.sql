-- Base de données complète pour Match My Formation - Présentation riche
-- Créée le 14/03/2026

-- DROP DATABASE IF EXISTS matchmyformation_bdd;
-- CREATE DATABASE matchmyformation_bdd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE matchmyformation_bdd;

-- =============================================
-- TABLE UTILISATEURS (Users)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'creator', 'admin') DEFAULT 'student',
    avatar VARCHAR(255) NULL,
    bio TEXT NULL,
    phone VARCHAR(20) NULL,
    address TEXT NULL,
    city VARCHAR(100) NULL,
    country VARCHAR(100) NULL,
    birth_date DATE NULL,
    gender ENUM('male', 'female', 'other') NULL,
    website VARCHAR(255) NULL,
    linkedin VARCHAR(255) NULL,
    twitter VARCHAR(255) NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    last_login_at TIMESTAMP NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    preferences JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE CATEGORIES
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NULL,
    icon VARCHAR(50) NULL,
    color VARCHAR(7) NULL,
    parent_id BIGINT UNSIGNED NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- =============================================
-- TABLE COURS (Courses)
-- =============================================
CREATE TABLE IF NOT EXISTS courses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(500) NOT NULL,
    content LONGTEXT NULL,
    category_id BIGINT UNSIGNED NULL,
    creator_id BIGINT UNSIGNED NULL,
    level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    language VARCHAR(10) DEFAULT 'fr',
    duration_hours DECIMAL(8,2) DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0,
    original_price DECIMAL(10,2) NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    thumbnail VARCHAR(255) NULL,
    preview_video VARCHAR(255) NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    certificate_available BOOLEAN DEFAULT TRUE,
    max_students INT NULL,
    current_students INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    reviews_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    sales_count INT DEFAULT 0,
    requirements JSON NULL,
    what_you_learn JSON NULL,
    target_audience JSON NULL,
    curriculum JSON NULL,
    faq JSON NULL,
    seo_title VARCHAR(255) NULL,
    seo_description TEXT NULL,
    seo_keywords JSON NULL,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- TABLE VIDEOS
-- =============================================
CREATE TABLE IF NOT EXISTS videos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    video_url VARCHAR(500) NOT NULL,
    thumbnail VARCHAR(255) NULL,
    duration INT DEFAULT 0,
    course_id BIGINT UNSIGNED NULL,
    creator_id BIGINT UNSIGNED NULL,
    chapter_number INT DEFAULT 1,
    sort_order INT DEFAULT 0,
    is_free BOOLEAN DEFAULT FALSE,
    is_preview BOOLEAN DEFAULT FALSE,
    status ENUM('processing', 'ready', 'error') DEFAULT 'processing',
    views_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    file_size BIGINT NULL,
    resolution VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- TABLE INSCRIPTIONS (Enrollments)
-- =============================================
CREATE TABLE IF NOT EXISTS enrollments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    course_id BIGINT UNSIGNED NOT NULL,
    status ENUM('pending', 'active', 'completed', 'cancelled', 'refunded') DEFAULT 'pending',
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    completion_date TIMESTAMP NULL,
    certificate_url VARCHAR(255) NULL,
    last_accessed_at TIMESTAMP NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (user_id, course_id)
);

-- =============================================
-- TABLE TRANSACTIONS
-- =============================================
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    course_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    status ENUM('pending', 'completed', 'failed', 'refunded', 'cancelled') DEFAULT 'pending',
    payment_method ENUM('credit_card', 'paypal', 'bank_transfer', 'stripe') DEFAULT 'stripe',
    payment_intent_id VARCHAR(255) NULL,
    transaction_id VARCHAR(255) NULL,
    receipt_url VARCHAR(255) NULL,
    refunded_amount DECIMAL(10,2) DEFAULT 0,
    refund_reason TEXT NULL,
    metadata JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- =============================================
-- TABLE REVIEWS
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    course_id BIGINT UNSIGNED NOT NULL,
    rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (user_id, course_id)
);

-- =============================================
-- TABLE BLOG ARTICLES
-- =============================================
CREATE TABLE IF NOT EXISTS blog_articles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content LONGTEXT NOT NULL,
    author_id BIGINT UNSIGNED NULL,
    featured_image VARCHAR(255) NULL,
    status ENUM('draft', 'published', 'scheduled') DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    category VARCHAR(100) NULL,
    tags JSON NULL,
    seo_title VARCHAR(255) NULL,
    seo_description TEXT NULL,
    seo_keywords JSON NULL,
    views_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- TABLE NEWSLETTER SUBSCRIBERS
-- =============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NULL,
    status ENUM('active', 'unsubscribed', 'bounced') DEFAULT 'active',
    source ENUM('website', 'import', 'manual', 'course_enrollment') DEFAULT 'website',
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL,
    last_opened_at TIMESTAMP NULL,
    last_clicked_at TIMESTAMP NULL,
    opens_count INT DEFAULT 0,
    clicks_count INT DEFAULT 0,
    location VARCHAR(255) NULL,
    preferences JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE NEWSLETTER CAMPAIGNS
-- =============================================
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    preview_text TEXT NULL,
    status ENUM('draft', 'scheduled', 'sending', 'sent', 'failed') DEFAULT 'draft',
    scheduled_at TIMESTAMP NULL,
    sent_at TIMESTAMP NULL,
    recipients_count INT DEFAULT 0,
    opens_count INT DEFAULT 0,
    clicks_count INT DEFAULT 0,
    bounces_count INT DEFAULT 0,
    unsubscribes_count INT DEFAULT 0,
    created_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- INSERTION DES DONNÉES DE DÉMONSTRATION
-- =============================================

-- Insertion des catégories
INSERT INTO categories (name, slug, description, icon, color, sort_order) VALUES
('Tourisme', 'tourisme', 'Formation complète dans le secteur du tourisme', 'map', '#3B82F6', 1),
('Hôtellerie', 'hotellerie', 'Gestion hôtelière et restauration', 'hotel', '#10B981', 2),
('Marketing Digital', 'marketing-digital', 'Marketing en ligne et réseaux sociaux', 'trending-up', '#8B5CF6', 3),
('Management', 'management', 'Gestion d\'équipe et leadership', 'users', '#F59E0B', 4),
('Service Client', 'service-client', 'Excellence dans le service client', 'headphones', '#EF4444', 5),
('Langues', 'langues', 'Apprentissage des langues étrangères', 'globe', '#06B6D4', 6),
('Informatique', 'informatique', 'Bureautique et outils numériques', 'computer', '#6366F1', 7),
('Communication', 'communication', 'Techniques de communication professionnelle', 'message-circle', '#EC4899', 8);

-- Insertion des utilisateurs (étudiants, créateurs, admin)
INSERT INTO users (name, email, password, role, avatar, bio, phone, city, country, status, email_verified) VALUES
-- Admin
('Super Administrateur', 'admin@matchmyformation.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 
'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 
'Administrateur principal de la plateforme Match My Formation', '+33 1 23 45 67 89', 'Paris', 'France', 'active', TRUE),

-- Créateurs de contenu
('Marie Dubois', 'marie.dubois@matchmyformation.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'creator',
'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
'Expert en tourisme durable avec 15 ans d\'expérience dans l\'industrie hôtelière', '+33 6 12 34 56 78', 'Lyon', 'France', 'active', TRUE),

('Jean Martin', 'jean.martin@matchmyformation.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'creator',
'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
'Consultant en marketing digital spécialisé dans le secteur touristique', '+33 6 23 45 67 89', 'Marseille', 'France', 'active', TRUE),

('Sophie Laurent', 'sophie.laurent@matchmyformation.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'creator',
'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
'Formatrice en service client et communication professionnelle', '+33 6 34 56 78 90', 'Bordeaux', 'France', 'active', TRUE),

('Pierre Bernard', 'pierre.bernard@matchmyformation.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'creator',
'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
'Expert en management et leadership d\'équipes', '+33 6 45 67 89 01', 'Lille', 'France', 'active', TRUE),

-- Étudiants
('Alice Petit', 'alice.petit@matchmyformation.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student',
'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
'Étudiante en tourisme, passionnée par l\'hôtellerie de luxe', '+33 7 12 34 56 78', 'Nice', 'France', 'active', TRUE),

('Bob Leroy', 'bob.leroy@matchmyformation.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student',
'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
'Professionnel en reconversion vers le marketing digital', '+33 7 23 45 67 89', 'Toulouse', 'France', 'active', TRUE),

('Claire Rousseau', 'claire.rousseau@matchmyformation.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student',
'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
'Responsable service client cherchant à perfectionner ses compétences', '+33 7 34 56 78 90', 'Nantes', 'France', 'active', TRUE),

('David Moreau', 'david.moreau@matchmyformation.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student',
'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
'Manager d\'équipe en formation continue', '+33 7 45 67 89 01', 'Strasbourg', 'France', 'active', TRUE),

('Emma Girard', 'emma.girard@matchmyformation.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student',
'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
'Studiante en communication, passionnée par les langues', '+33 7 56 78 90 12', 'Montpellier', 'France', 'active', TRUE);

-- Insertion des cours
INSERT INTO courses (title, slug, description, short_description, category_id, creator_id, level, duration_hours, price, original_price, thumbnail, status, featured, rating, reviews_count, views_count, sales_count, requirements, what_you_learn, target_audience, curriculum, faq) VALUES
('Tourisme Durable et Écotourisme', 'tourisme-durable-ecotourisme', 
'Découvrez les fondamentaux du tourisme durable et comment mettre en place des pratiques écotouristiques respectueuses de l\'environnement. Cette formation complète vous apprendra à développer des projets touristiques durables.',
'Formation complète sur le tourisme durable et l\'écotourisme pour professionnels du secteur.',
1, 2, 'intermediate', 25, 89.99, 149.99, 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop', 'published', TRUE, 4.8, 156, 3420, 892,
'["Aucun prérequis spécifique", "Intérêt pour l\'environnement", "Base en tourisme recommandée"]',
'["Comprendre les principes du tourisme durable", "Mettre en place des pratiques écotouristiques", "Évaluer l\'impact environnemental", "Développer des projets durables"]',
'["Professionnels du tourisme", "Gérants d\'hébergements", "Agents de voyage", "Étudiants en tourisme"]',
'["Module 1: Introduction au tourisme durable", "Module 2: Impact environnemental", "Module 3: Certification et labels", "Module 4: Cas pratiques", "Module 5: Projet final"]',
'["Q: Cette formation est-elle certifiante? R: Oui, un certificat est délivré.", "Q: Y a-t-il des prérequis? R: Non, ouverte à tous.", "Q: La formation est-elle en ligne? R: Oui, 100% en ligne."]'),

('Gestion Hôtelière Avancée', 'gestion-hoteliere-avancee',
'Maîtrisez tous les aspects de la gestion hôtelière : de la réservation à la satisfaction client, en passant par la gestion du personnel et l\'optimisation des revenus.',
'Devenez expert en gestion hôtelière avec cette formation complète et pratique.',
2, 2, 'advanced', 40, 149.99, 249.99, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop', 'published', TRUE, 4.9, 203, 5678, 1456,
'["Expérience en hôtellerie", "Connaissances de base en gestion", "Niveau professionnel"]',
'["Optimiser les revenus hôteliers", "Gérer les équipes efficacement", "Améliorer l\'expérience client", "Utiliser les technologies modernes"]',
'["Directeurs d\'hôtel", "Gérants d\'établissements", "Responsables réception", "Étudiants hôtellerie"]',
'["Module 1: Stratégie hôtelier", "Module 2: Gestion des revenus", "Module 3: Marketing hôtelier", "Module 4: Service client", "Module 5: Digitalisation", "Module 6: Stage pratique"]',
'["Q: Formation accessible aux débutants? R: Niveau intermédiaire recommandé.", "Q: Certificat inclus? R: Oui, certifié.", "Q: Durée de la formation? R: 40 heures de contenu."]'),

('Marketing Digital Touristique', 'marketing-digital-touristique',
'Apprenez à promouvoir efficacement des destinations et services touristiques sur les plateformes numériques. SEO, réseaux sociaux, publicité en ligne, et bien plus encore.',
'Marketing digital spécialisé pour l\'industrie touristique et hôtelière.',
3, 3, 'intermediate', 30, 119.99, 199.99, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop', 'published', TRUE, 4.7, 178, 4234, 1123,
'["Connaissances de base en marketing", "Maîtrise de l\'outil informatique", "Intérêt pour le tourisme"]',
'["Créer des stratégies marketing digitales", "Optimiser le référencement", "Gérer les réseaux sociaux", "Analyser les performances"]',
'["Marketing managers", "Responsables communication", "Entrepreneurs du tourisme", "Étudiants marketing"]',
'["Module 1: Fondamentaux du marketing digital", "Module 2: SEO pour le tourisme", "Module 3: Réseaux sociaux", "Module 4: Publicité en ligne", "Module 5: Email marketing", "Module 6: Analytics"]',
'["Q: Niveau requis? R: Intermédiaire.", "Q: Outils nécessaires? R: Ordinateur avec accès internet.", "Q: Certification? R: Oui, certifiante."]'),

('Excellence Service Client', 'excellence-service-client',
'Développez des compétences exceptionnelles en service client pour fidéliser votre clientèle et transformer chaque interaction en une expérience mémorable.',
'Devenez un expert du service client avec des techniques avancées de communication.',
5, 4, 'beginner', 15, 69.99, 99.99, 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop', 'published', FALSE, 4.6, 234, 2890, 789,
'["Aucun prérequis", "Bonne capacité d\'écoute", "Volonté d\'apprendre"]',
'["Maîtriser les techniques de communication", "Gérer les situations difficiles", "Fidéliser la clientèle", "Mesurer la satisfaction"]',
'["Agents de service client", "Commerciaux", "Hôtesse d\'accueil", "Tous professionnels en contact client"]',
'["Module 1: Communication efficace", "Module 2: Gestion des conflits", "Module 3: Personnalisation du service", "Module 4: Outils digitaux", "Module 5: Certification"]',
'["Q: Formation pour débutants? R: Oui, accessible à tous.", "Q: Durée de formation? R: 15 heures.", "Q: Pratique incluse? R: Oui, mises en situation."]'),

('Leadership et Management', 'leadership-management',
'Développez votre style de leadership et apprenez à gérer des équipes performantes avec des techniques de management modernes et éprouvées.',
'Formation complète en leadership pour managers et futurs leaders.',
4, 5, 'advanced', 35, 139.99, 229.99, 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', 'published', FALSE, 4.8, 167, 3456, 934,
'["Expérience en management", "Leadership d\'équipe", "Niveau professionnel"]',
'["Développer son style de leadership", "Motiver son équipe", "Gérer les performances", "Prendre des décisions stratégiques"]',
'["Managers", "Directeurs d\'équipe", "Entrepreneurs", "Cadres en devenir"]',
'["Module 1: Styles de leadership", "Module 2: Motivation et engagement", "Module 3: Gestion des conflits", "Module 4: Prise de décision", "Module 5: Coaching", "Module 6: Transformation digitale"]',
'["Q: Expérience management requise? R: Oui, niveau intermédiaire.", "Q: Formation certifiante? R: Oui.", "Q: Contenu pratique? R: Oui, études de cas."]'),

('Anglais Touristique', 'anglais-touristique',
'Apprenez l\'anglais professionnel spécifique au secteur du tourisme : accueil, réservation, information touristique, et gestion des situations courantes.',
'Anglais spécialisé pour les professionnels du tourisme et de l\'hôtellerie.',
6, 2, 'beginner', 20, 79.99, 129.99, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop', 'published', FALSE, 4.5, 189, 2234, 678,
'["Niveau débutant en anglais", "Intérêt pour le tourisme", "Motivation à apprendre"]',
'["Communiquer en anglais avec les clients", "Gérer les réservations", "Donner des informations touristiques", "Résoudre les problèmes courants"]',
'["Personnel d\'accueil", "Agents de voyage", "Étudiants tourisme", "Professionnels hôtellerie"]',
'["Module 1: Vocabulaire de base", "Module 2: Accueil et réception", "Module 3: Réservations", "Module 4: Tourisme et visites", "Module 5: Situations professionnelles"]',
'["Q: Niveau anglais requis? R: Débutant accepté.", "Q: Formation intensive? R: 20 heures.", "Q: Certification? R: Oui, test final."]'),

('Bureautique Avancée', 'bureautique-avancee',
'Maîtrisez les outils bureautiques essentiels : Word, Excel, PowerPoint, et les outils collaboratifs pour optimiser votre productivité professionnelle.',
'Formation complète sur les outils bureautiques modernes et productivité.',
7, 3, 'beginner', 25, 59.99, 99.99, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop', 'published', FALSE, 4.4, 145, 1876, 567,
'["Connaissances informatiques de base", "Accès aux logiciels Office", "Motivation à apprendre"]',
'["Maîtriser Word, Excel, PowerPoint", "Utiliser les outils collaboratifs", "Optimiser sa productivité", "Créer des documents professionnels"]',
'["Tous professionnels", "Étudiants", "Demandeurs d\'emploi", "Personnes en reconversion"]',
'["Module 1: Word avancé", "Module 2: Excel professionnel", "Module 3: PowerPoint dynamique", "Module 4: Outils collaboratifs", "Module 5: Productivité"]',
'["Q: Logiciels fournis? R: Non, licence requise.", "Q: Niveau requis? R: Débutant accepté.", "Q: Certificat? R: Oui, certifiant."]'),

('Communication Professionnelle', 'communication-professionnelle',
'Développez vos compétences en communication professionnelle : prise de parole, rédaction, négociation, et communication interpersonnelle en entreprise.',
'Formation complète en communication pour exceller professionnellement.',
8, 4, 'intermediate', 18, 89.99, 149.99, 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop', 'published', FALSE, 4.7, 198, 3012, 823,
'["Expérience professionnelle", "Bonne expression orale", "Volonté de progresser"]',
'["Améliorer sa prise de parole", "Rédiger efficacement", "Négocier avec succès", "Communiquer en équipe"]',
'["Tous professionnels", "Managers", "Commerciaux", "Étudiants"]',
'["Module 1: Fondamentaux de la communication", "Module 2: Prise de parole", "Module 3: Rédaction professionnelle", "Module 4: Négociation", "Module 5: Communication d\'équipe"]',
'["Q: Formation pour tous niveaux? R: Intermédiaire recommandé.", "Q: Exercices pratiques? R: Oui, nombreux.", "Q: Certification? R: Oui."]');

-- Insertion des vidéos pour chaque cours
INSERT INTO videos (title, description, video_url, thumbnail, duration, course_id, creator_id, chapter_number, sort_order, is_free, is_preview, status) VALUES
-- Vidéos pour Tourisme Durable
('Introduction au Tourisme Durable', 'Présentation des concepts fondamentaux du tourisme durable', 'https://example.com/video1.mp4', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=225&fit=crop', 1800, 1, 2, 1, 1, TRUE, TRUE, 'ready'),
('Impact Environnemental du Tourisme', 'Analyse des impacts environnementaux et solutions durables', 'https://example.com/video2.mp4', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop', 2400, 1, 2, 1, 2, FALSE, FALSE, 'ready'),
('Certifications et Labels Écologiques', 'Découverte des certifications existantes et comment les obtenir', 'https://example.com/video3.mp4', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=225&fit=crop', 2100, 1, 2, 2, 1, FALSE, FALSE, 'ready'),
('Études de Cas Réussis', 'Analyse de projets écotouristiques réussis dans le monde', 'https://example.com/video4.mp4', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop', 2700, 1, 2, 3, 1, FALSE, FALSE, 'ready'),
('Projet Pratique Final', 'Mise en pratique des acquis avec un projet concret', 'https://example.com/video5.mp4', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=225&fit=crop', 3600, 1, 2, 4, 1, FALSE, FALSE, 'ready'),

-- Vidéos pour Gestion Hôtelière
('Stratégie Hôtelière Moderne', 'Les fondamentaux de la stratégie dans l\'industrie hôtelière', 'https://example.com/video6.mp4', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=225&fit=crop', 2100, 2, 2, 1, 1, TRUE, TRUE, 'ready'),
('Revenue Management', 'Optimisation des revenus et pricing stratégique', 'https://example.com/video7.mp4', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=225&fit=crop', 3000, 2, 2, 2, 1, FALSE, FALSE, 'ready'),
('Marketing Hôtelier Digital', 'Stratégies marketing pour l\'industrie hôtelière', 'https://example.com/video8.mp4', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=225&fit=crop', 2400, 2, 2, 3, 1, FALSE, FALSE, 'ready'),
('Service Client Excellence', 'Créer une expérience client exceptionnelle', 'https://example.com/video9.mp4', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=225&fit=crop', 2700, 2, 2, 4, 1, FALSE, FALSE, 'ready'),
('Digitalisation Hôtelière', 'Intégration des technologies modernes', 'https://example.com/video10.mp4', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=225&fit=crop', 3300, 2, 2, 5, 1, FALSE, FALSE, 'ready'),
('Stage Pratique', 'Mise en situation réelle en environnement hôtelier', 'https://example.com/video11.mp4', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=225&fit=crop', 7200, 2, 2, 6, 1, FALSE, FALSE, 'ready'),

-- Vidéos pour Marketing Digital
('Fondamentaux du Marketing Digital', 'Introduction au marketing digital et ses applications', 'https://example.com/video12.mp4', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop', 1800, 3, 3, 1, 1, TRUE, TRUE, 'ready'),
('SEO pour le Tourisme', 'Optimisation du référencement pour les sites touristiques', 'https://example.com/video13.mp4', 'https://images.unsplash.com/photo-1593720219276-0b1eacd661ef?w=400&h=225&fit=crop', 2700, 3, 3, 2, 1, FALSE, FALSE, 'ready'),
('Réseaux Sociaux Touristiques', 'Stratégies pour Instagram, Facebook, LinkedIn', 'https://example.com/video14.mp4', 'https://images.unsplash.com/photo-1611162617474-5b21f8f8f3b9?w=400&h=225&fit=crop', 2400, 3, 3, 3, 1, FALSE, FALSE, 'ready'),
('Publicité en Ligne', 'Google Ads, Facebook Ads pour le tourisme', 'https://example.com/video15.mp4', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=225&fit=crop', 3000, 3, 3, 4, 1, FALSE, FALSE, 'ready'),
('Email Marketing', 'Campagnes email et newsletters efficaces', 'https://example.com/video16.mp4', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=225&fit=crop', 2100, 3, 3, 5, 1, FALSE, FALSE, 'ready'),
('Analytics et Mesures', 'Suivi des performances et KPIs', 'https://example.com/video17.mp4', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=225&fit=crop', 2400, 3, 3, 6, 1, FALSE, FALSE, 'ready');

-- Insertion des inscriptions
INSERT INTO enrollments (user_id, course_id, status, progress_percentage, enrolled_at) VALUES
-- Alice Petit - plusieurs cours
(6, 1, 'active', 75.5, '2024-01-15 10:30:00'),
(6, 3, 'active', 45.0, '2024-02-01 14:20:00'),
(6, 5, 'completed', 100.0, '2024-01-20 09:15:00'),

-- Bob Leroy
(7, 3, 'active', 60.0, '2024-02-10 16:45:00'),
(7, 7, 'active', 30.0, '2024-02-15 11:30:00'),

-- Claire Rousseau
(8, 5, 'active', 85.0, '2024-01-25 13:20:00'),
(8, 8, 'active', 50.0, '2024-02-05 10:15:00'),

-- David Moreau
(9, 4, 'active', 40.0, '2024-02-08 15:30:00'),
(9, 5, 'completed', 100.0, '2024-01-18 08:45:00'),

-- Emma Girard
(10, 6, 'active', 70.0, '2024-01-30 12:00:00'),
(10, 8, 'active', 25.0, '2024-02-12 14:20:00');

-- Insertion des transactions
INSERT INTO transactions (user_id, course_id, amount, currency, status, payment_method, created_at) VALUES
(6, 1, 89.99, 'EUR', 'completed', 'stripe', '2024-01-15 10:35:00'),
(6, 3, 119.99, 'EUR', 'completed', 'stripe', '2024-02-01 14:25:00'),
(6, 5, 139.99, 'EUR', 'completed', 'paypal', '2024-01-20 09:20:00'),
(7, 3, 119.99, 'EUR', 'completed', 'stripe', '2024-02-10 16:50:00'),
(7, 7, 59.99, 'EUR', 'completed', 'stripe', '2024-02-15 11:35:00'),
(8, 5, 139.99, 'EUR', 'completed', 'stripe', '2024-01-25 13:25:00'),
(8, 8, 89.99, 'EUR', 'completed', 'paypal', '2024-02-05 10:20:00'),
(9, 4, 69.99, 'EUR', 'completed', 'stripe', '2024-02-08 15:35:00'),
(9, 5, 139.99, 'EUR', 'completed', 'stripe', '2024-01-18 08:50:00'),
(10, 6, 79.99, 'EUR', 'completed', 'stripe', '2024-01-30 12:05:00'),
(10, 8, 89.99, 'EUR', 'completed', 'stripe', '2024-02-12 14:25:00');

-- Insertion des reviews
INSERT INTO reviews (user_id, course_id, rating, comment, status, created_at) VALUES
(6, 1, 5, 'Formation excellente ! Très complète et bien structurée. J\'ai beaucoup appris sur le tourisme durable.', 'approved', '2024-02-01 10:00:00'),
(7, 3, 4, 'Très bon contenu, mais j\'aurais aimé plus d\'exemples pratiques. Néanmoins recommandé !', 'approved', '2024-02-20 14:30:00'),
(8, 5, 5, 'Formation de qualité supérieure ! Le formateur est excellent et les exemples concrets.', 'approved', '2024-02-15 09:20:00'),
(9, 4, 4, 'Contenu pertinent et bien expliqué. Parfait pour améliorer son service client.', 'approved', '2024-02-25 11:45:00'),
(10, 6, 5, 'Exactement ce qu\'il me fallait ! L\'anglais professionnel expliqué simplement.', 'approved', '2024-02-18 15:30:00');

-- Insertion des articles de blog
INSERT INTO blog_articles (title, slug, excerpt, content, author_id, featured_image, status, featured, category, tags, views_count, likes_count, comments_count, published_at) VALUES
('Les Tendances du Tourisme Durable en 2024', 'tendances-tourisme-durable-2024',
'Découvrez les dernières innovations et tendances qui transforment l\'industrie du tourisme vers un avenir plus durable.',
'Le tourisme durable connaît une transformation sans précédent en 2024. Les voyageurs sont de plus en plus conscients de leur impact environnemental et cherchent des expériences authentiques qui respectent la planète. Dans cet article, nous explorons les principales tendances qui façonnent l\'avenir du tourisme durable...',
2, 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop', 'published', TRUE, 'Tourisme', '["tourisme", "durable", "tendances", "2024", "environnement"]', 3420, 156, 23, '2024-03-01 10:00:00'),

('Comment Optimiser la Gestion Hôtelière', 'optimiser-gestion-hoteliere',
'Stratégies avancées pour améliorer l\'efficacité opérationnelle et la satisfaction client dans l\'hôtellerie moderne.',
'La gestion hôtelière exige une approche multidimensionnelle alliant expertise opérationnelle, sens du service et maîtrise des nouvelles technologies. Les hôteliers modernes doivent jongler avec de multiples défis : optimisation des revenus, gestion des talents, digitalisation des processus, et personnalisation de l\'expérience client...',
2, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop', 'published', TRUE, 'Hôtellerie', '["hôtellerie", "gestion", "optimisation", "client", "revenue"]', 2890, 134, 18, '2024-02-25 14:30:00'),

('Marketing Digital pour le Secteur Touristique', 'marketing-digital-touristique',
'Techniques et stratégies de marketing digital spécifiquement adaptées aux entreprises du secteur touristique.',
'Le marketing digital révolutionne la manière dont les entreprises touristiques communiquent avec leurs clients. Dans un secteur aussi visuel et expérientiel que le tourisme, les stratégies digitales doivent être particulièrement créatives et engageantes. Découvrez comment transformer votre présence en ligne en véritable moteur de croissance...',
3, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop', 'published', FALSE, 'Marketing', '["marketing", "digital", "tourisme", "stratégie", "communication"]', 2156, 98, 15, '2024-03-05 09:15:00'),

('L\'Importance du Service Client dans l\'Hôtellerie', 'service-client-hotellerie',
'Pourquoi un service client exceptionnel est crucial pour le succès dans l\'industrie hôtelière moderne.',
'Dans l\'industrie hôtelière ultra-compétitive d\'aujourd\'hui, le service client n\'est plus une option mais une nécessité stratégique. Les voyageurs ont des attentes de plus en plus élevées et partagent instantanément leurs expériences sur les plateformes en ligne. Un service client exceptionnel peut transformer un client satisfait en ambassadeur de marque...',
4, 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop', 'published', FALSE, 'Service Client', '["service", "client", "hôtellerie", "expérience", "satisfaction"]', 1876, 87, 12, '2024-02-28 16:45:00'),

('Leadership Transformationnel dans le Tourisme', 'leadership-transformationnel-tourisme',
'Développer un leadership adapté aux défis et opportunités du secteur touristique moderne.',
'Le secteur touristique fait face à des transformations rapides : digitalisation, nouvelles attentes des clients, enjeux environnementaux, et concurrence mondiale. Dans ce contexte, les leaders doivent évoluer pour guider leurs équipes vers l\'excellence. Le leadership transformationnel émerge comme la approche la plus adaptée à ces défis...',
5, 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop', 'published', FALSE, 'Management', '["leadership", "management", "transformation", "tourisme", "équipe"]', 1543, 76, 9, '2024-03-03 11:20:00');

-- Insertion des abonnés newsletter
INSERT INTO newsletter_subscribers (email, name, status, source, subscribed_at, opens_count, clicks_count, location) VALUES
('alice.petit@email.com', 'Alice Petit', 'active', 'website', '2024-01-15 10:30:00', 12, 3, 'Paris, France'),
('bob.leroy@email.com', 'Bob Leroy', 'active', 'course_enrollment', '2024-02-01 14:20:00', 8, 2, 'Lyon, France'),
('claire.rousseau@email.com', 'Claire Rousseau', 'active', 'website', '2024-01-25 13:20:00', 15, 4, 'Marseille, France'),
('david.moreau@email.com', 'David Moreau', 'active', 'import', '2024-01-10 09:15:00', 6, 1, 'Lille, France'),
('emma.girard@email.com', 'Emma Girard', 'active', 'manual', '2024-02-05 11:45:00', 10, 2, 'Bordeaux, France'),
('francois.dubois@email.com', 'François Dubois', 'active', 'website', '2024-02-12 16:30:00', 9, 3, 'Toulouse, France'),
('isabelle.martin@email.com', 'Isabelle Martin', 'active', 'course_enrollment', '2024-02-18 08:20:00', 11, 4, 'Nice, France'),
('lucas.bernard@email.com', 'Lucas Bernard', 'active', 'website', '2024-02-20 14:15:00', 7, 1, 'Nantes, France'),
('marie.legrand@email.com', 'Marie Legrand', 'active', 'import', '2024-01-08 10:45:00', 13, 5, 'Strasbourg, France'),
('nicolas.petit@email.com', 'Nicolas Petit', 'active', 'manual', '2024-02-25 12:30:00', 5, 0, 'Montpellier, France');

-- Insertion des campagnes newsletter
INSERT INTO newsletter_campaigns (title, subject, content, preview_text, status, scheduled_at, sent_at, recipients_count, opens_count, clicks_count, bounces_count, unsubscribes_count, created_by) VALUES
('Nouveaux Cours de Tourisme Durable', 'Découvrez nos dernières formations en tourisme durable',
'Bonjour, nous sommes ravis de vous annoncer le lancement de nos nouvelles formations spécialisées en tourisme durable !',
'Découvrez nos formations exclusives en tourisme durable...', 'sent', NULL, '2024-03-01 09:00:00', 1250, 890, 234, 8, 12, 2),

('Offre Spéciale Printemps', '-20% sur toutes nos formations',
'Cette offre spéciale printemps est l\'occasion parfaite de développer vos compétences à un prix avantageux !',
'Profitez de -20% sur toutes nos formations...', 'sent', NULL, '2024-03-10 10:30:00', 1500, 1120, 345, 15, 18, 2),

('Webinar Gratuit Marketing Touristique', 'Inscrivez-vous à notre webinar gratuit',
'Rejoignez-nous pour un webinar exclusif sur les dernières tendances du marketing touristique.',
'Webinar gratuit sur le marketing touristique...', 'scheduled', '2024-03-20 14:00:00', NULL, 0, 0, 0, 0, 0, 2),

('Mise à jour Platforme', 'Nouvelles fonctionnalités disponibles',
'Nous avons le plaisir de vous annoncer le déploiement de nouvelles fonctionnalités sur notre plateforme.',
'Découvrez les nouvelles fonctionnalités...', 'draft', NULL, NULL, 0, 0, 0, 0, 0, 2);

-- Mise à jour des statistiques des cours
UPDATE courses SET 
    current_students = (SELECT COUNT(*) FROM enrollments WHERE course_id = courses.id AND status = 'active'),
    sales_count = (SELECT COUNT(*) FROM transactions WHERE course_id = courses.id AND status = 'completed'),
    reviews_count = (SELECT COUNT(*) FROM reviews WHERE course_id = courses.id AND status = 'approved'),
    rating = COALESCE((SELECT AVG(rating) FROM reviews WHERE course_id = courses.id AND status = 'approved'), 0);

-- Création d\'index pour optimiser les performances
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_featured ON courses(featured);
CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_reviews_course ON reviews(course_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_blog_articles_status ON blog_articles(status);
CREATE INDEX idx_blog_articles_featured ON blog_articles(featured);
CREATE INDEX idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX idx_newsletter_campaigns_status ON newsletter_campaigns(status);

-- Affichage des statistiques finales
SELECT '=== STATISTIQUES FINALES ===' as info;
SELECT CONCAT('Utilisateurs: ', COUNT(*)) as stat FROM users;
SELECT CONCAT('Catégories: ', COUNT(*)) as stat FROM categories;
SELECT CONCAT('Cours: ', COUNT(*)) as stat FROM courses;
SELECT CONCAT('Vidéos: ', COUNT(*)) as stat FROM videos;
SELECT CONCAT('Inscriptions: ', COUNT(*)) as stat FROM enrollments;
SELECT CONCAT('Transactions: ', COUNT(*)) as stat FROM transactions;
SELECT CONCAT('Avis: ', COUNT(*)) as stat FROM reviews;
SELECT CONCAT('Articles blog: ', COUNT(*)) as stat FROM blog_articles;
SELECT CONCAT('Abonnés newsletter: ', COUNT(*)) as stat FROM newsletter_subscribers;
SELECT CONCAT('Campagnes newsletter: ', COUNT(*)) as stat FROM newsletter_campaigns;
