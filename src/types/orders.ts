export interface OrderItem {
  productId: string | number;
  name: string;
  image?: string;
  price?: number;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  email?: string;
  address: string;
  city: string;
  postalCode?: string;
  phone?: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  createdAt: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: OrderItem[];
  total: number;
  shippingAddress: ShippingAddress;
  delivery?: string;
  paymentMethod?: string;
}
