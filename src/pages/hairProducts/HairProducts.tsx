import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import ProductCard from '../../components/ui/productCard/ProductCard';
import './HairProducts.scss';
import beardBgImage from '/src/assets/images/products/product-top-name-bg.png';
import { ProductData } from '../../types/ProductData';

// Sample product data
const sampleProducts: ProductData[] = [
  {
    id: 1,
    name: 'Hair Oil',
    price: 1500,
    currency: 'LKR',
    description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy',
    image: 'src/assets/images/products/wax-preview.png',
    rating: 5,
    isNew: true,
    discount: 50,
    category: 'Hair Oil'
  },
  {
    id: 2,
    name: 'Hair Oil',
    price: 1500,
    currency: 'LKR',
    description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy',
    image: '/src/assets/images/products/wax-preview.png',
    rating: 5,
    isNew: true,
    discount: null,
    category: 'Hair Oil'
  },
  {
    id: 3,
    name: 'Hair Oil',
    price: 1500,
    currency: 'LKR',
    description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy',
    image: '/src/assets/images/products/wax-preview.png',
    rating: 5,
    isNew: false,
    discount: null,
    category: 'Hair Oil'
  },
  {
    id: 4,
    name: 'Hair Oil',
    price: 1500,
    currency: 'LKR',
    description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy',
    image: '/src/assets/images/products/wax-preview.png',
    rating: 5,
    isNew: true,
    discount: null,
    category: 'Hair Oil'
  },
  {
    id: 5,
    name: 'Hair Oil',
    price: 1500,
    currency: 'LKR',
    description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy',
    image: '/src/assets/images/products/wax-preview.png',
    rating: 5,
    isNew: false,
    discount: null,
    category: 'Hair Wax'
  },
  {
    id: 6,
    name: 'Hair Oil',
    price: 1500,
    currency: 'LKR',
    description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy',
    image: '/src/assets/images/products/wax-preview.png',
    rating: 5,
    isNew: false,
    discount: null,
    category: 'Hair Wax'
  }
];

// Available categories for filter
const categories = [
  "All Categories",
  "Hair Oil",
  "Hair Cream",
  "Hair Wax"
];

// Price ranges for filter
const priceRanges = [
  "All Price",
  "Under LKR 1000",
  "LKR 1000 - LKR 2000",
  "Over LKR 2000"
];

const HairProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPrice, setSelectedPrice] = useState("All Price");

  // Simulate fetching products from API
  useEffect(() => {
    // In a real application, this would be an API call
    setProducts(sampleProducts);
    setFilteredProducts(sampleProducts);
  }, []);

  // Filter products when category or price changes
  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (selectedCategory !== "All Categories") {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filter by price
    if (selectedPrice !== "All Price") {
      if (selectedPrice === "Under LKR 1000") {
        result = result.filter(product => product.price < 1000);
      } else if (selectedPrice === "LKR 1000 - LKR 2000") {
        result = result.filter(product => product.price >= 1000 && product.price <= 2000);
      } else if (selectedPrice === "Over LKR 2000") {
        result = result.filter(product => product.price > 2000);
      }
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, selectedPrice, products]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPrice(e.target.value);
  };

  return (
    <div className="hair-products-page">
      {/* Hero Section with Background Image */}
      <div className="hero-section" style={{ backgroundImage: `url(${beardBgImage})` }}>
        <h1>Hair</h1>
      </div>
      
      <Container className="mt-4 mb-5">
        {/* Filter Section */}
        <div className="filter-section mb-4">
          <Row>
            <Col xs={12} md={6} lg={3}>
              <div className="filter-label">CATEGORIES</div>
              <Form.Select
                className="filter-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={12} md={6} lg={3} className='mt-2 mt-md-0'>
              <div className="filter-label">PRICE</div>
              <Form.Select
                className="filter-select"
                value={selectedPrice}
                onChange={handlePriceChange}
              >
                {priceRanges.map((range, index) => (
                  <option key={index} value={range}>{range}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </div>
        
        {/* Products Grid - 2 cards per row on desktop, 1 card per row on mobile */}
        <Row>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <Col xs={12} md={6} key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))
          ) : (
            <Col xs={12} className="text-center py-5">
              <h3>No products found matching your criteria</h3>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default HairProducts;