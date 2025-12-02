# MediControl

MediControl é um sistema de controle de tratamento medicamentoso para pacientes polimedicados.

## Tecnologias

-   PHP 8.2
-   Laravel 12
-   PostgreSQL
-   Redis
-   RabbitMQ
-   React 19
-   TypeScript
-   Inertia.js
-   Tailwind CSS 4
-   FrankenPHP (Laravel Octane)
-   Caddy (Reverse Proxy)

## 🐳 Instalação com Docker (Recomendado)

### Requisitos

-   Docker 24.0+
-   Docker Compose 2.20+

### Início Rápido

1. Clone o repositório

```bash
git clone https://github.com/medi-control/medi-control.git
cd medi-control
```

2. Configure e inicie a aplicação

```bash
make install
```

Ou manualmente:

```bash
# Copie o arquivo de configuração
cp .env.example .env

# Inicie os containers
docker compose up -d

# Aguarde os containers iniciarem e então gere a chave da aplicação
docker compose exec frankenphp php artisan key:generate

# Execute as migrações
docker compose exec frankenphp php artisan migrate
```

3. Acesse a aplicação

-   **Aplicação**: http://localhost:8000
-   **Horizon** (Filas): http://localhost:8000/horizon
-   **Pulse** (Monitoramento): http://localhost:8000/pulse
-   **RabbitMQ** (Management): http://localhost:15672 (guest/guest)

### Comandos Úteis

O projeto inclui um Makefile com atalhos para comandos comuns:

```bash
make help           # Mostra todos os comandos disponíveis
make up             # Inicia os containers
make down           # Para os containers
make logs           # Visualiza os logs
make shell          # Acessa o shell do container
make artisan        # Executa comandos artisan (ex: make artisan cmd="migrate")
make migrate        # Executa migrações
make fresh          # Reseta o banco de dados com seeds
make test           # Executa os testes
make build          # Reconstrói as imagens
```

### Desenvolvimento

O ambiente de desenvolvimento inclui:

-   **Hot Module Replacement (HMR)**: Alterações no frontend são refletidas instantaneamente
-   **Xdebug**: Configurado na porta 9003 para debugging
-   **Live Reload**: Alterações no código PHP são detectadas automaticamente pelo Octane
-   **Bind Mounts**: Código é montado em tempo real para desenvolvimento

Para visualizar logs específicos:

```bash
make logs-app       # Logs da aplicação
make logs-horizon   # Logs do Horizon (filas)
docker compose logs -f postgres   # Logs do PostgreSQL
```

### Produção

Para executar em produção:

1. Configure as variáveis de ambiente de produção:

```bash
cp .env.example .env.production
# Edite .env.production com valores reais
```

2. Construa e inicie os containers de produção:

```bash
make build-prod     # Constrói as imagens de produção
make prod-up        # Inicia em modo produção
```

3. Configure o DNS do seu domínio para apontar para o servidor

4. O Caddy irá provisionar automaticamente os certificados SSL via Let's Encrypt

**Diferenças em Produção:**

-   Sem Xdebug
-   Assets pré-compilados (sem Vite HMR)
-   OPcache habilitado
-   Supervisor gerencia FrankenPHP + Horizon
-   Limites de recursos configurados
-   HTTPS automático via Caddy

### Estrutura de Containers

```
┌─────────────────────────────────────┐
│   Caddy (Reverse Proxy + SSL)      │
│         Portas: 80, 443             │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌──────────────┐  ┌──────────────┐
│  FrankenPHP  │  │    Reverb    │
│  + Horizon   │  │  (WebSocket) │
│  Porta: 8000 │  │  Porta: 8080 │
└──────┬───────┘  └──────────────┘
       │
  ┌────┴─────┬──────────┬─────────┐
  ▼          ▼          ▼         ▼
┌──────┐  ┌──────┐  ┌────────┐  ┌──────┐
│Postgres│ │Redis │  │RabbitMQ│  │ Vite │
│ :5432  │ │:6379 │  │ :5672  │  │:5173 │
└────────┘ └──────┘  └────────┘  └──────┘
                                (dev only)
```

### Backup e Restore

**Backup do Banco de Dados:**

```bash
make db-backup
```

**Restore do Banco de Dados:**

```bash
make db-restore file="backups/db-backup-20240101-120000.sql"
```

**Backup de Uploads:**

```bash
docker cp medicontrol_app:/var/www/html/storage/app ./storage-backup
```

### Troubleshooting

**Container não inicia:**

```bash
docker compose ps          # Verifica status
docker compose logs nome   # Vê logs do container
```

**Erro de conexão com banco de dados:**

```bash
# Verifica se o PostgreSQL está pronto
docker compose exec postgres pg_isready -U postgres

# Verifica as variáveis de ambiente
docker compose exec frankenphp env | grep DB_
```

**Limpar tudo e recomeçar:**

```bash
make clean           # Remove containers, volumes e imagens
make install         # Reinstala do zero
```

**Problemas com permissões:**

```bash
make fix-permissions
```

## Instalação Manual (Sem Docker)
