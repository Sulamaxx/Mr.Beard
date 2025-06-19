import { useState, FormEvent } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import ApiService from "../../../services/ApiService"; // Adjust the path as needed

interface PasswordResetModalProps {
  show: boolean;
  onHide: () => void;
}

// Define interfaces for your API responses
interface ApiResponse {
  message?: string;
  success?: boolean;
  data?: any;
}

function PasswordResetModal({ show, onHide }: PasswordResetModalProps) {
  // Step tracking (1: email, 2: verification code, 3: new password)
  const [step, setStep] = useState(1);
  
  // Form fields
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "danger"; text: string } | null>(null);
  const [validated, setValidated] = useState(false);

  // API base URL - adjust as needed for your environment
  // const API_URL = process.env.REACT_APP_API_URL || "/api";

  // Handle modal close and reset state
  const handleModalClose = () => {
    onHide();
    // Reset all form fields and state on close
    setTimeout(() => {
      setStep(1);
      setEmail("");
      setVerificationCode("");
      setNewPassword("");
      setConfirmPassword("");
      setValidated(false);
      setMessage(null);
    }, 300);
  };

  // Step 1: Request verification code
  const handleRequestCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Call the API to send verification code
      const response:ApiResponse = await ApiService.post('/v2/forgot-password', { email });
      
      // Handle successful response
      setMessage({
        type: "success",
        text: response.message || `Verification code sent to ${email}`
      });
      setStep(2);
      setValidated(false);
    } catch (err: any) {
      console.error("Error sending verification code:", err);
      setMessage({
        type: "danger",
        text: err.response?.data?.message || "Failed to send verification code. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Call the API to verify the code
      const response:ApiResponse = await ApiService.post('/v2/verify-reset-code', {
        email,
        code: verificationCode
      });
      
      // Handle successful response
      setMessage({
        type: "success",
        text: response.message || "Code verified successfully"
      });
      setStep(3);
      setValidated(false);
    } catch (err: any) {
      console.error("Error verifying code:", err);
      setMessage({
        type: "danger",
        text: err.response?.data?.message || "Invalid verification code. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setMessage({
        type: "danger",
        text: "Passwords do not match"
      });
      return;
    }
    
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Call the API to reset the password
      const response:ApiResponse = await ApiService.post('/v2/reset-password', {
        email,
        code: verificationCode,
        password: newPassword,
        password_confirmation: confirmPassword
      });
      
      // Handle successful response
      setMessage({
        type: "success",
        text: response.message || "Password successfully reset. You can now login with your new password."
      });
      
      // Close modal with delay after success
      setTimeout(() => {
        handleModalClose();
      }, 3000);
    } catch (err: any) {
      console.error("Error resetting password:", err);
      setMessage({
        type: "danger",
        text: err.response?.data?.message || "Failed to reset password. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render form based on current step
  const renderStepForm = () => {
    switch (step) {
      case 1:
        return (
          <Form noValidate validated={validated} onSubmit={handleRequestCode}>
            <Form.Group className="mb-3" controlId="formResetEmail">
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

            <div className="d-flex justify-content-end">
              <Button 
                variant="secondary" 
                onClick={handleModalClose} 
                className="me-2"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Code"}
              </Button>
            </div>
          </Form>
        );
      
      case 2:
        return (
          <Form noValidate validated={validated} onSubmit={handleVerifyCode}>
            <Form.Group className="mb-3" controlId="formVerificationCode">
              <Form.Label>Verification Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Verification code is required.
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Enter the code sent to {email}
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button 
                variant="outline-secondary" 
                onClick={() => {
                  setStep(1);
                  setValidated(false);
                  setMessage(null);
                }}
                disabled={isLoading}
              >
                Back
              </Button>
              <div>
                <Button 
                  variant="secondary" 
                  onClick={handleModalClose} 
                  className="me-2"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
              </div>
            </div>
          </Form>
        );
      
      case 3:
        return (
          <Form noValidate validated={validated} onSubmit={handleResetPassword}>
            <Form.Group className="mb-3" controlId="formNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
              <Form.Control.Feedback type="invalid">
                Password must be at least 8 characters.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                isInvalid={validated && newPassword !== confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                Passwords must match.
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button 
                variant="outline-secondary" 
                onClick={() => {
                  setStep(2);
                  setValidated(false);
                  setMessage(null);
                }}
                disabled={isLoading}
              >
                Back
              </Button>
              <div>
                <Button 
                  variant="secondary" 
                  onClick={handleModalClose} 
                  className="me-2"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </div>
          </Form>
        );
      
      default:
        return null;
    }
  };

  // Modal titles for each step
  const modalTitles = {
    1: "Forgot Password",
    2: "Enter Verification Code",
    3: "Set New Password"
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitles[step as keyof typeof modalTitles]}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && <Alert variant={message.type}>{message.text}</Alert>}
        
        {step === 1 && (
          <p>Enter your email address and we'll send you a verification code.</p>
        )}
        
        {renderStepForm()}
      </Modal.Body>
    </Modal>
  );
}

export default PasswordResetModal;