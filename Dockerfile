# ============================================
# Stage 1: Frontend Build
# ============================================
FROM node:24-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including dev deps needed for build)
RUN npm ci

# Copy source files needed for build
COPY resources ./resources
COPY public ./public
COPY vite.config.ts tsconfig.json tsconfig.node.json postcss.config.js tailwind.config.ts ./

# Build frontend assets
RUN npm run build

# ============================================
# Stage 2: PHP Dependencies
# ============================================
FROM php:8.2-cli-alpine AS php-dependencies

# Install system dependencies
RUN apk add --no-cache \
    libpq-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libwebp-dev \
    icu-dev

# Install PHP extensions needed for Composer
RUN docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
        --with-webp \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_pgsql \
        pgsql \
        zip \
        pcntl \
        gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy composer files
COPY composer.json composer.lock ./

# Install PHP dependencies (production only)
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --prefer-dist \
    --no-interaction \
    --optimize-autoloader

# ============================================
# Stage 3: Production Runtime
# ============================================
FROM dunglas/frankenphp:1-php8.2

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libwebp-dev \
    libicu-dev \
    gosu \
    && docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
        --with-webp \
    && docker-php-ext-install -j$(nproc) pdo pdo_pgsql pgsql zip pcntl sockets gd intl opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Configure PHP for production
RUN { \
        echo 'opcache.enable=1'; \
        echo 'opcache.memory_consumption=256'; \
        echo 'opcache.interned_strings_buffer=16'; \
        echo 'opcache.max_accelerated_files=10000'; \
        echo 'opcache.validate_timestamps=0'; \
        echo 'opcache.save_comments=1'; \
        echo 'opcache.fast_shutdown=1'; \
    } > /usr/local/etc/php/conf.d/opcache.ini

# Set working directory
WORKDIR /app

# Copy Composer binary
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy PHP dependencies from builder
COPY --from=php-dependencies /app/vendor ./vendor

# Copy application code
COPY . .

# Copy built frontend assets from frontend builder
COPY --from=frontend-builder /app/public/build ./public/build

# Optimize autoloader
RUN composer dump-autoload --optimize --no-scripts --no-dev

# Set permissions
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache \
    && chmod -R 775 /app/storage /app/bootstrap/cache

# Copy Caddyfile and create writable config and data directories
COPY docker/Caddyfile /etc/caddy/Caddyfile
RUN chmod 644 /etc/caddy/Caddyfile && chown root:root /etc/caddy/Caddyfile \
    && mkdir -p /config/caddy /data/caddy /data/caddy/locks \
    && chmod -R 775 /config/caddy /data/caddy \
    && chown -R www-data:www-data /config/caddy /data/caddy

# Copy entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose ports
EXPOSE 8000 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/up || exit 1

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile"]
