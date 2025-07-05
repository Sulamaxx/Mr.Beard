import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
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
  onSubmit?: (data: ProfileData) => void;
  onSignOut?: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ 
  initialData, 
  userName,
  onSubmit, 
  onSignOut 
}) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    email: '',
    phone: ''
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setProfileData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(profileData);
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

          <Button type="submit" className="save-btn mb-3">
            Save Changes
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