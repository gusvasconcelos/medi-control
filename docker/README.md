# Docker Setup for Medi Control

Production-ready Docker configuration for Laravel 12 with FrankenPHP, PostgreSQL, Redis, and Horizon.

## Quick Start

### Prerequisites

-   Docker Engine 20.10+
-   Docker Compose v2.0+

### Local Development

1. Copy environment file:

```bash
cp .env.example .env
```

2. Update `.env` with your settings:

```bash
APP_KEY=base64:YOUR_APP_KEY_HERE
DB_DATABASE=medi_control
DB_USERNAME=medi_control
DB_PASSWORD=your_secure_password
JWT_SECRET=your_secure_jwt_secret
```

3. Generate application key:

```bash
php artisan key:generate
```

4. Generate JWT secret:

```bash
php artisan jwt:secret
```

5. Start containers:

```bash
docker-compose up -d
```

6. Check container status:

```bash
docker-compose ps
```

7. View logs:

```bash
docker-compose logs -f app
docker-compose logs -f horizon
```

## Services

### Application (FrankenPHP + Laravel Octane)

-   **Port:** 8000
-   **Health check:** http://localhost:8000/up
-   **Container:** medi-control-app

### Horizon (Queue Worker)

-   **Dashboard:** http://localhost:8000/horizon
-   **Container:** medi-control-horizon

### PostgreSQL

-   **Port:** 5432
-   **Container:** medi-control-postgres
-   **Volume:** postgres-data

### Redis

-   **Port:** 6379
-   **Container:** medi-control-redis
-   **Volume:** redis-data

## Common Commands

### Application Management

```bash
# Stop containers
docker-compose down

# Rebuild containers
docker-compose up -d --build

# Execute Artisan commands
docker-compose exec app php artisan migrate
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:cache

# Access container shell
docker-compose exec app bash

# View Horizon logs
docker-compose exec horizon tail -f /app/storage/logs/horizon.log
```

### Database Operations

```bash
# Run migrations
docker-compose exec app php artisan migrate

# Seed database
docker-compose exec app php artisan db:seed

# Reset database
docker-compose exec app php artisan migrate:fresh --seed

# Access PostgreSQL
docker-compose exec postgres psql -U medi_control -d medi_control
```

### Monitoring

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f horizon
docker-compose logs -f postgres
docker-compose logs -f redis

# Check container health
docker-compose ps
```

## Production Deployment

### Environment Variables

Set these in your production `.env`:

```bash
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
DB_PASSWORD=strong_production_password
```

### Build for Production

```bash
docker build -t medi-control:latest .
```

### Deploy with Docker Compose

```bash
# Pull latest images
docker-compose pull

# Start in detached mode
docker-compose up -d

# Run migrations
docker-compose exec app php artisan migrate --force
```

### Security Considerations

1. Use strong passwords for `DB_PASSWORD`
2. Keep `APP_DEBUG=false` in production
3. Set proper `APP_URL`
4. Use volume mounts for persistent data
5. Configure reverse proxy (nginx/Caddy) for SSL if needed

## Volumes

Persistent data is stored in named volumes:

-   `postgres-data`: PostgreSQL database files
-   `redis-data`: Redis persistence files

Local mounts:

-   `./storage`: Laravel storage directory
-   `./bootstrap/cache`: Bootstrap cache

## Health Checks

All services have health checks configured:

-   **app:** HTTP check on `/up`
-   **horizon:** Process check via supervisor
-   **postgres:** `pg_isready` check
-   **redis:** `redis-cli ping` check

## Troubleshooting

### Containers won't start

```bash
# Check logs
docker-compose logs

# Check individual service
docker-compose logs app
```

### Database connection issues

```bash
# Verify postgres is running
docker-compose ps postgres

# Test connection
docker-compose exec app php artisan tinker
>>> DB::connection()->getPdo();
```

### Horizon not processing jobs

```bash
# Check horizon status
docker-compose logs horizon

# Restart horizon
docker-compose restart horizon

# Clear failed jobs
docker-compose exec app php artisan queue:flush
```

### Permission issues

```bash
# Fix storage permissions
docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
docker-compose exec app chmod -R 775 storage bootstrap/cache
```

## Configuration Files

-   `Dockerfile`: Multi-stage build configuration
-   `docker-compose.yml`: Service orchestration
-   `.dockerignore`: Build context exclusions
-   `docker/supervisord.conf`: Horizon worker configuration
-   `docker/entrypoint.sh`: Container startup script

## Resources

-   [Docker Documentation](https://docs.docker.com/)
-   [Laravel Deployment](https://laravel.com/docs/deployment)
-   [Laravel Horizon](https://laravel.com/docs/horizon)
-   [FrankenPHP](https://frankenphp.dev/)
