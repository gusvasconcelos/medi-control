# Modelo Entidade-Relacionamento (MER) - MediControl

**Versão:** 1.0
**Data:** 19/10/2025
**Sistema:** MediControl - Sistema de Controle de Tratamentos Medicamentosos

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Diagrama MER](#diagrama-mer)
3. [Entidades](#entidades)
4. [Relacionamentos](#relacionamentos)
5. [Regras de Negócio](#regras-de-negócio)
6. [Índices e Constraints](#índices-e-constraints)
7. [Enums](#enums)
8. [Sistema de Permissões](#sistema-de-permissões)

---

## 🎯 Visão Geral

O MediControl é um sistema de gerenciamento de tratamentos medicamentosos para pacientes polimedicados, com integração de Inteligência Artificial. O sistema oferece:

- Controle de posologia e horários de medicamentos
- Alertas inteligentes de interação medicamentosa
- Gestão de cuidadores com permissões granulares
- Chat com IA para esclarecimento de dúvidas
- Relatórios de adesão ao tratamento
- Sistema de notificações multi-canal (Push, WhatsApp)

### Perfis de Usuário

- **Paciente**: Gerencia seus próprios medicamentos e tratamentos
- **Cuidador**: Pode gerenciar medicamentos de pacientes que concederam permissão

---

## 📊 Diagrama MER

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ENTIDADES PRINCIPAIS                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│       USERS          │
│──────────────────────│
│ PK id                │
│    name              │
│    email (unique)    │
│    password          │
│    phone             │◄─────┐
│    email_verified_at │      │
│    created_at        │      │
│    updated_at        │      │
└──────────────────────┘      │
         │ 1                  │
         │                    │ N
         │ N          ┌───────┴──────────────┐
         ├────────────│  CAREGIVER_PATIENT   │ (Tabela Pivot)
         │            │──────────────────────│
         │            │ PK id                │
         │            │ FK caregiver_id      │
         │            │ FK patient_id        │
         │            │    status (enum)     │
         │            │    invited_at        │
         │            │    accepted_at       │
         │            │    revoked_at        │
         │            │    created_at        │
         │            │    updated_at        │
         │            └──────────────────────┘
         │                     │ 1
         │                     │
         │                     │ N
         │            ┌────────┴──────────────────┐
         │            │  CAREGIVER_PERMISSIONS    │
         │            │───────────────────────────│
         │            │ PK id                     │
         │            │ FK caregiver_patient_id   │
         │            │ FK permission_id          │
         │            │    created_at             │
         │            └───────────────────────────┘
         │
         │ 1
         │
         ├────────────┬────────────┬────────────┬────────────┐
         │            │            │            │            │
         │ N          │ N          │ N          │ N          │ N
┌────────┴────────┐  │   ┌────────┴────────┐  │   ┌────────┴────────────┐
│ USER_MEDICATIONS│  │   │ MEDICATION_LOGS │  │   │   CHAT_SESSIONS     │
│─────────────────│  │   │─────────────────│  │   │─────────────────────│
│ PK id           │  │   │ PK id           │  │   │ PK id               │
│ FK user_id      │  │   │ FK user_med_id  │  │   │ FK user_id          │
│ FK medication_id│  │   │    scheduled_at │  │   │    started_at       │
│    dosage       │  │   │    taken_at     │  │   │    ended_at         │
│    frequency    │  │   │    status (enum)│  │   │    expires_at       │
│    time_slots   │  │   │    notes        │  │   │    context_type     │
│    via_admin    │  │   │    created_at   │  │   │    created_at       │
│    duration     │  │   └─────────────────┘  │   └─────────────────────┘
│    start_date   │  │                        │            │ 1
│    end_date     │  │                        │            │
│    initial_stock│  │                        │            │ N
│    current_stock│  │                        │   ┌────────┴────────────┐
│    low_stock_th │  │                        │   │      MESSAGES       │
│    notes        │  │                        │   │─────────────────────│
│    active       │  │                        │   │ PK id               │
│    created_at   │  │                        │   │ FK chat_session_id  │
│    updated_at   │  │                        │   │    role (enum)      │
└─────────────────┘  │                        │   │    content          │
         │ N         │                        │   │    created_at       │
         │           │                        └───┼─────────────────────┘
         │ N         │                            │
┌────────┴─────────┐ │                            │
│ SIDE_EFFECTS     │ │                            │
│──────────────────│ │                            │
│ PK id            │ │                            │
│ FK user_med_id   │ │                            │
│    symptom       │ │                            │
│    severity      │ │                            │
│    reported_at   │ │                            │
│    notes         │ │                            │
│    created_at    │ │                            │
└──────────────────┘ │                            │
                     │                            │
         ┌───────────┴────────────────────────────┘
         │
         │ N
┌────────┴────────────┐
│   NOTIFICATIONS     │
│─────────────────────│
│ PK id               │
│ FK user_id          │
│ FK user_med_id      │
│    type (enum)      │
│    title            │
│    body             │
│    scheduled_for    │
│    sent_at          │
│    read_at          │
│    provider (enum)  │
│    status (enum)    │
│    metadata (json)  │
│    created_at       │
└─────────────────────┘


┌──────────────────────┐
│  MEDICATIONS (Cat.)  │
│──────────────────────│
│ PK id                │
│    name              │
│    active_principle  │
│    manufacturer      │
│    category          │
│    strength          │
│    form (enum)       │
│    description       │
│    warnings          │
│    interactions      │
│    created_at        │
│    updated_at        │
└──────────────────────┘
         │ 1
         │
         │ N
         │ (referenciado por USER_MEDICATIONS)


┌──────────────────────────┐
│   INTERACTION_ALERTS     │
│──────────────────────────│
│ PK id                    │
│ FK user_id               │
│ FK medication_1_id       │
│ FK medication_2_id       │
│    severity (enum)       │
│    description           │
│    recommendation        │
│    detected_at           │
│    acknowledged_at       │
│    created_at            │
└──────────────────────────┘


┌──────────────────────────┐
│    ADHERENCE_REPORTS     │
│──────────────────────────│
│ PK id                    │
│ FK user_id               │
│    period_start          │
│    period_end            │
│    total_scheduled       │
│    total_taken           │
│    adherence_rate        │
│    generated_at          │
│    file_path             │
│    created_at            │
└──────────────────────────┘


┌──────────────────────────┐
│ NOTIFICATION_PREFERENCES │
│──────────────────────────│
│ PK id                    │
│ FK user_id (unique)      │
│    medication_reminder   │
│    low_stock_alert       │
│    interaction_alert     │
│    push_enabled          │
│    whatsapp_enabled      │
│    quiet_hours_start     │
│    quiet_hours_end       │
│    created_at            │
│    updated_at            │
└──────────────────────────┘


┌──────────────────────┐
│   ROLES (Spatie)     │
│──────────────────────│
│ PK id                │
│    name              │
│    guard_name        │
│    created_at        │
│    updated_at        │
└──────────────────────┘


┌──────────────────────┐
│ PERMISSIONS (Spatie) │
│──────────────────────│
│ PK id                │
│    name              │
│    guard_name        │
│    created_at        │
│    updated_at        │
└──────────────────────┘
```

---

## 📚 Entidades

### 1. USERS

Armazena todos os usuários do sistema (pacientes e cuidadores).

**Migration:** [2025_10_19_080353_add_phone_to_users_table.php](../database/migrations/2025_10_19_080353_add_phone_to_users_table.php)
**Model:** [User.php](../app/Models/User.php)

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | bigint | PK, auto_increment | Identificador único |
| name | varchar(255) | NOT NULL | Nome completo |
| email | varchar(255) | NOT NULL, UNIQUE | Email (login) |
| password | varchar(255) | NOT NULL | Senha hash |
| phone | varchar(20) | NULLABLE | Telefone (WhatsApp) |
| email_verified_at | timestamp | NULLABLE | Data de verificação do email |
| remember_token | varchar(100) | NULLABLE | Token de sessão |
| created_at | timestamp | NOT NULL | Data de criação |
| updated_at | timestamp | NOT NULL | Data de atualização |

**Relacionamentos:**
- 1:N com `user_medications`
- 1:N com `notifications`
- 1:N com `chat_sessions`
- 1:N com `adherence_reports`
- 1:N com `interaction_alerts`
- 1:1 com `notification_preferences`
- N:N com `users` (via `caregiver_patient`)
- N:N com `roles` (Spatie)

**Traits:**
- `HasRoles` (Spatie)
- `HasFactory`
- `Notifiable`

**Guard:** `api` (JWT)

---

### 2. MEDICATIONS

Catálogo pré-definido de medicamentos.

**Migration:** [2025_10_19_080553_create_medications_table.php](../database/migrations/2025_10_19_080553_create_medications_table.php)
**Model:** [Medication.php](../app/Models/Medication.php)

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | bigint | PK, auto_increment | Identificador único |
| name | varchar(255) | NOT NULL | Nome comercial |
| active_principle | varchar(255) | NOT NULL | Princípio ativo |
| manufacturer | varchar(255) | NULLABLE | Fabricante |
| category | varchar(255) | NULLABLE, INDEX | Categoria (ex: antibiótico) |
| strength | varchar(255) | NULLABLE | Concentração (ex: "500mg") |
| form | enum | NOT NULL, DEFAULT 'tablet' | Forma farmacêutica |
| description | text | NULLABLE | Descrição geral |
| warnings | text | NULLABLE | Avisos importantes |
| interactions | json | NULLABLE | Array de IDs de medicamentos que interagem |
| created_at | timestamp | NOT NULL | Data de criação |
| updated_at | timestamp | NOT NULL | Data de atualização |

**Índices:**
- `name`
- `active_principle`
- `category`

**Enum form:**
- tablet
- capsule
- liquid
- injection
- cream
- drops
- spray
- inhaler
- patch
- other

---

### 3. USER_MEDICATIONS

Relaciona usuários aos medicamentos que estão tomando (posologia).

**Migration:** [2025_10_19_080914_create_user_medications_table.php](../database/migrations/2025_10_19_080914_create_user_medications_table.php)
**Model:** [UserMedication.php](../app/Models/UserMedication.php)

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | bigint | PK, auto_increment | Identificador único |
| user_id | bigint | FK(users), NOT NULL, INDEX | Usuário dono |
| medication_id | bigint | FK(medications), NOT NULL, RESTRICT | Medicamento do catálogo |
| dosage | varchar(255) | NOT NULL | Dosagem (ex: "1 comprimido") |
| frequency | varchar(255) | NOT NULL | Frequência (ex: "2x ao dia") |
| time_slots | json | NOT NULL | Horários ["08:00", "20:00"] |
| via_administration | enum | NOT NULL, DEFAULT 'oral' | Via de administração |
| duration | integer | NULLABLE | Duração em dias (null = contínuo) |
| start_date | date | NOT NULL, INDEX | Data de início |
| end_date | date | NULLABLE, INDEX | Data de término |
| initial_stock | integer | NOT NULL, DEFAULT 0 | Quantidade inicial |
| current_stock | integer | NOT NULL, DEFAULT 0 | Quantidade atual |
| low_stock_threshold | integer | NOT NULL, DEFAULT 5 | Limite para alerta |
| notes | text | NULLABLE | Observações |
| active | boolean | NOT NULL, DEFAULT true, INDEX | Medicamento ativo |
| created_at | timestamp | NOT NULL | Data de criação |
| updated_at | timestamp | NOT NULL | Data de atualização |

**Índices:**
- `[user_id, active]`
- `[start_date, end_date]`

**Enum via_administration:**
- oral
- topical
- injection
- inhalation
- sublingual
- rectal
- other

**Traits:**
- `UserRelation` (escopo automático por usuário)

**On Delete:**
- `user_id`: CASCADE
- `medication_id`: RESTRICT

---

### 4. MEDICATION_LOGS

Histórico de tomadas de medicamentos.

**Migration:** [2025_10_19_081033_create_medication_logs_table.php](../database/migrations/2025_10_19_081033_create_medication_logs_table.php)
**Model:** [MedicationLog.php](../app/Models/MedicationLog.php)

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | bigint | PK, auto_increment | Identificador único |
| user_medication_id | bigint | FK(user_medications), NOT NULL, INDEX | Medicamento do usuário |
| scheduled_at | datetime | NOT NULL, INDEX | Quando deveria tomar |
| taken_at | datetime | NULLABLE | Quando realmente tomou |
| status | enum | NOT NULL, DEFAULT 'pending', INDEX | Status da tomada |
| notes | text | NULLABLE | Observações |
| created_at | timestamp | NOT NULL | Data de criação |

**Índices:**
- `user_medication_id`
- `scheduled_at`
- `[status, scheduled_at]`

**Enum status:**
- pending
- taken
- missed
- skipped

**On Delete:**
- `user_medication_id`: CASCADE

---

### 5. SIDE_EFFECTS

Registro de efeitos colaterais/sintomas.

**Migration:** [2025_10_19_081131_create_side_effects_table.php](../database/migrations/2025_10_19_081131_create_side_effects_table.php)
**Model:** [SideEffect.php](../app/Models/SideEffect.php)

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | bigint | PK, auto_increment | Identificador único |
| user_medication_id | bigint | FK(user_medications), NOT NULL, INDEX | Medicamento relacionado |
| symptom | varchar(255) | NOT NULL | Nome do sintoma |
| severity | enum | NOT NULL, DEFAULT 'mild', INDEX | Gravidade |
| reported_at | datetime | NOT NULL, INDEX | Data do relato |
| notes | text | NULLABLE | Observações |
| created_at | timestamp | NOT NULL | Data de criação |

**Índices:**
- `user_medication_id`
- `reported_at`
- `severity`

**Enum severity:**
- mild
- moderate
- severe

**On Delete:**
- `user_medication_id`: CASCADE

---

### 6. INTERACTION_ALERTS

Alertas de interações medicamentosas detectadas.

**Migration:** [2025_10_19_081224_create_interaction_alerts_table.php](../database/migrations/2025_10_19_081224_create_interaction_alerts_table.php)
**Model:** [InteractionAlert.php](../app/Models/InteractionAlert.php)

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | bigint | PK, auto_increment | Identificador único |
| user_id | bigint | FK(users), NOT NULL, INDEX | Usuário alertado |
| medication_1_id | bigint | FK(medications), NOT NULL, RESTRICT | Primeiro medicamento |
| medication_2_id | bigint | FK(medications), NOT NULL, RESTRICT | Segundo medicamento |
| severity | enum | NOT NULL, DEFAULT 'moderate', INDEX | Gravidade da interação |
| description | text | NOT NULL | Descrição da interação |
| recommendation | text | NULLABLE | Recomendação |
| detected_at | datetime | NOT NULL | Quando foi detectado |
| acknowledged_at | datetime | NULLABLE, INDEX | Quando foi visualizado |
| created_at | timestamp | NOT NULL | Data de criação |

**Índices:**
- `user_id`
- `[user_id, acknowledged_at]`
- `severity`

**Enum severity:**
- mild
- moderate
- severe
- contraindicated

**Traits:**
- `UserRelation`

**On Delete:**
- `user_id`: CASCADE
- `medication_1_id`: RESTRICT
- `medication_2_id`: RESTRICT

---

### 7. NOTIFICATIONS

Sistema unificado de notificações.

**Migration:** [2025_10_19_081330_create_notifications_table.php](../database/migrations/2025_10_19_081330_create_notifications_table.php)
**Model:** [Notification.php](../app/Models/Notification.php)

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | bigint | PK, auto_increment | Identificador único |
| user_id | bigint | FK(users), NOT NULL, INDEX | Destinatário |
| user_medication_id | bigint | FK(user_medications), NULLABLE | Medicamento relacionado |
| type | enum | NOT NULL, DEFAULT 'system', INDEX | Tipo de notificação |
| title | varchar(255) | NOT NULL | Título |
| body | text | NOT NULL | Corpo da mensagem |
| scheduled_for | datetime | NOT NULL, INDEX | Quando enviar |
| sent_at | datetime | NULLABLE | Quando foi enviada |
| read_at | datetime | NULLABLE | Quando foi lida |
| provider | enum | NOT NULL, DEFAULT 'push' | Canal de envio |
| status | enum | NOT NULL, DEFAULT 'pending', INDEX | Status |
| metadata | json | NULLABLE | Dados extras |
| created_at | timestamp | NOT NULL | Data de criação |

**Índices:**
- `[user_id, status]`
- `scheduled_for`
- `type`

**Enum type:**
- medication_reminder
- low_stock
- interaction_alert
- system

**Enum provider:**
- push
- whatsapp

**Enum status:**
- pending
- sent
- failed
- read

**Traits:**
- `UserRelation`

**On Delete:**
- `user_id`: CASCADE
- `user_medication_id`: CASCADE

---

### 8. NOTIFICATION_PREFERENCES

Preferências de notificação por usuário.

**Migration:** [2025_10_19_080828_create_notification_preferences_table.php](../database/migrations/2025_10_19_080828_create_notification_preferences_table.php)
**Model:** [NotificationPreference.php](../app/Models/NotificationPreference.php)

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | bigint | PK, auto_increment | Identificador único |
| user_id | bigint | FK(users), NOT NULL, UNIQUE | Usuário |
| medication_reminder | boolean | NOT NULL, DEFAULT true | Ativar lembretes |
| low_stock_alert | boolean | NOT NULL, DEFAULT true | Ativar alerta de estoque |
| interaction_alert | boolean | NOT NULL, DEFAULT true | Ativar alerta de interação |
| push_enabled | boolean | NOT NULL, DEFAULT true | Ativar notificações push |
| whatsapp_enabled | boolean | NOT NULL, DEFAULT false | Ativar WhatsApp |
| quiet_hours_start | time | NULLABLE | Início do silêncio (ex: "22:00") |
| quiet_hours_end | time | NULLABLE | Fim do silêncio (ex: "07:00") |
| created_at | timestamp | NOT NULL | Data de criação |
| updated_at | timestamp | NOT NULL | Data de atualização |

**Constraints:**
- `user_id` UNIQUE (1:1 com User)

**On Delete:**
- `user_id`: CASCADE

---

### 9. CHAT_SESSIONS

Sessões de chat com IA (temporárias).

**Migration:** [2025_10_19_081521_create_chat_sessions_table.php](../database/migrations/2025_10_19_081521_create_chat_sessions_table.php)
**Model:** [ChatSession.php](../app/Models/ChatSession.php)

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | bigint | PK, auto_increment | Identificador único |
| user_id | bigint | FK(users), NOT NULL, INDEX | Usuário dono |
| started_at | datetime | NOT NULL | Início da sessão |
| ended_at | datetime | NULLABLE | Fim da sessão |
| expires_at | datetime | NOT NULL, INDEX | Expira em 24h |
| context_type | enum | NOT NULL, DEFAULT 'general' | Contexto da conversa |
| created_at | timestamp | NOT NULL | Data de criação |

**Índices:**
- `user_id`
- `expires_at` (para limpeza automática)

**Enum context_type:**
- general
- medication
- interaction
- symptom
- other

**Traits:**
- `UserRelation`

**On Delete:**
- `user_id`: CASCADE

**Nota:** Implementar job para limpar sessões expiradas.

---

### 10. MESSAGES

Mensagens dentro das sessões de chat.

**Migration:** [2025_10_19_081611_create_messages_table.php](../database/migrations/2025_10_19_081611_create_messages_table.php)
**Model:** [Message.php](../app/Models/Message.php)

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | bigint | PK, auto_increment | Identificador único |
| chat_session_id | bigint | FK(chat_sessions), NOT NULL, INDEX | Sessão de chat |
| role | enum | NOT NULL, DEFAULT 'user' | Autor da mensagem |
| content | text | NOT NULL | Conteúdo |
| created_at | timestamp | NOT NULL | Data de criação |

**Índices:**
- `[chat_session_id, created_at]`

**Enum role:**
- user
- assistant

**On Delete:**
- `chat_session_id`: CASCADE

---

### 11. ADHERENCE_REPORTS

Relatórios de adesão ao tratamento.

**Migration:** [2025_10_19_081644_create_adherence_reports_table.php](../database/migrations/2025_10_19_081644_create_adherence_reports_table.php)
**Model:** [AdherenceReport.php](../app/Models/AdherenceReport.php)

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | bigint | PK, auto_increment | Identificador único |
| user_id | bigint | FK(users), NOT NULL, INDEX | Usuário |
| period_start | date | NOT NULL | Início do período |
| period_end | date | NOT NULL | Fim do período |
| total_scheduled | integer | NOT NULL, DEFAULT 0 | Total programado |
| total_taken | integer | NOT NULL, DEFAULT 0 | Total tomado |
| adherence_rate | decimal(5,2) | NOT NULL, DEFAULT 0.00 | Percentual de adesão |
| generated_at | datetime | NOT NULL, INDEX | Quando foi gerado |
| file_path | varchar(255) | NULLABLE | Caminho do PDF |
| created_at | timestamp | NOT NULL | Data de criação |

**Índices:**
- `user_id`
- `[user_id, generated_at]`

**Traits:**
- `UserRelation`

**On Delete:**
- `user_id`: CASCADE

**Cálculo:**
```
adherence_rate = (total_taken / total_scheduled) * 100
```

---

### 12. CAREGIVER_PATIENT

Relacionamento N:N entre cuidadores e pacientes.

**Migration:** [2025_10_19_080701_create_caregiver_patient_table.php](../database/migrations/2025_10_19_080701_create_caregiver_patient_table.php)

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | bigint | PK, auto_increment | Identificador único |
| caregiver_id | bigint | FK(users), NOT NULL | Quem cuida |
| patient_id | bigint | FK(users), NOT NULL | Quem é cuidado |
| status | enum | NOT NULL, DEFAULT 'pending', INDEX | Status do relacionamento |
| invited_at | timestamp | NOT NULL | Quando foi convidado |
| accepted_at | timestamp | NULLABLE | Quando aceitou |
| revoked_at | timestamp | NULLABLE | Quando foi revogado |
| created_at | timestamp | NOT NULL | Data de criação |
| updated_at | timestamp | NOT NULL | Data de atualização |

**Constraints:**
- UNIQUE(`caregiver_id`, `patient_id`)
- `caregiver_id` ≠ `patient_id`

**Enum status:**
- pending (aguardando aceitação)
- active (ativo)
- revoked (revogado)

**On Delete:**
- `caregiver_id`: CASCADE
- `patient_id`: CASCADE

---

### 13. CAREGIVER_PERMISSIONS

Permissões específicas por relacionamento cuidador-paciente.

**Migration:** [2025_10_19_080744_create_caregiver_permissions_table.php](../database/migrations/2025_10_19_080744_create_caregiver_permissions_table.php)

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | bigint | PK, auto_increment | Identificador único |
| caregiver_patient_id | bigint | FK(caregiver_patient), NOT NULL | Relacionamento |
| permission_id | bigint | FK(permissions), NOT NULL | Permissão concedida |
| created_at | timestamp | NOT NULL | Data de criação |

**Constraints:**
- UNIQUE(`caregiver_patient_id`, `permission_id`)

**On Delete:**
- `caregiver_patient_id`: CASCADE
- `permission_id`: CASCADE

---

## 🔗 Relacionamentos

### Relacionamentos Principais

| Tabela Origem | Cardinalidade | Tabela Destino | Descrição |
|---------------|---------------|----------------|-----------|
| users | 1:N | user_medications | Um usuário tem vários medicamentos |
| users | 1:N | notifications | Um usuário recebe várias notificações |
| users | 1:N | chat_sessions | Um usuário tem várias sessões de chat |
| users | 1:N | adherence_reports | Um usuário gera vários relatórios |
| users | 1:N | interaction_alerts | Um usuário recebe vários alertas |
| users | 1:1 | notification_preferences | Um usuário tem uma configuração |
| users | N:N | users | Cuidadores ↔ Pacientes (via caregiver_patient) |
| users | N:N | roles | Usuários ↔ Roles (Spatie) |
| medications | 1:N | user_medications | Um medicamento pode ser usado por vários usuários |
| user_medications | 1:N | medication_logs | Um medicamento tem vários logs |
| user_medications | 1:N | side_effects | Um medicamento pode ter vários efeitos colaterais |
| user_medications | 1:N | notifications | Um medicamento pode gerar várias notificações |
| chat_sessions | 1:N | messages | Uma sessão tem várias mensagens |
| caregiver_patient | 1:N | caregiver_permissions | Um relacionamento tem várias permissões |

---

## 📜 Regras de Negócio

### 1. Controle de Acesso

#### 1.1 Pacientes
- Podem gerenciar apenas seus próprios medicamentos
- Podem visualizar apenas seus próprios logs, relatórios e notificações
- Podem ter sessões de chat próprias
- Podem convidar cuidadores e definir permissões

#### 1.2 Cuidadores
- Podem gerenciar medicamentos de pacientes vinculados com `status='active'`
- Acesso limitado pelas permissões concedidas em `caregiver_permissions`
- Podem visualizar logs e relatórios apenas se tiverem a permissão correspondente
- Podem receber notificações de alertas se tiverem a permissão `receive_patient_alerts`

### 2. Medicamentos

#### 2.1 Ao criar `user_medication`
1. Verificar interações com outros medicamentos ativos do usuário
2. Se detectar interação, criar registro em `interaction_alerts`
3. Se interação for severa ou contraindicated, criar notificação imediata

#### 2.2 Controle de estoque
- `current_stock` deve ser decrementado automaticamente quando:
  - `medication_log.status` = 'taken'
- Quando `current_stock` ≤ `low_stock_threshold`:
  - Criar notificação tipo `low_stock`

#### 2.3 Desativação automática
- `active` deve ser `false` quando:
  - `end_date` < hoje
  - `current_stock` = 0 (opcional, configurável)

### 3. Notificações

#### 3.1 Criação automática
Tipos de notificações criadas automaticamente:

**medication_reminder:**
- Criada diariamente para cada `time_slot` de `user_medications` ativos
- Job cron diário: gera notificações para as próximas 24h
- Respeita `notification_preferences` do usuário
- Não envia durante `quiet_hours`

**low_stock:**
- Criada quando `current_stock` ≤ `low_stock_threshold`
- Enviada apenas se `notification_preferences.low_stock_alert` = true

**interaction_alert:**
- Criada quando detecta interação medicamentosa
- Severidade `severe` ou `contraindicated`: envio imediato
- Enviada apenas se `notification_preferences.interaction_alert` = true

#### 3.2 Quiet Hours
- Se `quiet_hours_start` e `quiet_hours_end` estiverem definidos:
  - Notificações agendadas durante este período são adiadas para `quiet_hours_end`
  - Exceção: `interaction_alert` com severidade `contraindicated` (sempre enviada)

### 4. Chat Sessions

#### 4.1 Expiração
- Sessões expiram após 24 horas de inatividade
- `expires_at` = `started_at` + 24 horas
- Job cron deve deletar sessões onde `expires_at` < agora
- Messages são deletadas em cascade

#### 4.2 Contexto
- `context_type` define o tipo de conversa
- Pode influenciar prompts da IA
- Exemplos:
  - `medication`: conversa sobre medicamento específico
  - `interaction`: conversa sobre interação medicamentosa
  - `symptom`: conversa sobre sintomas

### 5. Medication Logs

#### 5.1 Criação automática
- Job cron diário cria `medication_log` com `status='pending'` para:
  - Cada `time_slot` de `user_medications` ativos
  - Para as próximas 24 horas

#### 5.2 Ao marcar como taken
Quando `medication_log.status` = 'taken':
1. Atualizar `taken_at` com timestamp atual
2. Decrementar `user_medication.current_stock`
3. Se `current_stock` ≤ `low_stock_threshold`:
   - Criar notificação `low_stock`

### 6. Relatórios de Adesão

#### 6.1 Cálculo
```php
$adherence_rate = ($total_taken / $total_scheduled) * 100;
```

Onde:
- `total_scheduled`: count de `medication_logs` no período
- `total_taken`: count de `medication_logs` com `status='taken'` no período

#### 6.2 Compartilhamento
- Relatórios podem ser compartilhados com cuidadores vinculados
- Cuidadores precisam da permissão `export_patient_reports`

### 7. Relacionamento Cuidador-Paciente

#### 7.1 Fluxo de Convite
1. Paciente envia convite ao cuidador
   - Cria registro em `caregiver_patient` com `status='pending'`
   - `invited_at` = agora
2. Paciente define permissões iniciais
   - Cria registros em `caregiver_permissions`
3. Cuidador aceita convite
   - `status` → 'active'
   - `accepted_at` = agora

#### 7.2 Revogação
- Paciente pode revogar acesso a qualquer momento:
  - `status` → 'revoked'
  - `revoked_at` = agora
  - Permissões são mantidas mas inativas

#### 7.3 Edição de Permissões
- Paciente pode adicionar/remover permissões enquanto `status='active'`
- Implementação: delete + create em `caregiver_permissions`

---

## 🔒 Índices e Constraints

### Índices Principais

```sql
-- USERS
CREATE INDEX idx_users_email ON users(email);

-- USER_MEDICATIONS
CREATE INDEX idx_user_meds_user_active ON user_medications(user_id, active);
CREATE INDEX idx_user_meds_dates ON user_medications(start_date, end_date);

-- MEDICATION_LOGS
CREATE INDEX idx_med_logs_user_med ON medication_logs(user_medication_id);
CREATE INDEX idx_med_logs_scheduled ON medication_logs(scheduled_at);
CREATE INDEX idx_med_logs_status_scheduled ON medication_logs(status, scheduled_at);

-- NOTIFICATIONS
CREATE INDEX idx_notif_user_status ON notifications(user_id, status);
CREATE INDEX idx_notif_scheduled ON notifications(scheduled_for);
CREATE INDEX idx_notif_type ON notifications(type);

-- CHAT_SESSIONS
CREATE INDEX idx_chat_user ON chat_sessions(user_id);
CREATE INDEX idx_chat_expires ON chat_sessions(expires_at);

-- INTERACTION_ALERTS
CREATE INDEX idx_interact_user ON interaction_alerts(user_id);
CREATE INDEX idx_interact_user_ack ON interaction_alerts(user_id, acknowledged_at);
CREATE INDEX idx_interact_severity ON interaction_alerts(severity);

-- CAREGIVER_PATIENT
CREATE UNIQUE INDEX idx_caregiver_patient_unique ON caregiver_patient(caregiver_id, patient_id);
CREATE INDEX idx_caregiver_patient_status ON caregiver_patient(status);

-- CAREGIVER_PERMISSIONS
CREATE UNIQUE INDEX idx_caregiver_perm_unique ON caregiver_permissions(caregiver_patient_id, permission_id);
```

### Foreign Keys

Todas as foreign keys estão configuradas com as seguintes estratégias:

| Tabela | FK | On Delete | Motivo |
|--------|-----|-----------|--------|
| user_medications | user_id | CASCADE | Deleta medicamentos ao deletar usuário |
| user_medications | medication_id | RESTRICT | Protege catálogo |
| medication_logs | user_medication_id | CASCADE | Deleta logs ao deletar medicamento |
| side_effects | user_medication_id | CASCADE | Deleta efeitos ao deletar medicamento |
| notifications | user_id | CASCADE | Deleta notificações ao deletar usuário |
| notifications | user_medication_id | CASCADE | Deleta notificações ao deletar medicamento |
| interaction_alerts | user_id | CASCADE | Deleta alertas ao deletar usuário |
| interaction_alerts | medication_1_id | RESTRICT | Protege catálogo |
| interaction_alerts | medication_2_id | RESTRICT | Protege catálogo |
| chat_sessions | user_id | CASCADE | Deleta sessões ao deletar usuário |
| messages | chat_session_id | CASCADE | Deleta mensagens ao deletar sessão |
| adherence_reports | user_id | CASCADE | Deleta relatórios ao deletar usuário |
| notification_preferences | user_id | CASCADE | Deleta preferências ao deletar usuário |
| caregiver_patient | caregiver_id | CASCADE | Remove relacionamento |
| caregiver_patient | patient_id | CASCADE | Remove relacionamento |
| caregiver_permissions | caregiver_patient_id | CASCADE | Remove permissões |
| caregiver_permissions | permission_id | CASCADE | Remove se permissão deletada |

---

## 🏷️ Enums

### medication_form
```
tablet, capsule, liquid, injection, cream, drops, spray, inhaler, patch, other
```

### via_administration
```
oral, topical, injection, inhalation, sublingual, rectal, other
```

### medication_log_status
```
pending, taken, missed, skipped
```

### side_effect_severity
```
mild, moderate, severe
```

### interaction_severity
```
mild, moderate, severe, contraindicated
```

### notification_type
```
medication_reminder, low_stock, interaction_alert, system
```

### notification_provider
```
push, whatsapp
```

### notification_status
```
pending, sent, failed, read
```

### chat_session_context_type
```
general, medication, interaction, symptom, other
```

### message_role
```
user, assistant
```

### caregiver_patient_status
```
pending, active, revoked
```

---

## 🔐 Sistema de Permissões

### Roles (Spatie)

**Seeder:** [RoleSeeder.php](../database/seeders/RoleSeeder.php)

| Nome | Guard | Descrição |
|------|-------|-----------|
| patient | api | Paciente do sistema |
| caregiver | api | Cuidador de pacientes |

### Permissions (Spatie)

**Seeder:** [PermissionSeeder.php](../database/seeders/PermissionSeeder.php)

Todas as permissões usam `guard_name = 'api'` e são específicas para cuidadores:

#### Visualização
- `view_patient_medications` - Visualizar medicamentos do paciente
- `view_patient_logs` - Visualizar histórico de tomadas do paciente
- `view_patient_side_effects` - Visualizar efeitos colaterais reportados
- `view_patient_reports` - Visualizar relatórios de adesão
- `view_patient_interactions` - Visualizar alertas de interação medicamentosa

#### Gerenciamento
- `manage_patient_medications` - Adicionar, editar e remover medicamentos
- `manage_patient_logs` - Registrar tomadas de medicamento
- `manage_patient_stock` - Atualizar estoque de medicamentos
- `manage_patient_side_effects` - Registrar efeitos colaterais

#### Notificações
- `receive_patient_alerts` - Receber alertas de interação e estoque baixo

#### Relatórios
- `export_patient_reports` - Exportar relatórios de adesão

### Verificação de Permissões

#### Helper no User Model

```php
/**
 * Verifica se cuidador tem permissão específica para um paciente
 */
public function caregiverHasPermissionFor(int $patientId, string $permission): bool
```

#### Exemplo de Uso

```php
// Verificar se cuidador pode ver medicamentos do paciente
if ($caregiver->caregiverHasPermissionFor($patientId, 'view_patient_medications')) {
    // Permitir acesso
}

// Em Policy
public function view(User $user, UserMedication $medication)
{
    // Próprio paciente
    if ($user->id === $medication->user_id) {
        return true;
    }

    // Cuidador com permissão
    return $user->hasRole('caregiver')
        && $user->caregiverHasPermissionFor(
            $medication->user_id,
            'view_patient_medications'
        );
}
```

### Relacionamentos de Permissões

```php
// Obter pacientes sob cuidado do cuidador
$caregiver->patientsUnderCare; // BelongsToMany com wherePivot('status', 'active')

// Obter cuidadores de um paciente
$patient->caregivers; // BelongsToMany com wherePivot('status', 'active')
```

---

## 📝 Migrations Disponíveis

| Ordem | Migration | Descrição |
|-------|-----------|-----------|
| 1 | `2025_10_19_080353_add_phone_to_users_table` | Adiciona campo phone |
| 2 | `2025_10_19_080553_create_medications_table` | Catálogo de medicamentos |
| 3 | `2025_10_19_080701_create_caregiver_patient_table` | Relacionamento cuidador-paciente |
| 4 | `2025_10_19_080744_create_caregiver_permissions_table` | Permissões granulares |
| 5 | `2025_10_19_080828_create_notification_preferences_table` | Preferências de notificação |
| 6 | `2025_10_19_080914_create_user_medications_table` | Medicamentos do usuário |
| 7 | `2025_10_19_081033_create_medication_logs_table` | Logs de tomadas |
| 8 | `2025_10_19_081131_create_side_effects_table` | Efeitos colaterais |
| 9 | `2025_10_19_081224_create_interaction_alerts_table` | Alertas de interação |
| 10 | `2025_10_19_081330_create_notifications_table` | Notificações |
| 11 | `2025_10_19_081521_create_chat_sessions_table` | Sessões de chat |
| 12 | `2025_10_19_081611_create_messages_table` | Mensagens do chat |
| 13 | `2025_10_19_081644_create_adherence_reports_table` | Relatórios de adesão |

---

## 🚀 Comandos para Execução

### Executar Migrations
```bash
php artisan migrate
```

### Executar Seeders
```bash
php artisan db:seed --class=RoleSeeder
php artisan db:seed --class=PermissionSeeder
```

### Rollback
```bash
php artisan migrate:rollback
```

### Fresh (limpar e recriar)
```bash
php artisan migrate:fresh --seed
```

---

## 📚 Referências

- [Laravel Migrations](https://laravel.com/docs/12.x/migrations)
- [Eloquent Relationships](https://laravel.com/docs/12.x/eloquent-relationships)
- [Spatie Laravel Permission](https://spatie.be/docs/laravel-permission/v6/introduction)
- [JWT Authentication](https://jwt-auth.readthedocs.io/en/develop/)

---

**Documento gerado automaticamente em:** 19/10/2025
**Versão do Laravel:** 12
**Versão do PHP:** 8.2
