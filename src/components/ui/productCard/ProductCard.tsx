import React, { useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { ProductData } from '../../../types/ProductData';
import './ProductCard.scss';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../../../services/ApiService';

interface ProductCardProps {
  product: ProductData;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  
  // Generate star rating display
  const renderRating = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
    ));
  };

  // Navigate to product detail page when clicking on the card
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if the click was on the Add to Cart button
    if (!(e.target as HTMLElement).closest('.add-to-cart-btn')) {
      navigate(`/product/${product.id}`);
    }
  };

  // Handle Add to Cart separately
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event from firing
          ApiService.post<any>("/v2/cart/add", {
            product_id: product.id,
            quantity: 1,
          });
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
              <Button 
                variant="dark" 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
              >
                Add to cart
              </Button>
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductCard;