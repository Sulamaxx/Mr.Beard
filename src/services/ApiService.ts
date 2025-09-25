import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class ApiService {
  private static instance: ApiService;
  private axiosInstance: AxiosInstance;
  
  private constructor() {
    this.axiosInstance = axios.create({
      baseURL:import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api', 
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // You can add auth token here if needed
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle errors globally
        if (error.response) {
          // Server responded with a status code outside of 2xx range
          console.error('API Error:', error.response.status, error.response.data);
          
          // Handle unauthorized access
          if (error.response.status === 401) {
            // Handle unauthorized (e.g., redirect to login)
            console.error('Unauthorized access. Please login again.');
          }
        } else if (error.request) {
          // Request was made but no response was received
          console.error('Network Error:', error.request);
        } else {
          // Something else triggered an error
          console.error('Error:', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }
  
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }
  
  // Generic request method
  public async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance(config);
    return response.data;
  }
  
  // Convenience methods for common HTTP methods
  public async get<T>(url: string, params?: any): Promise<T> {
    return this.request<T>({ method: 'get', url, params });
  }
  
  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ method: 'post', url, data, ...config });
  }
  
  public async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'put', url, data });
  }
  
  public async delete<T>(url: string): Promise<T> {
    return this.request<T>({ method: 'delete', url });
  }
}

export default ApiService.getInstance();
