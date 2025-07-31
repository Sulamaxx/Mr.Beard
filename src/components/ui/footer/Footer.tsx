import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.scss';
import logo from '/src/assets/images/logo.svg';

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
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </Col>

          {/* Navigation Links - Second Column */}
          <Col lg={3} md={6} sm={12} className="mb-4 mb-lg-0 footer-links text-lg-start">
            <ul className="list-unstyled">
              <li><a href="/hair">Hair</a></li>
              <li><a href="/beard">Beard</a></li>
              <li><a href="/apparel">Apparel</a></li>
              <li><a href="/accessories">Accessories</a></li>

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
              <a href="https://www.facebook.com/share/1bKskpeoJm/?mibextid=wwXIfr" target="_blank" className="social-icon facebook" aria-label="Facebook">
              <i className="bi bi-facebook"></i>
              </a>
              <a href="https://www.instagram.com/dilshan_t_amarasinghe" target="_blank" className="social-icon instagram" aria-label="Instagram">
              <i className="bi bi-instagram"></i>
              </a>
              <a href="https://www.tiktok.com/@__mrbeard?_t=ZS-8yUgxpIv01R&_r=1" target="_blank" className="social-icon tiktok" aria-label="Tiktok">
                <i className="bi bi-tiktok"></i>
              </a>
              <a href="https://www.linkedin.com/in/dilshan-t-amarasinghe" target="_blank" className="social-icon linkedin" aria-label="LinkedIn">
              <i className="bi bi-linkedin"></i>
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