/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Order, Product, Customer, Notification, TrafficSource, ConversionStep, RegionalSales } from './types';

// Initial Products Data
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Auriculares Pro X",
    category: "Audio",
    price: 37000,
    stock: 4, // Trigger stock warning (< 5)
    salesCount: 1240,
    revenue: 45900000
  },
  {
    id: "prod-2",
    name: "Notebook Gaming Z2",
    category: "Computadoras",
    price: 1200000,
    stock: 15,
    salesCount: 850,
    revenue: 1020000000
  },
  {
    id: "prod-3",
    name: "Cámara 4K Vlog",
    category: "Fotografía",
    price: 280000,
    stock: 22,
    salesCount: 620,
    revenue: 173600000
  },
  {
    id: "prod-4",
    name: "Teclado Mecánico RGB",
    category: "Accesorios",
    price: 92000,
    stock: 8,
    salesCount: 580,
    revenue: 53360000
  },
  {
    id: "prod-5",
    name: "Monitor curvo 34\"",
    category: "Monitores",
    price: 340000,
    stock: 12,
    salesCount: 410,
    revenue: 139400000
  },
  {
    id: "prod-6",
    name: "Mouse Inalámbrico",
    category: "Accesorios",
    price: 25000,
    stock: 50,
    salesCount: 390,
    revenue: 9750000
  }
];

// Initial Orders Data
export const INITIAL_ORDERS: Order[] = [
  {
    id: "#94821",
    clientName: "Mateo Rossi",
    clientEmail: "mateo.rossi@example.com",
    productName: "Auriculares Pro X",
    total: 45900,
    status: "Completado",
    date: "Hoy, 14:20",
    timestamp: "2026-06-24T14:20:00Z",
    quantity: 1
  },
  {
    id: "#94819",
    clientName: "Lucía Fernández",
    clientEmail: "lucia.f@example.com",
    productName: "Notebook Gaming Z2",
    total: 1200000,
    status: "Pendiente",
    date: "Hoy, 12:45",
    timestamp: "2026-06-24T12:45:00Z",
    quantity: 1
  },
  {
    id: "#94818",
    clientName: "Alejandro Gómez",
    clientEmail: "alejandro.g@example.com",
    productName: "Cámara 4K Vlog",
    total: 280000,
    status: "Completado",
    date: "Ayer, 18:30",
    timestamp: "2026-06-23T18:30:00Z",
    quantity: 1
  },
  {
    id: "#94817",
    clientName: "Sofía Pérez",
    clientEmail: "sofia.p@example.com",
    productName: "Teclado Mecánico RGB",
    total: 92000,
    status: "Completado",
    date: "Ayer, 15:15",
    timestamp: "2026-06-23T15:15:00Z",
    quantity: 1
  },
  {
    id: "#94816",
    clientName: "Martín Díaz",
    clientEmail: "martin.diaz@example.com",
    productName: "Mouse Inalámbrico",
    total: 25000,
    status: "Cancelado",
    date: "Ayer, 11:00",
    timestamp: "2026-06-23T11:00:00Z",
    quantity: 1
  },
  {
    id: "#94815",
    clientName: "Valentina Romero",
    clientEmail: "valen.romero@example.com",
    productName: "Monitor curvo 34\"",
    total: 340000,
    status: "Completado",
    date: "22 Jun, 16:45",
    timestamp: "2026-06-22T16:45:00Z",
    quantity: 1
  },
  {
    id: "#94814",
    clientName: "Bruno Silva",
    clientEmail: "bruno.silva@example.com",
    productName: "Auriculares Pro X",
    total: 45900,
    status: "Completado",
    date: "22 Jun, 09:10",
    timestamp: "2026-06-22T09:10:00Z",
    quantity: 1
  },
  {
    id: "#94813",
    clientName: "Clara Méndez",
    clientEmail: "clara.mendez@example.com",
    productName: "Notebook Gaming Z2",
    total: 1200000,
    status: "Completado",
    date: "21 Jun, 14:20",
    timestamp: "2026-06-21T14:20:00Z",
    quantity: 1
  }
];

// Initial Customers Data
export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    name: "Mateo Rossi",
    email: "mateo.rossi@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop",
    totalOrders: 8,
    totalSpent: 367200,
    status: "VIP",
    lastOrderDate: "Hoy, 14:20"
  },
  {
    id: "cust-2",
    name: "Lucía Fernández",
    email: "lucia.f@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop",
    totalOrders: 3,
    totalSpent: 3600000,
    status: "Recurrente",
    lastOrderDate: "Hoy, 12:45"
  },
  {
    id: "cust-3",
    name: "Alejandro Gómez",
    email: "alejandro.g@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop",
    totalOrders: 12,
    totalSpent: 3360000,
    status: "VIP",
    lastOrderDate: "Ayer, 18:30"
  },
  {
    id: "cust-4",
    name: "Sofía Pérez",
    email: "sofia.p@example.com",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=250&auto=format&fit=crop",
    totalOrders: 1,
    totalSpent: 92000,
    status: "Nuevo",
    lastOrderDate: "Ayer, 15:15"
  },
  {
    id: "cust-5",
    name: "Martín Díaz",
    email: "martin.diaz@example.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop",
    totalOrders: 2,
    totalSpent: 50000,
    status: "Recurrente",
    lastOrderDate: "Ayer, 11:00"
  },
  {
    id: "cust-6",
    name: "Valentina Romero",
    email: "valen.romero@example.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250&auto=format&fit=crop",
    totalOrders: 5,
    totalSpent: 1700000,
    status: "VIP",
    lastOrderDate: "22 Jun, 16:45"
  }
];

