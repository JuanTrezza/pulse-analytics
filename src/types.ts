/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Order {
  id: string; // e.g. "#94821"
  clientName: string;
  clientEmail: string;
  productName: string;
  total: number;
  status: 'Completado' | 'Pendiente' | 'Cancelado';
  date: string; // e.g. "Hoy, 14:20"
  timestamp: string; // ISO string for sorting
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  salesCount: number;
  revenue: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  totalOrders: number;
  totalSpent: number;
  status: 'Nuevo' | 'Recurrente' | 'VIP';
  lastOrderDate: string;
}

export interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  date: string;
  timestamp: string;
  dismissed: boolean;
}

export interface TrafficSource {
  name: string;
  percentage: number;
  visits: number;
  color: string;
}

export interface ConversionStep {
  name: string;
  value: number;
  percentage: number;
}

export interface RegionalSales {
  region: string;
  percentage: number;
  sales: number;
}
