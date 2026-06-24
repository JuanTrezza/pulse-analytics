/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  AlertTriangle, 
  Check, 
  Plus, 
  X, 
  RefreshCw, 
  Edit2, 
  ArrowUpRight 
} from 'lucide-react';
import { Product } from '../types';

interface ProductosViewProps {
  products: Product[];
  onRestockProduct: (productId: string) => void;
  onUpdateProductPrice: (productId: string, newPrice: number) => void;
  onAddProduct: (newProduct: Product) => void;
  onShowToast: (message: string) => void;
}

export default function ProductosView({
  products,
  onRestockProduct,
  onUpdateProductPrice,
  onAddProduct,
  onShowToast
}: ProductosViewProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  
  // Create product state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newStock, setNewStock] = useState<number>(0);

  // Price editing state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // Extract unique categories for filter
  const categories = ['todos', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCategory || newPrice <= 0 || newStock < 0) {
      onShowToast("Complete todos los campos con valores válidos.");
      return;
    }

    const nextId = `prod-${products.length + 1}`;
    const product: Product = {
      id: nextId,
      name: newName,
      category: newCategory,
      price: newPrice,
      stock: newStock,
      salesCount: 0,
      revenue: 0
    };

    onAddProduct(product);
    setIsCreateOpen(false);

    // reset fields
    setNewName('');
    setNewCategory('');
    setNewPrice(0);
    setNewStock(0);
    onShowToast(`Producto "${newName}" registrado.`);
  };

  const handleStartEditPrice = (prod: Product) => {
    setEditingPriceId(prod.id);
    setTempPrice(prod.price);
  };

  const handleSavePrice = (id: string) => {
    if (tempPrice <= 0) {
      onShowToast("El precio debe ser un número positivo.");
      return;
    }
    onUpdateProductPrice(id, tempPrice);
    setEditingPriceId(null);
    onShowToast("Precio actualizado correctamente.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-sans text-3xl font-extrabold text-on-surface tracking-tight">Inventario de productos</h1>
          <p className="text-on-surface-variant text-sm font-sans mt-1">Supervisa niveles de abastecimiento, modifica precios y añade nuevos artículos.</p>
        </div>
        <button 
          id="btn-new-product-modal"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir producto</span>
        </button>
      </div>

      {/* Grid statistics of inventory */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-surface-container micro-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-outline font-sans">Artículos catalogados</span>
            <span className="text-xl font-bold text-on-surface block font-mono">
              {products.length}
            </span>
          </div>
        </div>

        <div className="bg-surface-container micro-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-outline font-sans">En stock crítico (&lt; 5)</span>
            <span className="text-xl font-bold text-red-400 block font-mono">
              {products.filter(p => p.stock < 5).length}
            </span>
          </div>
        </div>

        <div className="bg-surface-container micro-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-outline font-sans">Abastecimiento saludable</span>
            <span className="text-xl font-bold text-green-400 block font-mono">
              {products.filter(p => p.stock >= 5).length}
            </span>
          </div>
        </div>
      </div>

      {/* Search and category filters */}
      <div className="bg-surface-container micro-border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o categoría..."
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg pl-10 pr-4 py-1.5 text-xs focus:outline-none focus:border-primary/80 transition-colors text-on-surface"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-surface-container-high/40 p-1 rounded-lg border border-outline-variant/20 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 font-mono text-xs rounded-md transition-colors capitalize whitespace-nowrap cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-surface-container-highest text-on-surface font-semibold' 
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              {cat === 'todos' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products table list */}
      <div className="bg-surface-container micro-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-low/30">
                <th className="px-6 py-3.5 text-[10px] font-bold font-mono text-outline uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3.5 text-[10px] font-bold font-mono text-outline uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3.5 text-[10px] font-bold font-mono text-outline uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3.5 text-[10px] font-bold font-mono text-outline uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3.5 text-[10px] font-bold font-mono text-outline uppercase tracking-wider">Unidades vendidas</th>
                <th className="px-6 py-3.5 text-[10px] font-bold font-mono text-outline uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredProducts.map((prod) => {
                const isCritical = prod.stock < 5;
                const isEditingPrice = editingPriceId === prod.id;

                return (
                  <tr key={prod.id} className="hover:bg-surface-container-high/20 transition-colors text-sm">
                    <td className="px-6 py-4 font-semibold text-on-surface">{prod.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-surface-container-high text-outline rounded text-xs font-mono">
                        {prod.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono">
                      {isEditingPrice ? (
                        <div className="flex items-center gap-1.5">
                          <input 
                            type="number" 
                            value={tempPrice}
                            onChange={(e) => setTempPrice(parseInt(e.target.value) || 0)}
                            className="w-20 bg-surface-container-low border border-outline border-none rounded px-2 py-0.5 text-xs text-on-surface"
                          />
                          <button 
                            onClick={() => handleSavePrice(prod.id)}
                            className="p-1 bg-primary/20 hover:bg-primary/30 text-primary rounded"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 group">
                          <span className="text-on-surface-variant font-bold">${prod.price.toLocaleString('es-AR')}</span>
                          <button 
                            onClick={() => handleStartEditPrice(prod)}
                            className="p-1 hover:bg-surface-container-high rounded text-outline hover:text-on-surface opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span className={isCritical ? 'text-red-400 font-bold' : 'text-on-surface-variant'}>
                          {prod.stock} u.
                        </span>
                        {isCritical && (
                          <span className="w-2 h-2 bg-red-400 rounded-full animate-ping" title="Bajo stock" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-outline">{prod.salesCount.toLocaleString()} u.</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onRestockProduct(prod.id)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-md text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Abastecer</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Product Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsCreateOpen(false)} />
          <div className="relative bg-surface-container-high micro-border rounded-xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-sans text-lg font-bold text-on-surface flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Registrar nuevo producto
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 hover:bg-surface-container rounded-lg text-outline hover:text-on-surface">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block mb-1">Nombre del artículo *</label>
                <input 
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Auriculares Pro X"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block mb-1">Categoría *</label>
                <input 
                  type="text"
                  required
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Audio"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block mb-1">Precio ($) *</label>
                  <input 
                    type="number"
                    required
                    min={1}
                    value={newPrice || ''}
                    onChange={(e) => setNewPrice(parseInt(e.target.value) || 0)}
                    placeholder="37000"
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-outline font-mono uppercase tracking-wider block mb-1">Stock Inicial *</label>
                  <input 
                    type="number"
                    required
                    min={0}
                    value={newStock || ''}
                    onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                    placeholder="25"
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-primary hover:brightness-110 active:scale-98 text-on-primary font-bold rounded-lg text-sm transition-all shadow-lg shadow-primary/10 mt-6 cursor-pointer"
              >
                Crear artículo
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
