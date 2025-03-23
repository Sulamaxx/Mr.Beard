import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Dropdown, Form, Pagination } from "react-bootstrap";
import "./AllProducts.scss";
import ProductCard from "../../../components/ui/admin/productCard/ProductCard";
import PaginationComponent from "../../../components/ui/admin/pagination/PaginationComponent";

// Sample product data
const sampleProducts = [
  {
    id: 1,
    name: "Hair Oil",
    category: "Hair",
    price: 3200.00,
    image: "/src/assets/images/products/wax1.png",
    summary: "Lorem ipsum is placeholder text commonly used in the graphic.",
    sales: 1269
  },
  {
    id: 2,
    name: "Hair Oil",
    category: "Hair",
    price: 3200.00,
    image: "/src/assets/images/products/wax1.png",
    summary: "Lorem ipsum is placeholder text commonly used in the graphic.",
    sales: 1269
  },
  {
    id: 3,
    name: "Hair Oil",
    category: "Hair",
    price: 3200.00,
    image: "/src/assets/images/products/wax1.png",
    summary: "Lorem ipsum is placeholder text commonly used in the graphic.",
    sales: 1269
  },
  {
    id: 4,
    name: "Hair Oil",
    category: "Hair",
    price: 3200.00,
    image: "/src/assets/images/products/wax1.png",
    summary: "Lorem ipsum is placeholder text commonly used in the graphic.",
    sales: 1269
  },
  {
    id: 5,
    name: "Hair Oil",
    category: "Hair",
    price: 3200.00,
    image: "/src/assets/images/products/wax1.png",
    summary: "Lorem ipsum is placeholder text commonly used in the graphic.",
    sales: 1269
  },
  {
    id: 6,
    name: "Hair Oil",
    category: "Hair",
    price: 3200.00,
    image: "/src/assets/images/products/wax1.png",
    summary: "Lorem ipsum is placeholder text commonly used in the graphic.",
    sales: 1269
  },
  {
    id: 7,
    name: "Hair Oil",
    category: "Hair",
    price: 3200.00,
    image: "/src/assets/images/products/wax1.png",
    summary: "Lorem ipsum is placeholder text commonly used in the graphic.",
    sales: 1269
  },
  {
    id: 8,
    name: "Hair Oil",
    category: "Hair",
    price: 3200.00,
    image: "/src/assets/images/products/wax1.png",
    summary: "Lorem ipsum is placeholder text commonly used in the graphic.",
    sales: 1269
  },
  {
    id: 9,
    name: "Beard Oil",
    category: "Beard",
    price: 3200.00,
    image: "/src/assets/images/products/wax1.png",
    summary: "Lorem ipsum is placeholder text commonly used in the graphic.",
    sales: 1269
  },
  {
    id: 10,
    name: "Beard Oil",
    category: "Beard",
    price: 3200.00,
    image: "/src/assets/images/products/wax1.png",
    summary: "Lorem ipsum is placeholder text commonly used in the graphic.",
    sales: 1269
  },
  {
    id: 11,
    name: "Beard Oil",
    category: "Beard",
    price: 3200.00,
    image: "/src/assets/images/products/wax1.png",
    summary: "Lorem ipsum is placeholder text commonly used in the graphic.",
    sales: 1269
  },
  {
    id: 12,
    name: "Beard Oil",
    category: "Beard",
    price: 3200.00,
    image: "/src/assets/images/products/wax1.png",
    summary: "Lorem ipsum is placeholder text commonly used in the graphic.",
    sales: 1269
  },
  {
    id: 13,
    name: "Beard Oil",
    category: "Beard",
    price: 3200.00,
    image: "/src/assets/images/products/wax1.png",
    summary: "Lorem ipsum is placeholder text commonly used in the graphic.",
    sales: 1269
  },
  {
    id: 14,
    name: "Beard Oil",
    category: "Beard",
    price: 3200.00,
    image: "/src/assets/images/products/wax1.png",
    summary: "Lorem ipsum is placeholder text commonly used in the graphic.",
    sales: 1269
  },
  {
    id: 15,
    name: "Beard Oil",
    category: "Beard",
    price: 3200.00,
    image: "/src/assets/images/products/wax1.png",
    summary: "Lorem ipsum is placeholder text commonly used in the graphic.",
    sales: 1269
  }
];

const AllProducts: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const productsPerPage = 9;
  
  // Filter products based on selected category and search term
  const filteredProducts = sampleProducts.filter(product => {
    const matchesCategory = filterCategory === "ALL" || 
                           product.category.toUpperCase() === filterCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, searchTerm]);
  
  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  return (
    <div className="all-products">
      <div className="products-header">
        <div>
          <h1>All Products</h1>
          <div className="breadcrumb">Home &gt; All Products</div>
        </div>
        <div className="filter-section d-flex justify-content-between align-items-center mb-4">
          
        <div className="category-filter me-3">
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-category">
                {filterCategory} <i className="bi bi-chevron-down ms-2"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  active={filterCategory === "ALL"} 
                  onClick={() => setFilterCategory("ALL")}
                >
                  ALL
                </Dropdown.Item>
                <Dropdown.Item 
                  active={filterCategory === "BEARD"} 
                  onClick={() => setFilterCategory("BEARD")}
                >
                  BEARD
                </Dropdown.Item>
                <Dropdown.Item 
                  active={filterCategory === "HAIR"} 
                  onClick={() => setFilterCategory("HAIR")}
                >
                  HAIR
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <Button variant="secondary" className="add-product-btn">
            <i className="bi bi-plus-circle me-2"></i> ADD NEW PRODUCT
          </Button>
        
        </div>
      </div>
      
      <Row>
        {currentProducts.length > 0 ? (
          currentProducts.map(product => (
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
        onPageChange={paginate}
        showNextButton={true}
        className="mt-4"/>
      )}
    </div>
  );
};

export default AllProducts;