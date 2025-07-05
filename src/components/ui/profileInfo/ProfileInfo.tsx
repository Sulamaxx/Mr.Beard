import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import userAvatar from '../../../assets/images/profile/user_avatar.png';
import './ProfileInfo.scss';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
}

interface ProfileInfoProps {
  initialData?: ProfileData;
  userName?: string;
  onSubmit?: (data: ProfileData) => Promise<{ success: boolean; message: string }>;
  onSignOut?: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ 
  initialData, 
  userName,
  onSubmit, 
  onSignOut 
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    email: '',
    phone: ''
  });

  // Update form data when initialData changes (only on first mount)
  useEffect(() => {
    if (initialData && profileData.fullName === '' && profileData.email === '' && profileData.phone === '') {
      setProfileData(initialData);
    }
  }, [initialData, profileData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!onSubmit) return;
    
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const result = await onSubmit(profileData);
      
      if (result.success) {
        setSuccessMessage(result.message);
        // Keep form data filled - don't clear inputs
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    }
  };

  return (
    <Card className="profile-info-card">
      <Card.Body>
        <div className="profile-header">
          <h4 className="profile-title">PROFILE</h4>
        </div>
        
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            <img 
              src={userAvatar} 
              alt="Profile" 
              className="avatar-img"
            />
            <div className="edit-avatar-btn">
              <i className="bi bi-pencil-square"></i>
            </div>
          </div>
          <h5 className="profile-name">{userName?.toUpperCase() || 'USER'}</h5>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Alert variant="success" className="mb-3">
            {successMessage}
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} className="profile-form text-start">
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={profileData.fullName}
              onChange={handleChange}
              className="profile-input"
              placeholder="Enter your full name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              className="profile-input"
              placeholder="Enter your email address"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={profileData.phone}
              onChange={handleChange}
              className="profile-input"
              placeholder="Enter your phone number"
            />
          </Form.Group>

          <Button type="submit" className="save-btn mb-3" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>

          <Row className='justify-content-center'>
            <Col sm={'auto'}>
              <Button 
                variant="outline-danger" 
                className="sign-out-btn"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ProfileInfo;