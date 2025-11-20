# MediControl

MediControl é um sistema de controle de tratamento medicamentoso para pacientes polimedicados.

## Tecnologias

-   PHP 8.2
-   Laravel 12
-   PostgreSQL
-   Redis

## Instalação

1. Clone o repositório

```bash
git clone https://github.com/medi-control/medi-control.git
```

2. Instale as dependências

```bash
composer install
```

3. Configure o arquivo `.env`

```bash
cp .env.example .env
```

4. Execute as migrações

```bash
php artisan migrate
```

5. Execute os seeds

```bash
php artisan db:seed
```

6. Execute o servidor

```bash
php artisan serve
```

7. Acesse a aplicação em `http://localhost:8000`
