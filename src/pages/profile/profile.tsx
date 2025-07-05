import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProfileInfo from '../../components/ui/profileInfo/ProfileInfo';
import ChangePassword from '../../components/ui/changePassword/ChangePassword';
import BillingDetails from '../../components/billingDetails/BillingDetails';
import './profile.scss';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface BillingData {
  firstName: string;
  lastName: string;
  country: string;
  company: string;
  streetAddress: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

const ProfilePage: React.FC = () => {
  const handleProfileSubmit = (data: ProfileData) => {
    console.log('Profile data:', data);
    // Handle profile update API call here
  };

  const handlePasswordSubmit = (data: PasswordData) => {
    console.log('Password data:', data);
    // Handle password change API call here
  };

  const handleBillingSubmit = (data: BillingData) => {
    console.log('Billing data:', data);
    // Handle billing update API call here
  };

  const handleSignOut = () => {
    console.log('Sign out clicked');
    // Handle sign out logic here
  };

  return (
    <div className="profile-page">
      <Container fluid className="profile-container">
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <Row className="g-4">
              {/* Profile Section */}
              <Col lg={6}>
                <ProfileInfo 
                  onSubmit={handleProfileSubmit}
                  onSignOut={handleSignOut}
                />
              </Col>

              {/* Password Section */}
              <Col lg={6}>
                <ChangePassword 
                  onSubmit={handlePasswordSubmit}
                />
              </Col>

              {/* Billing Details Section */}
              <Col xs={12}>
                <BillingDetails 
                  onSubmit={handleBillingSubmit}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfilePage;