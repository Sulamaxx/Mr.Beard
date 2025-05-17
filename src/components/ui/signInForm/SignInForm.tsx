import { useState, FormEvent } from "react";
import { Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./SignInForm.scss";
import { useAuth } from "../../../contexts/AuthContext";
import PasswordResetModal from "../passwordResetModal/PasswordResetModal"; // Import the new multi-step modal component

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
  const [showResetModal, setShowResetModal] = useState(false); // State for controlling modal visibility

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
      await login(email, password);
      // Redirect to dashboard on successful login
      navigate('/dashboard'); // Adjust path as needed
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