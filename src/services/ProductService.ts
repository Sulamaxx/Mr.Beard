import ApiService from './ApiService';
import { ProductData } from '../types/ProductData';

class ProductService {
  private static instance: ProductService;
  
  private constructor() {}
  
  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }
  
  /**
   * Get products filtered by category
   * @param category - The category to filter by
   * @param priceRange - Optional price range filter
   * @returns Promise with array of products
   */
  public async getProductsByCategory(
    category: string,
    priceRange?: string
  ): Promise<ProductData[]> {
    // Create request data with filter parameters
    const requestData = {
      category: category === 'All Categories' ? null : category,
      priceRange: priceRange === 'All Price' ? null : priceRange
    };
    
    return ApiService.post<ProductData[]>('/products/filter', requestData);
  }
  
  /**
   * Get a single product by ID
   * @param id - The product ID
   * @returns Promise with product data
   */
  public async getProductById(id: number): Promise<ProductData> {
    return ApiService.get<ProductData>(`/products/${id}`);
  }
}

export default ProductService.getInstance();