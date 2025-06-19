// StaffService.ts - Service for managing staff members using ApiService

import ApiService from './ApiService';

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  company: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StaffResponse {
  status: 'success' | 'error';
  data: {
    staff: Staff[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalStaff: number;
      limit: number;
    };
  };
  message?: string;
}

export interface SingleStaffResponse {
  status: 'success' | 'error';
  data: Staff;
  message?: string;
}

class StaffService {
  private static instance: StaffService;
  
  private constructor() {}
  
  public static getInstance(): StaffService {
    if (!StaffService.instance) {
      StaffService.instance = new StaffService();
    }
    return StaffService.instance;
  }

  /**
   * Get paginated staff members with optional search
   * @param page - Page number
   * @param searchTerm - Optional search term
   * @param limit - Number of items per page
   * @returns Promise with paginated staff data
   */
  public async getPaginatedStaff(
    page: number = 1,
    searchTerm: string = '',
    limit: number = 10
  ): Promise<StaffResponse> {
    const params: Record<string, any> = { 
      page,
      limit 
    };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    return ApiService.get('/v2/admin/staff/paginated', params);
  }

  /**
   * Get a single staff member by ID
   * @param id - The staff ID
   * @returns Promise with staff data
   */
  public async getStaffById(id: string): Promise<SingleStaffResponse> {
    return ApiService.get(`/v2/staff/${id}`);
  }

  /**
   * Create a new staff member
   * @param staffData - Staff data
   * @returns Promise with created staff member
   */
  public async createStaff(staffData: Partial<Staff>): Promise<SingleStaffResponse> {
    return ApiService.post('/v2/staff', staffData);
  }

  /**
   * Update an existing staff member
   * @param id - Staff ID
   * @param staffData - Updated staff data
   * @returns Promise with updated staff member
   */
  public async updateStaff(id: string, staffData: Partial<Staff>): Promise<SingleStaffResponse> {
    return ApiService.put(`/v2/staff/${id}`, staffData);
  }

  /**
   * Delete a staff member
   * @param id - Staff ID
   * @returns Promise with deletion confirmation
   */
  public async deleteStaff(id: string): Promise<{ status: 'success' | 'error'; message?: string }> {
    return ApiService.delete(`/v2/staff/${id}`);
  }

  /**
   * Delete multiple staff members
   * @param ids - Array of staff IDs
   * @returns Promise with deletion confirmation
   */
  // public async deleteMultipleStaff(ids: string[]): Promise<{ status: 'success' | 'error'; message?: string }> {
  //   // Convert formatted IDs to numeric IDs if needed
  //   const numericIds = ids.map(id => parseInt(id.replace(/\D/g, '')));
  //   return ApiService.delete('/v2/staff/bulk-delete', { ids: numericIds });
  // }

  /**
   * Search staff members
   * @param searchTerm - Search term
   * @returns Promise with search results
   */
  public async searchStaff(searchTerm: string): Promise<StaffResponse> {
    return this.getPaginatedStaff(1, searchTerm);
  }
}

export default StaffService.getInstance();