/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  ShoppingCart, 
  TrendingUp, 
  Check, 
  Clock, 
  AlertTriangle, 
  X, 
  Trash2,
  DollarSign
} from 'lucide-react';
import { Order, Product } from '../types';

interface PedidosViewProps {
  orders: Order[];
  products: Product[];
  onAddOrder: (newOrder: Order) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: 'Completado' | 'Pendiente' | 'Cancelado') => void;
  onDeleteOrder: (orderId: string) => void;
  onShowToast: (message: string) => void;
}

export default function PedidosView({ 
  orders, 
  products, 
  onAddOrder, 
  onUpdateOrderStatus, 
  onDeleteOrder,
  onShowToast
}: PedidosViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Completado' | 'Pendiente' | 'Cancelado'>('Todos');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Create order modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [orderStatus, setOrderStatus] = useState<'Completado' | 'Pendiente' | 'Cancelado'>('Pendiente');

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const estimatedTotal = selectedProduct ? selectedProduct.price * quantity : 0;

  // Filter logic
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.includes(searchTerm) || 
                          o.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !selectedProductId) {
      onShowToast("Por favor complete todos los campos obligatorios.");
      return;
    }

    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) return;

    // Generate unique incremental ID
    const nextNum = Math.max(...orders.map(o => {
      const num = parseInt(o.id.replace('#', ''));
      return isNaN(num) ? 0 : num;
    })) + 1;
    
    const newId = `#${nextNum}`;

    const newOrder: Order = {
      id: newId,
      clientName,
      clientEmail,
      productName: prod.name,
      total: prod.price * quantity,
      status: orderStatus,
      date: "Hoy, " + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString(),
      quantity
    };

    onAddOrder(newOrder);
    setIsCreateModalOpen(false);
    
    // reset form
    setClientName('');
    setClientEmail('');
    setSelectedProductId('');
    setQuantity(1);
    setOrderStatus('Pendiente');
    onShowToast(`Pedido ${newId} registrado con éxito!`);
  };

  const handleDelete = (orderId: string) => {
    onDeleteOrder(orderId);
    setSelectedOrder(null);
    onShowToast(`Pedido ${orderId} eliminado.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-sans text-3xl font-extrabold text-on-surface tracking-tight">Gestión de pedidos</h1>
          <p className="text-on-surface-variant text-sm font-sans mt-1">Controla los despachos, estados de cobro y registro de nuevas ventas.</p>
        </div>
        <button 
          id="btn-new-order-modal"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo pedido</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container micro-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-outline font-sans">Completados</span>
            <span className="text-xl font-bold text-on-surface block font-mono">
              {orders.filter(o => o.status === 'Completado').length}
            </span>
          </div>
        </div>
        <div className="bg-surface-container micro-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-outline font-sans">Pendientes</span>
            <span className="text-xl font-bold text-on-surface block font-mono">
              {orders.filter(o => o.status === 'Pendiente').length}
            </span>
          </div>
        </div>
        <div className="bg-surface-container micro-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-outline font-sans">Cancelados</span>
            <span className="text-xl font-bold text-on-surface block font-mono">
              {orders.filter(o => o.status === 'Cancelado').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="bg-surface-container micro-border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID, cliente, producto..."
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg pl-10 pr-4 py-1.5 text-xs focus:outline-none focus:border-primary/80 transition-colors text-on-surface"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-surface-container-high/40 p-1 rounded-lg border border-outline-variant/20 overflow-x-auto w-full sm:w-auto">
          {(['Todos', 'Completado', 'Pendiente', 'Cancelado'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 font-mono text-xs rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === st 
                  ? 'bg-surface-container-highest text-on-surface font-semibold' 
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-surface-container micro-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-low/30">
                <th className="px-6 py-3.5 text-[10px] font-bold font-mono text-outline uppercase tracking-wider">ID Pedido</th>
                <th className="px-6 py-3.5 text-[10px] font-bold font-mono text-outline uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3.5 text-[10px] font-bold font-mono text-outline uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3.5 text-[10px] font-bold font-mono text-outline uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-3.5 text-[10px] font-bold font-mono text-outline uppercase tracking-wider">Total</th>
                <th className="px-6 py-3.5 text-[10px] font-bold font-mono text-outline uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3.5 text-[10px] font-bold font-mono text-outline uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-xs text-outline italic">
                    No se encontraron pedidos correspondientes a los filtros indicados.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    id={`order-row-${order.id}`}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-surface-container-high/40 transition-colors cursor-pointer text-sm"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-primary">{order.id}</td>
                    <td className="px-6 py-4 font-medium text-on-surface">{order.clientName}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{order.productName}</td>
                    <td className="px-6 py-4 text-outline font-mono text-xs">{order.quantity || 1} u.</td>
                    <td className="px-6 py-4 font-bold text-on-surface font-mono">${order.total.toLocaleString('es-AR')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'Completado' 
                          ? 'bg-green-500/10 text-green-400' 
                          : order.status === 'Pendiente'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-outline text-xs">{order.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-surface-container w-full max-w-md h-full p-6 border-l border-outline-variant/30 flex flex-col justify-between animate-in slide-in-from-right duration-250">
            <div>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant/20">
                <div>
                  <span className="font-mono text-xs text-primary font-bold">{selectedOrder.id}</span>
                  <h3 className="font-sans text-lg font-bold text-on-surface mt-1">Detalle del Pedido</h3>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-1.5 hover:bg-surface-container-high rounded-lg text-outline hover:text-on-surface">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block">Cliente</span>
                  <span className="text-sm font-semibold text-on-surface block mt-1">{selectedOrder.clientName}</span>
                  <span className="text-xs text-on-surface-variant block mt-0.5">{selectedOrder.clientEmail}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block">Producto adquirido</span>
                  <span className="text-sm font-semibold text-on-surface block mt-1">
                    {selectedOrder.productName} <span className="text-outline font-mono text-xs font-normal">x {selectedOrder.quantity || 1}</span>
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block">Total de transacción</span>
                  <span className="text-lg font-extrabold text-on-surface block mt-1 font-mono">${selectedOrder.total.toLocaleString('es-AR')}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block">Fecha de registro</span>
                  <span className="text-xs text-on-surface-variant block mt-1 font-sans">{selectedOrder.date}</span>
                </div>

                {/* Interactive Status Changer */}
                <div>
                  <span className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block mb-2">Estado del despacho</span>
                  <div className="flex gap-2">
                    {(['Completado', 'Pendiente', 'Cancelado'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          onUpdateOrderStatus(selectedOrder.id, st);
                          setSelectedOrder(prev => prev ? { ...prev, status: st } : null);
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          selectedOrder.status === st
                            ? st === 'Completado' 
                              ? 'bg-green-500/10 border-green-500/30 text-green-400 font-bold'
                              : st === 'Pendiente'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold'
                              : 'bg-red-500/10 border-red-500/30 text-red-400 font-bold'
                            : 'bg-surface-container-low border-outline-variant/20 text-outline hover:text-on-surface'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/20 flex gap-3">
              <button 
                onClick={() => handleDelete(selectedOrder.id)}
                className="flex items-center justify-center gap-2 flex-1 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-xs font-bold text-red-400 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar pedido</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New order creation modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative bg-surface-container-high micro-border rounded-xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-sans text-lg font-bold text-on-surface flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Registrar nuevo pedido
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 hover:bg-surface-container rounded-lg text-outline hover:text-on-surface">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block mb-1">Nombre del cliente *</label>
                <input 
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Mateo Rossi"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block mb-1">Correo electrónico *</label>
                <input 
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="mateo.rossi@example.com"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block mb-1">Producto *</label>
                  <select 
                    required
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="">Seleccione...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (${p.price.toLocaleString()})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block mb-1">Cantidad *</label>
                  <input 
                    type="number"
                    required
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block mb-1">Estado de inicio</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Pendiente', 'Completado'] as const).map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setOrderStatus(st)}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                        orderStatus === st
                          ? 'bg-primary/20 border-primary text-primary font-bold'
                          : 'bg-surface-container-low border-outline-variant/20 text-outline hover:text-on-surface'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {selectedProduct && (
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 flex justify-between items-center mt-2">
                  <span className="text-xs text-on-surface-variant font-sans">Total estimado:</span>
                  <span className="text-base font-extrabold text-primary font-mono">${estimatedTotal.toLocaleString('es-AR')}</span>
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-3 bg-primary hover:brightness-110 active:scale-98 text-on-primary font-bold rounded-lg text-sm transition-all shadow-lg shadow-primary/10 mt-6 cursor-pointer"
              >
                Insertar Pedido
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
