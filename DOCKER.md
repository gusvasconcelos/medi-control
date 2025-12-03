# MediControl - Docker Production Environment

Este guia fornece instruções para executar o MediControl em produção usando Docker com FrankenPHP.

## 🏗️ Arquitetura

O ambiente containerizado inclui:

-   **App (FrankenPHP)**: Servidor PHP 8.2 com Laravel 12 usando FrankenPHP (Caddy + PHP)
-   **Horizon**: Worker para processamento de filas Laravel
-   **PostgreSQL 15**: Banco de dados principal
-   **Redis 7**: Cache, sessões e filas

## 📋 Pré-requisitos

-   Docker 20.10+
-   Docker Compose 2.0+
-   Make (opcional, mas recomendado)

## 🚀 Instalação Rápida

### 1. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.production.example .env

# Edite o arquivo .env com suas configurações
nano .env
```

**Importante**: Configure especialmente:

-   `APP_KEY` (gere com `php artisan key:generate`)
-   `APP_URL`
-   Senhas para `DB_PASSWORD`, `REDIS_PASSWORD`
-   Chaves de APIs: `OPENAI_API_KEY`, `ONESIGNAL_APP_ID`, etc.

### 2. Inicialize o projeto

```bash
# Usando Make (recomendado)
make init

# Ou manualmente
docker compose build
docker compose up -d
docker compose exec app php artisan migrate --force
```

### 3. Acesse a aplicação

-   **Aplicação**: http://localhost ou https://seu-dominio.com

## 📦 Comandos Make Disponíveis

### Gestão de Containers

```bash
make help              # Mostra todos os comandos disponíveis
make build             # Constrói as imagens Docker
make up                # Inicia todos os containers
make down              # Para todos os containers
make restart           # Reinicia todos os containers
make ps                # Lista containers em execução
make stats             # Mostra uso de recursos dos containers
```

### Logs

```bash
make logs              # Logs de todos os containers
make logs-app          # Logs apenas da aplicação
make logs-horizon      # Logs apenas do Horizon
```

### Acesso aos Containers

```bash
make shell             # Acessa shell do container app (como www-data)
make shell-root        # Acessa shell do container app (como root)
```

### Laravel

```bash
make artisan CMD="route:list"           # Executa comando artisan
make composer CMD="require package"     # Executa comando composer
make db-migrate                         # Executa migrations
make db-fresh                           # Recria banco (⚠️ apaga dados!)
make horizon-restart                    # Reinicia Horizon
```

### Backup e Restore

```bash
make backup-db                          # Cria backup do banco
make restore-db FILE=backup.sql         # Restaura backup do banco
```

### Deploy

```bash
make deploy            # Deploy nova versão (rebuild + restart)
make init              # Inicialização completa do projeto
```

### Limpeza

```bash
make clean             # Para containers e remove volumes
make prune             # Remove todos recursos Docker não usados
```

## 🔧 Comandos Docker Compose Manuais

Se preferir não usar Make:

```bash
# Iniciar containers
docker compose up -d

# Parar containers
docker compose down

# Ver logs
docker compose logs -f

# Executar comando artisan
docker compose exec app php artisan migrate

# Executar comando composer
docker compose exec app composer install

# Acessar shell
docker compose exec app sh

# Reiniciar serviço específico
docker compose restart horizon
```

## 🗂️ Estrutura de Arquivos Docker

```
.
├── Dockerfile                 # Imagem da aplicação com FrankenPHP
├── docker-compose.yml         # Orquestração de serviços
├── .dockerignore             # Arquivos ignorados no build
├── .env.production.example   # Exemplo de variáveis de ambiente
└── docker/
    ├── entrypoint.sh         # Script de inicialização da aplicação
    ├── Caddyfile             # Configuração do Caddy/FrankenPHP
    ├── init-db.sql           # Inicialização do PostgreSQL (extensões)
    └── nginx.conf.example    # Exemplo de configuração Nginx
```

## 📊 Volumes Persistentes

Os seguintes dados são persistidos:

-   `postgres_data`: Dados do PostgreSQL (named volume)
-   `redis_data`: Dados do Redis (named volume)
-   `./storage/app/public`: Arquivos públicos da aplicação (bind mount)
-   `logs`: Logs da aplicação (named volume)

**Nota sobre imagens/arquivos públicos**: O diretório `storage/app/public` é montado como bind mount para garantir que imagens e arquivos enviados pela aplicação sejam acessíveis tanto no host quanto no container. O symlink `public/storage` é automaticamente criado no container durante a inicialização.

## 🗄️ PostgreSQL - Extensões Incluídas

O banco de dados é inicializado automaticamente com as seguintes extensões:

-   **unaccent**: Buscas sem considerar acentuação (essencial para português)
-   **uuid-ossp**: Geração de UUIDs
-   **pg_trgm**: Busca fuzzy e similaridade de texto

Essas extensões são instaladas automaticamente via `docker/init-db.sql` na primeira inicialização do container.

## 🔒 Segurança

### Senhas Fortes

Sempre use senhas fortes para:

-   `DB_PASSWORD`
-   `REDIS_PASSWORD`

### HTTPS

Em produção, configure um reverse proxy (como Nginx ou Traefik) na frente do container para:

-   Gerenciar certificados SSL/TLS
-   Rate limiting
-   WAF (Web Application Firewall)

### Firewall

Configure firewall para expor apenas portas necessárias:

-   8000/443: Aplicação web (através de reverse proxy)
-   Bloqueie acesso direto às portas: 5432 (PostgreSQL), 6379 (Redis)

## 🐛 Troubleshooting

### Container não inicia

```bash
# Veja os logs
make logs-app

# Reconstrua as imagens
make build
```

### Erro de permissão

```bash
# Entre como root e ajuste permissões
make shell-root
chown -R www-data:www-data /app/storage /app/bootstrap/cache
```

### Imagens não aparecem (404)

Se as imagens não estão acessíveis:

```bash
# 1. Verifique se o symlink existe e está correto
docker exec medicontrol_app ls -la /app/public/storage

# 2. Se necessário, recrie o symlink
docker exec medicontrol_app rm -f /app/public/storage
docker exec medicontrol_app php artisan storage:link

# 3. Verifique permissões
docker exec medicontrol_app chown -R www-data:www-data /app/storage/app/public
```

### Banco de dados não conecta

```bash
# Verifique se o PostgreSQL está rodando
docker compose ps

# Veja logs do PostgreSQL
docker compose logs postgres

# Teste conexão manualmente
docker compose exec app php artisan db:show
```

### Horizon não processa jobs

```bash
# Veja logs do Horizon
make logs-horizon

# Reinicie o Horizon
make horizon-restart

# Verifique filas no Redis
docker compose exec redis redis-cli KEYS "*queues*"
```

### Limpar tudo e recomeçar

```bash
# ⚠️ ATENÇÃO: Isso apagará TODOS os dados
make clean
make init
```

## 🔄 Atualizações

Para atualizar a aplicação em produção:

```bash
# 1. Pull do código atualizado
git pull origin main

# 2. Deploy
make deploy

# 3. Execute migrations se necessário
make db-migrate
```

## 📈 Monitoramento

### Laravel Pulse

Acesse `/pulse` na aplicação para ver métricas de performance.

### Laravel Horizon

Acesse `/horizon` na aplicação para monitorar filas e jobs.

### Logs

Todos os logs são enviados para stdout/stderr e podem ser visualizados com:

```bash
make logs
```

## 🆘 Suporte

Para problemas ou dúvidas:

1. Verifique os logs com `make logs`
2. Consulte a documentação do Laravel
3. Abra uma issue no repositório
