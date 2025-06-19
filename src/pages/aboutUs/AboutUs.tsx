import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./AboutUs.scss";
import ownerImage from "/src/assets/images/about/owner.png";
import visionImage from "/src/assets/images/about/vision.png";
import missionImage from "/src/assets/images/about/mission.png";

const AboutUs: React.FC = () => {
  return (
    <div className="about-us">
      <Container>
        {/* About Us Header */}
        <Row className="mb-lg-5">
          <Col xs={12} className="text-center mt-5">
            <h1 className="section-title">Meet the Founder</h1>
          </Col>
        </Row>

        {/* Title Section with Image */}
        <Row className="mb-md-5 align-items-start">
          <Col lg={5} md={6} sm={12} className="mb-4 mb-md-0">
            <div className="product-image-container">
              <img
                src={ownerImage}
                alt="Beard Wax Product"
                className="img-fluid product-image"
              />
            </div>
          </Col>
          <Col lg={7} md={6} sm={12}>
            <p className="section-text text-md-start">
            Dilshan T Amarasinghe is a dynamic entrepreneur, Visiting Lecturer, and SME Business Consultant with a Entrepreneurship and Business Management background from the University of Sri Jayewardenepura. As the owner of four brands, he is dedicated to empowering businesses and redefining men’s grooming in Sri Lanka.
 <br/><br/>
At Mr. Beard, we believe grooming is more than just style—it’s about confidence, self-care, and making a difference. Join us in transforming men’s grooming while supporting a truly important cause.
            </p>
          </Col>
        </Row>

        {/* Vision Section */}
        <Row>
        <h1 className="text-uppercase text-center text-md-start mt-5 section-subtitle">
            Vision
          </h1>
          <Col md={7} className="align-content-start mt-2 mt-md-5">
            <div className="beard-wax-text text-white">
              <Col md={12}>
                <p className="text-start text-center text-md-start section-text">
                  "To become Sri Lanka’s most trusted and inspiring men’s
                  grooming brand — empowering every man to wear his beard with
                  confidence, pride, and personality."
                </p>
              </Col>
            </div>
          </Col>
          <Col
            md={5}
            style={{
              backgroundImage: `url(${visionImage})`,
              minHeight: "300px",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></Col>
        </Row>

        {/* Mission Section */}
        <Row>
          <h1 className="text-uppercase text-center text-md-end mt-5 section-subtitle">
            Mission
          </h1>
          <Col md={7} className="align-content-start mt-2 d-md-none">
            <div className="beard-wax-text text-white ps-md-5">
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
          <Col
            md={5}
            style={{
              backgroundImage: `url(${missionImage})`,
              minHeight: "440px",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></Col>
          <Col md={7} className="align-content-start mt-5 d-none d-md-block">
            <div className="beard-wax-text text-white ps-md-5">
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
        </Row>
      </Container>
    </div>
  );
};

export default AboutUs;
