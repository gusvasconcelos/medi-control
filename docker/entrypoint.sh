#!/bin/bash
set -e

echo "🚀 MediControl initialization starting..."

# Check if vendor directory exists (needed for development with bind mounts)
if [ ! -d "vendor" ] || [ ! -f "vendor/autoload.php" ]; then
  echo "📦 Installing Composer dependencies..."
  composer install --no-interaction --prefer-dist
  echo "✅ Dependencies installed"
fi

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL database..."
until php artisan db:show 2>/dev/null; do
  echo "   Database not ready yet, waiting..."
  sleep 2
done

echo "✅ Database connected!"

# Run database migrations
echo "📊 Running database migrations..."
if [ "$APP_ENV" = "production" ]; then
  php artisan migrate --force
else
  php artisan migrate
fi

# Cache configurations (production only)
if [ "$APP_ENV" = "production" ]; then
  echo "🗂️  Caching configurations..."
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache
  echo "✅ Configuration cached"
else
  echo "🧹 Clearing caches for development..."
  php artisan config:clear
  php artisan route:clear
  php artisan view:clear
  echo "✅ Caches cleared"
fi

# Create storage link
echo "🔗 Creating storage link..."
php artisan storage:link || true

# Run database seeds (development only, if RUN_SEEDS=true)
if [ "$APP_ENV" = "local" ] && [ "$RUN_SEEDS" = "true" ]; then
  echo "🌱 Running database seeds..."
  php artisan db:seed
  echo "✅ Seeds completed"
fi

# Fix permissions
echo "🔒 Fixing storage permissions..."
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Patch Octane to skip FrankenPHP version check (development workaround)
if [ -f "vendor/laravel/octane/src/Commands/Concerns/InstallsFrankenPhpDependencies.php" ]; then
  echo "🔧 Patching Octane FrankenPHP version check..."
  sed -i 's/if (confirm/if (false \&\& confirm/g' vendor/laravel/octane/src/Commands/Concerns/InstallsFrankenPhpDependencies.php 2>/dev/null || true
fi

echo "✨ Initialization complete!"
echo ""
echo "🏥 MediControl is ready!"
echo "   - Application: ${APP_URL:-http://localhost:8000}"
echo ""

# Execute the container's main command
exec "$@"
