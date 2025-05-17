import ApiService from './ApiService';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
}

export interface PaginatedUserResponse {
  status: string;
  data: {
    users: User[];
    pagination: {
      currentPage: number;
      totalPages: number;
      perPage: number;
      totalUsers: number;
    }
  }
}

class UserService {
  private static instance: UserService;
  
  private constructor() {}
  
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }
  
  /**
   * Get paginated users with optional search
   * @param page - Page number
   * @param searchTerm - Optional search term
   * @returns Promise with paginated user data
   */
  public async getPaginatedUsers(
    page: number = 1,
    searchTerm: string = ''
  ): Promise<PaginatedUserResponse> {
    const params: Record<string, any> = { page };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    return ApiService.get<PaginatedUserResponse>('/v2/admin/users/paginated', params);
  }
  
  /**
   * Get a single user by ID
   * @param id - The user ID
   * @returns Promise with user data
   */
  public async getUserById(id: string): Promise<any> {
    // Extract numeric ID from formatted ID (e.g., USR001 -> 1)
    const numericId = id.replace(/\D/g, '');
    return ApiService.get<any>(`/v2/users/${parseInt(numericId)}`);
  }
  
  /**
   * Create a new user
   * @param userData - User data
   * @returns Promise with created user
   */
  public async createUser(userData: any): Promise<any> {
    return ApiService.post<any>('/v2/users', userData);
  }
  
  /**
   * Update an existing user
   * @param id - User ID
   * @param userData - Updated user data
   * @returns Promise with updated user
   */
  public async updateUser(id: string, userData: any): Promise<any> {
    // Extract numeric ID from formatted ID (e.g., USR001 -> 1)
    const numericId = id.replace(/\D/g, '');
    return ApiService.put<any>(`/v2/users/${parseInt(numericId)}`, userData);
  }
  
  /**
   * Delete a user
   * @param id - User ID
   * @returns Promise with deletion confirmation
   */
  public async deleteUser(id: string): Promise<any> {
    // Extract numeric ID from formatted ID (e.g., USR001 -> 1)
    const numericId = id.replace(/\D/g, '');
    return ApiService.delete<any>(`/v2/users/${parseInt(numericId)}`);
  }
}

export default UserService.getInstance();