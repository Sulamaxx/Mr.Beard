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
    discount: number | null;
    category: string;
  }