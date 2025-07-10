import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./AboutUs.scss";
import ownerImage from "/src/assets/images/about/owner.png";
import visionImage from "/src/assets/images/about/vision.png";
import missionImage from "/src/assets/images/about/mission.png";

const AboutUs: React.FC = () => {
  return (
    <div className="about-us">
      {/* Move the about-us-header class to wrap the entire founder section */}
      <div className="about-us-header">
        <Container>
          {/* About Us Header */}
          <Row>
            <Col xs={12} className="text-center mt-5">
              <h1 className="section-title">Meet the Founder</h1>
            </Col>
          </Row>

          {/* Title Section with Image */}
          <Row className="mb-md-5 align-items-start">
            <Col className="mb-4 mb-md-0 col-sm-auto">
              <div className="product-image-container">
                <img
                  src={ownerImage}
                  alt="The Company Founder"
                  className="img-fluid product-image"
                  width={450}
                />
              </div>
            </Col>
            <Col lg={6} md={8} sm={12} className="mt-lg-4">
              <p className="founder-section-text text-md-start mt-md-5">
                Dilshan T Amarasinghe is a dynamic entrepreneur, Visiting
                Lecturer, and SME Business Consultant with a Entrepreneurship and
                Business Management background from the University of Sri
                Jayewardenepura. As the owner of four brands, he is dedicated to
                empowering businesses and redefining men's grooming in Sri Lanka.
                 <br />
                <br />
                At Mr. Beard, we believe grooming is more than just style—it's
                about confidence, self-care, and making a difference. Join us in
                transforming men's grooming while supporting a truly important
                cause.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {/* Vision Section */}
        <Row className="mt-0">
          <Col md={7} className="d-flex flex-column">
            <div className="beard-wax-text text-white h-100 d-flex flex-column">
              <h1 className="text-uppercase text-center text-md-start mt-2 section-subtitle">
                Vision
              </h1>
              <div className="mt-auto">
                <Col md={12}>
                  <p className="text-start text-center text-md-start section-text">
                    "To become Sri Lanka's most trusted and inspiring men's
                    grooming brand — empowering every man to wear his beard with
                    confidence, pride, and personality."
                  </p>
                </Col>
              </div>
            </div>
          </Col>
          <Col>
            <div className="product-image-container with-glow d-flex justify-content-center justify-content-md-end">
              <img
                src={visionImage}
                alt="Vision Image"
                className="img-fluid product-image"
                height={150}
              />
            </div>
          </Col>
        </Row>

        {/* Mission Section */}
        <Row className="my-5">
          <Col md={7} className="align-content-start mt-2 d-md-none">
            <div className="beard-wax-text text-white ps-md-5">
              <h1 className="text-uppercase text-center text-md-end mt-5 section-subtitle">
                Mission
              </h1>
              <Col md={12}>
                <p className="text-start text-center text-md-end section-text">
                  We are on a mission to deliver high-quality, locally made
                  beard care products that solve real grooming problems. With
                  natural ingredients, modern design, and genuine customer care,
                  we help men grow healthier beards and stronger identities —
                  one drop at a time.
                </p>
              </Col>
            </div>
          </Col>
          <Col>
            <div className="product-image-container with-glow d-flex justify-content-center justify-content-md-start">
              <img
                src={missionImage}
                alt="Mission Image"
                className="img-fluid product-image"
                height={150}
              />
            </div>
          </Col>

          <Col md={7} className="d-flex flex-column d-none d-md-block">
            <div className="beard-wax-text text-white h-100 d-flex flex-column">
              <h1 className="text-uppercase text-center text-md-end mt-2 section-subtitle">
                Mission
              </h1>
              <div className="mt-auto">
                <Col md={12}>
                  <p className="text-start text-center text-md-end section-text">
                    We are on a mission to deliver high-quality, locally made
                    beard care products that solve real grooming problems. With
                    natural ingredients, modern design, and genuine customer
                    care, we help men grow healthier beards and stronger
                    identities — one drop at a time.
                  </p>
                </Col>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutUs;