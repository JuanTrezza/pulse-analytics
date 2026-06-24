/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import VentasView from './components/VentasView';
import PedidosView from './components/PedidosView';
import ClientesView from './components/ClientesView';
import ProductosView from './components/ProductosView';
import ReportesView from './components/ReportesView';
import AjustesView from './components/AjustesView';
import PerfilView from './components/PerfilView';

import { Order, Product, Customer, Notification } from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_NOTIFICATIONS 
} from './data';

import { Sparkles, X } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [selectedRange, setSelectedRange] = useState<'dia' | 'semana' | 'mes' | 'ano'>('mes');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Core Global States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  // Custom toast notifications
  const [toast, setToast] = useState<string | null>(null);

  // Trigger automated simulation events to make the app feel alive
  useEffect(() => {
    const timer = setTimeout(() => {
      // Add a simulation notification after some delay
      const liveAlert: Notification = {
        id: "sim-1",
        type: "info",
        title: "Nueva venta",
        message: "Lucía Fernández ha iniciado un proceso de compra por un Monitor curvo 34\".",
        date: "Ahora mismo",
        timestamp: new Date().toISOString(),
        dismissed: false
      };
      setNotifications(prev => [liveAlert, ...prev]);
      triggerToast("Simulación: Intención de compra detectada.");
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(prev => prev === msg ? null : prev);
    }, 3500);
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, dismissed: true } : n));
  };

  const handleClearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, dismissed: true })));
    triggerToast("Todas las notificaciones marcadas como leídas.");
  };

  const handleRestockProduct = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const addedStock = 50;
        const finalStock = p.stock + addedStock;
        triggerToast(`Abastecimiento completo: +${addedStock} unidades para ${p.name}.`);
        return { ...p, stock: finalStock };
      }
      return p;
    }));

    // Auto dismiss any stock warnings for this product
    setNotifications(prev => prev.map(n => {
      if (n.title.toLowerCase().includes("stock") && n.message.toLowerCase().includes("auriculares")) {
        return { ...n, dismissed: true };
      }
      return n;
    }));
  };

  const handleUpdateProductPrice = (productId: string, newPrice: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, price: newPrice } : p));
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleAddOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);

    // Check if we need to subtract stock from products
    setProducts(prevProds => prevProds.map(p => {
      if (p.name.toLowerCase() === newOrder.productName.toLowerCase()) {
        const updatedStock = Math.max(0, p.stock - newOrder.quantity);
        
        // If stock falls below 5, raise a new critical stock alert automatically!
        if (updatedStock < 5 && p.stock >= 5) {
          const newAlert: Notification = {
            id: `notif-auto-${Date.now()}`,
            type: "warning",
            title: "Stock crítico",
            message: `${p.name} tiene menos de 5 unidades en almacén.`,
            date: "Hace 1 min",
            timestamp: new Date().toISOString(),
            dismissed: false
          };
          setNotifications(prevNotifs => [newAlert, ...prevNotifs]);
        }
        return { 
          ...p, 
          stock: updatedStock,
          salesCount: p.salesCount + newOrder.quantity,
          revenue: p.revenue + newOrder.total
        };
      }
      return p;
    }));

    // Update customer spending
    setCustomers(prevCusts => {
      const exists = prevCusts.some(c => c.name.toLowerCase() === newOrder.clientName.toLowerCase());
      if (exists) {
        return prevCusts.map(c => {
          if (c.name.toLowerCase() === newOrder.clientName.toLowerCase()) {
            return {
              ...c,
              totalOrders: c.totalOrders + 1,
              totalSpent: c.totalSpent + newOrder.total,
              lastOrderDate: "Hoy, " + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
            };
          }
          return c;
        });
      } else {
        // Create new customer
        const newCust: Customer = {
          id: `cust-${prevCusts.length + 1}`,
          name: newOrder.clientName,
          email: newOrder.clientEmail,
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop",
          totalOrders: 1,
          totalSpent: newOrder.total,
          status: "Nuevo",
          lastOrderDate: "Hoy, " + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
        };
        return [newCust, ...prevCusts];
      }
    });
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: 'Completado' | 'Pendiente' | 'Cancelado') => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    triggerToast(`Pedido ${orderId} actualizado a "${newStatus}".`);
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  // Render current active tab content
  const renderView = () => {
    switch (currentTab) {
      case 'dashboard':
      case 'conversion':
      case 'ingresos':
      case 'geografia':
        return (
          <DashboardView 
            selectedRange={selectedRange}
            onSelectedRangeChange={setSelectedRange}
            products={products}
            orders={orders}
            notifications={notifications}
            onDismissNotification={handleDismissNotification}
            onRestockProduct={handleRestockProduct}
            onNavigateToTab={setCurrentTab}
            onOpenCreateOrderModal={() => {
              setCurrentTab('pedidos');
              // triggers create order modal automatically by selector
              setTimeout(() => {
                const btn = document.getElementById('btn-new-order-modal');
                if (btn) btn.click();
              }, 100);
            }}
            onShowToast={triggerToast}
          />
        );
      case 'ventas':
        return (
          <VentasView 
            orders={orders}
            products={products}
            selectedRange={selectedRange}
          />
        );
      case 'pedidos':
        return (
          <PedidosView 
            orders={orders}
            products={products}
            onAddOrder={handleAddOrder}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onShowToast={triggerToast}
          />
        );
      case 'clientes':
        return (
          <ClientesView 
            customers={customers}
            onShowToast={triggerToast}
          />
        );
      case 'productos':
        return (
          <ProductosView 
            products={products}
            onRestockProduct={handleRestockProduct}
            onUpdateProductPrice={handleUpdateProductPrice}
            onAddProduct={handleAddProduct}
            onShowToast={triggerToast}
          />
        );
      case 'reportes':
        return <ReportesView onShowToast={triggerToast} />;
      case 'ajustes':
        return <AjustesView onShowToast={triggerToast} />;
      case 'perfil':
        return <PerfilView onShowToast={triggerToast} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans antialiased selection:bg-primary/30 selection:text-white">
      {/* Sidebar navigation */}
      <Sidebar 
        currentTab={currentTab} 
        onChangeTab={setCurrentTab} 
        isOpen={mobileSidebarOpen}
        onToggleMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* Main content body panel */}
      <div className="md:ml-[240px] flex flex-col min-h-screen">
        {/* Top Header */}
        <Header 
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          selectedRange={selectedRange}
          onSelectedRangeChange={setSelectedRange}
          notifications={notifications}
          onDismissNotification={handleDismissNotification}
          onClearAllNotifications={handleClearAllNotifications}
          productsList={products}
          ordersList={orders}
          customersList={customers}
          onNavigateToTab={setCurrentTab}
        />

        {/* Dynamic Inner Tab View */}
        <main className="flex-1 pt-20 px-4 md:px-6 pb-12 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto">
            {renderView()}
          </div>
        </main>
      </div>

      {/* Elegant Toast Notifications */}
      {toast && (
        <div 
          id="system-floating-toast"
          className="fixed bottom-6 right-6 z-[120] bg-surface-container-high border border-outline-variant/40 rounded-xl p-4 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-250 min-w-[280px]"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-xs font-semibold text-on-surface leading-snug">{toast}</p>
          </div>
          <button 
            id="close-toast-btn"
            onClick={() => setToast(null)}
            className="text-outline hover:text-on-surface"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
