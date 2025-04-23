import { useState, FormEvent } from "react";
import { Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./SignUpForm.scss";
import { useAuth } from "../../../contexts/AuthContext";
import ApiService from "../../../services/ApiService"; // Import the ApiService

interface SignUpFormProps {
  setShowForm: (formType: string) => void;
}

function SignUpForm({ setShowForm }: SignUpFormProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    password_confirmation: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [validated, setValidated] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      // Use ApiService for the registration request
      const data = await ApiService.post('/v2/register', formData);
      
      // Registration successful
      if (data.access_token) {
        // Store token in localStorage
        localStorage.setItem("token", data.access_token);
        
        // Auto-login after registration
        await login(formData.email, formData.password);
        
        // Redirect to dashboard
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      
      // Handle validation errors from Laravel backend
      if (err.response?.status === 422) {
        setValidationErrors(err.response.data.errors || {});
        setError("Please check the form for errors.");
      } else {
        setError(err.response?.data?.message || "An error occurred during registration. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getValidationFeedback = (field: string) => {
    return validationErrors[field] ? (
      Array.isArray(validationErrors[field]) 
        ? validationErrors[field][0] 
        : validationErrors[field]
    ) : "";
  };

  return (
    <Row className="justify-content-center align-items-center vh-100 m-0 px-2 px-md-0">
      <Col md={6} lg={4} className="bg-white p-4 rounded-4">
        <h2 className="form-title">Sign Up</h2>
        <p className="subtitle">Create your account</p>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* SIGN UP FORM */}
        <Form noValidate validated={validated} onSubmit={handleSubmit} className="text-start">
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!validationErrors.email}
              required
            />
            <Form.Control.Feedback type="invalid">
              {getValidationFeedback("email") || "Please provide a valid email."}
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter your Name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.name}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {getValidationFeedback("name") || "Name is required."}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formMobile">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="mobile"
                  placeholder="Enter your Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.mobile}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {getValidationFeedback("mobile") || "Valid mobile number is required."}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!validationErrors.password}
              required
            />
            <Form.Control.Feedback type="invalid">
              {getValidationFeedback("password") || "Password is required."}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPasswordConfirmation">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="password_confirmation"
              placeholder="Confirm your password"
              value={formData.password_confirmation}
              onChange={handleChange}
              isInvalid={!!validationErrors.password_confirmation}
              required
            />
            <Form.Control.Feedback type="invalid">
              {getValidationFeedback("password_confirmation") || "Please confirm your password."}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 my-3"
            style={{
              color: "#fff",
            }}
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </Button>
        </Form>

        <div className="signin-link text-center mt-2">
          <span>Already have an account?</span>
          &nbsp;
          <a onClick={() => setShowForm("formSignIn")}>Sign In</a>
        </div>
      </Col>
    </Row>
  );
}

export default SignUpForm;