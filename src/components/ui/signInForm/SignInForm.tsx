import { Row, Col, Form, Button } from "react-bootstrap";
import "./SignInForm.scss";
import googleLogo from "/src/assets/images/signInUp/google_logo.svg";
import facebookLogo from "/src/assets/images/signInUp/facebook_logo.svg";

interface SignInFormProps {
  setShowForm: (formType: string) => void;
}

function SignInForm({ setShowForm }: SignInFormProps) {
  return (
    <Row className="justify-content-center align-items-center vh-100 m-0 px-2 px-md-0">
      <Col md={6} lg={4} className="bg-white p-4 rounded-4">
        <h2 className="form-title">Sign In</h2>
        <p className="subtitle">Where Style Meets Confidence.</p>

        {/* SIGN IN FORM */}
        <Form className="text-start">
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" placeholder="Enter your email" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Your Password</Form.Label>
            <Form.Control type="password" placeholder="Enter your password" />
          </Form.Group>

          <Button
            variant="primary"
            className="w-100 mb-3"
            style={{
              color: "#fff",
            }}
          >
            Sign In
          </Button>
        </Form>

        {/* <div className="continue-with text-center my-3">
          <span>or continue with</span>
        </div> */}

        {/* EXAMPLE: Social Login Buttons or Just a Placeholder */}
        {/* <div className="social-buttons d-flex justify-content-center">
          <Button variant="outline-primary" className="border-0">
            <img src={googleLogo} alt="Google" className="img-fluid logo-button" />
          </Button>
          <Button variant="outline-primary" className="border-0">
            <img src={facebookLogo} alt="Facebook" className="img-fluid logo-button" />
          </Button>
        </div> */}

        <div className="signup-link text-center mt-4">
          <span>No Account?</span>
          &nbsp;
          <a onClick={() => setShowForm('formSignUp')}>Sign Up</a>
        </div>
      </Col>
    </Row>
  );
}

export default SignInForm;
