import React from 'react';
import PolicyActionButtons from './policyActionButtons/PolicyActionButtons';
import './PolicyPages.scss';

const TermsConditions: React.FC = () => {
  return (
    <div className="policy-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="policy-content text-start">
              <h1 className="page-title text-center mb-5">TERMS AND CONDITIONS</h1>
              
              <p className="intro-text">
                Welcome to Mr. Beard. By using our website or purchasing from us, you agree to the following terms and conditions.
              </p>

              <section className="policy-section">
                <h3 className="section-title">General:</h3>
                <ul className="policy-list">
                  <li>All content on this website is owned by Mr. Beard and may not be reused without permission.</li>
                  <li>Prices are listed in [LKR/USD] and are subject to change without notice.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h3 className="section-title">Orders:</h3>
                <ul className="policy-list">
                  <li>Orders are confirmed once payment is processed.</li>
                  <li>We reserve the right to cancel any order due to product unavailability or suspected fraud.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h3 className="section-title">Shipping:</h3>
                <ul className="policy-list">
                  <li>We deliver across Sri Lanka within 3-5 business days.</li>
                  <li>Tracking information will be sent via email or SMS.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h3 className="section-title">Limitation of Liability:</h3>
                <ul className="policy-list">
                  <li>Mr. Beard is not liable for any indirect or consequential damages arising from product misuse.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h3 className="section-title">Governing Law:</h3>
                <ul className="policy-list">
                  <li>These terms are governed by the laws of Sri Lanka.</li>
                </ul>
              </section>

              <p className="contact-text">
                If you have questions, reach us at hello@mrbeard.com.
              </p>

              <PolicyActionButtons />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;