import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './ContactUs.scss';

const ContactUs: React.FC = () => {
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', formData);
      // Reset form after submission
      setFormData({ fullName: '', email: '', message: '' });
    }
    
    setValidated(true);
  };

  return (
    <div className="contact-page">
      {/* Contact Info Header */}
      <div className="contact-info-header">
        <Container>
          <Row className="justify-content-between">
            <Col xs={12} md={4} className="contact-info-item bg-primary rounded-5">
              <div className="icon-container">
                <i className="bi bi-building"></i>
              </div>
              <h3>ADDRESS</h3>
              <p>234 Hai Trieu, Ho Chi Minh City,<br />Viet Nam</p>
            </Col>
            
            <Col xs={12} md={4} className="contact-info-item bg-primary rounded-5">
              <div className="icon-container">
                <i className="bi bi-telephone"></i>
              </div>
              <h3>CONTACT US</h3>
              <p>+84 234 567 890</p>
            </Col>
            
            <Col xs={12} md={4} className="contact-info-item bg-primary rounded-5">
              <div className="icon-container">
                <i className="bi bi-envelope"></i>
              </div>
              <h3>EMAIL</h3>
              <p>hello@3legant.com</p>
            </Col>
          </Row>
        </Container>
      </div>
      
      {/* Contact Form and Map */}
      <Container className="contact-content">
        <Row>
          <Col xs={12} md={6} className="contact-form-container text-start">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-4" controlId="formFullName">
                <Form.Label>FULL NAME</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Your Name" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className='form-control' 
                />
                <Form.Control.Feedback type="invalid">
                  Please provide your name.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="formEmail">
                <Form.Label>EMAIL ADDRESS</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Your Email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid email.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="formMessage">
                <Form.Label>MESSAGE</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={5} 
                  placeholder="Your message" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required 
                />
                <Form.Control.Feedback type="invalid">
                  Please enter your message.
                </Form.Control.Feedback>
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="submit-button"
              >
                Send Message
              </Button>
            </Form>
          </Col>
          
          <Col xs={12} md={6} className="map-container">
            <div className="google-map">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197667!2d106.70232841471821!3d10.777057992318668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e91%3A0x9e15cc3d0e3f40e0!2sHai%20Trieu%2C%20District%201%2C%20Ho%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2sus!4v1647885484830!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                allowFullScreen 
                loading="lazy"
                title="Google Map"
              ></iframe>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactUs;