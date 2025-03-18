import React, { useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { ProductData } from '../../../types/ProductData';
import './ProductCard.scss';

interface ProductCardProps {
  product: ProductData;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [inWishlist, setInWishlist] = useState(false);
  
  const toggleWishlist = () => {
    setInWishlist(!inWishlist);
    // In a real app, you would call an API to update the wishlist
  };
  
  // Generate star rating display
  const renderRating = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
    ));
  };

  return (
    <Card className="horizontal-product-card">
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
            <div className="product-rating">
              {renderRating(product.rating)}
            </div>
            
            <Card.Title className="product-title">{product.name}</Card.Title>
            
            <div className="product-price">
              {product.currency} {product.price.toFixed(2)}
            </div>
            
            <Card.Text className="product-description">
              {product.description}
            </Card.Text>
            
            <div className="product-actions">
              <Button variant="dark" className="add-to-cart-btn">
                Add to cart
              </Button>
              
              <Button 
                variant="link" 
                className="wishlist-btn"
                onClick={toggleWishlist}
              >
                {inWishlist ? <i className='bi bi-heart-fill'></i> : <i className='bi bi-heart'></i>}
                <span className="ms-2">Wishlist</span>
              </Button>
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductCard;