import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import './BillingDetails.scss';

interface BillingData {
  firstName: string;
  lastName: string;
  country: string;
  company: string;
  streetAddress: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

interface BillingDetailsProps {
  initialData?: BillingData;
  onSubmit?: (data: BillingData) => Promise<{ success: boolean; message: string }>;
}

const BillingDetails: React.FC<BillingDetailsProps> = ({ initialData, onSubmit }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [billingData, setBillingData] = useState<BillingData>({
    firstName: '',
    lastName: '',
    country: '',
    company: '',
    streetAddress: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    phone: ''
  });

  // City options in alphabetical order
  const cityOptions = [
    "Ambalangoda",
    "Ampara",
    "Anuradhapura",
    "Awissawella",
    "Badulla",
    "Batticaloa",
    "Chilaw",
    "Colombo",
    "Embilipitiya",
    "Galle",
    "Gampaha",
    "Hambantota",
    "Jaffna",
    "Kaluthara",
    "Kandy",
    "Kegalle",
    "Kilinochchi",
    "Kurunegala",
    "Mahiyangana",
    "Mannar",
    "Matara",
    "Monaragala",
    "Nuwara Eliya",
    "Polonnaruwa",
    "Puttalam",
    "Rathnapura",
    "Trincomalee",
    "Vavunia"
  ];

  // Update form data when initialData changes (only on first mount)
  useEffect(() => {
    if (initialData && billingData.firstName === '' && billingData.lastName === '' && billingData.country === '') {
      setBillingData(initialData);
    }
  }, [initialData, billingData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBillingData({
      ...billingData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!onSubmit) return;
    
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const result = await onSubmit(billingData);
      
      if (result.success) {
        setSuccessMessage(result.message);
        // Keep form data filled - don't clear inputs
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="billing-details-card">
      <Card.Body>
        <div className="billing-header">
          <h4 className="billing-title">BILLING DETAILS</h4>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Alert variant="success" className="mb-3">
            {successMessage}
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} className="billing-form text-md-start">
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>First Name*</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={billingData.firstName}
                  onChange={handleChange}
                  className="billing-input"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Last Name*</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={billingData.lastName}
                  onChange={handleChange}
                  className="billing-input"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Country / Region*</Form.Label>
                <Form.Control
                  type="text"
                  name="country"
                  placeholder="Country / Region"
                  value={billingData.country}
                  onChange={handleChange}
                  className="billing-input"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  type="text"
                  name="company"
                  placeholder="Company (optional)"
                  value={billingData.company}
                  onChange={handleChange}
                  className="billing-input"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Street Address*</Form.Label>
                <Form.Control
                  type="text"
                  name="streetAddress"
                  placeholder="House number and street name"
                  value={billingData.streetAddress}
                  onChange={handleChange}
                  className="billing-input"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Apt, suite, unit</Form.Label>
                <Form.Control
                  type="text"
                  name="apartment"
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  value={billingData.apartment}
                  onChange={handleChange}
                  className="billing-input"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>City*</Form.Label>
                <Form.Select
                  name="city"
                  value={billingData.city}
                  onChange={handleChange}
                  className="billing-input"
                  required
                >
                  <option value="">Select City</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>State*</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  placeholder="State"
                  value={billingData.state}
                  onChange={handleChange}
                  className="billing-input"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Postal Code*</Form.Label>
                <Form.Control
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={billingData.postalCode}
                  onChange={handleChange}
                  className="billing-input"
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group>
                <Form.Label>Phone*</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={billingData.phone}
                  onChange={handleChange}
                  className="billing-input"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="billing-submit-section">
            <Button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default BillingDetails;