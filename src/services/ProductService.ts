import ApiService from './ApiService';
import { ProductData } from '../types/ProductData';

// Define interface for pagination response
export interface PaginatedResponse<T> {
  status: string;
  data: {
    products: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      perPage: number;
      totalProducts: number;
    }
  }
}

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
    
    return ApiService.post<ProductData[]>('/v2/products/filter', requestData);
  }
  
  /**
   * Get a single product by ID
   * @param id - The product ID
   * @returns Promise with product data
   */
  public async getProductById(id: number): Promise<ProductData> {
    return ApiService.get<ProductData>(`/v2/product/${id}`);
  }

  /**
   * Get paginated products with optional filtering
   * @param page - Page number
   * @param category - Optional category filter
   * @param searchTerm - Optional search term
   * @returns Promise with paginated product data
   */
  public async getPaginatedProducts(
    page: number = 1,
    category: string = 'ALL',
    searchTerm: string = ''
  ): Promise<PaginatedResponse<ProductData>> {
    const params: Record<string, any> = { page };
    
    if (category !== 'ALL') {
      params.category = category;
    }
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    return ApiService.post<PaginatedResponse<ProductData>>('v2/admin/all_products', params);
  }
}

export default ProductService.getInstance();