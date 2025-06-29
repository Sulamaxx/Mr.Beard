import React from 'react';
import PolicyActionButtons from './policyActionButtons/PolicyActionButtons';
import './PolicyPages.scss';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="policy-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="policy-content text-start">
              <h1 className="page-title text-center mb-5">PRIVACY POLICY</h1>
              
              <p className="intro-text">
                At Mr. Beard, your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.
              </p>

              <section className="policy-section">
                <h3 className="section-title">Information We Collect:</h3>
                <ul className="policy-list">
                  <li>Name, email address, shipping address, and phone number.</li>
                  <li>Payment information via secure gateways (we do not store card details).</li>
                  <li>Browsing behavior on our website (for analytics & marketing).</li>
                </ul>
              </section>

              <section className="policy-section">
                <h3 className="section-title">How We Use Your Data:</h3>
                <ul className="policy-list">
                  <li>To process and fulfill your orders.</li>
                  <li>To send order updates and marketing promotions.</li>
                  <li>To improve user experience on our website.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h3 className="section-title">Third-Party Services:</h3>
                <ul className="policy-list">
                  <li>We may share data with trusted partners (e.g, payment processors, delivery services).</li>
                  <li>We never sell your personal data to third parties.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h3 className="section-title">Your Rights:</h3>
                <ul className="policy-list">
                  <li>You may request access, correction, or deletion of your data at any time.</li>
                  <li>To unsubscribe from marketing emails, click the "unsubscribe" link in our emails.</li>
                </ul>
              </section>

              <p className="contact-text">
                For questions, contact privacy@mrbeard.com.
              </p>

              <PolicyActionButtons />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;