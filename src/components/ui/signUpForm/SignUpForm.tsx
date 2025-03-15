import { Row, Col, Form, Button } from "react-bootstrap";
import "./SignUpForm.scss";
import googleLogo from "/src/assets/images/signInUp/google_logo.svg";
import facebookLogo from "/src/assets/images/signInUp/facebook_logo.svg";

interface SignUpFormProps {
  setShowForm: (formType: string) => void;
}

function SignUpForm({ setShowForm }: SignUpFormProps) {
  return (
    <Row className="justify-content-center align-items-center vh-100 m-0 px-2 px-md-0">
      <Col md={6} lg={4} className="bg-white p-4 rounded-4">
        <h2 className="form-title">Sign Up</h2>
        <p className="subtitle">Create your account</p>

        {/* SIGN UP FORM */}
        <Form className="text-start">
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" placeholder="Enter your email" />
          </Form.Group>

          <Row>
            <Col md={6}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your Name" />
            </Form.Group>          
            </Col>
            <Col md={6}>
            <Form.Group className="mb-3" controlId="formMobile">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control type="tel" placeholder="Enter your Mobile Number" />
            </Form.Group>          
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter your password" />
          </Form.Group>

          <Button
            variant="primary"
            className="w-100 my-3"
            style={{
              color: "#fff",
            }}
          >
            Sign Up
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
