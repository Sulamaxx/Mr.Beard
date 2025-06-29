import React from 'react';
import PolicyActionButtons from './policyActionButtons/PolicyActionButtons';
import './PolicyPages.scss';

const ReturnPolicy: React.FC = () => {
  return (
    <div className="policy-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="policy-content text-start">
              <h1 className="page-title text-center mb-5">RETURN POLICY</h1>
              
              <p className="intro-text mb-5">
                At Mr. Beard, we take pride in the quality of our products. If you're not fully satisfied with your purchase, we're here to help.
              </p>

              <section className="policy-section mb-4">
                <h3 className="section-title">Return Eligibility:</h3>
                <ul className="policy-list">
                  <li>Items must be returned within 7 days of delivery.</li>
                  <li>Products must be unused, unopened, and in their original packaging.</li>
                  <li>Items marked as "Final Sale" are non-returnable.</li>
                </ul>
              </section>

              <section className="policy-section mb-4">
                <h3 className="section-title">How to Initiate a Return:</h3>
                <ol className="policy-list numbered">
                  <li>Email us at support@mrbeard.com with your order number and reason for return.</li>
                  <li>We will send you a return shipping label (if eligible).</li>
                  <li>Once we receive and inspect your return, we'll notify you of the status.</li>
                </ol>
              </section>

              <section className="policy-section mb-4">
                <h3 className="section-title">Refunds:</h3>
                <ul className="policy-list">
                  <li>Approved returns will be refunded to your original payment method.</li>
                  <li>Please allow 5-10 business days for the refund to reflect.</li>
                </ul>
              </section>

              <section className="policy-section mb-5">
                <h3 className="section-title">Exchanges:</h3>
                <ul className="policy-list">
                  <li>Exchanges are available for damaged or defective items only.</li>
                </ul>
              </section>

              <PolicyActionButtons />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;