import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./AboutUs.scss";
import ownerImage from "/src/assets/images/about/owner.png";
import visionImage from "/src/assets/images/about/vision.png";
import missionImage from "/src/assets/images/about/mission.png";

const AboutUs: React.FC = () => {
  return (
    <div className="about-us">
      {/* Move the about-us-header class to wrap the entire founder section */}
      <div className="about-us-header">
        <Container>
          {/* About Us Header */}
          <Row>
            <Col xs={12} className="text-center mt-5">
              <h1 className="section-title">Meet the Founder</h1>
            </Col>
          </Row>

          {/* Title Section with Image */}
          <Row className="mb-md-5 align-items-start">
            <Col xs={12}>
              <div className="founder-content-wrapper">
                <div className="founder-image-float">
                  <div className="product-image-container">
                    <img
                      src={ownerImage}
                      alt="The Company Founder"
                      className="img-fluid product-image"
                      width={350}
                    />
                  </div>
                </div>
                <div className="founder-section-text">
                  <p>
                    Dilshan T Amarasinghe is a dynamic entrepreneur, Visiting
                    Lecturer, and SME Business Consultant with a strong academic
                    foundation in Entrepreneurship and Business Management from
                    the University of Sri Jayewardenepura. With a clear vision
                    to empower others and create meaningful impact, he currently
                    leads four brands that are redefining industries and setting
                    new standards for quality, creativity, and purpose-driven
                    business in Sri Lanka.
                  </p>
                  <p>
                    Among these ventures, Mr. Beard holds a special place in his
                    heart. What started as a simple passion for men's grooming
                    has now evolved into a movement that celebrates confidence,
                    self-care, and social responsibility. Dilshan believes
                    grooming is not just about looking good, it's about feeling
                    good, being authentic, and having the courage to express
                    your identity with pride.
                  </p>
                  <p>
                    Through Mr. Beard, he aims to uplift Sri Lankan men by
                    offering high-quality grooming products that meet global
                    standards while staying true to local values. More than just
                    a brand, Mr. Beard is a community, a brotherhood built on
                    trust, education, and empowerment.
                  </p>
                  <p className="founder-quote">
                    <em>
                      "If I can't use it on myself, I will never offer it to my
                      customers."
                    </em>
                  </p>
                  <p>
                    This is a promise Dilshan stands by. Every product under the
                    Mr. Beard label is personally tested, trusted, and
                    guaranteed to be safe, effective, and of the highest
                    quality. Only what he truly believes in makes its way to
                    you. His commitment to quality isn't just professional, it's
                    deeply personal.
                  </p>
                  <p>
                    One of the brand's proudest initiatives is{" "}
                    <strong>"Mr. Beard with No Shave November"</strong>, which
                    reflects the brand's core purpose of supporting those
                    battling cancer. As part of this mission, a portion of the
                    revenue from every bottle of Mr. Beard Oil sold during this
                    period is allocated directly to the No Shave November
                    Project Fund.
                  </p>
                  <p>
                    Through this meaningful initiative, even our customers,
                    knowingly or unknowingly, become contributors to a greater
                    cause. By simply purchasing our products, they take part in
                    a movement that promotes awareness, compassion, and
                    collective giving.
                  </p>
                  <p>
                    This is more than a seasonal campaign; it's a reflection of
                    what Mr. Beard truly stands for: purpose, care, and
                    responsibility.
                  </p>
                  <p>
                    Dilshan's journey as a founder reflects resilience, purpose,
                    and an unwavering commitment to helping others rise. He
                    strongly believes that even a small business can create a
                    big impact if it's built with love, honesty, and a mission
                    to serve. His entrepreneurial path is rooted in meaningful
                    action, not just ambition.
                  </p>
                  <div className="founders-note">
                    <h4>Founder's Note</h4>
                    <p className="founder-quote">
                      <em>
                        "This is more than a business to me. It's a reflection
                        of who I am and what I believe in. Every time you choose
                        Mr. Beard, you're not just choosing a product—you're
                        becoming part of a story built on trust, care, and
                        purpose."
                      </em>
                    </p>
                    <p className="signature">
                      <strong>Dilshan T Amarasinghe</strong>
                      <br />
                      Founder – Mr. Beard (pvt) ltd
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {/* Vision Section */}
        <Row className="mt-0">
          <Col md={7} className="d-flex flex-column">
            <div className="beard-wax-text text-white h-100 d-flex flex-column">
              <h1 className="text-uppercase text-center text-md-start mt-2 section-subtitle">
                Vision
              </h1>
              <div className="mt-auto">
                <Col md={12}>
                  <p className="text-start text-center text-md-start section-text">
                    "To become Sri Lanka's most trusted and inspiring men's
                    grooming brand — empowering every man to wear his beard with
                    confidence, pride, and personality."
                  </p>
                </Col>
              </div>
            </div>
          </Col>
          <Col>
            <div className="product-image-container with-glow d-flex justify-content-center justify-content-md-end">
              <img
                src={visionImage}
                alt="Vision Image"
                className="img-fluid product-image"
                height={150}
              />
            </div>
          </Col>
        </Row>

        {/* Mission Section */}
        <Row className="my-5">
          <Col md={7} className="align-content-start mt-2 d-md-none">
            <div className="beard-wax-text text-white ps-md-5">
              <h1 className="text-uppercase text-center text-md-end mt-5 section-subtitle">
                Mission
              </h1>
              <Col md={12}>
                <p className="text-start text-center text-md-end section-text">
                  We are on a mission to deliver high-quality, locally made
                  beard care products that solve real grooming problems. With
                  natural ingredients, modern design, and genuine customer care,
                  we help men grow healthier beards and stronger identities —
                  one drop at a time.
                </p>
              </Col>
            </div>
          </Col>
          <Col>
            <div className="product-image-container with-glow d-flex justify-content-center justify-content-md-start">
              <img
                src={missionImage}
                alt="Mission Image"
                className="img-fluid product-image"
                height={150}
              />
            </div>
          </Col>

          <Col md={7} className="d-flex flex-column d-none d-md-block">
            <div className="beard-wax-text text-white h-100 d-flex flex-column">
              <h1 className="text-uppercase text-center text-md-end mt-2 section-subtitle">
                Mission
              </h1>
              <div className="mt-auto">
                <Col md={12}>
                  <p className="text-start text-center text-md-end section-text">
                    We are on a mission to deliver high-quality, locally made
                    beard care products that solve real grooming problems. With
                    natural ingredients, modern design, and genuine customer
                    care, we help men grow healthier beards and stronger
                    identities — one drop at a time.
                  </p>
                </Col>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutUs;
