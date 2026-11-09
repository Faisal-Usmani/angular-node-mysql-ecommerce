import { Product } from './products.type';

export interface CartItem {
  product: Product;
  quantity: number;
  amount: number;
  firstName:string | null;
  lastName:string | null
}

export interface Cart {
  products: CartItem[];
  totalAmount: number;
  totalProducts: number;
}

export interface DeliveryAddress {
  userName: string;
  address: string;
  city: string;
  state: string;
  pin: string;
}
