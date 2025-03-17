import React from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import './Footer.scss';
import logo from '/src/assets/images/logo.svg';
import twitter from '/src/assets/images/footer/twitter-x.svg';
import linkedin from '/src/assets/images/footer/linkedin.svg';
import facebook from '/src/assets/images/footer/facebook.svg';
import instagram from '/src/assets/images/footer/instagram.svg';

const Footer: React.FC = () => {
  return (
    <footer className="mr-beard-footer">
      <Container>
        <Row className="footer-content py-4 pb-5">
          {/* Logo Column */}
          <Col lg={3} md={6} sm={12} className="mb-4 mb-lg-0 logo-column">
            <div className="brand-logo">
              <img 
                src={logo} 
                alt="MR.BEARD Logo" 
                className="footer-logo"
              />
            </div>
          </Col>

          {/* Navigation Links - First Column */}
          <Col lg={2} md={6} sm={12} className="mb-4 mb-lg-0 footer-links text-lg-start">
            <ul className="list-unstyled">
              <li><a href="/">Home</a></li>
              <li><a href="/collection">Collection</a></li>
              <li><a href="/products">Products</a></li>
            </ul>
          </Col>

          {/* Navigation Links - Second Column */}
          <Col lg={3} md={6} sm={12} className="mb-4 mb-lg-0 footer-links text-lg-start">
            <ul className="list-unstyled">
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </Col>

          {/* Newsletter Column */}
          <Col lg={4} md={6} sm={12} className="newsletter-column">
            <p className="newsletter-text">
              Be the first to know about our biggest and best sales. We'll never send more than one email a month.
            </p>
            <Form className="newsletter-form">
              <Form.Control
                type="email"
                placeholder="ENTER YOUR EMAIL"
                className="newsletter-input"
              />
            </Form>
            <div className="social-icons">
              <a href="#" className="social-icon twitter" aria-label="Twitter">
                <img src={twitter} alt='Twitter-x'/>
              </a>
              <a href="#" className="social-icon linkedin" aria-label="LinkedIn">
              <img src={linkedin} alt='Linkedin'/>
              </a>
              <a href="#" className="social-icon facebook" aria-label="Facebook">
              <img src={facebook} alt='Facebook'/>
              </a>
              <a href="#" className="social-icon instagram" aria-label="Instagram">
              <img src={instagram} alt='Instagram'/>
              </a>
            </div>
          </Col>
        </Row>

        {/* Copyright Row */}
        <Row className="copyright-row py-3">
          <Col xs={12} className="text-center">
            <p className="copyright-text mb-0">
              All rights are reserved by Mr.Beard | Develop by <span className="developer">C-Lento</span>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;