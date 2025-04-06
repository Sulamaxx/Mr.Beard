import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ProductCard from './productCard/ProductCard';
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

const FeaturedProducts: React.FC = () => {
  // Define available categories
  const categories = ['Hair', 'Beard', 'Accessories'];
  
  // State to track the active category
  const [activeCategory, setActiveCategory] = useState<string>('Beard');

  // Sample product data (in a real app, this would come from an API or props)
  const categoryProducts: CategoryProducts = {
    Hair: [
      {
        id: 'h1',
        name: 'Shiny Dress',
        image: '/src/assets/images/products/comb.png',
        price: 4500,
        currency: 'LKR',
        rating: 5,
        reviews: 4100
      },
      // Add two more hair products
    ],
    Beard: [
      {
        id: 'b1',
        name: 'Comb',
        image: '/src/assets/images/products/comb.png',
        price: 4500,
        currency: 'LKR',
        rating: 5,
        reviews: 4100
      },
      {
        id: 'b2',
        name: 'Beard Oil',
        image: '/src/assets/images/products/beard_oil.png',
        price: 5600,
        currency: 'LKR',
        rating: 5,
        reviews: 4100
      },
      {
        id: 'b3',
        name: 'Beard Wax',
        image: '/src/assets/images/products/wax-preview.png',
        price: 3000,
        currency: 'LKR',
        rating: 5,
        reviews: 4100
      }
    ],
    Accessories: [
      // Add three accessories products
    ]
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

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
        </Row>
      </Container>
  );
};

export default FeaturedProducts;