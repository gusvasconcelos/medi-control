<?php

return [
    'reminder' => [
        'title_before' => 'Medication reminder',
        'title_now' => 'Time to take your medication',
        'body_before' => 'In :minutes minutes you should take :medication at :time',
        'body_now' => 'It\'s time to take :medication (:dosage)',
    ],

    'interaction' => [
        'title' => 'Drug interaction alert',
        'body' => 'An interaction was detected between :medication1 and :medication2. Severity: :severity',
    ],

    'low_stock' => [
        'title' => 'Low stock',
        'body' => ':medication stock is low. :quantity units remaining.',
    ],

    'preferences' => [
        'updated' => 'Notification preferences updated successfully',
        'not_found' => 'Notification preferences not found',
    ],

    'types' => [
        'medication_reminder' => 'Medication reminder',
        'interaction_alert' => 'Interaction alert',
        'low_stock' => 'Low stock',
        'system' => 'System',
    ],

    'status' => [
        'pending' => 'Pending',
        'sent' => 'Sent',
        'failed' => 'Failed',
        'read' => 'Read',
    ],

    'marked_as_read' => 'Notification marked as read',
    'all_marked_as_read' => 'All notifications marked as read',
];
