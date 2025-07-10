import React, { useState } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import PendingOrders from './PendingOrders';
import CompleteOrders from './CompleteOrders';
import './OrderDetails.scss';

type TabType = 'pending' | 'complete';

const OrderDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('pending');

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <div className="my-orders-page">
      <Container fluid className="orders-container">
        <Row className="justify-content-center">
          <Col lg={12}>
            <div className="orders-card">
              <div className="orders-header">
                <h2 className="orders-title">ORDER DETAILS</h2>
              </div>

              <div className="orders-tabs">
                <Nav variant="underline" className="custom-tabs">
                  <Nav.Item>
                    <Nav.Link 
                      className={activeTab === 'pending' ? 'active' : ''}
                      onClick={() => handleTabChange('pending')}
                    >
                      Pending Orders
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      className={activeTab === 'complete' ? 'active' : ''}
                      onClick={() => handleTabChange('complete')}
                    >
                      Complete orders
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>

              <div className="orders-content">
                {activeTab === 'pending' ? <PendingOrders /> : <CompleteOrders />}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OrderDetails;