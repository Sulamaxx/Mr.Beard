import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import ProductCard from '../../components/ui/productCard/ProductCard';
import './BeardProducts.scss';
import beardBgImage from '/src/assets/images/products/product-top-name-bg.png';
import { ProductData } from '../../types/ProductData';
import ApiService from '../../services/ApiService';

// Price ranges for filter
const priceRanges = [
  "All Price",
  "Under LKR 1000",
  "LKR 1000 - LKR 2000",
  "Over LKR 2000"
];

const BeardProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [selectedPrice, setSelectedPrice] = useState("All Price");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Send POST request with 'Beard' as static category using ApiService
        const data = await ApiService.post<ProductData[]>('/v2/products/filtered_products', {
          category: 'Beard'
        });

        // @ts-ignore
        setProducts(data.data);
        // @ts-ignore
        setFilteredProducts(data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products by price range on the client side
  useEffect(() => {
    let result = [...products];
    
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
  }, [selectedPrice, products]);
  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPrice(e.target.value);
  };

  return (
    <div className="beard-products-page mt-3">
      
      <Container className="mt-4 mb-5">
      {/* Hero Section with Background Image */}
      <div className="products-hero-section" style={{ backgroundImage: `url(${beardBgImage})` }}>
        <h1>Beard</h1>
      </div>
        {/* Filter Section */}
        <div className="filter-section mb-4">
          <Row>
            {/* <Col xs={12} md={6} lg={3}>
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
            </Col> */}
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
        
        {/* Loading state */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}
        
        {/* Products Grid */}
        {!loading && !error && (
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
        )}
      </Container>
    </div>
  );
};

export default BeardProducts;