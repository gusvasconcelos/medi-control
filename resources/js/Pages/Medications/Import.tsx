import { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { Upload, FileText, ArrowLeft, AlertCircle } from 'lucide-react';

import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { getNavigationItems } from '@/config/navigation';
import { useToast } from '@/hooks/useToast';
import type { PageProps } from '@/types';

export default function MedicationsImport({ auth }: PageProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];
    const { showSuccess, showError } = useToast();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const validExtensions = ['csv', 'xls', 'xlsx'];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        if (!fileExtension || !validExtensions.includes(fileExtension)) {
            showError('Por favor, selecione um arquivo CSV, XLS ou XLSX');
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        setSelectedFile(file);
    };

    const handleFileRemove = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleImport = async () => {
        if (!selectedFile) {
            showError('Por favor, selecione um arquivo');
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);

        router.post('/medications/import', formData, {
            forceFormData: true,
            onSuccess: () => {
                showSuccess('Medicamentos importados com sucesso!');
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setTimeout(() => {
                    router.get('/medications');
                }, 1500);
            },
            onError: (errors) => {
                const errorMessage = errors.file || 'Erro ao importar medicamentos';
                showError(errorMessage);
                setIsUploading(false);
            },
            onFinish: () => {
                setIsUploading(false);
            },
        });
    };

    const handleBackToList = () => {
        router.get('/medications');
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${sizes[i]}`;
    };

    return (
        <>
            <Head title="Importar Medicamentos" />

            <AuthenticatedLayout
                navItems={getNavigationItems('/medications', userRoles)}
            >
                <div className="min-h-screen bg-base-100">
                    <div className="container mx-auto max-w-4xl px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                        <div className="mb-6 sm:mb-8">
                            <button
                                type="button"
                                className="btn btn-ghost btn-sm gap-2 mb-4"
                                onClick={handleBackToList}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Voltar para Medicamentos
                            </button>

                            <h1 className="mb-1 text-xl font-bold text-base-content sm:text-2xl md:text-3xl">
                                Importar Medicamentos
                            </h1>
                            <p className="text-xs sm:text-sm text-base-content/60">
                                Faça upload de um arquivo CSV, XLS ou XLSX para importar medicamentos em lote
                            </p>
                        </div>

                        <div className="rounded-lg bg-base-200 p-6">
                            <div className="space-y-6">
                                {/* Info Alert */}
                                <div className="alert alert-info">
                                    <AlertCircle className="h-5 w-5" />
                                    <div className="text-sm">
                                        <p className="font-semibold mb-1">Formato do arquivo</p>
                                        <p>
                                            O arquivo deve conter as colunas:
                                        </p>
                                        <ul className="list-disc list-inside">
                                            <li className="font-semibold">nome_produto: <span className="font-normal">Nome do medicamento</span></li>
                                            <li className="font-semibold">principio_ativo: <span className="font-normal">Princípio ativo</span></li>
                                            <li className="font-semibold">empresa_detentora_registro: <span className="font-normal">Empresa detentora do registro</span></li>
                                            <li className="font-semibold">categoria_regulatoria: <span className="font-normal">Categoria regulatoria</span></li>
                                            <li className="font-semibold">classe_terapeutica: <span className="font-normal">Classe terapeutica</span></li>
                                            <li className="font-semibold">numero_registro_produto: <span className="font-normal">Número de registro do produto</span></li>
                                        </ul>
                                        <p>
                                            O arquivo deve ser um CSV, XLS ou XLSX.
                                        </p>
                                    </div>
                                </div>

                                {/* File Upload Area */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold">Arquivo</span>
                                    </label>

                                    {!selectedFile ? (
                                        <label
                                            htmlFor="file-upload"
                                            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-base-content/20 rounded-lg cursor-pointer bg-base-100 hover:bg-base-300 transition-colors"
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="h-12 w-12 mb-3 text-base-content/40" />
                                                <p className="mb-2 text-sm text-base-content">
                                                    <span className="font-semibold">Clique para fazer upload</span> ou
                                                    arraste e solte
                                                </p>
                                                <p className="text-xs text-base-content/60">
                                                    CSV, XLS ou XLSX
                                                </p>
                                            </div>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept=".csv,.xls,.xlsx"
                                                onChange={handleFileSelect}
                                                disabled={isUploading}
                                            />
                                        </label>
                                    ) : (
                                        <div className="flex items-center justify-between p-4 bg-base-100 border border-base-content/20 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-8 w-8 text-primary" />
                                                <div>
                                                    <p className="text-sm font-medium text-base-content">
                                                        {selectedFile.name}
                                                    </p>
                                                    <p className="text-xs text-base-content/60">
                                                        {formatFileSize(selectedFile.size)}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-ghost btn-sm"
                                                onClick={handleFileRemove}
                                                disabled={isUploading}
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        className="btn btn-ghost"
                                        onClick={handleBackToList}
                                        disabled={isUploading}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary gap-2"
                                        onClick={handleImport}
                                        disabled={!selectedFile || isUploading}
                                    >
                                        {isUploading ? (
                                            <>
                                                <span className="loading loading-spinner loading-sm"></span>
                                                Importando...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-5 w-5" />
                                                Importar Medicamentos
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
