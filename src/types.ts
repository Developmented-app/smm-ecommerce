export type SmmCategory = 'Instagram' | 'TikTok' | 'YouTube' | 'Twitter (X)' | 'Facebook';

export interface SmmService {
  id: string;
  category: SmmCategory;
  name: string;
  pricePerThousand: number; // in USD
  minQuantity: number;
  maxQuantity: number;
  description: string;
}

export type OrderStatus = 'Pending' | 'In Progress' | 'Completed' | 'Canceled';

export interface SmmOrder {
  id: string;
  serviceId: string;
  serviceName: string;
  category: SmmCategory;
  link: string;
  quantity: number;
  price: number;
  status: OrderStatus;
  createdAt: string;
  startCount: number;
  remains: number;
  canceledAt?: string;
  autoRetryCount?: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  downloadsCount: number;
  fileSize: string;
  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface EComOrder {
  id: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  downloadToken: string;
}

export interface Transaction {
  id: string;
  type: 'Deposit' | 'SMM Order' | 'E-commerce Purchase';
  amount: number;
  description: string;
  createdAt: string;
}
