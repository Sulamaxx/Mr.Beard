import React, { useState, useEffect } from "react";
import { Row, Col, Button, Dropdown, Form } from "react-bootstrap";
import "./AllProducts.scss";
import ProductCard from "../../../components/ui/admin/productCard/ProductCard";
import PaginationComponent from "../../../components/ui/admin/pagination/PaginationComponent";
import { Link } from "react-router-dom";
import ProductService from "../../../services/ProductService";
import { ProductData } from "../../../types/ProductData";

const AllProducts: React.FC = () => {
  // State for products and pagination
  const [products, setProducts] = useState<ProductData[]>([]);
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products with the current filters and pagination
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ProductService.getPaginatedProducts(
        currentPage,
        filterCategory,
        searchTerm
      );
      
      if (response.status === 'success') {
        setProducts(response.data.products);
        setTotalPages(response.data.pagination.totalPages);
        setTotalProducts(response.data.pagination.totalProducts);
      } else {
        throw new Error('Failed to load products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch products when pagination or filters change
  useEffect(() => {
    fetchProducts();
  }, [currentPage, filterCategory]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when search changes
      fetchProducts();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Note: We don't need to call fetchProducts() here because the useEffect will handle it
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setFilterCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // The debounced effect will handle the API call
  };

  return (
    <div className="all-products">
      <div className="products-header">
        <div>
          <h1>All Products</h1>
          <div className="breadcrumb">Home &gt; All Products</div>
        </div>
        <div className="filter-section d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex">
            <div className="search-box me-3">
              <Form.Control
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="category-filter me-3">
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-category">
                  {filterCategory} <i className="bi bi-chevron-down ms-2"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    active={filterCategory === "ALL"} 
                    onClick={() => handleCategoryChange("ALL")}
                  >
                    ALL
                  </Dropdown.Item>
                  <Dropdown.Item 
                    active={filterCategory === "BEARD"} 
                    onClick={() => handleCategoryChange("BEARD")}
                  >
                    BEARD
                  </Dropdown.Item>
                  <Dropdown.Item 
                    active={filterCategory === "HAIR"} 
                    onClick={() => handleCategoryChange("HAIR")}
                  >
                    HAIR
                  </Dropdown.Item>
                  <Dropdown.Item 
                    active={filterCategory === "ACCESSORIES"} 
                    onClick={() => handleCategoryChange("ACCESSORIES")}
                  >
                    ACCESSORIES
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          
          <Link to="add-new-product" className="text-decoration-none">
            <Button variant="secondary" className="add-product-btn">
              <i className="bi bi-plus-circle me-2"></i> ADD NEW PRODUCT
            </Button>
          </Link>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <>
          <Row>
            {products.length > 0 ? (
              products.map(product => (
                <Col className="mb-3" lg={4} md={6} sm={12} key={product.id}>
                  <ProductCard product={product} />
                </Col>
              ))
            ) : (
              <Col xs={12} className="text-center py-5">
                <h5>No products found. Try adjusting your filters.</h5>
              </Col>
            )}
          </Row>
          
          {totalPages > 1 && (
            <PaginationComponent 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showNextButton={true}
              className="mt-4"
              maxVisiblePages={3} // Adjust based on your UI preference
            />
          )}
          
          {products.length > 0 && (
            <div className="text-center mt-3 text-muted">
              Showing {products.length} of {totalProducts} products
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllProducts;