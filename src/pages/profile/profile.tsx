import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import ProfileInfo from '../../components/ui/profileInfo/ProfileInfo';
import ChangePassword from '../../components/ui/changePassword/ChangePassword';
import BillingDetails from '../../components/ui/billingDetails/BillingDetails';
import ApiService from '../../services/ApiService';
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

interface UserApiResponse {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  country: string;
  company: string | null;
  address: string;
  apartment: string | null;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
  mobile: string;
  user_type: string;
}

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserApiResponse | null>(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await ApiService.get<UserApiResponse>('/v2/user/');
        setUserData(response);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileSubmit = async (data: ProfileData) => {
    try {
      // Update profile data via API
      const updateData = {
        name: data.fullName,
        email: data.email,
        phone: data.phone
      };
      
      const response = await ApiService.put<UserApiResponse>('/v2/user/', updateData);
      setUserData(response);
      console.log('Profile updated successfully:', response);
      
      // You can show a success message here
    } catch (err) {
      console.error('Error updating profile:', err);
      // Handle error - show error message
    }
  };

  const handlePasswordSubmit = async (data: PasswordData) => {
    try {
      // Update password via API
      const passwordData = {
        current_password: data.currentPassword,
        new_password: data.newPassword,
        new_password_confirmation: data.confirmPassword
      };
      
      await ApiService.put('/v2/user/password', passwordData);
      console.log('Password updated successfully');
      
      // You can show a success message here
    } catch (err) {
      console.error('Error updating password:', err);
      // Handle error - show error message
    }
  };

  const handleBillingSubmit = async (data: BillingData) => {
    try {
      // Update billing data via API
      const billingData = {
        first_name: data.firstName,
        last_name: data.lastName,
        country: data.country,
        company: data.company,
        address: data.streetAddress,
        apartment: data.apartment,
        city: data.city,
        state: data.state,
        postal_code: data.postalCode,
        mobile: data.phone
      };
      
      const response = await ApiService.put<UserApiResponse>('/v2/user/', billingData);
      setUserData(response);
      console.log('Billing details updated successfully:', response);
      
      // You can show a success message here
    } catch (err) {
      console.error('Error updating billing details:', err);
      // Handle error - show error message
    }
  };

  const handleSignOut = () => {
    // Handle sign out logic here
    localStorage.removeItem('token');
    // Redirect to login page
    window.location.href = '/login';
  };

  // Transform API data to component props
  const getProfileData = (): ProfileData => {
    if (!userData) {
      return { fullName: '', email: '', phone: '' };
    }
    
    return {
      fullName: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || ''
    };
  };

  const getBillingData = (): BillingData => {
    if (!userData) {
      return {
        firstName: '',
        lastName: '',
        country: '',
        company: '',
        streetAddress: '',
        apartment: '',
        city: '',
        state: '',
        postalCode: '',
        phone: ''
      };
    }
    
    return {
      firstName: userData.first_name || '',
      lastName: userData.last_name || '',
      country: userData.country || '',
      company: userData.company || '',
      streetAddress: userData.address || '',
      apartment: userData.apartment || '',
      city: userData.city || '',
      state: userData.state || '',
      postalCode: userData.postal_code || '',
      phone: userData.mobile || ''
    };
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Container fluid className="profile-container">
          <Row className="justify-content-center">
            <Col xs={12} className="text-center">
              <Spinner animation="border" variant="warning" />
              <p className="text-white mt-3">Loading profile data...</p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <Container fluid className="profile-container">
          <Row className="justify-content-center">
            <Col lg={8}>
              <Alert variant="danger">
                {error}
              </Alert>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Container fluid className="profile-container">
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <Row className="g-4">
              {/* Profile Section */}
              <Col lg={6}>
                <ProfileInfo 
                  initialData={getProfileData()}
                  userName={userData?.name || 'User'}
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
                  initialData={getBillingData()}
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