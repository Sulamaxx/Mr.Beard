import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import ApiService from "../services/ApiService"; 

// Update interface to match API response
interface User {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  user_type: string; // Add user_type field
}

// API response structure
interface LoginResponse {
  status: string;
  access_token: string;
  token_type: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>; // Update return type
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check local storage for existing token/user on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    setLoading(true);
    try {
      const response = await ApiService.post<LoginResponse>('/v2/login', { email, password });
      
      // Log the full response for debugging
      console.log('Login API response:', response);
      
      // Extract data based on actual API response structure
      const { access_token, user, status, token_type } = response;
      
      // Save to state
      setToken(access_token);
      setUser(user);
      
      // Save to localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Return the full response for use in components
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (token) {
        // Call logout API
        await ApiService.post('/v2/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state and storage regardless of API success
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};