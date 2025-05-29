import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ProductCard from './productCard/ProductCard';
import ApiService from '../../../services/ApiService';
import './FeaturedProducts.scss';

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

// Define the categories and their products
interface CategoryProducts {
  [key: string]: Product[];
}

// Define API response interface
interface FeaturedProductsResponse {
  status: string;
  data: CategoryProducts;
}

const FeaturedProducts: React.FC = () => {
  // Define available categories
  const categories = ['Hair', 'Beard', 'Accessories', 'Apparel'];
  
  // State to track the active category
  const [activeCategory, setActiveCategory] = useState<string>('Beard');
  
  // State to store the products fetched from the API
  const [categoryProducts, setCategoryProducts] = useState<CategoryProducts>({});
  
  // State to track loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // State to track error
  const [error, setError] = useState<string | null>(null);

  // Fetch featured products when component mounts
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Call the API using ApiService
        const response = await ApiService.post<FeaturedProductsResponse>('/v2/products/featured');
        
        // Update state with the fetched data
        if (response.status === 'success' && response.data) {
          setCategoryProducts(response.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
        setError('Failed to load featured products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // Render loading state
  if (isLoading) {
    return (
      <Container className='featured-products py-5'>
        <div className="text-center">
          <p>Loading featured products...</p>
        </div>
      </Container>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container className='featured-products py-5'>
        <div className="text-center">
          <p className="text-danger">{error}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className='featured-products py-5'>
      <div className="category-tabs mb-4">
        <Row className="justify-content-center">
          {categories.map((category) => (
            <Col key={category} xs={6} sm={3}>
              <Button
                variant="light"
                className={`category-btn w-100 ${activeCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
                disabled={!categoryProducts[category] || categoryProducts[category].length === 0}
              >
                {category}
              </Button>
            </Col>
          ))}
        </Row>
      </div>

      <Row className='mt-5'>
        {categoryProducts[activeCategory]?.map((product) => (
          <Col key={product.id} lg={4} md={4} sm={6} xs={12} className="mb-4">
            <ProductCard product={product} />
          </Col>
        ))}
        
        {(!categoryProducts[activeCategory] || categoryProducts[activeCategory].length === 0) && (
          <Col xs={12} className="text-center">
            <p>No featured products available for this category.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default FeaturedProducts;