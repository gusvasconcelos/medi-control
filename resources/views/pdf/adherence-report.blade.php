<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Adesão ao Tratamento</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            line-height: 1.5;
            color: #1f2937;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #3b82f6;
        }

        .header h1 {
            font-size: 24px;
            color: #3b82f6;
            margin-bottom: 5px;
        }

        .header .subtitle {
            font-size: 14px;
            color: #6b7280;
        }

        .header .period {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 10px;
        }

        .section {
            margin-bottom: 25px;
        }

        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 1px solid #e5e7eb;
        }

        .metrics-grid {
            display: table;
            width: 100%;
            margin-bottom: 20px;
        }

        .metrics-row {
            display: table-row;
        }

        .metric-card {
            display: table-cell;
            width: 20%;
            padding: 10px;
            text-align: center;
            border: 1px solid #e5e7eb;
            background-color: #f9fafb;
        }

        .metric-card .value {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .metric-card .label {
            font-size: 10px;
            color: #6b7280;
            text-transform: uppercase;
        }

        .metric-card.success .value { color: #22c55e; }
        .metric-card.warning .value { color: #f59e0b; }
        .metric-card.error .value { color: #ef4444; }
        .metric-card.info .value { color: #3b82f6; }

        .medication-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            page-break-inside: avoid;
        }

        .medication-header {
            display: table;
            width: 100%;
            margin-bottom: 10px;
        }

        .medication-header .name-col {
            display: table-cell;
            width: 70%;
        }

        .medication-header .rate-col {
            display: table-cell;
            width: 30%;
            text-align: right;
        }

        .medication-name {
            font-size: 14px;
            font-weight: bold;
            color: #1f2937;
        }

        .medication-dosage {
            font-size: 11px;
            color: #6b7280;
        }

        .adherence-rate {
            font-size: 20px;
            font-weight: bold;
        }

        .adherence-rate.high { color: #22c55e; }
        .adherence-rate.medium { color: #f59e0b; }
        .adherence-rate.low { color: #ef4444; }

        .progress-bar {
            height: 8px;
            background-color: #e5e7eb;
            border-radius: 4px;
            margin: 10px 0;
            overflow: hidden;
        }

        .progress-bar .fill {
            height: 100%;
            border-radius: 4px;
        }

        .progress-bar .fill.high { background-color: #22c55e; }
        .progress-bar .fill.medium { background-color: #f59e0b; }
        .progress-bar .fill.low { background-color: #ef4444; }

        .stats-grid {
            display: table;
            width: 100%;
            margin: 10px 0;
        }

        .stats-row {
            display: table-row;
        }

        .stat-cell {
            display: table-cell;
            width: 25%;
            padding: 8px;
            text-align: center;
            border: 1px solid #e5e7eb;
        }

        .stat-cell .stat-value {
            font-size: 16px;
            font-weight: bold;
        }

        .stat-cell .stat-label {
            font-size: 9px;
            color: #6b7280;
            text-transform: uppercase;
        }

        .stat-cell.scheduled { background-color: #f3f4f6; }
        .stat-cell.taken { background-color: #dcfce7; }
        .stat-cell.taken .stat-value { color: #22c55e; }
        .stat-cell.pending { background-color: #fef3c7; }
        .stat-cell.pending .stat-value { color: #f59e0b; }
        .stat-cell.lost { background-color: #fee2e2; }
        .stat-cell.lost .stat-value { color: #ef4444; }

        .time-slots {
            margin: 10px 0;
            font-size: 11px;
        }

        .time-slots .label {
            color: #6b7280;
        }

        .time-slot-badge {
            display: inline-block;
            padding: 2px 8px;
            background-color: #e5e7eb;
            border-radius: 4px;
            margin-right: 5px;
            font-size: 10px;
        }

        .punctuality-row {
            display: table;
            width: 100%;
            margin-top: 10px;
            font-size: 11px;
        }

        .punctuality-row .label {
            display: table-cell;
            width: 70%;
            color: #6b7280;
        }

        .punctuality-row .value {
            display: table-cell;
            width: 30%;
            text-align: right;
            font-weight: bold;
        }

        .interactions-section {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
        }

        .interactions-title {
            font-size: 11px;
            font-weight: bold;
            color: #f59e0b;
            margin-bottom: 8px;
        }

        .interaction-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 10px;
            margin-right: 5px;
            margin-bottom: 5px;
        }

        .interaction-badge.mild {
            background-color: #dbeafe;
            color: #1d4ed8;
        }

        .interaction-badge.moderate {
            background-color: #fef3c7;
            color: #b45309;
        }

        .interaction-badge.severe {
            background-color: #fee2e2;
            color: #dc2626;
        }

        .interaction-badge.contraindicated {
            background-color: #fecaca;
            color: #991b1b;
            border: 1px solid #dc2626;
        }

        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 10px;
            color: #9ca3af;
        }

        .no-medications {
            text-align: center;
            padding: 40px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>MediControl</h1>
        <div class="subtitle">Relatório de Adesão ao Tratamento</div>
        <div class="period">
            Período: {{ $startDate }} a {{ $endDate }}
        </div>
        @if(isset($userName))
        <div class="period">
            Paciente: {{ $userName }}
        </div>
        @endif
    </div>

    <div class="section">
        <div class="section-title">Resumo Geral</div>
        <div class="metrics-grid">
            <div class="metrics-row">
                <div class="metric-card {{ $report['adherence_rate'] >= 80 ? 'success' : ($report['adherence_rate'] >= 60 ? 'warning' : 'error') }}">
                    <div class="value">{{ number_format($report['adherence_rate'], 1) }}%</div>
                    <div class="label">Adesão</div>
                </div>
                <div class="metric-card success">
                    <div class="value">{{ $report['total_taken'] }}</div>
                    <div class="label">Tomadas</div>
                </div>
                <div class="metric-card error">
                    <div class="value">{{ $report['total_lost'] }}</div>
                    <div class="label">Perdidas</div>
                </div>
                <div class="metric-card warning">
                    <div class="value">{{ $report['total_pending'] }}</div>
                    <div class="label">Pendentes</div>
                </div>
                <div class="metric-card {{ $report['punctuality_rate'] >= 80 ? 'success' : ($report['punctuality_rate'] >= 60 ? 'warning' : 'error') }}">
                    <div class="value">{{ number_format($report['punctuality_rate'], 1) }}%</div>
                    <div class="label">Pontualidade</div>
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Detalhes por Medicamento</div>

        @if(count($report['medications']) > 0)
            @foreach($report['medications'] as $medication)
                @php
                    $adherenceRate = $medication['total_scheduled'] > 0
                        ? round(($medication['total_taken'] / $medication['total_scheduled']) * 100, 1)
                        : 0;
                    $rateClass = $adherenceRate >= 80 ? 'high' : ($adherenceRate >= 60 ? 'medium' : 'low');
                    $punctualityClass = $medication['punctuality_rate'] >= 80 ? 'high' : ($medication['punctuality_rate'] >= 60 ? 'medium' : 'low');
                @endphp

                <div class="medication-card">
                    <div class="medication-header">
                        <div class="name-col">
                            <div class="medication-name">{{ $medication['name'] ?: 'Medicamento' }}</div>
                            <div class="medication-dosage">{{ $medication['dosage'] }}</div>
                        </div>
                        <div class="rate-col">
                            <div class="adherence-rate {{ $rateClass }}">{{ $adherenceRate }}%</div>
                        </div>
                    </div>

                    <div class="progress-bar">
                        <div class="fill {{ $rateClass }}" style="width: {{ $adherenceRate }}%"></div>
                    </div>

                    <div class="stats-grid">
                        <div class="stats-row">
                            <div class="stat-cell scheduled">
                                <div class="stat-value">{{ $medication['total_scheduled'] }}</div>
                                <div class="stat-label">Prescritas</div>
                            </div>
                            <div class="stat-cell taken">
                                <div class="stat-value">{{ $medication['total_taken'] }}</div>
                                <div class="stat-label">Tomadas</div>
                            </div>
                            <div class="stat-cell pending">
                                <div class="stat-value">{{ $medication['total_pending'] }}</div>
                                <div class="stat-label">Pendentes</div>
                            </div>
                            <div class="stat-cell lost">
                                <div class="stat-value">{{ $medication['total_lost'] }}</div>
                                <div class="stat-label">Perdidas</div>
                            </div>
                        </div>
                    </div>

                    <div class="time-slots">
                        <span class="label">Horários:</span>
                        @foreach($medication['time_slots'] as $slot)
                            <span class="time-slot-badge">{{ $slot }}</span>
                        @endforeach
                    </div>

                    <div class="punctuality-row">
                        <span class="label">Pontualidade:</span>
                        <span class="value {{ $punctualityClass }}">{{ number_format($medication['punctuality_rate'], 1) }}%</span>
                    </div>

                    @if(count($medication['interactions']) > 0)
                        <div class="interactions-section">
                            <div class="interactions-title">⚠️ Interações Identificadas</div>
                            @foreach($medication['interactions'] as $interaction)
                                <span class="interaction-badge {{ $interaction['severity'] }}">
                                    {{ $interaction['name'] }}
                                    ({{ __('medications.interaction_severity.' . $interaction['severity']) }})
                                </span>
                            @endforeach
                        </div>
                    @endif
                </div>
            @endforeach
        @else
            <div class="no-medications">
                <p>Nenhum medicamento encontrado para o período selecionado.</p>
            </div>
        @endif
    </div>

    <div class="footer">
        <p>Relatório gerado em {{ $generatedAt }} | MediControl - Sistema de Controle de Medicamentos</p>
        <p>Este relatório é apenas informativo e não substitui orientação médica profissional.</p>
    </div>
</body>
</html>
