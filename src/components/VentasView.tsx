/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  CreditCard, 
  ShoppingBag, 
  Users, 
  Smartphone, 
  Laptop, 
  Share2, 
  Percent,
  Calendar
} from 'lucide-react';
import { Order, Product } from '../types';

interface VentasViewProps {
  orders: Order[];
  products: Product[];
  selectedRange: 'dia' | 'semana' | 'mes' | 'ano';
}

export default function VentasView({ orders, products, selectedRange }: VentasViewProps) {
  const [activeChannel, setActiveChannel] = useState<'todos' | 'web' | 'mobile' | 'retail'>('todos');

  // Math metrics
  const totalSales = orders.filter(o => o.status === 'Completado').reduce((acc, curr) => acc + curr.total, 0);
  const pendingSales = orders.filter(o => o.status === 'Pendiente').reduce((acc, curr) => acc + curr.total, 0);
  const totalUnitsSold = products.reduce((acc, curr) => acc + curr.salesCount, 0);

  const salesChannels = [
    { name: 'Tienda Web', amount: totalSales * 0.55, percentage: 55, icon: Laptop, count: 785 },
    { name: 'App Móvil', amount: totalSales * 0.30, percentage: 30, icon: Smartphone, count: 428 },
    { name: 'Venta Directa', amount: totalSales * 0.15, percentage: 15, icon: ShoppingBag, count: 215 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="font-sans text-3xl font-extrabold text-on-surface tracking-tight">Análisis de ventas</h1>
        <p className="text-on-surface-variant text-sm font-sans mt-1">Desglose de ingresos, canales de adquisición y volumen comercial.</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container micro-border rounded-xl p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block">VENTAS CONCRETADAS</span>
            <span className="text-2xl font-bold text-on-surface font-sans mt-1.5 block">${totalSales.toLocaleString('es-AR')}</span>
            <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1 mt-1 font-sans">
              <TrendingUp className="w-3.5 h-3.5 inline" /> +14.2% vs mes anterior
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface-container micro-border rounded-xl p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block">FACTURACIÓN PENDIENTE</span>
            <span className="text-2xl font-bold text-on-surface font-sans mt-1.5 block">${pendingSales.toLocaleString('es-AR')}</span>
            <span className="text-[10px] text-outline font-sans mt-1 block">Esperando acreditación de pago</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface-container micro-border rounded-xl p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block">UNIDADES DESPACHADAS</span>
            <span className="text-2xl font-bold text-on-surface font-mono mt-1.5 block">{totalUnitsSold.toLocaleString('es-AR')} u.</span>
            <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1 mt-1 font-sans">
              <TrendingUp className="w-3.5 h-3.5 inline" /> +5.6% vs mes anterior
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-secondary-container/10 flex items-center justify-center text-secondary">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Adquisition Channels */}
        <div className="lg:col-span-2 bg-surface-container micro-border rounded-xl p-5 md:p-6">
          <h3 className="font-sans text-lg font-bold text-on-surface mb-1">Ventas por canal</h3>
          <p className="text-on-surface-variant text-xs font-sans mb-6">Desglose del rendimiento según la plataforma de compra.</p>

          <div className="space-y-5">
            {salesChannels.map((channel, idx) => {
              const Icon = channel.icon;
              return (
                <div key={idx} className="p-4 bg-surface-container-low/40 border border-outline-variant/20 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center text-outline">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">{channel.name}</h4>
                      <p className="text-xs text-outline mt-0.5 font-sans">{channel.count} pedidos concretados</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-on-surface font-mono block">${channel.amount.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</span>
                    <span className="text-[10px] font-bold text-primary font-mono mt-0.5 inline-block bg-primary/10 px-1.5 py-0.5 rounded">
                      {channel.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conversión banner */}
        <div className="bg-surface-container micro-border rounded-xl p-5 md:p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-sans text-lg font-bold text-on-surface mb-1">Tasa de conversión</h3>
            <p className="text-on-surface-variant text-xs font-sans mb-4">Efectividad comercial global del periodo.</p>
          </div>

          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-4 border-dashed border-primary/40 relative">
              <span className="text-2xl font-black text-primary font-mono">3.42%</span>
            </div>
            <p className="text-xs text-on-surface-variant font-sans mt-4 max-w-[200px] mx-auto">
              El promedio del sector e-commerce ronda el 2.1%. Estás operando con alto rendimiento.
            </p>
          </div>

          <div className="pt-4 border-t border-outline-variant/20 space-y-2">
            <div className="flex justify-between text-xs text-on-surface-variant">
              <span>Checkout iniciado</span>
              <span className="font-semibold text-on-surface font-mono">19.4%</span>
            </div>
            <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '19.4%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
