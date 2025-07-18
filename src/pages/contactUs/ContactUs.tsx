import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import ApiService from "../../services/ApiService"; // Adjust path as needed
import "./ContactUs.scss";

interface Response {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

const ContactUs: React.FC = () => {
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    type: "success" | "danger";
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const showAlert = (type: "success" | "danger", message: string) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "success", message: "" });
    }, 5000);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setIsLoading(true);

    try {
      const response: Response = await ApiService.post(
        "/v2/contact/sendMessage",
        formData
      );

      if (response.success) {
        showAlert(
          "success",
          response.message || "Your message has been sent successfully!"
        );
        setFormData({ fullName: "", email: "", message: "" });
        setValidated(false);
      } else {
        showAlert(
          "danger",
          response.message || "Failed to send message. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Contact form error:", error);

      if (error.response?.status === 422) {
        // Validation errors
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(", ");
        showAlert("danger", errorMessages);
      } else {
        showAlert(
          "danger",
          "Sorry, there was an error sending your message. Please try again later."
        );
      }
    } finally {
      setIsLoading(false);
    }

    setValidated(true);
  };

  return (
    <div className="contact-page">
              <Row className="mt-2">
                <h1 className="fw-bolder my-4 text-white">CONTACT US</h1>
              </Row>
      {/* Contact Info Header */}
      <div className="contact-info-header">
        <Container>
          <Row className="justify-content-center g-4">
            <Col
              xs={12}
              lg={4}
              className="d-flex justify-content-center"
            >
              <div className="contact-info-item bg-primary">
                <div className="icon-container">
                  <i className="bi bi-building"></i>
                </div>
                <h3>ADDRESS</h3>
                <p>
                No: 37/D/1 Samurdhi Avenue, Sapugaskanda, Sri Lanka 11607
                </p>
              </div>
            </Col>

            <Col
              xs={12}
              lg={4}
              className="d-flex justify-content-center"
            >
              <div className="contact-info-item bg-primary">
                <div className="icon-container">
                  <i className="bi bi-telephone"></i>
                </div>
                <h3>CONTACT US</h3>
                <p>076 082 0695 / 076 201 9963</p>
              </div>
            </Col>

            <Col
              xs={12}
              lg={4}
              className="d-flex justify-content-center"
            >
              <div className="contact-info-item bg-primary">
                <div className="icon-container">
                  <i className="bi bi-envelope"></i>
                </div>
                <h3>EMAIL</h3>
                <p>Mbs@mrbeardstore.com</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Contact Form and Map */}
      <Container className="contact-content">
        <Row>
          <Col xs={12} lg={6} className="contact-form-container text-start">
            {alert.show && (
              <Alert variant={alert.type} className="mb-4">
                {alert.message}
              </Alert>
            )}

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
                  disabled={isLoading}
                  className="form-control"
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter your message.
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </Form>
          </Col>

          <Col xs={12} lg={6} className="map-container">
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