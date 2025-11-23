<?php

return [
    'reminder' => [
        'title_before' => 'Lembrete de medicamento',
        'title_now' => 'Hora de tomar seu medicamento',
        'body_before' => 'Em :minutes minutos você deve tomar :medication às :time',
        'body_now' => 'Está na hora de tomar :medication (:dosage)',
    ],

    'interaction' => [
        'title' => 'Alerta de interação medicamentosa',
        'body' => 'Foi detectada uma interação entre :medication1 e :medication2. Severidade: :severity',
    ],

    'low_stock' => [
        'title' => 'Estoque baixo',
        'body' => 'O estoque de :medication está baixo. Restam :quantity unidades.',
    ],

    'preferences' => [
        'updated' => 'Preferências de notificação atualizadas com sucesso',
        'not_found' => 'Preferências de notificação não encontradas',
    ],

    'types' => [
        'medication_reminder' => 'Lembrete de medicamento',
        'interaction_alert' => 'Alerta de interação',
        'low_stock' => 'Estoque baixo',
        'system' => 'Sistema',
    ],

    'status' => [
        'pending' => 'Pendente',
        'sent' => 'Enviada',
        'failed' => 'Falhou',
        'read' => 'Lida',
    ],

    'marked_as_read' => 'Notificação marcada como lida',
    'all_marked_as_read' => 'Todas as notificações foram marcadas como lidas',
];
