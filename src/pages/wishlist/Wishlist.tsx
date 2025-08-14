import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import WishlistCard from '../../components/ui/wishlistCard/WishlistCard';
import './Wishlist.scss';
import ApiService from '../../services/ApiService';

// Interface for wishlist item structure based on the backend controller
interface WishlistProduct {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  discount: number;
  discounted_price: number;
  stock: number;
  image: string;
  is_in_stock: boolean;
}

interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  product: WishlistProduct;
}

interface WishlistResponse {
  status: string | boolean;
  data: WishlistItem[];
  count: number;
}

interface ApiResponse {
  status: string | boolean;
  data?: any;
  message?: string;
}

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle 401 Unauthorized responses
  const handleUnauthorized = () => {
    // Clear any stored auth tokens or user data here if needed
    // localStorage.removeItem('token'); // Example if you store tokens
    navigate('/signin');
  };

  // Fetch wishlist items from API
  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiService.get<WishlistResponse>('/v2/wishlist');
      
      if (response.status === true || response.status === 'success') {
        setWishlistItems(response.data);
      } else {
        setError('Failed to load wishlist items');
      }
    } catch (err: any) {
      console.error('Error fetching wishlist items:', err);
      
      // Check for 401 unauthorized
      if (err.status === 401 || err.response?.status === 401) {
        handleUnauthorized();
        return;
      }
      
      setError('Failed to load wishlist items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist
  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      const response: ApiResponse = await ApiService.delete(`/v2/wishlist/${productId}`);
      
      if (response.status === true || response.status === 'success') {
        // Remove the item from the local state
        setWishlistItems(prevItems => 
          prevItems.filter(item => item.product.id !== productId)
        );
        setSuccessMessage('Product removed from wishlist successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError('Failed to remove item from wishlist');
      }
    } catch (err: any) {
      console.error('Error removing item from wishlist:', err);
      
      // Check for 401 unauthorized
      if (err.status === 401 || err.response?.status === 401) {
        handleUnauthorized();
        return;
      }
      
      setError('Failed to remove item from wishlist. Please try again.');
    }
  };

  // Add item to cart - Updated to return a promise for the WishlistCard component
  const handleAddToCart = async (productId: number): Promise<void> => {
    try {
      const response: ApiResponse = await ApiService.post('/v2/cart/add', {
        product_id: productId,
        quantity: 1,
      });
      
      if (response.status === true || response.status === 'success') {
        setSuccessMessage('Product added to cart successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
        
        // Return successfully resolved promise
        return Promise.resolve();
      } else {
        setError('Failed to add item to cart');
        throw new Error('Failed to add item to cart');
      }
    } catch (err: any) {
      console.error('Error adding item to cart:', err);
      
      // Check for 401 unauthorized
      if (err.status === 401 || err.response?.status === 401) {
        handleUnauthorized();
        return;
      }
      
      setError('Failed to add item to cart. Please try again.');
      // Re-throw the error so the WishlistCard component can handle it
      throw err;
    }
  };

  // Clear error message
  const clearError = () => {
    setError(null);
  };

  // Clear success message
  const clearSuccessMessage = () => {
    setSuccessMessage(null);
  };

  return (
    <div className="wishlist-page mt-3">
      <Container className="mt-4 mb-5">
        {/* Page Title */}
        <div className="page-header mb-4 pt-2">
          <h1 className="page-title">WISHLIST</h1>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Alert variant="success" className="mb-4" dismissible onClose={clearSuccessMessage}>
            {successMessage}
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="danger" className="mb-4" dismissible onClose={clearError}>
            {error}
          </Alert>
        )}
        
        {/* Loading state */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-light">Loading your wishlist...</p>
          </div>
        )}
        
        {/* Wishlist Items Grid */}
        {!loading && !error && (
          <Row>
            {wishlistItems.length > 0 ? (
              wishlistItems.map(item => (
                <Col xs={12} md={6} key={item.id}>
                  <WishlistCard 
                    wishlistItem={item}
                    onRemove={handleRemoveFromWishlist}
                    onAddToCart={handleAddToCart}
                  />
                </Col>
              ))
            ) : (
              <Col xs={12} className="text-center py-5">
                <div className="empty-wishlist">
                  <i className="bi bi-heart display-1 text-primary mb-3"></i>
                  <h3 className="text-light">Your wishlist is empty</h3>
                  <p className="text-primary">Start adding products to your wishlist to see them here</p>
                </div>
              </Col>
            )}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Wishlist;