# syntax=docker/dockerfile:1.4

# Stage 1: Build frontend assets with Node.js
FROM node:20-alpine AS node-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source files needed for build
COPY resources/ resources/
COPY public/ public/
COPY vite.config.ts tailwind.config.js tsconfig.json postcss.config.js ./

# Build production assets
RUN npm run build

# Stage 2: Install PHP dependencies
FROM composer:2 AS php-builder

WORKDIR /app

# Copy composer files
COPY composer.json composer.lock ./

# Install production dependencies
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --no-scripts \
    --prefer-dist \
    --optimize-autoloader

# Stage 3: Development target
FROM dunglas/frankenphp:latest-php8.2 AS development

LABEL maintainer="MediControl Team"
LABEL description="MediControl Development Environment"

WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    postgresql-client \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN install-php-extensions \
    mbstring \
    xml \
    pdo \
    pdo_pgsql \
    curl \
    openssl \
    tokenizer \
    ctype \
    json \
    bcmath \
    fileinfo \
    zip \
    gd \
    iconv \
    intl \
    pcntl \
    sockets

# Copy PHP configuration
COPY docker/php/php.ini-development /usr/local/etc/php/php.ini
COPY docker/php/xdebug.ini /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy composer files first
COPY composer.json composer.lock ./

# Copy application code and Laravel bootstrap needed for Composer scripts/autoload
COPY app/ app/
COPY bootstrap/ bootstrap/
COPY artisan artisan

# Install dependencies (including dev dependencies for development)
# Use --no-scripts to avoid running artisan/package discovery during image build,
# which requires full app runtime (storage paths, cache, etc.)
RUN composer install \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --no-scripts

# Copy remaining application code
COPY . .

# Copy supervisor configuration
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Set permissions for application directories
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html && \
    chmod -R 775 storage bootstrap/cache

# Create storage link for development
RUN php artisan storage:link

# Copy entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose ports
EXPOSE 8000 9003

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/up || exit 1

# Set entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Start supervisor (manages both FrankenPHP and Horizon)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

# Stage 4: Production target
FROM dunglas/frankenphp:latest-php8.2 AS production

LABEL maintainer="MediControl Team"
LABEL description="MediControl Production Environment"

WORKDIR /var/www/html

# Install system dependencies (minimal for production)
RUN apt-get update && apt-get install -y \
    curl \
    libpng-dev \
    libxml2-dev \
    libzip-dev \
    postgresql-client \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions (without xdebug)
RUN install-php-extensions \
    bcmath \
    gd \
    intl \
    soap \
    redis \
    opcache \
    pcntl \
    exif

# Copy PHP production configuration
COPY docker/php/php.ini-production /usr/local/etc/php/php.ini

# Copy application code
COPY --chown=www-data:www-data . .

# Copy built frontend assets from node-builder
COPY --from=node-builder --chown=www-data:www-data /app/public/build ./public/build

# Copy vendor dependencies from php-builder
COPY --from=php-builder --chown=www-data:www-data /app/vendor ./vendor

# Copy supervisor configuration
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Set permissions for application directories
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html && \
    chmod -R 775 storage bootstrap/cache

# Optimize for production
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# Create storage link
RUN php artisan storage:link

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/up || exit 1

# Copy entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Start supervisor (manages both FrankenPHP and Horizon)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
