.PHONY: help up down restart logs shell artisan migrate fresh seed test build build-prod clean ps status install

# Default target - show help
help:  ## Show this help message
	@echo "MediControl Docker Commands"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development commands
up:  ## Start development environment
	docker compose up -d

down:  ## Stop all containers
	docker compose down

restart:  ## Restart all containers
	docker compose restart

logs:  ## Tail logs from all containers
	docker compose logs -f

logs-app:  ## Tail application logs only
	docker compose logs -f frankenphp

logs-horizon:  ## Tail Horizon logs
	docker compose exec frankenphp tail -f storage/logs/horizon.log

shell:  ## Open bash shell in app container
	docker compose exec frankenphp bash

shell-root:  ## Open bash shell as root in app container
	docker compose exec -u root frankenphp bash

# Artisan commands
artisan:  ## Run artisan command (usage: make artisan cmd="migrate")
	docker compose exec frankenphp php artisan $(cmd)

migrate:  ## Run database migrations
	docker compose exec frankenphp php artisan migrate

migrate-fresh:  ## Drop all tables and re-run migrations
	docker compose exec frankenphp php artisan migrate:fresh

fresh:  ## Fresh database with seeds
	docker compose exec frankenphp php artisan migrate:fresh --seed

seed:  ## Run database seeders
	docker compose exec frankenphp php artisan db:seed

rollback:  ## Rollback last migration
	docker compose exec frankenphp php artisan migrate:rollback

# Testing
test:  ## Run all tests
	docker compose exec frankenphp php artisan test

test-filter:  ## Run specific test (usage: make test-filter name="TestName")
	docker compose exec frankenphp php artisan test --filter=$(name)

lint:  ## Run code style fixer
	docker compose exec frankenphp composer lint

lint-test:  ## Check code style without fixing
	docker compose exec frankenphp composer lint:test

phpstan:  ## Run static analysis
	docker compose exec frankenphp ./vendor/bin/phpstan analyse

# Build commands
build:  ## Build development images
	docker compose build

build-prod:  ## Build production images
	docker compose -f docker-compose.yml -f docker-compose.prod.yml build

build-no-cache:  ## Build development images without cache
	docker compose build --no-cache

# Production commands
prod-up:  ## Start production environment
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

prod-down:  ## Stop production environment
	docker compose -f docker-compose.yml -f docker-compose.prod.yml down

prod-logs:  ## Tail production logs
	docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

# Monitoring
ps:  ## Show running containers
	docker compose ps

status:  ## Show detailed container status
	docker compose ps -a

horizon:  ## Open Horizon dashboard in browser
	@echo "Opening http://localhost:8000/horizon"
	@command -v xdg-open > /dev/null && xdg-open http://localhost:8000/horizon || echo "Please open http://localhost:8000/horizon in your browser"

pulse:  ## Open Pulse dashboard in browser
	@echo "Opening http://localhost:8000/pulse"
	@command -v xdg-open > /dev/null && xdg-open http://localhost:8000/pulse || echo "Please open http://localhost:8000/pulse in your browser"

rabbitmq:  ## Open RabbitMQ management interface
	@echo "Opening http://localhost:15672 (guest/guest)"
	@command -v xdg-open > /dev/null && xdg-open http://localhost:15672 || echo "Please open http://localhost:15672 in your browser"

# Cache commands
cache-clear:  ## Clear all caches
	docker compose exec frankenphp php artisan cache:clear
	docker compose exec frankenphp php artisan config:clear
	docker compose exec frankenphp php artisan route:clear
	docker compose exec frankenphp php artisan view:clear

cache:  ## Cache config, routes, and views
	docker compose exec frankenphp php artisan config:cache
	docker compose exec frankenphp php artisan route:cache
	docker compose exec frankenphp php artisan view:cache

# Database commands
db-shell:  ## Open PostgreSQL shell
	docker compose exec postgres psql -U postgres -d medicontrol

db-backup:  ## Backup database
	@mkdir -p backups
	docker compose exec postgres pg_dump -U postgres medicontrol > backups/db-backup-$$(date +%Y%m%d-%H%M%S).sql
	@echo "Database backed up to backups/db-backup-$$(date +%Y%m%d-%H%M%S).sql"

db-restore:  ## Restore database (usage: make db-restore file="backups/db-backup.sql")
	docker compose exec -T postgres psql -U postgres medicontrol < $(file)

# Installation
install:  ## Initial setup - copy .env, generate key, start containers, migrate
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo ".env file created"; \
	else \
		echo ".env file already exists"; \
	fi
	docker compose up -d
	@echo "Waiting for containers to be ready..."
	@sleep 10
	docker compose exec frankenphp php artisan key:generate
	docker compose exec frankenphp php artisan migrate
	@echo ""
	@echo "✅ Installation complete!"
	@echo "   Application: http://localhost:8000"
	@echo "   Horizon: http://localhost:8000/horizon"
	@echo "   Pulse: http://localhost:8000/pulse"
	@echo "   RabbitMQ: http://localhost:15672 (guest/guest)"

# Cleanup
clean:  ## Remove all containers, volumes, and images
	docker compose down -v --rmi all

clean-volumes:  ## Remove all volumes (WARNING: deletes all data!)
	docker compose down -v

# Utilities
npm:  ## Run npm command in vite container (usage: make npm cmd="install package")
	docker compose exec vite npm $(cmd)

composer:  ## Run composer command (usage: make composer cmd="require package")
	docker compose exec frankenphp composer $(cmd)

fix-permissions:  ## Fix storage permissions
	docker compose exec -u root frankenphp chown -R www-data:www-data storage bootstrap/cache
	docker compose exec -u root frankenphp chmod -R 775 storage bootstrap/cache
