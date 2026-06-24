/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  LayoutDashboard, 
  Banknote, 
  ShoppingCart, 
  Users, 
  Package, 
  BarChart3, 
  TrendingUp, 
  Wallet, 
  Globe, 
  Settings, 
  User,
  Menu,
  X
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  isOpen: boolean;
  onToggleMobile: () => void;
}

export default function Sidebar({ currentTab, onChangeTab, isOpen, onToggleMobile }: SidebarProps) {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ventas', label: 'Ventas', icon: Banknote },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'productos', label: 'Productos', icon: Package },
    { id: 'reportes', label: 'Reportes', icon: BarChart3 },
  ];

  const analysisItems = [
    { id: 'conversion', label: 'Conversión', icon: TrendingUp },
    { id: 'ingresos', label: 'Ingresos', icon: Wallet },
    { id: 'geografia', label: 'Geografía', icon: Globe },
  ];

  const bottomItems = [
    { id: 'ajustes', label: 'Ajustes', icon: Settings },
    { id: 'perfil', label: 'Perfil', icon: User },
  ];

  const renderItem = (item: { id: string; label: string; icon: any }) => {
    const IconComponent = item.icon;
    const isActive = currentTab === item.id;

    return (
      <button
        key={item.id}
        id={`nav-item-${item.id}`}
        onClick={() => {
          onChangeTab(item.id);
          if (isOpen) onToggleMobile(); // close mobile drawer
        }}
        className={`relative w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 group text-left ${
          isActive 
            ? 'text-primary font-semibold bg-surface-container-highest/60' 
            : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/40'
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="active-nav-indicator"
            className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-primary rounded-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <IconComponent className={`w-4 h-4 transition-transform group-hover:scale-105 ${isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-on-surface'}`} />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          id="sidebar-overlay"
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
          onClick={onToggleMobile}
        />
      )}

      {/* Sidebar container */}
      <aside 
        id="sidebar-container"
        className={`fixed left-0 top-0 h-full w-[240px] bg-surface-container-low border-r border-outline-variant/30 z-50 flex flex-col py-6 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Logo */}
        <div className="px-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="font-sans font-black text-on-primary text-base select-none">P</span>
            </div>
            <span className="text-xl font-extrabold text-primary tracking-tighter font-sans">PULSE</span>
          </div>
          
          {/* Mobile close button */}
          <button 
            id="close-sidebar-mobile"
            className="md:hidden p-1.5 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface"
            onClick={onToggleMobile}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-none">
          {mainNavItems.map(renderItem)}

          <div className="pt-5 pb-2 px-3">
            <span className="text-[10px] font-bold tracking-wider text-outline uppercase font-mono">Análisis</span>
          </div>
          
          {analysisItems.map(renderItem)}
        </nav>

        {/* Bottom items */}
        <div className="px-3 mt-auto pt-4 border-t border-outline-variant/20 space-y-1">
          {bottomItems.map(renderItem)}
        </div>
      </aside>
    </>
  );
}