// Traffic Sources
export const TRAFFIC_SOURCES: TrafficSource[] = [
  { name: "Orgánica", percentage: 38, visits: 18388, color: "#d0bcff" },
  { name: "Social", percentage: 24, visits: 11614, color: "#adc6ff" },
  { name: "Directo", percentage: 18, visits: 8710, color: "#37333d" },
  { name: "Referidos", percentage: 12, visits: 5807, color: "#ffb869" },
  { name: "Otros", percentage: 8, visits: 3873, color: "#494454" }
];

// Regional Sales
export const REGIONAL_SALES: RegionalSales[] = [
  { region: "CABA", percentage: 45.2, sales: 1287021 },
  { region: "Buenos Aires (GBA)", percentage: 28.4, sales: 808659 },
  { region: "Córdoba", percentage: 11.1, sales: 316060 },
  { region: "Santa Fe", percentage: 8.3, sales: 236333 },
  { region: "Mendoza", percentage: 4.2, sales: 119590 },
  { region: "Otras regiones", percentage: 2.8, sales: 79729 }
];

// Conversion Steps
export const CONVERSION_STEPS: ConversionStep[] = [
  { name: "Visitantes", value: 124500, percentage: 100 },
  { name: "Vieron producto", value: 82100, percentage: 65.9 },
  { name: "Carrito", value: 24200, percentage: 19.4 },
  { name: "Compra", value: 1400, percentage: 1.1 }
];

// Initial Notifications Data
export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "not-1",
    type: "warning",
    title: "Stock crítico",
    message: "Auriculares Pro X tiene menos de 5 unidades en almacén.",
    date: "Hace 12 min",
    timestamp: "2026-06-24T14:45:00Z",
    dismissed: false
  },
  {
    id: "not-2",
    type: "success",
    title: "Servidor operativo",
    message: "Sincronización con pasarela de pagos restablecida con éxito.",
    date: "Hace 2 horas",
    timestamp: "2026-06-24T12:57:00Z",
    dismissed: false
  },
  {
    id: "not-3",
    type: "info",
    title: "Campaña de Marketing",
    message: "Nuevo pico de tráfico detectado por anuncio de Instagram.",
    date: "Ayer, 16:30",
    timestamp: "2026-06-23T16:30:00Z",
    dismissed: false
  }
];

// Revenue over time (For interactive charts)
// Generates rich structured dynamic historical lines
export const REVENUE_TIMELINE = {
  semana: [
    { label: "Lunes", ingresos: 210000, previo: 195000, ordenes: 92 },
    { label: "Martes", ingresos: 290000, previo: 240000, ordenes: 121 },
    { label: "Miércoles", ingresos: 410000, previo: 380000, ordenes: 180 },
    { label: "Jueves", ingresos: 320000, previo: 350000, ordenes: 145 },
    { label: "Viernes", ingresos: 580000, previo: 420000, ordenes: 230 },
    { label: "Sábado", ingresos: 620000, previo: 500000, ordenes: 250 },
    { label: "Domingo", ingresos: 417392, previo: 380000, ordenes: 165 }
  ],
  dia: [
    { label: "00:00", ingresos: 24000, previo: 18000, ordenes: 12 },
    { label: "04:00", ingresos: 12000, previo: 15000, ordenes: 5 },
    { label: "08:00", ingresos: 45000, previo: 32000, ordenes: 20 },
    { label: "12:00", ingresos: 120000, previo: 95000, ordenes: 65 },
    { label: "16:00", ingresos: 140000, previo: 110000, ordenes: 78 },
    { label: "20:00", ingresos: 110000, previo: 130000, ordenes: 52 },
    { label: "23:59", ingresos: 65000, previo: 45000, ordenes: 30 }
  ],
  mes: [
    { label: "Semana 1", ingresos: 650000, previo: 600000, ordenes: 310 },
    { label: "Semana 2", ingresos: 720000, previo: 680000, ordenes: 345 },
    { label: "Semana 3", ingresos: 690000, previo: 750000, ordenes: 330 },
    { label: "Semana 4", ingresos: 787392, previo: 710000, ordenes: 395 }
  ],
  ano: [
    { label: "Ene", ingresos: 1800000, previo: 1500000, ordenes: 820 },
    { label: "Feb", ingresos: 2100000, previo: 1700000, ordenes: 980 },
    { label: "Mar", ingresos: 2400000, previo: 2100000, ordenes: 1100 },
    { label: "Abr", ingresos: 2200000, previo: 2300000, ordenes: 1050 },
    { label: "May", ingresos: 2847392, previo: 2500000, ordenes: 1428 },
    { label: "Jun", ingresos: 3100000, previo: 2700000, ordenes: 1550 }
  ]
};
