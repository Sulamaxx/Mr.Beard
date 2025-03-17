import React from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container-fluid">
      <Row>
        <Col className="col-12">
          <h1>Home</h1>
          <Row>
          <Link to="/signin">Sign In</Link>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
