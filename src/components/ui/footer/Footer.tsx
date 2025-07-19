import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
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
          <Col lg={3} md={6} sm={12} className="mb-4 mb-lg-0 footer-links text-lg-start">
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
          <Col lg={3} md={6} sm={12} className="mb-4 mb-lg-0 footer-links text-lg-start">
            {/* <p className="newsletter-text">
              Be the first to know about our biggest and best sales. We'll never send more than one email a month.
            </p>
            <Form className="newsletter-form">
              <Form.Control
                type="email"
                placeholder="ENTER YOUR EMAIL"
                className="newsletter-input"
              />
            </Form> */}

            <ul className="list-unstyled">
              <li><a href="/return-policy">Return Policy</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/terms-conditions">Terms & Conditions</a></li>
            </ul>

            <div className="social-icons">
              <a href="#" className="social-icon twitter" aria-label="X">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" className="social-icon linkedin" aria-label="LinkedIn">
              <i className="bi bi-linkedin"></i>
              </a>
              <a href="#" className="social-icon facebook" aria-label="Facebook">
              <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="social-icon instagram" aria-label="Instagram">
              <i className="bi bi-instagram"></i>
              </a>
            </div>
          </Col>
        </Row>
      </Container>

        {/* Copyright Row */}
        <Row className="copyright-row py-3">
          <Col xs={12} className="text-center">
            <p className="copyright-text mb-0">
              All rights are reserved by Mr.Beard | Develop by <span className="developer">C-Lento</span>
            </p>
          </Col>
        </Row>
    </footer>
  );
};

export default Footer;