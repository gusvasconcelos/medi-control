import { Package } from 'lucide-react';

interface StockManagementStepProps {
    initialStock: number;
    lowStockThreshold: number;
    errors: {
        initialStock?: string;
        lowStockThreshold?: string;
    };
    onChange: (field: string, value: number) => void;
}

export function StockManagementStep({
    initialStock,
    lowStockThreshold,
    errors,
    onChange,
}: StockManagementStepProps) {
    return (
        <div className="space-y-4">
            <div className="alert alert-info">
                <Package className="h-5 w-5" />
                <span className="text-sm">
                    Configure o estoque para acompanhar a quantidade disponível e receber alertas
                    quando estiver baixo.
                </span>
            </div>

            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text font-medium">
                        Estoque inicial <span className="text-error">*</span>
                    </span>
                </label>
                <input
                    type="number"
                    placeholder="0"
                    value={initialStock || ''}
                    onChange={(e) => onChange('initialStock', parseInt(e.target.value) || 0)}
                    min={0}
                    className={`input input-bordered w-full ${errors.initialStock ? 'input-error' : ''}`}
                    required
                />
                {errors.initialStock && (
                    <label className="label">
                        <span className="label-text-alt text-error">{errors.initialStock}</span>
                    </label>
                )}
                <label className="label">
                    <span className="label-text-alt text-base-content/60 text-xs">
                        Quantidade total de unidades que você possui
                    </span>
                </label>
            </div>

            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text font-medium">
                        Estoque mínimo para alerta <span className="text-error">*</span>
                    </span>
                </label>
                <input
                    type="number"
                    placeholder="5"
                    value={lowStockThreshold || ''}
                    onChange={(e) => {
                        const value = e.target.value;
                        onChange('lowStockThreshold', value === '' ? 0 : parseInt(value) || 0);
                    }}
                    min={0}
                    className={`input input-bordered w-full ${errors.lowStockThreshold ? 'input-error' : ''}`}
                    required
                />
                {errors.lowStockThreshold && (
                    <label className="label">
                        <span className="label-text-alt text-error">
                            {errors.lowStockThreshold}
                        </span>
                    </label>
                )}
                <label className="label">
                    <span className="label-text-alt text-base-content/60 text-xs">
                        Você receberá um alerta quando o estoque atingir este valor
                    </span>
                </label>
            </div>

        </div>
    );
}
