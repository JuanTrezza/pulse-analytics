/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { FileBarChart2, FileText, Download, Play, CheckCircle } from 'lucide-react';

interface ReportesViewProps {
  onShowToast: (message: string) => void;
}

export default function ReportesView({ onShowToast }: ReportesViewProps) {
  const [reportType, setReportType] = useState('ventas');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerateReport = () => {
    setIsRunning(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsRunning(false);
            onShowToast("Reporte estructurado y listo para descargar.");
          }, 400);
          return 100;
        }
        return p + 20;
      });
    }, 150);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="font-sans text-3xl font-extrabold text-on-surface tracking-tight">Reportes y exportación</h1>
        <p className="text-on-surface-variant text-sm font-sans mt-1">Configura parámetros y compila reportes detallados del estado general de tu tienda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container micro-border rounded-xl p-6 md:col-span-2 space-y-6">
          <h3 className="font-sans text-lg font-bold text-on-surface">Configurar compilación</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block mb-2">Tipo de reporte</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setReportType('ventas')}
                  className={`p-3.5 rounded-lg border text-left transition-all ${
                    reportType === 'ventas' 
                      ? 'bg-primary/5 border-primary text-primary font-bold' 
                      : 'bg-surface-container-low border-outline-variant/30 text-outline'
                  }`}
                >
                  <FileText className="w-5 h-5 mb-2" />
                  <span className="text-sm block">Auditoria de Ventas</span>
                </button>

                <button 
                  onClick={() => setReportType('inventario')}
                  className={`p-3.5 rounded-lg border text-left transition-all ${
                    reportType === 'inventario' 
                      ? 'bg-primary/5 border-primary text-primary font-bold' 
                      : 'bg-surface-container-low border-outline-variant/30 text-outline'
                  }`}
                >
                  <FileBarChart2 className="w-5 h-5 mb-2" />
                  <span className="text-sm block">Inventario Físico</span>
                </button>
              </div>
            </div>

            <button
              onClick={handleGenerateReport}
              disabled={isRunning}
              className="w-full py-3 bg-primary hover:brightness-110 active:scale-98 text-on-primary font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Generar Reporte</span>
            </button>
          </div>
        </div>

        {/* Status display */}
        <div className="bg-surface-container micro-border rounded-xl p-6 flex flex-col justify-between">
          <h3 className="font-sans text-lg font-bold text-on-surface mb-4">Estado del reporte</h3>

          {isRunning ? (
            <div className="text-center py-6 space-y-4">
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-dashed border-primary/30 animate-spin">
                <span className="sr-only">Cargando...</span>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-semibold text-on-surface">Procesando registros...</div>
                <div className="text-xs text-outline font-mono">{progress}% completado</div>
              </div>
            </div>
          ) : progress === 100 ? (
            <div className="text-center py-6 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-400">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-on-surface">Reporte Compilado</div>
                <p className="text-xs text-on-surface-variant font-sans">Todos los datos consolidados con precisión.</p>
              </div>
              <button 
                onClick={() => {
                  onShowToast("Descargando archivo Excel/PDF...");
                  setProgress(0);
                }}
                className="mx-auto flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold rounded-lg hover:bg-green-500/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Descargar archivo</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-outline text-xs italic">
              Configura los parámetros y haz clic en "Generar Reporte" para iniciar la compilación.
            </div>
          )}

          <div className="text-[10px] text-outline font-mono text-center pt-4 border-t border-outline-variant/10">
            Formato de descarga estándar: PDF y CSV.
          </div>
        </div>
      </div>
    </div>
  );
}
