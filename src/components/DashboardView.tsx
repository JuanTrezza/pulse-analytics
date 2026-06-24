/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Share2, 
  Plus, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  MapPin
} from 'lucide-react';
import { Order, Product, Notification, TrafficSource, ConversionStep, RegionalSales } from '../types';
import { REVENUE_TIMELINE } from '../data';

interface DashboardViewProps {
  selectedRange: 'dia' | 'semana' | 'mes' | 'ano';
  onSelectedRangeChange: (range: 'dia' | 'semana' | 'mes' | 'ano') => void;
  products: Product[];
  orders: Order[];
  notifications: Notification[];
  onDismissNotification: (id: string) => void;
  onRestockProduct: (productId: string) => void;
  onNavigateToTab: (tab: string) => void;
  onOpenCreateOrderModal: () => void;
  onShowToast: (message: string) => void;
}

export default function DashboardView({
  selectedRange,
  onSelectedRangeChange,
  products,
  orders,
  notifications,
  onDismissNotification,
  onRestockProduct,
  onNavigateToTab,
  onOpenCreateOrderModal,
  onShowToast
}: DashboardViewProps) {
  const [orderFilter, setOrderFilter] = useState<'Todos' | 'Pendientes' | 'Completados'>('Todos');
  const [hoveredChartPoint, setHoveredChartPoint] = useState<number | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Dynamic calculations based on selected range
  const timelineData = REVENUE_TIMELINE[selectedRange];
  
  // Calculate total revenue, orders, avg ticket, and conversion rate for selected range
  const currentTotalRevenue = timelineData.reduce((acc, curr) => acc + curr.ingresos, 0);
  const currentTotalOrders = timelineData.reduce((acc, curr) => acc + curr.ordenes, 0);
  const avgTicket = currentTotalOrders > 0 ? currentTotalRevenue / currentTotalOrders : 0;
  
  // Constants for comparative percentage indicators matching reference
  const kpiStats = {
    revenue: {
      val: `$${currentTotalRevenue.toLocaleString('es-AR')}`,
      diff: '+12.4%',
      up: true,
      spark: [40, 35, 50, 45, 60, 55, 70]
    },
    orders: {
      val: currentTotalOrders.toLocaleString('es-AR'),
      diff: '+8.7%',
      up: true,
      spark: [20, 25, 22, 30, 28, 35, 40]
    },
    ticket: {
      val: `$${Math.round(avgTicket).toLocaleString('es-AR')}`,
      diff: '-2.1%',
      up: false,
      spark: [80, 75, 70, 72, 65, 68, 60]
    },
    conversion: {
      val: selectedRange === 'dia' ? '3.15%' : selectedRange === 'semana' ? '3.22%' : '3.42%',
      diff: '+0.8%',
      up: true,
      spark: [10, 12, 11, 15, 14, 16, 18]
    }
  };

  // SVG Area Chart Plot calculations
  const chartHeight = 320;
  const chartWidth = 720;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 45;

  const maxVal = Math.max(...timelineData.map(d => Math.max(d.ingresos, d.previo))) * 1.15;
  const minVal = 0; // consistent zero baseline for analytical precision

  const getCoordinates = (index: number, val: number) => {
    const totalPoints = timelineData.length;
    const x = paddingLeft + (index / (totalPoints - 1)) * (chartWidth - paddingLeft - paddingRight);
    const y = chartHeight - paddingBottom - ((val - minVal) / (maxVal - minVal)) * (chartHeight - paddingTop - paddingBottom);
    return { x, y };
  };

  // Generate SVG paths
  let currentAreaPointsPath = '';
  let currentLinePointsPath = '';
  let previousLinePointsPath = '';

  timelineData.forEach((d, i) => {
    const currCoords = getCoordinates(i, d.ingresos);
    const prevCoords = getCoordinates(i, d.previo);

    if (i === 0) {
      currentLinePointsPath = `M ${currCoords.x} ${currCoords.y}`;
      currentAreaPointsPath = `M ${currCoords.x} ${chartHeight - paddingBottom} L ${currCoords.x} ${currCoords.y}`;
      previousLinePointsPath = `M ${prevCoords.x} ${prevCoords.y}`;
    } else {
      currentLinePointsPath += ` L ${currCoords.x} ${currCoords.y}`;
      currentAreaPointsPath += ` L ${currCoords.x} ${currCoords.y}`;
      previousLinePointsPath += ` L ${prevCoords.x} ${prevCoords.y}`;
    }

    if (i === timelineData.length - 1) {
      currentAreaPointsPath += ` L ${currCoords.x} ${chartHeight - paddingBottom} Z`;
    }
  });

  // Sparkline coordinates helper
  const drawSparkline = (data: number[]) => {
    const width = 120;
    const height = 40;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    return data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Filtered orders for table
  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'Todos') return true;
    return o.status === orderFilter;
  }).slice(0, 5); // limit to 5 on dashboard as per reference

  // Donut chart circles calculation helper
  const trafficData = [
    { name: 'Orgánica', value: 38, color: '#d0bcff' },
    { name: 'Social', value: 24, color: '#adc6ff' },
    { name: 'Directo', value: 18, color: '#37333d' },
    { name: 'Referidos', value: 12, color: '#ffb869' },
    { name: 'Otros', value: 8, color: '#494454' }
  ];

  const totalTrafficVisits = 48392;

  // Handles export PDF simulation
  const handleExportPDF = () => {
    setIsExportModalOpen(true);
    setIsExporting(true);
    setExportProgress(10);
    
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
            setIsExportModalOpen(false);
            onShowToast("Reporte PDF descargado con éxito!");
          }, 600);
          return 100;
        }
        return prev + 15;
      });
    }, 200);
  };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      onShowToast("Enlace de compartir copiado al portapapeles!");
    } catch {
      onShowToast("Enlace de compartir: " + window.location.href);
    }
  };

  // Regions lists for geographic representation
  const regionBreakdown = [
    { name: "CABA", percentage: 45.2, active: true },
    { name: "Buenos Aires (GBA)", percentage: 28.4, active: true },
    { name: "Córdoba", percentage: 11.1, active: false },
    { name: "Santa Fe", percentage: 8.3, active: false },
    { name: "Mendoza", percentage: 4.2, active: false }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-sans text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">Dashboard general</h1>
          <p className="text-on-surface-variant text-sm font-sans mt-1">Resumen de tu tienda — Periodo de análisis activo.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            id="export-pdf-btn"
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3.5 py-2 border border-outline-variant/30 rounded-lg text-xs font-semibold hover:bg-surface-container-high/60 transition-all active:scale-95 text-on-surface cursor-pointer"
          >
            <FileText className="w-4 h-4 text-outline" />
            <span>Exportar PDF</span>
          </button>
          <button 
            id="share-dashboard-btn"
            onClick={handleShare}
            className="flex items-center gap-2 px-3.5 py-2 border border-outline-variant/30 rounded-lg text-xs font-semibold hover:bg-surface-container-high/60 transition-all active:scale-95 text-on-surface cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-outline" />
            <span>Compartir</span>
          </button>
          <button 
            id="create-report-btn"
            onClick={onOpenCreateOrderModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold shadow-lg shadow-primary/10 hover:brightness-110 hover:shadow-primary/25 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear pedido</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="bg-surface-container micro-border rounded-xl p-4 flex flex-col justify-between hover:border-primary/25 transition-all group duration-350">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] font-bold text-outline uppercase tracking-wider">INGRESOS TOTALES</span>
            <span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 rounded-md text-[10px] font-bold">
              {kpiStats.revenue.diff}
            </span>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight font-sans">
              {kpiStats.revenue.val}
            </h2>
            <p className="text-[10px] text-outline mt-0.5 font-sans italic">vs mes anterior</p>
          </div>
          <div className="h-10 w-full mt-4">
            <svg className="w-full h-full" viewBox="0 0 120 40" preserveAspectRatio="none">
              <path 
                d={drawSparkline(kpiStats.revenue.spark)} 
                fill="none" 
                stroke="#d0bcff" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Orders */}
        <div className="bg-surface-container micro-border rounded-xl p-4 flex flex-col justify-between hover:border-primary/25 transition-all group duration-350">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] font-bold text-outline uppercase tracking-wider">ÓRDENES</span>
            <span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 rounded-md text-[10px] font-bold">
              {kpiStats.orders.diff}
            </span>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight font-sans font-mono">
              {kpiStats.orders.val}
            </h2>
            <p className="text-[10px] text-outline mt-0.5 font-sans italic">vs mes anterior</p>
          </div>
          <div className="h-10 w-full mt-4">
            <svg className="w-full h-full" viewBox="0 0 120 40" preserveAspectRatio="none">
              <path 
                d={drawSparkline(kpiStats.orders.spark)} 
                fill="none" 
                stroke="#d0bcff" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Average Ticket */}
        <div className="bg-surface-container micro-border rounded-xl p-4 flex flex-col justify-between hover:border-primary/25 transition-all group duration-350">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] font-bold text-outline uppercase tracking-wider">TICKET PROMEDIO</span>
            <span className="px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded-md text-[10px] font-bold font-sans">
              {kpiStats.ticket.diff}
            </span>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight font-sans">
              {kpiStats.ticket.val}
            </h2>
            <p className="text-[10px] text-outline mt-0.5 font-sans italic">vs mes anterior</p>
          </div>
          <div className="h-10 w-full mt-4">
            <svg className="w-full h-full" viewBox="0 0 120 40" preserveAspectRatio="none">
              <path 
                d={drawSparkline(kpiStats.ticket.spark)} 
                fill="none" 
                stroke="#ffb4ab" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Conversion Rate */}
        <div className="bg-surface-container micro-border rounded-xl p-4 flex flex-col justify-between hover:border-primary/25 transition-all group duration-350">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] font-bold text-outline uppercase tracking-wider">TASA DE CONVERSIÓN</span>
            <span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 rounded-md text-[10px] font-bold">
              {kpiStats.conversion.diff}
            </span>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight font-mono">
              {kpiStats.conversion.val}
            </h2>
            <p className="text-[10px] text-outline mt-0.5 font-sans italic">vs mes anterior</p>
          </div>
          <div className="h-10 w-full mt-4">
            <svg className="w-full h-full" viewBox="0 0 120 40" preserveAspectRatio="none">
              <path 
                d={drawSparkline(kpiStats.conversion.spark)} 
                fill="none" 
                stroke="#d0bcff" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Revenue Over Time Area Chart */}
      <div className="bg-surface-container micro-border rounded-xl p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-sans text-lg font-bold text-on-surface">Ingresos por día</h3>
            <p className="text-on-surface-variant text-xs font-sans">Distribución de facturación en el período actual.</p>
          </div>
          <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/30 select-none">
            {(['dia', 'semana', 'mes', 'ano'] as const).map(tab => (
              <button
                key={tab}
                id={`chart-tab-${tab}`}
                onClick={() => onSelectedRangeChange(tab)}
                className={`px-3 py-1 font-mono text-xs rounded-md transition-colors capitalize cursor-pointer ${
                  selectedRange === tab 
                    ? 'bg-primary text-on-primary font-semibold shadow-sm' 
                    : 'text-outline hover:text-on-surface hover:bg-surface-container-high/40'
                }`}
              >
                {tab === 'dia' ? 'Día' : tab === 'semana' ? 'Semana' : tab === 'mes' ? 'Mes' : 'Año'}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Responsive SVG Plot */}
        <div className="relative w-full overflow-x-auto overflow-y-hidden scrollbar-none">
          <div className="min-w-[640px] h-[340px] relative">
            <svg 
              className="w-full h-full" 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              onMouseLeave={() => setHoveredChartPoint(null)}
            >
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d0bcff" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#d0bcff" stopOpacity="0.00"/>
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const y = paddingTop + ratio * (chartHeight - paddingTop - paddingBottom);
                const gridValue = Math.round(maxVal - ratio * (maxVal - minVal));
                return (
                  <g key={index}>
                    <line 
                      x1={paddingLeft} 
                      y1={y} 
                      x2={chartWidth - paddingRight} 
                      y2={y} 
                      stroke="rgba(255, 255, 255, 0.04)" 
                      strokeDasharray="3 3"
                    />
                    <text 
                      x={paddingLeft - 8} 
                      y={y + 4} 
                      fill="#958ea0" 
                      fontSize="9" 
                      fontFamily="JetBrains Mono" 
                      textAnchor="end"
                    >
                      ${Math.round(gridValue / 1000)}k
                    </text>
                  </g>
                );
              })}

              {/* Comparing Month (dashed line) */}
              <path 
                d={previousLinePointsPath} 
                fill="none" 
                stroke="#494454" 
                strokeWidth="1.5" 
                strokeDasharray="4 4" 
              />

              {/* Filled Area Gradient */}
              <path 
                d={currentAreaPointsPath} 
                fill="url(#purpleGradient)" 
              />

              {/* Main Line */}
              <path 
                d={currentLinePointsPath} 
                fill="none" 
                stroke="#d0bcff" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* X Axis Labels */}
              {timelineData.map((d, i) => {
                const coords = getCoordinates(i, d.ingresos);
                
                // Only show readable intervals to prevent crowding
                const showLabel = 
                  selectedRange === 'dia' ? i % 1 === 0 :
                  selectedRange === 'semana' ? true :
                  selectedRange === 'mes' ? true : true;

                return (
                  <g key={i}>
                    {showLabel && (
                      <text 
                        x={coords.x} 
                        y={chartHeight - 12} 
                        fill="#958ea0" 
                        fontSize="9" 
                        fontFamily="Inter" 
                        textAnchor="middle"
                      >
                        {d.label}
                      </text>
                    )}

                    {/* Interactive hover hotzone for each point */}
                    <circle 
                      cx={coords.x} 
                      cy={coords.y} 
                      r="16" 
                      fill="transparent" 
                      className="cursor-crosshair"
                      onMouseEnter={() => setHoveredChartPoint(i)}
                    />

                    {/* Anchor dots on line hover */}
                    {hoveredChartPoint === i && (
                      <>
                        <line 
                          x1={coords.x} 
                          y1={paddingTop} 
                          x2={coords.x} 
                          y2={chartHeight - paddingBottom} 
                          stroke="rgba(208, 188, 255, 0.25)" 
                          strokeWidth="1"
                        />
                        <circle 
                          cx={coords.x} 
                          cy={coords.y} 
                          r="5" 
                          fill="#d0bcff" 
                          stroke="#15121b" 
                          strokeWidth="2" 
                        />
                      </>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Custom Floating Tooltip */}
            {hoveredChartPoint !== null && timelineData[hoveredChartPoint] && (
              <div 
                className="absolute bg-surface-container-high border border-outline-variant/40 p-3 rounded-lg shadow-2xl z-20 pointer-events-none transition-all duration-75"
                style={{
                  left: `${getCoordinates(hoveredChartPoint, timelineData[hoveredChartPoint].ingresos).x + 10}px`,
                  top: `${Math.min(180, getCoordinates(hoveredChartPoint, timelineData[hoveredChartPoint].ingresos).y - 60)}px`
                }}
              >
                <div className="text-[10px] font-bold font-mono text-outline uppercase mb-1">
                  {timelineData[hoveredChartPoint].label}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-4 justify-between">
                    <span className="text-xs text-on-surface-variant font-sans">Actual:</span>
                    <span className="text-xs font-bold text-primary font-mono">
                      ${timelineData[hoveredChartPoint].ingresos.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 justify-between">
                    <span className="text-xs text-on-surface-variant font-sans">Previo:</span>
                    <span className="text-xs font-semibold text-outline font-mono">
                      ${timelineData[hoveredChartPoint].previo.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Top Products & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top selling products */}
        <div className="bg-surface-container micro-border rounded-xl p-5 md:p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-sans text-lg font-bold text-on-surface mb-1">Productos más vendidos</h3>
            <p className="text-on-surface-variant text-xs font-sans mb-6">Artículos más destacados por facturación.</p>
          </div>
          <div className="space-y-4">
            {products.slice(0, 6).map((prod) => {
              // Calculate sales scale
              const maxUnits = Math.max(...products.map(p => p.salesCount));
              const percentage = maxUnits > 0 ? (prod.salesCount / maxUnits) * 100 : 0;
              
              // Formatting display
              const revenueLabel = prod.revenue >= 1000000 
                ? `$${(prod.revenue / 1000000).toFixed(1)}M` 
                : `$${(prod.revenue / 1000).toFixed(0)}k`;

              return (
                <div key={prod.id} className="space-y-1.5 group cursor-pointer" onClick={() => onNavigateToTab('productos')}>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-on-surface group-hover:text-primary transition-colors">{prod.name}</span>
                    <span className="text-outline text-xs font-mono">
                      {prod.salesCount.toLocaleString('es-AR')} u. — {revenueLabel}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500 group-hover:brightness-110" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Traffic Sources Donut Chart */}
        <div className="bg-surface-container micro-border rounded-xl p-5 md:p-6 flex flex-col">
          <h3 className="font-sans text-lg font-bold text-on-surface mb-1">Fuentes de tráfico</h3>
          <p className="text-on-surface-variant text-xs font-sans mb-6">Origen de las visitas y conversiones.</p>
          
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Custom SVG Donut Chart */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="rgba(255,255,255,0.02)" strokeWidth="10" />
                
                {/* Render cumulative rings */}
                {(() => {
                  let accumulatedPercent = 0;
                  return trafficData.map((source, idx) => {
                    const radius = 38;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDash = (source.value / 100) * circumference;
                    const strokeOffset = circumference - (accumulatedPercent / 100) * circumference;
                    accumulatedPercent += source.value;

                    return (
                      <circle
                        key={idx}
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke={source.color}
                        strokeWidth="10"
                        strokeDasharray={`${strokeDash} ${circumference}`}
                        strokeDashoffset={strokeOffset}
                        strokeLinecap="butt"
                        className="transition-all duration-300 hover:scale-105 cursor-pointer"
                        style={{ transformOrigin: 'center' }}
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl md:text-3xl font-extrabold text-on-surface font-mono">{totalTrafficVisits.toLocaleString('es-AR')}</span>
                <span className="text-[10px] text-outline font-bold uppercase tracking-widest font-sans mt-0.5">Visitas</span>
              </div>
            </div>

            {/* Labels breakout */}
            <div className="grid grid-cols-2 gap-3 shrink-0">
              {trafficData.map((source, idx) => (
                <div key={idx} className="flex flex-col p-2 bg-surface-container-low/40 rounded-lg border border-outline-variant/20 min-w-[90px]">
                  <span className="flex items-center gap-1.5 text-[11px] text-outline font-sans">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: source.color }} />
                    {source.name}
                  </span>
                  <span className="font-extrabold text-sm text-on-surface mt-1 font-mono">{source.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Orders & Customer Segments */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders table */}
        <div className="xl:col-span-2 bg-surface-container micro-border rounded-xl overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 md:p-6 border-b border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-low/20">
              <div>
                <h3 className="font-sans text-lg font-bold text-on-surface">Pedidos recientes</h3>
                <p className="text-on-surface-variant text-xs font-sans mt-0.5">Últimas transacciones registradas.</p>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-container-high/40 p-1 rounded-lg border border-outline-variant/20 select-none">
                {(['Todos', 'Pendientes', 'Completados'] as const).map(statusTab => (
                  <button
                    key={statusTab}
                    onClick={() => setOrderFilter(statusTab)}
                    className={`px-3 py-1 font-mono text-[11px] rounded-md transition-colors cursor-pointer ${
                      orderFilter === statusTab 
                        ? 'bg-surface-container-highest text-on-surface font-semibold' 
                        : 'text-outline hover:text-on-surface'
                    }`}
                  >
                    {statusTab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/30 bg-surface-container-low/30">
                    <th className="px-6 py-3 text-[10px] font-bold font-mono text-outline uppercase tracking-wider">ID Pedido</th>
                    <th className="px-6 py-3 text-[10px] font-bold font-mono text-outline uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-[10px] font-bold font-mono text-outline uppercase tracking-wider">Producto</th>
                    <th className="px-6 py-3 text-[10px] font-bold font-mono text-outline uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-[10px] font-bold font-mono text-outline uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-[10px] font-bold font-mono text-outline uppercase tracking-wider">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-xs text-outline italic">
                        No hay pedidos en este segmento
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr 
                        key={order.id} 
                        id={`dashboard-order-${order.id}`}
                        onClick={() => onNavigateToTab('pedidos')}
                        className="hover:bg-surface-container-high/50 transition-colors group cursor-pointer text-sm"
                      >
                        <td className="px-6 py-3.5 font-mono text-xs font-semibold text-primary">{order.id}</td>
                        <td className="px-6 py-3.5 font-medium text-on-surface">{order.clientName}</td>
                        <td className="px-6 py-3.5 text-on-surface-variant">{order.productName}</td>
                        <td className="px-6 py-3.5 font-bold text-on-surface font-mono">${order.total.toLocaleString('es-AR')}</td>
                        <td className="px-6 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-sans ${
                            order.status === 'Completado' 
                              ? 'bg-green-500/10 text-green-400' 
                              : order.status === 'Pendiente'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-outline text-xs">{order.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="p-4 border-t border-outline-variant/25 text-center bg-surface-container-low/10">
            <button 
              id="view-all-orders-dashboard"
              onClick={() => onNavigateToTab('pedidos')}
              className="text-primary font-bold text-xs hover:underline flex items-center gap-1.5 justify-center mx-auto cursor-pointer"
            >
              <span>Ver todos los pedidos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Client segments donut */}
        <div className="bg-surface-container micro-border rounded-xl p-5 md:p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-sans text-lg font-bold text-on-surface mb-1">Segmentos de clientes</h3>
            <p className="text-on-surface-variant text-xs font-sans mb-6">Composición y lealtad de la cartera.</p>
          </div>
          
          <div className="flex-1 flex items-center justify-center py-4">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="rgba(255,255,255,0.02)" strokeWidth="10" />
                
                {/* 41% VIP Recurrentes, 32% Nuevos, 27% Otros */}
                <circle 
                  cx="50" cy="50" r="38" fill="transparent" 
                  stroke="#d0bcff" strokeWidth="10" 
                  strokeDasharray="98 238" strokeDashoffset="0" 
                />
                <circle 
                  cx="50" cy="50" r="38" fill="transparent" 
                  stroke="#0566d9" strokeWidth="10" 
                  strokeDasharray="76 238" strokeDashoffset="-98" 
                />
                <circle 
                  cx="50" cy="50" r="38" fill="transparent" 
                  stroke="#ffb869" strokeWidth="10" 
                  strokeDasharray="64 238" strokeDashoffset="-174" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold font-mono text-on-surface">41%</span>
                <span className="text-[9px] text-outline font-bold uppercase tracking-wider font-sans mt-0.5">Recurrentes</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between p-2.5 bg-surface-container-low/50 rounded-lg border border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="text-xs font-medium text-on-surface">Clientes Recurrentes</span>
              </div>
              <span className="font-bold text-xs font-mono">41%</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-surface-container-low/50 rounded-lg border border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
                <span className="text-xs font-medium text-on-surface">Clientes Nuevos</span>
              </div>
              <span className="font-bold text-xs font-mono">32%</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-surface-container-low/50 rounded-lg border border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                <span className="text-xs font-medium text-on-surface">Clientes VIP</span>
              </div>
              <span className="font-bold text-xs font-mono">27%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Regional Sales, Conversion Funnel, Alerts feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
        {/* Sales by Region */}
        <div className="bg-surface-container micro-border rounded-xl p-5 md:p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-sans text-lg font-bold text-on-surface mb-1">Ventas por región</h3>
            <p className="text-on-surface-variant text-xs font-sans mb-4">Ubicación geográfica de pedidos.</p>
          </div>

          {/* Interactive Geographic Representation */}
          <div className="relative h-44 bg-surface-container-low rounded-lg border border-outline-variant/20 mb-4 flex items-center justify-center overflow-hidden">
            <div 
              className="absolute top-3 right-3 bg-surface-container-highest/80 backdrop-blur-md px-2 py-1 rounded border border-outline-variant/30 text-[10px] font-mono"
            >
              Argentina: Activa
            </div>

            {/* Custom SVG Vector Abstract Representing Southern Cone regions */}
            <svg className="w-32 h-40 opacity-40 hover:opacity-100 transition-opacity" viewBox="0 0 100 150">
              <g stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" fill="rgba(258, 255, 255, 0.02)">
                {/* Abstract shape representing Northern Argentina */}
                <path 
                  d="M 30 10 L 70 15 L 80 40 L 50 50 L 30 35 Z" 
                  className="hover:fill-primary/20 cursor-pointer transition-colors"
                  onMouseEnter={() => setHoveredRegion("Norte")}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
                {/* Abstract shape representing Central Argentina / Buenos Aires / CABA */}
                <path 
                  d="M 30 35 L 50 50 L 80 40 L 75 80 L 45 90 L 25 60 Z" 
                  className="hover:fill-primary/40 cursor-pointer transition-colors fill-primary/10"
                  onMouseEnter={() => setHoveredRegion("CABA / Buenos Aires")}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
                {/* Abstract shape representing Patagonia */}
                <path 
                  d="M 25 60 L 45 90 L 35 140 L 20 145 L 15 100 Z" 
                  className="hover:fill-primary/20 cursor-pointer transition-colors"
                  onMouseEnter={() => setHoveredRegion("Patagonia")}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
              </g>
            </svg>
            
            {/* Hover overlay text */}
            {hoveredRegion && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-surface-container-high border border-outline-variant/40 px-2 py-0.5 rounded text-[10px] font-mono text-primary font-semibold">
                {hoveredRegion}
              </div>
            )}
          </div>

          <div className="space-y-2">
            {regionBreakdown.map((reg, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant flex items-center gap-1.5 font-sans">
                  <MapPin className="w-3.5 h-3.5 text-outline" />
                  {reg.name}
                </span>
                <span className="font-bold font-mono text-on-surface">{reg.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-surface-container micro-border rounded-xl p-5 md:p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-sans text-lg font-bold text-on-surface mb-1">Embudo de conversión</h3>
            <p className="text-on-surface-variant text-xs font-sans mb-6">Eficiencia de compra y embudo.</p>
          </div>

          <div className="space-y-3.5 flex-1 flex flex-col justify-center">
            {/* Steps with descending width & opacity */}
            <div className="relative">
              <div className="h-10 bg-primary/20 border-l-4 border-primary rounded-r-lg flex items-center px-4 justify-between">
                <span className="text-xs font-bold text-on-surface">Visitantes</span>
                <span className="font-mono text-xs text-on-surface-variant">124.5k</span>
              </div>
            </div>
            <div className="relative ml-4">
              <div className="h-10 bg-primary/15 border-l-4 border-primary/70 rounded-r-lg flex items-center px-4 justify-between">
                <span className="text-xs font-bold text-on-surface">Vieron producto</span>
                <span className="font-mono text-xs text-on-surface-variant">82.1k</span>
              </div>
            </div>
            <div className="relative ml-10">
              <div className="h-10 bg-primary/10 border-l-4 border-primary/50 rounded-r-lg flex items-center px-4 justify-between">
                <span className="text-xs font-bold text-on-surface">Carrito</span>
                <span className="font-mono text-xs text-on-surface-variant">24.2k</span>
              </div>
            </div>
            <div className="relative ml-16">
              <div className="h-10 bg-primary/5 border-l-4 border-primary/30 rounded-r-lg flex items-center px-4 justify-between">
                <span className="text-xs font-bold text-on-surface">Compra</span>
                <span className="font-mono text-xs text-on-surface-variant">1.4k</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alertas & Notificaciones inside Dashboard */}
        <div className="bg-surface-container micro-border rounded-xl p-5 md:p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-sans text-lg font-bold text-on-surface mb-1">Alertas y notificaciones</h3>
            <p className="text-on-surface-variant text-xs font-sans mb-5">Estado e incidencias críticas del sistema.</p>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-start overflow-y-auto max-h-[220px] scrollbar-none pr-0.5">
            {notifications.filter(n => !n.dismissed).map((n) => (
              <div 
                key={n.id} 
                className="p-3 bg-error-container/10 border border-error/20 rounded-lg flex gap-3 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="w-8 h-8 rounded-full bg-error/25 flex items-center justify-center text-error shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-xs text-error truncate">{n.title}</h4>
                    <span className="text-[9px] text-outline font-mono whitespace-nowrap">{n.date}</span>
                  </div>
                  <p className="text-[11px] text-on-error-container mt-0.5 leading-tight">{n.message}</p>
                  
                  {/* Action button inside critical notification */}
                  {n.title.toLowerCase().includes("stock") && (
                    <button 
                      id="restock-notification-action-btn"
                      onClick={() => onRestockProduct("prod-1")}
                      className="mt-2.5 px-2.5 py-1 bg-error/20 hover:bg-error/30 text-error rounded text-[10px] font-semibold transition-all active:scale-95 cursor-pointer"
                    >
                      Reabastecer stock
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Simulation Modal Overlay */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setIsExportModalOpen(false)} />
          <div className="relative bg-surface-container-high micro-border rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-sans text-lg font-bold text-on-surface flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Generando reporte
              </h3>
            </div>
            <p className="text-sm text-on-surface-variant mb-6 font-sans">
              Compilando transacciones recientes, gráficos de facturación y métricas de rendimiento...
            </p>
            
            {/* Progress loading bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-outline">Exportando PDF...</span>
                <span className="text-primary font-bold">{exportProgress}%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden border border-outline-variant/10">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-150"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
