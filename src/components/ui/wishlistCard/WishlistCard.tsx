import React, { useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './WishlistCard.scss';

interface WishlistProduct {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  discount: number;
  discount_type?: string; // Added discount_type to support both percentage and amount discounts
  currency?: string; // Added currency for amount-based discounts
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

interface WishlistCardProps {
  wishlistItem: WishlistItem;
  onRemove: (productId: number) => void;
  onAddToCart: (productId: number) => Promise<void>;
}

const WishlistCard: React.FC<WishlistCardProps> = ({ wishlistItem, onRemove, onAddToCart }) => {
  const navigate = useNavigate();
  const { product } = wishlistItem;
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

  const truncateProductName = (name: string, maxLength: number = 40): string => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength).trim() + '...';
  };

  // Calculate the discount display - UPDATED to match ProductCard
  const calculateDiscount = () => {
    const discount = Number(product.discount);
    if (!discount || discount <= 0) return null;
    
    // Check if discount_type exists, if not assume it's percentage for backward compatibility
    if (product.discount_type === 'amount') {
      const currency = product.currency || 'LKR'; // Default to LKR if not provided
      return `-${currency} ${discount.toFixed(2)}`;
    } else {
      // Default to percentage
      return `-${discount}%`;
    }
  };

  // Calculate final price based on discount type - UPDATED to match ProductCard
  const calculateFinalPrice = () => {
    const originalPrice = Number(product.price);
    const discount = Number(product.discount);
    
    if (!discount || discount <= 0) {
      return originalPrice;
    }
    
    // Check if discount_type exists, if not assume it's percentage for backward compatibility
    if (product.discount_type === 'amount') {
      return Math.max(0, originalPrice - discount);
    } else {
      // Default to percentage
      return originalPrice - (originalPrice * discount / 100);
    }
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

  // Navigate to product detail page when clicking on the card
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if the click was on buttons
    if (!(e.target as HTMLElement).closest('.wishlist-actions')) {
      navigate(`/product/${product.id}`);
    }
  };

  // Handle Remove from Wishlist
  const handleRemoveFromWishlist = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event from firing
    onRemove(product.id);
  };

  // Handle Add to Cart - Just add and show feedback
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (cartLoading || !product.is_in_stock) return;
    
    setCartLoading(true);
    
    try {
      // Call the parent component's onAddToCart function
      await onAddToCart(product.id);
      
      // Show success feedback
      setJustAddedToCart(true);
      console.log('Product added to cart successfully');
      
      // Reset feedback after 3 seconds
      setTimeout(() => {
        setJustAddedToCart(false);
      }, 3000);
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

  const getCartButtonContent = () => {
    if (!product.is_in_stock) {
      return 'Out of Stock';
    }
    
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

  const finalPrice = calculateFinalPrice();
  const discountDisplay = calculateDiscount();
  const currency = product.currency || 'LKR'; // Default to LKR if not provided
  const originalPrice = Number(product.price);

  return (
    <Card className="wishlist-product-card" onClick={handleCardClick}>
      <Row className="g-0">
        {/* Left side - Product Image */}
        <Col xs={12} md={6} className="product-image-wrapper">
          <div className="product-image-container">
            <Card.Img src={product.image} className="product-image" />
            
            {/* Tags - Discount and Stock Status */}
            <div className="product-tags">
              {discountDisplay && (
                <span className="tag discount-tag">{discountDisplay}</span>
              )}
              {!product.is_in_stock && (
                <span className="tag out-of-stock-tag">Out of Stock</span>
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

            <Card.Title className="product-title text-lg-start">{truncateProductName(product.name)}</Card.Title>
            
            <div className="product-price text-lg-start">
              <span className="current-price">{currency} {finalPrice.toFixed(2)}</span>
              {product.discount > 0 && (
                <small className="text-danger text-decoration-line-through ms-2">
                  {currency} {originalPrice.toFixed(2)}
                </small>
              )}
            </div>
            
            <Card.Text className="product-description text-lg-start">
              {truncateDescription(product.description)}
            </Card.Text>
            
            <div className="wishlist-actions">
              <Button 
                variant={!product.is_in_stock ? "secondary" : justAddedToCart ? "success" : "dark"}
                className={`add-to-cart-btn ${justAddedToCart ? 'cart-success' : ''}`}
                onClick={handleAddToCart}
                disabled={!product.is_in_stock || cartLoading}
              >
                {getCartButtonContent()}
              </Button>
              <Button 
                variant="link" 
                className="remove-wishlist-btn"
                onClick={handleRemoveFromWishlist}
              >
                <i className='bi bi-heart-fill'></i>
                <span className="ms-2">Remove</span>
              </Button>
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default WishlistCard;