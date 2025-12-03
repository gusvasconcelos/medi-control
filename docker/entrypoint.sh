#!/bin/sh

set -e

echo "🚀 Starting MediControl application..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
until php artisan db:show 2>/dev/null; do
    echo "Database is unavailable - sleeping"
    sleep 2
done

echo "✅ Database is ready!"

# Run migrations only if RUN_MIGRATIONS is true and use file lock to prevent concurrent migrations
if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
    MIGRATION_LOCK="/tmp/migration.lock"

    # Wait for lock to be released (max 60 seconds)
    LOCK_WAIT=0
    while [ -f "$MIGRATION_LOCK" ] && [ $LOCK_WAIT -lt 60 ]; do
        echo "⏳ Waiting for migrations to complete (lock exists)..."
        sleep 2
        LOCK_WAIT=$((LOCK_WAIT + 2))
    done

    # Create lock file
    touch "$MIGRATION_LOCK"

    echo "🔄 Running database migrations..."
    if php artisan migrate --force --no-interaction; then
        echo "✅ Migrations completed successfully!"
    else
        echo "⚠️  Migration failed, but continuing..."
    fi

    # Remove lock file
    rm -f "$MIGRATION_LOCK"
fi

# Clear and cache config (important for production)
echo "🔧 Optimizing Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Link storage (remove old symlink if it exists to ensure correct path)
echo "🔗 Linking storage..."
rm -f /app/public/storage
php artisan storage:link

# Set correct permissions
echo "🔒 Setting permissions..."
chown -R www-data:www-data /app/storage /app/bootstrap/cache
chmod -R 775 /app/storage /app/bootstrap/cache

echo "✅ Application ready!"

# Execute the main command as www-data
exec gosu www-data "$@"
