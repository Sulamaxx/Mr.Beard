import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Nav,
  Form,
  FormGroup,
} from "react-bootstrap";
import "./Home.scss";

// Import product images and other assets
import heroImage from "/src/assets/images/home/hero-image.png";
import beardOilBottle from "/src/assets/images/home/beard-oil-bottle.png";
import reviewers from "/src/assets/images/home/reviewers.png";
import offer25 from "/src/assets/images/home/offer25.png";
import beardWaxImage from "/src/assets/images/home/beard-wax.png";
import shinyDressProduct from "/src/assets/images/home/beard-oil-bottle.png";
import longDressProduct from "/src/assets/images/home/beard-oil-bottle.png";
import fullSweaterProduct from "/src/assets/images/home/beard-oil-bottle.png";

import featureProductsBg from "/src/assets/images/home/feature-products-background.png";

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const productCategories = ["All", "Beard", "Accessories", "Apparel"];

  const products = {
    All: [
      {
        id: 1,
        name: "Shiny Dress",
        price: "LKR 4500",
        image: shinyDressProduct,
        rating: 5,
      },
      {
        id: 2,
        name: "Long Dress",
        price: "LKR 6600",
        image: longDressProduct,
        rating: 5,
      },
      {
        id: 3,
        name: "Full Sweater",
        price: "LKR 3000",
        image: fullSweaterProduct,
        rating: 5,
      },
    ],
    // You can add more category-specific products here
  };

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const galleryImages = [
    "/path/to/gallery-image-1.jpg",
    "/path/to/gallery-image-2.jpg",
    // Add more gallery image paths
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row>
            <Col md={6} className="hero-content">
              <h1 className="fs-1 text-start">Natural Ingredients</h1>
              <h1 className="text-start text-primary">Beard Oil</h1>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control search-bar"
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="search-addon"
                />
                <Button
                  className="input-group-text bg-dark border-dark text-light"
                  id="search-addon"
                >
                  <i className="bi bi-search"></i>
                </Button>
                <br />
              </div>
              <div className="col-3">
                <hr className="border-3 border-white" />
              </div>
              <Row>
                <Col sm={6}>
                  <div className="hero-stats">
                    <h2 className="fw-medium">#01</h2>
                    <div>
                      <Button variant="primary">
                        Start Shopping <i className="bi bi-arrow-up-right"></i>
                      </Button>
                    </div>
                  </div>
                  <Row className="text-start">
                    <div>
                      <img src={reviewers} alt="reviewers" />
                    </div>
                  </Row>
                </Col>
                <Col sm={6}>
                  <div>
                    <img src={offer25} alt="offer" />
                  </div>
                </Col>
              </Row>
            </Col>
            <Col md={6} className="hero-image">
              <img src={heroImage} alt="Beard Oil Bottle" />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section
        className="featured-products"
        style={{ backgroundImage: `url(${featureProductsBg})` }}
      >
        <Container fluid>
          <h2>OUR FEATURE PRODUCTS</h2>
          <Button variant="secondary">Start Shopping</Button>
          <img src={beardOilBottle} alt="beard oil" className="bottle-image" />
        </Container>
      </section>

      <section className="">
        <Container fluid>
          <Row>
            <Col
              md={6}
              style={{
                backgroundImage: `url(${beardWaxImage})`,
                minHeight: "600px",
              }}
            ></Col>
            <Col md={6} className="align-content-center">
              <div className="beard-wax-text text-white ps-5">
                <h1 className="text-uppercase text-primary text-start">
                  Beard Oil For You
                </h1>
                <Col md={8}>
                  <p className="text-start fs-5">
                    We provide the best Beard oil all over the world. We are the
                    worldd best store for Beard Oil. You can buy our product
                    without any hegitation because we always consus about our
                    product quality and always maintain it properly so your can
                    trust and this is our main goal we belive that...
                    <br />
                    <br />
                    Some of our customer say’s that they trust us and buy our
                    product without any hagitation because they belive us and
                    always happy to buy our product.
                  </p>
                </Col>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Product Carousel Section */}
      <section className="beard-oil-products mt-5">
        <Container>
          <h1 className="text-primary">Beard Oil For You</h1>
          <Row className="justify-content-center mt-4 mb-5">
          <Col md={6} className="text-white">
          Some of our customers say that they trust us and buy our product without any hesitation because they believe us and always happy to buy our product.
          </Col>
          </Row>
          <Nav
            variant="pills"
            activeKey={activeCategory}
            onSelect={(eventKey) => setActiveCategory(eventKey || "All")}
            className="product-categories"
          >
            {productCategories.map((category) => (
              <Nav.Item key={category}>
                <Nav.Link eventKey={category}>{category}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          <Row>
            {products[activeCategory as keyof typeof products].map(
              (product) => (
                <Col
                  key={product.id}
                  md={4}
                  sm={6}
                  xs={12}
                  className="product-card"
                >
                  <div className="card">
                    <img src={product.image} alt={product.name} />
                    <div className="product-details">
                      <h3>{product.name}</h3>
                      <div className="product-rating">
                        {renderStars(product.rating)}
                      </div>
                      <p>{product.price}</p>
                    </div>
                  </div>
                </Col>
              )
            )}
          </Row>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="product-benefits">
        <Container>
          <Row>
            <Col md={4}>
              <div className="benefit-item">
                <i className="icon-high-quality"></i>
                <span>High Quality</span>
              </div>
            </Col>
            <Col md={4}>
              <div className="benefit-item">
                <i className="icon-warranty"></i>
                <span>Warranty Protection</span>
              </div>
            </Col>
            <Col md={4}>
              <div className="benefit-item">
                <i className="icon-support"></i>
                <span>24/7 Support</span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Gallery Section */}
      <section className="product-gallery">
        <Container>
          <h2>Our Gallery</h2>
          <Row>
            {galleryImages.map((image, index) => (
              <Col key={index} md={4} sm={6} xs={12}>
                <img src={image} alt={`Gallery ${index + 1}`} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <Container>
          <Row>
            <Col>
              <div className="testimonial-card">
                <p>A testimonial quote about the product goes here.</p>
                <div className="testimonial-author">
                  <img src="/path/to/author-image.jpg" alt="Author" />
                  <span>Lara Smith</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
