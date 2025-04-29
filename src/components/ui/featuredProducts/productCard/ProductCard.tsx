import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ProductCard.scss';

// Define the product interface
interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  currency: string;
  rating: number;
  reviews: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  // Render star ratings
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`star ${i < product.rating ? 'filled' : ''}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Handle click to navigate to product detail page
  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card 
      className="product-card h-100" 
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-img-container">
        <Card.Img variant="top" src={product.image} alt={product.name} />
      </div>
      <Card.Body>
        <div className="product-info">
          <Card.Title>{product.name}</Card.Title>
          <div className="ratings">
            <div className="stars">
              {renderStars()}
            </div>
            <span className="reviews">({product.reviews.toLocaleString('en-US', { maximumFractionDigits: 1 })}k) Customer Reviews</span>
          </div>
        </div>
        <div className="price">
          {product.currency} {product.price}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;