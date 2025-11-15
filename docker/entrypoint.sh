#!/bin/bash
set -e

echo "Starting Medi Control application..."

echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -U "${DB_USERNAME}" -d "${DB_DATABASE}" > /dev/null 2>&1; do
  echo "Waiting for database connection..."
  sleep 2
done
echo "PostgreSQL is ready!"

echo "Waiting for Redis to be ready..."
until redis-cli -h redis ping > /dev/null 2>&1; do
  echo "Waiting for Redis connection..."
  sleep 2
done
echo "Redis is ready!"

if [ "${APP_ENV}" != "local" ]; then
  echo "Running database migrations..."
  php artisan migrate --force --no-interaction
fi

if [ "${APP_ENV}" = "production" ]; then
  echo "Optimizing application..."
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache
fi

if [ ! -L /app/public/storage ]; then
  echo "Creating storage link..."
  php artisan storage:link
fi

echo "Warming up cache..."
php artisan cache:clear
php artisan config:clear

echo "Setting permissions..."
chown -R www-data:www-data /app/storage /app/bootstrap/cache
chmod -R 775 /app/storage /app/bootstrap/cache

echo "Application ready!"

exec "$@"
