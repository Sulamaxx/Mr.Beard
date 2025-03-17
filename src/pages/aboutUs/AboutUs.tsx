import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './AboutUs.scss';
import aboutImage from '/src/assets/images/about/about_image.png';

const AboutUs: React.FC = () => {
  return (
    <div className="about-us">
      <Container>
        {/* About Us Header */}
        <Row className="mb-5">
          <Col xs={12} className="text-center">
            <h1 className="section-title">ABOUT US</h1>
          </Col>
        </Row>

        {/* Title Section with Image */}
        <Row className="mb-5 align-items-center">
          <Col lg={5} md={6} sm={12} className="mb-4 mb-md-0">
            <div className="product-image-container">
              <img 
                src={aboutImage} 
                alt="Beard Wax Product" 
                className="img-fluid product-image"
              />
            </div>
          </Col>
          <Col lg={7} md={6} sm={12}>
            <h2 className="section-subtitle">TITLE</h2>
            <p className="section-text">
              Lorem ipsum is simply dummy text of the printing and typesetting industry. 
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
              Lorem ipsum is simply dummy text of the printing and typesetting industry. 
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
            </p>
            <p className="section-text">
              Lorem ipsum is simply dummy text of the printing and typesetting industry. 
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
              Lorem ipsum is simply dummy text of the printing and typesetting industry. 
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
            </p>
          </Col>
        </Row>

        {/* Vision Section */}
        <Row className="mb-5">
          <Col xs={12} className="text-center">
            <h2 className="section-subtitle">VISION</h2>
            <div className="max-width-text">
              <p className="section-text text-center">
                Lorem ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                Lorem ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                Lorem ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
              </p>
            </div>
          </Col>
        </Row>

        {/* Mission Section */}
        <Row className="mb-5">
          <Col xs={12} className="text-center">
            <h2 className="section-subtitle">MISSION</h2>
            <div className="max-width-text">
              <p className="section-text text-center">
                Lorem ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                Lorem ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                Lorem ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
              </p>
            </div>
          </Col>
        </Row>

      </Container>
    </div>
  );
};

export default AboutUs;