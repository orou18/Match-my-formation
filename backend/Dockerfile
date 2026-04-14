FROM php:8.2-fpm as builder

# Dependencies for building
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libmcrypt-dev \
    libreadline-dev \
    libssl-dev \
    libicu-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# PHP extensions
RUN docker-php-ext-install \
    pdo_mysql \
    pdo_pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    intl

# Installer Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Working directory
WORKDIR /var/www/html

# Copy application
COPY --chown=www-data:www-data . .

# Install PHP dependencies (production only)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Clear cache
RUN composer clear-cache

# ========================================
# Production stage
# ========================================
FROM php:8.2-fpm as production

# Runtime dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpng6 \
    libonig5 \
    libxml2 \
    libzip4 \
    libfreetype6 \
    libjpeg62-turbo \
    libicu72 \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# PHP extensions (runtime only)
RUN docker-php-ext-install \
    pdo_mysql \
    pdo_pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    intl

# PHP configuration for production
RUN echo "upload_max_filesize = 20M" >> /usr/local/etc/php/conf.d/uploads.ini && \
    echo "post_max_size = 20M" >> /usr/local/etc/php/conf.d/uploads.ini && \
    echo "max_execution_time = 300" >> /usr/local/etc/php/conf.d/timeout.ini && \
    echo "memory_limit = 512M" >> /usr/local/etc/php/conf.d/memory.ini

WORKDIR /var/www/html

# Copy from builder
COPY --from=builder --chown=www-data:www-data /var/www/html .

# Set permissions
RUN chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD php -r "exit(file_exists('/var/www/html/bootstrap/cache/services.php') ? 0 : 1);"

# Start PHP-FPM
CMD ["php-fpm"]
