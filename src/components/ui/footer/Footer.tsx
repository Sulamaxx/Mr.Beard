import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.scss';
import logo from '/src/assets/images/logo.svg';
import codLogo from '/src/assets/icons/cod.png';

const Footer: React.FC = () => {
  return (
    <footer className="mr-beard-footer">
      <Container>
        <Row className="footer-content py-3">
          {/* Logo Column */}
          <Col lg={3} md={6} sm={12} className="mb-4 mb-lg-0 logo-column">
            <div className="brand-logo">
              <img 
                src={logo} 
                alt="MR.BEARD Logo" 
                className="footer-logo"
              />
            </div>
            <div className='text-center text-lg-start mt-3'>
              <b>Address: </b><br />
              <small>No: 37/D/1 Samurdhi Avenue, Sapugaskanda, Sri Lanka 11607</small><br />
              <b>Hotline: </b><br />
              <a className='text-decoration-none' href='tel:076 082 0695'>076 082 0695</a>
            </div>
          </Col>

          {/* Navigation Links - First Column */}
          <Col lg={3} md={6} sm={12} className="mb-4 mb-lg-0 footer-links text-lg-start">
            <b className='fs-6'>Work Time</b><br />
            <div className='mt-2'>
              Order Online: <br />
              Available 24x7<br />
            </div>
            <div className='mt-2'>
              Head Quarters Open<br />
              Monday to Friday - 9AM to 6PM
            </div>
          </Col>

          {/* Navigation Links - Second Column */}
          <Col lg={3} md={6} sm={12} className="mb-4 mb-lg-0 footer-links text-lg-start">
            <ul className="list-unstyled">
              <li><a href="/beard">Beard</a></li>
              <li><a href="/hair">Hair</a></li>
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
              <li><a href="https://www.promptxpress.lk/TrackItem.aspx#" target="_blank" rel="noopener">Tracking</a></li>
            </ul>

            <div className="social-icons">
              <a href="https://web.facebook.com/mrbeardstorelk" target="_blank" rel="noopener" className="social-icon facebook" aria-label="Facebook">
              <i className="bi bi-facebook"></i>
              </a>
              <a href="https://www.instagram.com/mrbeardstore_/" target="_blank" rel="noopener" className="social-icon instagram" aria-label="Instagram">
              <i className="bi bi-instagram"></i>
              </a>
              <a href="https://www.tiktok.com/@mrbeardstore_" target="_blank" rel="noopener" className="social-icon tiktok" aria-label="Tiktok">
                <i className="bi bi-tiktok"></i>
              </a>
              <a href="https://www.linkedin.com/company/mr-beard-store/" target="_blank" rel="noopener" className="social-icon linkedin" aria-label="LinkedIn">
              <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </Col>
        </Row>
        <Row className='mb-3'>
          <a href="https://www.payhere.lk" rel='noopener' target="_blank"><img src={codLogo} width={100} alt='Cash On Delivery'></img><img src="https://www.payhere.lk/downloads/images/payhere_long_banner.png" alt="PayHere" width="400"/></a>
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