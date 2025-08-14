import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { ProductData } from '../../../types/ProductData';
import './ProductCard.scss';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../../services/ApiService';

interface ProductCardProps {
  product: ProductData;
}

interface ApiResponse {
  status: string | boolean;
  data?: any;
  message?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [justAddedToCart, setJustAddedToCart] = useState(false);
  
  // Function to truncate description with precise character limit
  const truncateDescription = (text: string, maxLength: number = 100): string => {
    // Remove extra whitespace and normalize the text
    const normalizedText = text.replace(/\s+/g, ' ').trim();
    
    if (normalizedText.length <= maxLength) return normalizedText;
    
    // Calculate the actual limit accounting for the ellipsis (3 characters)
    const actualLimit = maxLength - 3;
    
    // Find the last space before the limit to avoid cutting words
    const lastSpace = normalizedText.lastIndexOf(' ', actualLimit);
    
    // If we can't find a space within reasonable range, cut at the limit
    const truncateAt = lastSpace > actualLimit - 15 ? lastSpace : actualLimit;
    
    return normalizedText.substring(0, truncateAt).trim() + '...';
  };

  // Generate star rating display
  const renderRating = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
    ));
  };

  // Handle 401 Unauthorized responses
  const handleUnauthorized = () => {
    navigate('/signin');
  };

  // Check if product is in wishlist on component mount
  useEffect(() => {
    checkWishlistStatus();
  }, [product.id]);

  const checkWishlistStatus = async () => {
    try {
      const response: ApiResponse = await ApiService.get('/v2/wishlist');
      if (response.status === true || response.status === 'success') {
        const isInWishlist = response.data.some((item: any) => item.product.id === product.id);
        setInWishlist(isInWishlist);
      }
    } catch (error: any) {
      // Silently fail - user might not be logged in
      setInWishlist(false);
    }
  };

  // Navigate to product detail page when clicking on the card
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if the click was on the Add to Cart button or wishlist button
    if (!(e.target as HTMLElement).closest('.add-to-cart-btn') && 
        !(e.target as HTMLElement).closest('.wishlist-btn')) {
      navigate(`/product/${product.id}`);
    }
  };

  // Handle Add to Cart - Just add and show feedback
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (cartLoading) return;
    
    setCartLoading(true);
    
    try {
      const response: ApiResponse = await ApiService.post<any>("/v2/cart/add", {
        product_id: product.id,
        quantity: 1,
      });
      
      if (response.status === true || response.status === 'success') {
        // Show success feedback
        setJustAddedToCart(true);
        console.log('Product added to cart successfully');
        
        // Reset feedback after 3 seconds
        setTimeout(() => {
          setJustAddedToCart(false);
        }, 3000);
      }
    } catch (error: any) {
      if (error.status === 401 || error.response?.status === 401) {
        handleUnauthorized();
        return;
      }
      console.error('Error adding product to cart:', error);
    } finally {
      setCartLoading(false);
    }
  };
  
  const toggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (wishlistLoading) return;
    
    setWishlistLoading(true);
    
    try {
      if (inWishlist) {
        // Remove from wishlist
        const response: ApiResponse = await ApiService.delete(`/v2/wishlist/${product.id}`);
        
        if (response.status === true || response.status === 'success') {
          setInWishlist(false);
          console.log('Product removed from wishlist successfully');
        } else {
          console.error('Failed to remove product from wishlist');
        }
      } else {
        // Add to wishlist
        const response: ApiResponse = await ApiService.post('/v2/wishlist', {
          product_id: product.id
        });
        
        if (response.status === true || response.status === 'success') {
          setInWishlist(true);
          console.log('Product added to wishlist successfully');
        } else {
          console.error('Failed to add product to wishlist');
        }
      }
    } catch (error: any) {
      if (error.status === 401 || error.response?.status === 401) {
        handleUnauthorized();
        return;
      }
      console.error('Error toggling wishlist:', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const getCartButtonContent = () => {
    if (cartLoading) {
      return (
        <>
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          Adding...
        </>
      );
    }
    
    if (justAddedToCart) {
      return (
        <>
          <i className="bi bi-check-circle-fill me-2"></i>
          Added to Cart!
        </>
      );
    }
    
    return 'Add to cart';
  };

  return (
    <Card className="horizontal-product-card" onClick={handleCardClick}>
      <Row className="g-0">
        {/* Left side - Product Image */}
        <Col xs={12} md={6} className="product-image-wrapper">
          <div className="product-image-container">
            <Card.Img src={product.image} className="product-image" />
            
            {/* Tags - NEW and Discount */}
            <div className="product-tags">
              {product.isNew && (
                <span className="tag new-tag">NEW</span>
              )}
              {product.discount && product.discount > 0 && (
                <span className="tag discount-tag">-{product.discount}%</span>
              )}
            </div>
          </div>
        </Col>
        
        {/* Right side - Product Details */}
        <Col xs={12} md={6} className="product-details">
          <Card.Body>
            <div className="product-rating text-lg-start">
              {renderRating(product.rating)}
            </div>
            
            <Card.Title className="product-title text-lg-start">{product.name}</Card.Title>
            
            <div className="product-price text-lg-start">
              {product.currency} {product.price.toFixed(2)}
            </div>
            
            <Card.Text className="product-description text-lg-start">
              {truncateDescription(product.description)}
            </Card.Text>
            
            <div className="product-actions">
              <Button 
                variant={justAddedToCart ? "success" : "dark"}
                className={`add-to-cart-btn ${justAddedToCart ? 'cart-success' : ''}`}
                onClick={handleAddToCart}
                disabled={cartLoading}
              >
                {getCartButtonContent()}
              </Button>
              <Button 
                variant="link" 
                className="wishlist-btn"
                onClick={toggleWishlist}
                disabled={wishlistLoading}
              >
                {wishlistLoading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    {inWishlist ? <i className='bi bi-heart-fill'></i> : <i className='bi bi-heart'></i>}
                    <span className="ms-2">
                      Wishlist
                    </span>
                  </>
                )}
              </Button>
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductCard;