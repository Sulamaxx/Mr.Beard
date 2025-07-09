import React from 'react';
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
  onAddToCart: (productId: number) => void;
}

const WishlistCard: React.FC<WishlistCardProps> = ({ wishlistItem, onRemove, onAddToCart }) => {
  const navigate = useNavigate();
  const { product } = wishlistItem;
  
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

  // Handle Add to Cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event from firing
    onAddToCart(product.id);
  };

  return (
    <Card className="wishlist-product-card" onClick={handleCardClick}>
      <Row className="g-0">
        {/* Left side - Product Image */}
        <Col xs={12} md={6} className="product-image-wrapper">
          <div className="product-image-container">
            <Card.Img src={product.image} className="product-image" />
            
            {/* Tags - Discount and Stock Status */}
            <div className="product-tags">
              {product.discount > 0 && (
                <span className="tag discount-tag">-{product.discount}%</span>
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

            <Card.Title className="product-title text-lg-start">{product.name}</Card.Title>
            
            <div className="product-price text-lg-start">
              {product.discount > 0 ? (
                <>
                  <span className="original-price">LKR {product.price}</span>
                </>
              ) : (
                <span className="current-price">LKR {product.price}</span>
              )}
            </div>
            
            <Card.Text className="product-description text-lg-start">
              {truncateDescription(product.description)}
            </Card.Text>
            
            <div className="wishlist-actions">
              <Button 
                variant="dark" 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!product.is_in_stock}
              >
                {product.is_in_stock ? 'Add to cart' : 'Out of Stock'}
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