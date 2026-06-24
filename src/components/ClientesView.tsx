/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, Mail, Phone, Calendar, UserPlus, ShieldAlert, Award, Star } from 'lucide-react';
import { Customer } from '../types';

interface ClientesViewProps {
  customers: Customer[];
  onShowToast: (message: string) => void;
}

export default function ClientesView({ customers, onShowToast }: ClientesViewProps) {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<'todos' | 'VIP' | 'Recurrente' | 'Nuevo'>('todos');

  // Filtered clients
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.email.toLowerCase().includes(search.toLowerCase());
    const matchesTier = tierFilter === 'todos' || c.status === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-sans text-3xl font-extrabold text-on-surface tracking-tight">Cartera de clientes</h1>
          <p className="text-on-surface-variant text-sm font-sans mt-1">Gestiona perfiles, segmentación y el valor acumulado de compra por usuario.</p>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="bg-surface-container micro-border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg pl-10 pr-4 py-1.5 text-xs focus:outline-none focus:border-primary/80 transition-colors text-on-surface"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-surface-container-high/40 p-1 rounded-lg border border-outline-variant/20 select-none">
          {(['todos', 'VIP', 'Recurrente', 'Nuevo'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3 py-1 font-mono text-xs rounded-md transition-colors capitalize cursor-pointer ${
                tierFilter === tier 
                  ? 'bg-surface-container-highest text-on-surface font-semibold' 
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              {tier === 'todos' ? 'Todos' : tier}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full bg-surface-container p-12 text-center text-xs text-outline italic rounded-xl micro-border">
            No se encontraron clientes correspondientes a la búsqueda.
          </div>
        ) : (
          filteredCustomers.map((cust) => {
            const badgeColors = {
              VIP: 'bg-primary/10 border-primary/20 text-primary',
              Recurrente: 'bg-secondary-container/10 border-secondary-container/20 text-secondary',
              Nuevo: 'bg-green-500/10 border-green-500/20 text-green-400'
            };

            return (
              <div 
                key={cust.id} 
                className="bg-surface-container micro-border rounded-xl p-5 hover:border-primary/20 transition-all flex flex-col justify-between group duration-250"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={cust.avatar} alt={cust.name} className="w-12 h-12 rounded-full object-cover border border-outline-variant/30" />
                      <div>
                        <h4 className="font-bold text-on-surface text-sm leading-tight group-hover:text-primary transition-colors">{cust.name}</h4>
                        <span className="text-xs text-outline font-sans truncate block max-w-[140px] mt-0.5">{cust.email}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase ${badgeColors[cust.status]}`}>
                      {cust.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-outline-variant/10">
                    <div>
                      <span className="text-[9px] font-bold text-outline font-mono uppercase tracking-wider block">Total gastado</span>
                      <span className="text-sm font-bold text-on-surface block mt-1 font-mono">${cust.totalSpent.toLocaleString('es-AR')}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-outline font-mono uppercase tracking-wider block">Pedidos</span>
                      <span className="text-sm font-bold text-on-surface block mt-1 font-mono">{cust.totalOrders}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-outline-variant/10 flex items-center justify-between text-[11px] text-outline">
                  <span className="font-sans flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Último pedido:
                  </span>
                  <span className="font-medium text-on-surface-variant">{cust.lastOrderDate}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
