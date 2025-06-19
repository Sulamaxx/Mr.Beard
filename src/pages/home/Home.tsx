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
import ourJourneyImage1 from "/src/assets/images/home/our-journey-image1.png";
import ourJourneyImage2 from "/src/assets/images/home/our-journey-image2.png";
import flags from "/src/assets/images/home/flags.png";

import iconHighQuality from "/src/assets/icons/icon-high-quality.png";
import iconWarranty from "/src/assets/icons/icon-warranty.png";
import iconSupport from "/src/assets/icons/icon-support.png";
import g1 from "src/assets/images/home/gallery/g1.jpg";
import g2 from "src/assets/images/home/gallery/g2.jpg";
import g3 from "src/assets/images/home/gallery/g3.jpg";

import featureProductsBg from "/src/assets/images/home/feature-products-background.png";
import FeaturedProducts from "../../components/ui/featuredProducts/FeaturedProducts";
import Gallery from "../../components/ui/gallery/Gallery";
import Testimonials from "../../components/ui/testimonials/Testimonials";
import { Link } from "react-router-dom";

const Home: React.FC = () => {

  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  
  // In a real application, you might fetch this data from an API
  useEffect(() => {
    // Gallary Image data - calculate aspect ratios from actual images
    const items = [
      {
        id: '1',
        image: g1,
        alt: 'Man with full beard',
        aspectRatio: 1, // square image
      },
      {
        id: '2',
        image: g2,
        alt: 'Man with glasses and beard',
        aspectRatio: 0.75, // portrait image
      },
      {
        id: '3',
        image: g3,
        alt: 'Man with styled hair and beard',
        aspectRatio: 0.8, // portrait image
      },
      {
        id: '4',
        image: '/assets/images/home/gallery/g4.jpg',
        alt: 'Man with plaid shirt and beard',
        aspectRatio: 1.33, // landscape image
      },
      {
        id: '5',
        image: '/assets/images/home/gallery/g5.jpg',
        alt: 'Man with beard in dark lighting',
        aspectRatio: 0.8, // portrait image
      },
      {
        id: '6',
        image: '/assets/images/home/gallery/g6.jpg',
        alt: 'Man with hat and long beard',
        aspectRatio: 0.8, // portrait image
      },
      {
        id: '7',
        image: '/assets/images/home/gallery/g7.jpg',
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
  <Container fluid className="p-0 align-content-center">
    <Row className="g-0">
      <Col lg={6} className="hero-content">
        <div className="px-3 px-md-5">
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
          </div>
          <div className="col-3 mt-3">
            <hr className="border-3 border-white" />
          </div>
          <Row className="mt-4">
            <Col sm={6}>
              <div className="hero-stats">
                <h2 className="fw-medium">#01</h2>
                <div>
                  <Link to="/beard">
                    <Button variant="primary">
                      Start Shopping <i className="bi bi-arrow-up-right"></i>
                    </Button>
                  </Link>
                </div>
              </div>
              <Row className="text-start mt-3">
                <div>
                  <img src={reviewers} alt="reviewers" />
                </div>
              </Row>
            </Col>
            <Col sm={6} className="text-start text-lg-center text-xl-start ps-5">
              <div>
                <img src={offer25} alt="offer" />
              </div>
            </Col>
          </Row>
        </div>
      </Col>
      <Col md={6} className="hero-image d-none d-lg-block">
        <img src={heroImage} alt="Beard Oil Bottle" draggable='false' />
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
          <Link to="/beard">
              <Button variant="dark">Start Shopping <i className="bi bi-arrow-up-right"></i></Button>
          </Link>
          <img src={beardOilBottle} alt="beard oil" className="bottle-image" draggable='false'/>
        </Container>
      </section>

      <section className="about-section pb-3">
        <Container fluid>
          <Row>
              <h1 className="text-uppercase text-center text-primary text-start mt-5">
              Our Journey
              </h1>
            <Col
              md={5}
              style={{
                backgroundImage: `url(${ourJourneyImage1})`,
                minHeight: "440px",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            ></Col>
            <Col md={7} className="align-content-center">
              <div className="beard-wax-text text-white ps-md-5">
                <Col md={10}>
                  <p className="text-start fs-5 text-center text-md-start">
                  About Mr. Beard—Sri Lanka’s First Beard Care Brand 
Founded in 2018, Mr. Beard is Sri Lanka’s first dedicated beard care brand, revolutionizing an industry that was nearly nonexistent in the country at the time. Our journey began when Dilshan T Amarasinghe, the founder of Mr. Beard, was inspired by No Shave November, a global movement supporting cancer patients. With a deep commitment to men’s grooming and social responsibility, Mr. Beard was born to offer high-quality beard care products while making a real impact.
                  </p>
                </Col>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={7} className="align-content-center">
              <div className="beard-wax-text text-white ps-md-5">
                <Col md={12}>
                  <p className="text-start fs-5 text-center text-md-start">
                  In 2022, we launched Sri Lanka’s first official No Shave November campaign, continuing this initiative in 2023. With every purchase of Mr. Beard Oil, a portion of the proceeds goes directly to supporting cancer patients, ensuring that every customer contributes to a meaningful cause. At the end of each November, we donate funds to hospitals dedicated to cancer treatment.
                  </p>
                </Col>
              </div>
            </Col>
            <Col
              md={5}
              style={{
                backgroundImage: `url(${ourJourneyImage2})`,
                minHeight: "300px",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            ></Col>
          </Row>
          <Row className="align-items-center justify-content-center">
            <Col md={11} className="text-center">            
            <p className="text-start fs-5 text-white text-center text-md-start">
          What started as a beard care brand has now evolved into Sri Lanka’s only locally developed full men’s grooming brand. Our exclusive formulations are made using 100% natural ingredients, specially crafted for Asian skin types, ensuring the best quality and effectiveness.
 <br/><br/>
Today, Mr. Beard proudly delivers premium men’s grooming products to 10+ countries, including Dubai, Qatar, New Zealand, Australia, Japan, Singapore, Maldives, Latvia, and Korea.
            </p>
            </Col>
          </Row>
          <Row>
            <img
              src={flags}
              alt="Country Flags"
              className="img-fluid mt-4"
              style={{ maxWidth: "500px", margin: "0 auto" }}
              draggable='false'
            />
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
