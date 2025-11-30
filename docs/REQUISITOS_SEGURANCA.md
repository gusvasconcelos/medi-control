# Requisitos de Segurança - MediControl

**Versão:** 1.0  
**Data:** 30/11/2025  
**Sistema:** MediControl - Sistema de Controle de Tratamentos Medicamentosos

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Requisitos de Segurança](#requisitos-de-segurança)

---

## 🎯 Visão Geral

Este documento descreve os requisitos de segurança implementados no sistema MediControl, identificando as medidas de proteção aplicadas para garantir a segurança e privacidade dos dados dos usuários.

---

## 🔒 Requisitos de Segurança

### 1.3. Requisito de Segurança

| ID      | Perigo                                                                 | Soluções                                                                                                                                                                                                                                                    |
| ------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [RS001] | Acesso não autorizado a recursos e dados do sistema                    | Implementação de autenticação obrigatória via Laravel Sanctum com suporte a sessões (Web SPA) e tokens (API Mobile). Todas as rotas protegidas utilizam middleware `auth:sanctum`.                                                                          |
| [RS002] | Acesso a dados de outros usuários devido à falta de isolamento         | Implementação de UserScope global que filtra automaticamente todas as queries por `user_id` do usuário autenticado. Models que utilizam o trait `UserRelation` aplicam automaticamente o isolamento de dados.                                               |
| [RS003] | Execução de ações não autorizadas por usuários sem permissão adequada  | Sistema de autorização baseado em roles e permissões (Spatie Laravel Permission). Rotas administrativas protegidas com middleware `role:super-admin`. Verificação de permissões granulares para cuidadores através do método `caregiverHasPermissionFor()`. |
| [RS004] | Injeção de dados maliciosos através de entrada do usuário              | Validação obrigatória de todas as requisições através de Form Requests (Laravel). Regras de validação específicas para cada endpoint, incluindo tipos de dados, tamanhos máximos, formatos e valores permitidos.                                            |
| [RS005] | Exposição de informações sensíveis em mensagens de erro e stack traces | Tratamento centralizado de exceções com filtragem de stack traces para exibir apenas código da aplicação. Stack traces e SQL queries exibidos apenas em modo debug. Dados sensíveis marcados com atributo `#[\SensitiveParameter]`.                         |
| [RS006] | Acesso de cuidadores a dados de pacientes sem autorização explícita    | Sistema de relacionamento cuidador-paciente com estados (pending, active, revoked). Verificação obrigatória de status 'active' antes de permitir acesso. Permissões granulares por relacionamento através da tabela `caregiver_permissions`.                |
| [RS007] | Exposição de senhas em texto plano ou logs                             | Senhas armazenadas com hash usando algoritmo bcrypt do Laravel. Campo `password` marcado como `hidden` no model User. Token de reset de senha marcado como `#[\SensitiveParameter]` para evitar exposição em logs.                                          |
| [RS008] | Ataques de SQL Injection através de queries mal formadas               | Uso exclusivo de Query Builder do Eloquent para todas as consultas ao banco de dados. Parâmetros sempre passados através de bindings, nunca concatenados diretamente em strings SQL.                                                                        |
| [RS009] | Acesso não autorizado a rotas administrativas                          | Rotas administrativas protegidas com middleware `role:super-admin`. Apenas usuários com role de super-admin podem acessar gerenciamento de roles, permissões e usuários do sistema.                                                                         |
| [RS010] | Requisições maliciosas através de proxies e balanceadores de carga     | Configuração de trust proxies para aceitar headers de proxies confiáveis (X-Forwarded-For, X-Forwarded-Host, X-Forwarded-Port, X-Forwarded-Proto, X-Forwarded-AWS-ELB). Permite identificação correta de IPs e protocolos em ambientes com load balancers.  |
| [RS011] | Validação inconsistente entre diferentes endpoints                     | Padronização de validação através de Form Requests dedicados para cada operação (Store, Update, etc.). Mensagens de erro traduzidas e atributos nomeados para melhor experiência do usuário.                                                                |
| [RS012] | Acesso a recursos sem verificação de propriedade ou relacionamento     | Verificação de relacionamento cuidador-paciente antes de permitir operações. Scopes específicos (`forPatient`, `forCaregiver`, `active`, `pending`) garantem que apenas relacionamentos válidos sejam acessados.                                            |

---

## 📝 Detalhamento dos Requisitos

### RS001 - Autenticação Obrigatória

**Descrição do Perigo:**
Acesso não autorizado a recursos e dados do sistema por usuários não autenticados.

**Solução Implementada:**

-   Autenticação via Laravel Sanctum com duas estratégias:
    -   **Web SPA (Inertia)**: Autenticação baseada em sessão com cookies
    -   **Mobile API**: Autenticação baseada em tokens API
-   Middleware `auth:sanctum` aplicado em todas as rotas protegidas
-   Middleware `EnsureFrontendRequestsAreStateful` para requisições web

**Localização:**

-   `routes/api/*.php` - Todas as rotas API protegidas
-   `routes/web.php` - Rotas web protegidas
-   `bootstrap/app.php` - Configuração de middleware

---

### RS002 - Isolamento de Dados por Usuário

**Descrição do Perigo:**
Acesso a dados de outros usuários devido à falta de isolamento automático.

**Solução Implementada:**

-   **UserScope**: Global scope que filtra automaticamente queries por `user_id`
-   **UserRelation Trait**: Trait aplicado em models que pertencem a usuários
    -   Aplica automaticamente o UserScope
    -   Define `user_id` automaticamente na criação
    -   Fornece método `scopeDisableUserScope()` para casos especiais

**Localização:**

-   `app/Models/Scopes/UserScope.php`
-   `app/Traits/UserRelation.php`
-   Models que utilizam: `UserMedication`, `Notification`, `ChatSession`, etc.

---

### RS003 - Autorização Baseada em Roles e Permissões

**Descrição do Perigo:**
Execução de ações não autorizadas por usuários sem permissão adequada.

**Solução Implementada:**

-   Sistema Spatie Laravel Permission para gerenciamento de roles e permissões
-   Roles: `patient`, `caregiver`, `super-admin`
-   Permissões granulares para cuidadores (view, manage, export)
-   Middleware `role:super-admin` para rotas administrativas
-   Método `caregiverHasPermissionFor()` para verificação de permissões específicas

**Localização:**

-   `app/Models/User.php` - Trait HasRoles e método caregiverHasPermissionFor
-   `routes/api.php` - Middleware role:super-admin
-   `database/seeders/RolesAndPermissionsSeeder.php`

---

### RS004 - Validação de Entrada

**Descrição do Perigo:**
Injeção de dados maliciosos através de entrada do usuário.

**Solução Implementada:**

-   Form Requests dedicados para cada operação (Store, Update)
-   Validação de tipos, tamanhos, formatos e valores permitidos
-   Validação de existência em banco de dados (`exists:table,column`)
-   Validação de unicidade (`unique:table,column`)
-   Validação de datas e relacionamentos

**Localização:**

-   `app/Http/Requests/` - Todos os Form Requests
-   Exemplos: `StoreUserMedicationRequest`, `UpdateMedicationRequest`, `SendMessageRequest`

---

### RS005 - Proteção de Informações Sensíveis em Erros

**Descrição do Perigo:**
Exposição de informações sensíveis em mensagens de erro e stack traces.

**Solução Implementada:**

-   Classe `ErrorResponse` para tratamento centralizado de exceções
-   Stack traces filtrados para exibir apenas código da aplicação
-   SQL queries e stack traces exibidos apenas em modo debug
-   Atributo `#[\SensitiveParameter]` para marcar parâmetros sensíveis
-   Logs estruturados com Request ID para rastreamento

**Localização:**

-   `app/Helpers/ErrorResponse.php`
-   `bootstrap/app.php` - Tratamento de exceções
-   `app/Models/User.php` - sendPasswordResetNotification com SensitiveParameter

---

### RS006 - Controle de Acesso Cuidador-Paciente

**Descrição do Perigo:**
Acesso de cuidadores a dados de pacientes sem autorização explícita.

**Solução Implementada:**

-   Tabela `caregiver_patient` com estados: `pending`, `active`, `revoked`
-   Relacionamentos filtrados apenas por status `active`
-   Tabela `caregiver_permissions` para permissões granulares por relacionamento
-   Verificação de relacionamento antes de permitir operações
-   Scopes específicos: `forPatient()`, `forCaregiver()`, `active()`, `pending()`

**Localização:**

-   `app/Models/CaregiverPatient.php`
-   `app/Models/User.php` - Relacionamentos patientsUnderCare e caregivers
-   `app/Services/CaregiverPatientService.php`

---

### RS007 - Proteção de Senhas

**Descrição do Perigo:**
Exposição de senhas em texto plano ou logs.

**Solução Implementada:**

-   Senhas armazenadas com hash usando algoritmo bcrypt
-   Campo `password` marcado como `hidden` no model User
-   Cast automático para `hashed` no model
-   Token de reset de senha marcado como `#[\SensitiveParameter]`
-   Notificação customizada para reset de senha

**Localização:**

-   `app/Models/User.php` - Cast de password e método sendPasswordResetNotification

---

### RS008 - Proteção contra SQL Injection

**Descrição do Perigo:**
Ataques de SQL Injection através de queries mal formadas.

**Solução Implementada:**

-   Uso exclusivo de Query Builder do Eloquent
-   Parâmetros sempre passados através de bindings
-   Nenhuma concatenação direta de strings SQL
-   Scopes e relacionamentos do Eloquent para queries complexas

**Localização:**

-   Todo o código utiliza Eloquent Query Builder
-   Exemplo: `app/Models/User.php` - método caregiverHasPermissionFor usa query builder

---

### RS009 - Proteção de Rotas Administrativas

**Descrição do Perigo:**
Acesso não autorizado a rotas administrativas.

**Solução Implementada:**

-   Middleware `role:super-admin` aplicado em rotas administrativas
-   Rotas protegidas: gerenciamento de roles, permissões, usuários do sistema
-   Verificação de role antes de permitir acesso

**Localização:**

-   `routes/api.php` - Grupo de rotas com middleware role:super-admin

---

### RS010 - Trust Proxies

**Descrição do Perigo:**
Requisições maliciosas através de proxies e balanceadores de carga.

**Solução Implementada:**

-   Configuração de trust proxies para aceitar headers confiáveis
-   Headers aceitos: X-Forwarded-For, X-Forwarded-Host, X-Forwarded-Port, X-Forwarded-Proto, X-Forwarded-AWS-ELB
-   Permite identificação correta de IPs e protocolos em ambientes com load balancers

**Localização:**

-   `bootstrap/app.php` - Configuração de trustProxies

---

### RS011 - Padronização de Validação

**Descrição do Perigo:**
Validação inconsistente entre diferentes endpoints.

**Solução Implementada:**

-   Form Requests dedicados para cada operação
-   Mensagens de erro traduzidas através de arquivos de idioma
-   Atributos nomeados para melhor experiência do usuário
-   Validação reutilizável e consistente

**Localização:**

-   `app/Http/Requests/` - Todos os Form Requests
-   `lang/pt/validation.php` - Mensagens de validação traduzidas

---

### RS012 - Verificação de Relacionamentos

**Descrição do Perigo:**
Acesso a recursos sem verificação de propriedade ou relacionamento.

**Solução Implementada:**

-   Scopes específicos para filtrar relacionamentos válidos
-   Verificação de status `active` antes de permitir operações
-   Métodos de verificação: `forPatient()`, `forCaregiver()`, `isActive()`, `isPending()`
-   Validação de relacionamento cuidador-paciente antes de operações

**Localização:**

-   `app/Models/CaregiverPatient.php` - Scopes e métodos de verificação
-   `app/Services/CaregiverPatientService.php` - Lógica de negócio

---

## 🔄 Histórico de Versões

| Versão | Data       | Descrição                                                                       | Autor   |
| ------ | ---------- | ------------------------------------------------------------------------------- | ------- |
| 1.0    | 30/11/2025 | Criação inicial do documento com todos os requisitos de segurança implementados | Sistema |

---

## 📚 Referências

-   Laravel Sanctum: Autenticação para SPAs e APIs
-   Spatie Laravel Permission: Sistema de roles e permissões
-   OWASP: Open Web Application Security Project
-   LGPD: Lei Geral de Proteção de Dados
