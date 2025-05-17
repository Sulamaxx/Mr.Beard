import { useState, FormEvent } from "react";
import { Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./SignInForm.scss";
import { useAuth } from "../../../contexts/AuthContext";
import PasswordResetModal from "../passwordResetModal/PasswordResetModal";

// Updated interface to include user type in the login response
interface LoginResponse {
  status: string;
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
    mobile: string;
    user_type: string;
  };
}

interface SignInFormProps {
  setShowForm: (formType: string) => void;
}

function SignInForm({ setShowForm }: SignInFormProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

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

    try {
      // Call the login function and receive the response
      const response = await login(email, password) as LoginResponse;
      
      // Check user type from the response and redirect accordingly
      if (response.user.user_type === "admin") {
        navigate('/admin');
      } else if (response.user.user_type === "customer") {
        navigate('/');
      } else {
        // Default fallback in case of an unexpected user type
        console.warn(`Unknown user type: ${response.user.user_type}, redirecting to home page`);
        navigate('/');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred during login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Open password reset modal
  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowResetModal(true);
  };

  return (
    <>
      <Row className="justify-content-center align-items-center vh-100 m-0 px-2 px-md-0">
        <Col md={6} lg={4} className="bg-white p-4 rounded-4">
          <h2 className="form-title">Sign In</h2>
          <p className="subtitle">Where Style Meets Confidence.</p>

          {error && <Alert variant="danger">{error}</Alert>}

          {/* SIGN IN FORM */}
          <Form noValidate validated={validated} onSubmit={handleSubmit} className="text-start">
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Your Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Password is required.
              </Form.Control.Feedback>
              
              {/* Forgot Password Link */}
              <div className="text-end mt-1">
                <a 
                  href="#" 
                  onClick={handleForgotPassword} 
                  className="forgot-password-link"
                >
                  Forgot Password?
                </a>
              </div>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mb-3"
              style={{
                color: "#fff",
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Form>

          <div className="signup-link text-center mt-4">
            <span>No Account?</span>
            &nbsp;
            <a onClick={() => setShowForm('formSignUp')}>Sign Up</a>
          </div>
        </Col>
      </Row>

      {/* Multi-step Password Reset Modal */}
      <PasswordResetModal 
        show={showResetModal} 
        onHide={() => setShowResetModal(false)} 
      />
    </>
  );
}

export default SignInForm;