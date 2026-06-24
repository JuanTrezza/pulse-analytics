/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  Bell, 
  Menu, 
  ChevronDown, 
  Check, 
  Trash2, 
  AlertCircle, 
  Info, 
  CheckCircle2,
  X
} from 'lucide-react';
import { Notification } from '../types';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  selectedRange: 'dia' | 'semana' | 'mes' | 'ano';
  onSelectedRangeChange: (range: 'dia' | 'semana' | 'mes' | 'ano') => void;
  notifications: Notification[];
  onDismissNotification: (id: string) => void;
  onClearAllNotifications: () => void;
  productsList: any[];
  ordersList: any[];
  customersList: any[];
  onNavigateToTab: (tab: string) => void;
}

export default function Header({
  onToggleMobileSidebar,
  searchQuery,
  onSearchQueryChange,
  selectedRange,
  onSelectedRangeChange,
  notifications,
  onDismissNotification,
  onClearAllNotifications,
  productsList,
  ordersList,
  customersList,
  onNavigateToTab
}: HeaderProps) {
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const rangeRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rangeRef.current && !rangeRef.current.contains(event.target as Node)) {
        setIsRangeOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeNotifications = notifications.filter(n => !n.dismissed);

  // Search filter options
  const filteredProducts = searchQuery ? productsList.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3) : [];

  const filteredOrders = searchQuery ? ordersList.filter(o => 
    o.id.includes(searchQuery) || o.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3) : [];

  const filteredCustomers = searchQuery ? customersList.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3) : [];

  const hasSearchResults = filteredProducts.length > 0 || filteredOrders.length > 0 || filteredCustomers.length > 0;

  const rangeLabels = {
    dia: 'Hoy (Día)',
    semana: 'Últimos 7 días',
    mes: 'Últimos 30 días',
    ano: 'Último año'
  };

  return (
    <header 
      id="header-bar"
      className="fixed top-0 right-0 w-full md:w-[calc(100%-240px)] h-16 bg-surface border-b border-outline-variant/30 z-40 flex items-center justify-between px-4 md:px-6"
    >
      {/* Left Search Bar / Mobile Burger */}
      <div className="flex items-center gap-4 flex-1">
        <button 
          id="burger-menu-toggle"
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Interactive Search */}
        <div ref={searchRef} className="relative w-full max-w-xs sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input 
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchQueryChange(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Buscar métricas, pedidos, clientes..."
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg pl-10 pr-10 py-1.5 text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface placeholder:text-outline"
            />
            {searchQuery && (
              <button 
                id="clear-search-query"
                onClick={() => onSearchQueryChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-0.5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Panel */}
          {isSearchFocused && searchQuery && (
            <div 
              id="search-results-dropdown"
              className="absolute left-0 right-0 mt-2 bg-surface-container-high border border-outline-variant/40 rounded-xl shadow-2xl p-4 max-h-[380px] overflow-y-auto z-50 animate-in fade-in-50 slide-in-from-top-1 duration-150"
            >
              {!hasSearchResults ? (
                <div className="text-center py-4 text-on-surface-variant text-sm">
                  No se encontraron resultados para "<span className="font-semibold text-on-surface">{searchQuery}</span>"
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Products Matches */}
                  {filteredProducts.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold text-outline tracking-wider uppercase font-mono mb-2">Productos</h4>
                      <div className="space-y-1">
                        {filteredProducts.map(p => (
                          <button
                            key={p.id}
                            onClick={() => {
                              onNavigateToTab('productos');
                              setIsSearchFocused(false);
                            }}
                            className="w-full text-left p-2 hover:bg-surface-container rounded-lg flex justify-between items-center transition-colors group"
                          >
                            <span className="text-sm text-on-surface group-hover:text-primary transition-colors">{p.name}</span>
                            <span className="text-xs font-mono text-outline">${p.price.toLocaleString('es-AR')}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Orders Matches */}
                  {filteredOrders.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold text-outline tracking-wider uppercase font-mono mb-2">Pedidos</h4>
                      <div className="space-y-1">
                        {filteredOrders.map(o => (
                          <button
                            key={o.id}
                            onClick={() => {
                              onNavigateToTab('pedidos');
                              setIsSearchFocused(false);
                            }}
                            className="w-full text-left p-2 hover:bg-surface-container rounded-lg flex justify-between items-center transition-colors group"
                          >
                            <div>
                              <div className="text-sm font-semibold text-on-surface font-mono group-hover:text-primary transition-colors">{o.id}</div>
                              <div className="text-xs text-outline">{o.clientName}</div>
                            </div>
                            <span className="text-xs font-bold text-on-surface">${o.total.toLocaleString('es-AR')}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Customers Matches */}
                  {filteredCustomers.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold text-outline tracking-wider uppercase font-mono mb-2">Clientes</h4>
                      <div className="space-y-1">
                        {filteredCustomers.map(c => (
                          <button
                            key={c.id}
                            onClick={() => {
                              onNavigateToTab('clientes');
                              setIsSearchFocused(false);
                            }}
                            className="w-full text-left p-2 hover:bg-surface-container rounded-lg flex items-center gap-3 transition-colors group"
                          >
                            <img src={c.avatar} alt={c.name} className="w-6 h-6 rounded-full object-cover" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-on-surface truncate group-hover:text-primary transition-colors">{c.name}</div>
                              <div className="text-xs text-outline truncate">{c.email}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right side widgets */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        {/* Date Filter selector */}
        <div ref={rangeRef} className="relative">
          <button 
            id="date-range-dropdown-trigger"
            onClick={() => setIsRangeOpen(!isRangeOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-on-surface-variant font-mono text-xs hover:bg-surface-container-high rounded-lg border border-outline-variant/20 transition-all select-none"
          >
            <Calendar className="w-3.5 h-3.5 text-outline" />
            <span>{rangeLabels[selectedRange]}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-outline transition-transform duration-200 ${isRangeOpen ? 'rotate-180' : ''}`} />
          </button>

          {isRangeOpen && (
            <div 
              id="date-range-dropdown"
              className="absolute right-0 mt-2 w-48 bg-surface-container-high border border-outline-variant/30 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in-50 slide-in-from-top-1 duration-150"
            >
              {(['dia', 'semana', 'mes', 'ano'] as const).map((r) => (
                <button
                  key={r}
                  id={`range-option-${r}`}
                  onClick={() => {
                    onSelectedRangeChange(r);
                    setIsRangeOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                    selectedRange === r 
                      ? 'bg-primary/10 text-primary font-semibold' 
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span>{rangeLabels[r]}</span>
                  {selectedRange === r && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-6 w-[1px] bg-outline-variant/30 hidden sm:block"></div>

        {/* Notifications Popover */}
        <div ref={notifRef} className="relative">
          <button 
            id="notifications-center-trigger"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {activeNotifications.length > 0 && (
              <span id="notif-badge-count" className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface animate-pulse" />
            )}
          </button>

          {isNotifOpen && (
            <div 
              id="notifications-dropdown-panel"
              className="absolute right-0 mt-2 w-80 bg-surface-container-high border border-outline-variant/40 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in-50 slide-in-from-top-1 duration-150"
            >
              <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low/40">
                <span className="text-xs font-bold font-mono tracking-wider text-on-surface uppercase">Alertas y Notificaciones</span>
                {activeNotifications.length > 0 && (
                  <button 
                    id="clear-all-notifs"
                    onClick={onClearAllNotifications}
                    className="text-[10px] text-outline hover:text-error flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Limpiar todas
                  </button>
                )}
              </div>

              <div className="max-h-[300px] overflow-y-auto divide-y divide-outline-variant/20">
                {activeNotifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-outline italic">
                    No tienes alertas pendientes
                  </div>
                ) : (
                  activeNotifications.map((n) => {
                    const iconMap = {
                      warning: <AlertCircle className="w-4 h-4 text-error" />,
                      info: <Info className="w-4 h-4 text-secondary animate-bounce" />,
                      success: <CheckCircle2 className="w-4 h-4 text-green-400" />
                    };
                    const bgMap = {
                      warning: 'bg-error-container/10 border-error/10',
                      info: 'bg-secondary-container/10 border-secondary/10',
                      success: 'bg-green-500/10 border-green-500/10'
                    };

                    return (
                      <div 
                        key={n.id}
                        id={`notif-item-${n.id}`} 
                        className={`p-3 border-l-2 flex gap-3 group relative ${bgMap[n.type]} ${
                          n.type === 'warning' ? 'border-l-error' : n.type === 'info' ? 'border-l-secondary' : 'border-l-green-400'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">{iconMap[n.type]}</div>
                        <div className="flex-1 min-w-0 pr-4">
                          <h4 className="text-xs font-bold text-on-surface leading-tight">{n.title}</h4>
                          <p className="text-[11px] text-on-surface-variant mt-0.5 leading-normal">{n.message}</p>
                          <span className="text-[9px] text-outline mt-1 block font-mono">{n.date}</span>
                        </div>
                        <button 
                          id={`dismiss-notif-${n.id}`}
                          onClick={() => onDismissNotification(n.id)}
                          className="absolute top-3 right-3 text-outline hover:text-on-surface opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar block */}
        <div 
          id="user-profile-avatar-trigger"
          onClick={() => onNavigateToTab('perfil')}
          className="flex items-center gap-2 cursor-pointer pl-1 hover:brightness-110 active:scale-95 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant/30 overflow-hidden shrink-0">
            <img 
              id="avatar-image-ref"
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop"
              alt="User profile"
            />
          </div>
          <div className="hidden lg:block text-left select-none">
            <div id="user-display-name" className="text-xs font-semibold text-on-surface">Admin Pulse</div>
            <div id="user-display-role" className="text-[9px] text-outline font-mono">SUPER USER</div>
          </div>
        </div>
      </div>
    </header>
  );
}
