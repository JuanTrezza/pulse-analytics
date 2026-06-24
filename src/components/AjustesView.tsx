/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Save, Shield, HelpCircle } from 'lucide-react';

interface AjustesViewProps {
  onShowToast: (message: string) => void;
}

export default function AjustesView({ onShowToast }: AjustesViewProps) {
  const [storeName, setStoreName] = useState('PULSE LATAM');
  const [currency, setCurrency] = useState('ARS');
  const [stockThreshold, setStockThreshold] = useState(5);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast("Ajustes del sistema guardados correctamente.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="font-sans text-3xl font-extrabold text-on-surface tracking-tight">Configuración del sistema</h1>
        <p className="text-on-surface-variant text-sm font-sans mt-1">Administra los parámetros generales del panel, integraciones y notificaciones.</p>
      </div>

      <div className="bg-surface-container micro-border rounded-xl p-5 md:p-6 max-w-2xl">
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/10">
            <Settings className="w-5 h-5 text-primary" />
            <h3 className="font-sans text-base font-bold text-on-surface">Parámetros de la tienda</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block mb-1">Nombre de la organización</label>
              <input 
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block mb-1">Moneda base</label>
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="ARS">Peso Argentino ($)</option>
                  <option value="USD">Dólar Estadounidense (USD)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block mb-1">Límite para stock crítico</label>
                <input 
                  type="number"
                  value={stockThreshold}
                  onChange={(e) => setStockThreshold(parseInt(e.target.value) || 0)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface focus:outline-none focus:border-primary font-mono"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-primary hover:brightness-110 active:scale-98 text-on-primary font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/10"
          >
            <Save className="w-4 h-4" />
            <span>Guardar cambios</span>
          </button>
        </form>
      </div>
    </div>
  );
}
