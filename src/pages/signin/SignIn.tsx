import { Container, Row, Col } from "react-bootstrap";
import "./SignIn.scss"; // Custom SCSS styles
import logo from "../../assets/images/logo.svg";
import Saly from "../../assets/images/signInUp/Saly-14.png";
import SignInForm from "../../components/ui/signInForm/SignInForm";
import SignUpForm from "../../components/ui/signUpForm/SignUpForm";
import { useState } from "react";

function SignIn() {
  const [showForm, setShowForm] = useState('formSignIn'); // Default form to show

  return (
    <div className="sign-in-page">
      <Container fluid className="p-0 position-absolute" style={{ zIndex: -1 }}>
        <Row className="g-0">
          {/* LEFT SECTION (Brand + Background Pattern) */}
          <Col
            md={6}
            className="left-section d-flex flex-column justify-content-center align-items-center vh-100"
          >
            <div className="brand-logo">
              <img src={logo} alt="Logo" />
            </div>
          </Col>

          {/* RIGHT SECTION (Form + Illustration) */}
          <Col
            md={6}
            className="right-section d-flex flex-column justify-content-center align-items-center vh-100 d-none d-md-block"
          >
            {/* ILLUSTRATION */}
            <div className="saly-container">
              <img src={Saly} alt="Decoration Image" />
            </div>
          </Col>
        </Row>
      </Container>

      {/* SIGN IN FORM */}
      <div className="form-container">
        {showForm === 'formSignIn' ? (
          <SignInForm setShowForm={setShowForm} />
        ) : (
          <SignUpForm setShowForm={setShowForm} />
        )}
      </div>
    </div>
  );
}

export default SignIn;
