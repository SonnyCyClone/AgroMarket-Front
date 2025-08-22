export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  discountPercent?: number;
  imageUrl: string;
  description: string;
  createdAt: string; // ISO
}
