// types/product.ts
export interface ProductData {
    id: number;
    name: string;
    price: number;
    currency: string;
    description: string;
    image: string;
    rating: number;
    isNew: boolean;
    discount_type?: string; // Make sure this exists
    discount: number | null;
    category: string;
  }