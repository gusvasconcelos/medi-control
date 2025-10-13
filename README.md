# Laravel API Starter Kit

Este é um starter kit para desenvolvimento de APIs modernas utilizando o framework [Laravel](https://laravel.com/). O objetivo é fornecer uma base robusta, segura e pronta para produção, acelerando o desenvolvimento de novas APIs.

## To-Do List

Funcionalidades que ainda serão implementadas neste starter kit:

-   [x] **Autenticação JWT**  
         Autenticação segura baseada em tokens JWT para proteger suas rotas e recursos.

-   [x] **Internalização**  
         Suporte a múltiplos idiomas, atualmente inglês e português do Brasil.

-   [x] **Tratamento de erros global e exceções personalizadas**
        Tratamento de erros global e exceções personalizadas para melhorar a experiência do usuário.

-   [x] **Code Style**
        Laravel Pint usando PSR-12 para formatação de código.

-   [x] **Code Quality**
        PHPStan para análise estática de código.

-   [x] **RBAC (Role-Based Access Control)**  
         Controle de acesso baseado em papéis para maior granularidade de permissões.

-   [x] **Logging via Discord**  
         Sistema de logs customizável para monitoramento e auditoria.

-   [ ] **Docker**  
         Ambiente de desenvolvimento e produção containerizado.

-   [ ] **CI/CD com Github Actions**  
         Pipeline de integração e entrega contínua utilizando Github Actions.

-   [ ] **Mailing**  
         Envio de e-mails transacionais e notificações.

-   [ ] **Social Login (Google, Apple)**  
         Autenticação via provedores sociais populares.

-   [ ] **File uploads**  
         Upload e gerenciamento de arquivos.

-   [x] **E2E tests**  
         Testes de ponta a ponta para garantir a qualidade da API.

## Como usar

1. Clone o repositório:
    ```bash
    git clone https://github.com/gusvasconcelos/laravel-boilerplate-api.git
    ```
2. Instale as dependências:
    ```bash
    composer install
    ```
3. Configure o arquivo `.env` conforme necessário.
    ```bash
    cp .env.example .env
    ```
4. Execute as migrations:
    ```bash
    php artisan migrate
    ```
5. Gere a chave JWT:
    ```bash
    php artisan jwt:secret
    ```
6. Inicie o servidor de desenvolvimento:
    ```bash
    php artisan serve
    ```

---

## Sobre

Este repositório foi criado para acelerar o desenvolvimento de APIs RESTful com Laravel, seguindo as melhores práticas de segurança, escalabilidade e manutenibilidade. Ideal para projetos que precisam de uma base sólida e recursos essenciais já prontos para uso.
