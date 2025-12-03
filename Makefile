.PHONY: help build up down restart logs shell composer artisan horizon-restart db-migrate db-fresh clean prune

help: ## Show this help message
	@echo 'MediControl Docker Commands'
	@echo ''
	@echo 'Usage:'
	@echo '  make <target>'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build Docker images
	@echo 'Building Docker images...'
	docker compose build --no-cache

up: ## Start all containers
	@echo 'Starting containers...'
	docker compose up -d
	@echo 'Containers started!'
	@echo 'Access the application at: http://localhost:8000'

down: ## Stop all containers
	@echo 'Stopping containers...'
	docker compose down
	@echo 'Containers stopped!'

restart: down up ## Restart all containers

logs: ## Show logs from all containers
	docker compose logs -f

logs-app: ## Show logs from app container
	docker compose logs -f app

logs-horizon: ## Show logs from horizon container
	docker compose logs -f horizon

shell: ## Access app container shell
	docker compose exec app sh

shell-root: ## Access app container shell as root
	docker compose exec -u root app sh

composer: ## Run composer command (use CMD="install --no-dev")
	docker compose exec app composer $(CMD)

artisan: ## Run artisan command (use CMD="migrate")
	docker compose exec app php artisan $(CMD)

horizon-restart: ## Restart Horizon
	@echo 'Restarting Horizon...'
	docker compose restart horizon
	@echo 'Horizon restarted!'

db-migrate: ## Run database migrations
	@echo 'Running migrations...'
	docker compose exec app php artisan migrate --force
	@echo 'Migrations completed!'

db-fresh: ## Fresh database with migrations (CAUTION: deletes all data!)
	@echo 'WARNING: This will delete all data!'
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker compose exec app php artisan migrate:fresh --force; \
		echo 'Database refreshed!'; \
	fi

clean: down ## Stop containers and remove volumes
	@echo 'Removing volumes...'
	docker compose down -v
	@echo 'Cleanup completed!'

prune: ## Remove all unused Docker resources
	@echo 'This will remove all unused Docker resources'
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker system prune -af --volumes; \
		echo 'Prune completed!'; \
	fi

ps: ## Show running containers
	docker compose ps

stats: ## Show container resource usage
	docker stats

backup-db: ## Backup PostgreSQL database
	@echo 'Creating database backup...'
	@mkdir -p ./backups
	docker compose exec -T postgres pg_dump -U $${DB_USERNAME} $${DB_DATABASE} > ./backups/backup-$$(date +%Y%m%d-%H%M%S).sql
	@echo 'Backup created in ./backups/'

restore-db: ## Restore PostgreSQL database (use FILE=backup.sql)
	@if [ -z "$(FILE)" ]; then \
		echo 'Error: Please specify FILE=path/to/backup.sql'; \
		exit 1; \
	fi
	@echo 'Restoring database from $(FILE)...'
	docker compose exec -T postgres psql -U $${DB_USERNAME} $${DB_DATABASE} < $(FILE)
	@echo 'Database restored!'

init: build up db-migrate ## Initialize project (build, start, migrate)
	@echo 'Project initialized successfully!'
	@echo ''
	@echo 'Application URL: http://localhost:8000'

deploy: ## Deploy new version (rebuild and restart)
	@echo 'Deploying new version...'
	docker compose build app
	docker compose up -d app
	docker compose restart horizon
	@echo 'Deployment completed!'
