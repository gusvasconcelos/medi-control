<?php

return [
    'auth' => [
        'logout' => 'Logout feito com sucesso.',
        'not_authenticated' => 'Não autenticado.',
        'invalid_credentials' => 'As credenciais estão inválidas.',
        'register_success' => 'Registro realizado com sucesso.',
    ],

    'user_medication' => [
        'created' => 'Medicamento cadastrado com sucesso.',
        'updated' => 'Medicamento atualizado com sucesso.',
        'deleted' => 'Medicamento removido com sucesso.',
        'not_found' => 'Medicamento não encontrado.',
    ],

    'medication_log' => [
        'taken' => 'Medicamento registrado como tomado com sucesso.',
        'invalid_time_slot' => 'O horário informado não está configurado para este medicamento.',
        'low_stock_title' => 'Estoque baixo',
        'low_stock_message' => 'O estoque do medicamento :medication está baixo (:stock unidades restantes).',
    ],
];
