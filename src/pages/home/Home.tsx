import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
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

import iconHighQuality from "/src/assets/icons/icon-high-quality.png";
import iconWarranty from "/src/assets/icons/icon-warranty.png";
import iconSupport from "/src/assets/icons/icon-support.png";

import featureProductsBg from "/src/assets/images/home/feature-products-background.png";
import FeaturedProducts from "../../components/ui/featuredProducts/FeaturedProducts";
import Gallery from "../../components/ui/gallery/Gallery";
import Testimonials from "../../components/ui/testimonials/Testimonials";

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

  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  
  // In a real application, you might fetch this data from an API
  useEffect(() => {
    // Sample data - in a real app, you should calculate aspect ratios from actual images
    const items = [
      {
        id: '1',
        image: 'src/assets/images/home/gallery/g1.jpg',
        alt: 'Man with full beard',
        aspectRatio: 1, // square image
      },
      {
        id: '2',
        image: 'src/assets/images/home/gallery/g2.jpg',
        alt: 'Man with glasses and beard',
        aspectRatio: 0.75, // portrait image
      },
      {
        id: '3',
        image: 'src/assets/images/home/gallery/g3.jpg',
        alt: 'Man with styled hair and beard',
        aspectRatio: 0.8, // portrait image
      },
      {
        id: '4',
        image: 'src/assets/images/home/gallery/g4.jpg',
        alt: 'Man with plaid shirt and beard',
        aspectRatio: 1.33, // landscape image
      },
      {
        id: '5',
        image: 'src/assets/images/home/gallery/g5.jpg',
        alt: 'Man with beard in dark lighting',
        aspectRatio: 0.8, // portrait image
      },
      {
        id: '6',
        image: 'src/assets/images/home/gallery/g6.jpg',
        alt: 'Man with hat and long beard',
        aspectRatio: 0.8, // portrait image
      },
      {
        id: '7',
        image: 'src/assets/images/home/gallery/g7.jpg',
        alt: 'Man with short beard',
        aspectRatio: 0.7, // portrait image
      },
      {
        id: '8',
        image: 'src/assets/images/home/gallery/g8.jpg',
        alt: 'Man with red shirt and beard',
        aspectRatio: 0.75, // portrait image
      },
    ];
    
    setGalleryItems(items);
  }, []);

  const testimonialData = [
    {
      id: '1',
      quote: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      author: 'Sarah Johnson',
      image: 'src/assets/images/home/testimonials/t1.jpg',
      position: 'Happy Customer'
    },
    {
      id: '2',
      quote: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      author: 'Michelle Davis',
      image: 'src/assets/images/home/testimonials/t2.png',
      position: 'Loyal Client'
    },
    {
      id: '3',
      quote: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      author: 'Jennifer Smith',
      image: 'src/assets/images/home/testimonials/t1.jpg',
      position: 'Regular Customer'
    },
    {
      id: '4',
      quote: 'Your beard products have completely transformed my grooming routine. I get compliments everywhere I go!',
      author: 'Robert Thompson',
      image: 'src/assets/images/home/testimonials/t2.png',
      position: 'Verified Buyer'
    },
    {
      id: '5',
      quote: 'The beard oil is incredible. My beard has never felt so soft and looked so good.',
      author: 'David Wilson',
      image: 'src/assets/images/home/testimonials/t1.jpg',
      position: 'Loyal Customer'
    }
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
          <Button variant="secondary">Start Shopping <i className="bi bi-arrow-up-right"></i></Button>
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
                <h1 className="text-uppercase text-primary text-start mt-5">
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
      <section className="featured-products py-5">
        <h1 className="text-uppercase text-primary text-start text-center">
          Beard Oil For You
        </h1>
        <Row className="justify-content-center mt-4">
          <Col md={6}>
            <p className="text-white">
              Some of our customers say that they trust us and buy our product
              without any hesitation because they believe us and always happy to
              buy our product.
            </p>
          </Col>
        </Row>
        <FeaturedProducts />
      </section>

      {/* Benefits Section */}
      <section className="product-benefits">
        <Container>
          <Row>
            <Col md={4}>
              <div className="benefit-item">
                <Row>
                  <Col md={"auto"}>
                    <img src={iconHighQuality} alt={"iconHighQuality"}></img>
                  </Col>
                  <Col md={6}>
                    <Row>
                      <h4 className="text-center text-md-start">
                        High Quality
                      </h4>
                    </Row>
                    <Row>
                      <span className="text-center text-md-start">
                        Crafted from top materials
                      </span>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col md={4} className="mt-4 mt-md-0">
              <div className="benefit-item">
                <Row>
                  <Col md={"auto"}>
                    <img src={iconWarranty} alt={"iconWarranty"}></img>
                  </Col>
                  <Col md={6}>
                    <Row>
                      <h4 className="text-center text-md-start">
                        Warrany Protection
                      </h4>
                    </Row>
                    <Row>
                      <span className="text-center text-md-start">
                        Over 2 years
                      </span>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col md={4} className="mt-4 mt-md-0">
              <div className="benefit-item">
                <Row>
                  <Col md={"auto"}>
                    <img src={iconSupport} alt={"iconSupport"}></img>
                  </Col>
                  <Col md={6}>
                    <Row>
                      <h4 className="text-center text-md-start">
                        24 / 7 Support
                      </h4>
                    </Row>
                    <Row>
                      <span className="text-center text-md-start">
                        Dedicated support
                      </span>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Gallery Section */}
      <Gallery
        items={galleryItems}
        title="Beard Style Gallery"
        subtitle="Get inspired by our collection of trending beard styles"
        columnCountSm={1}
        columnCountMd={2}
        columnCountLg={4}
        gapSize={10}
      />

      {/* Testimonials Section */}
        <Testimonials 
        testimonials={testimonialData} 
      />
    </div>
  );
};

export default Home;
