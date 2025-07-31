import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import userAvatar from '../../../assets/images/profile/user_avatar.png';
import ApiService from '../../../services/ApiService';
import './ProfileInfo.scss';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
}

interface ApiResponse {
  status: string;
  data?: any;
  message?: string;
}

interface ProfileInfoProps {
  initialData?: ProfileData;
  userName?: string;
  userProfilePicture?: string;
  onSubmit?: (data: ProfileData) => Promise<{ success: boolean; message: string }>;
  onSignOut?: () => void;
  onImageUploadSuccess?: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ 
  initialData, 
  userName,
  userProfilePicture,
  onSubmit, 
  onSignOut,
  onImageUploadSuccess
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string>(userAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  // Update profile image when userProfilePicture changes
  useEffect(() => {
    if (userProfilePicture) {
      // If it's a full URL, use it directly
      if (userProfilePicture.startsWith('http')) {
        setProfileImage(userProfilePicture);
      } else if (userProfilePicture !== 'default_avatar.png') {
        // userProfilePicture now contains the full path like 'profile_pictures/filename.jpg'
        setProfileImage(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/storage/${userProfilePicture}`);
        // localStorage.setItem('user', JSON.stringify(user));
        updateProfilePicture(userProfilePicture);
      } else {
        setProfileImage(userAvatar);
      }
    }
  }, [userProfilePicture]);

  const updateProfilePicture = (newPicture: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({...user, profile_picture: newPicture}));
  };

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

  const handleEditAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, JPG, GIF, SVG)');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be less than 2MB');
      return;
    }

    try {
      setImageUploading(true);
      setError(null);
      setSuccessMessage(null);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', file);

      // Upload image via API
      const response: ApiResponse = await ApiService.post('/v2/users/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 'success') {
        setSuccessMessage('Profile image updated successfully!');
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Notify parent component to refetch user data
        if (onImageUploadSuccess) {
          onImageUploadSuccess();
        }
      }
    } catch (err: any) {
      console.error('Error uploading image:', err);
      
      let errorMessage = 'Failed to upload image. Please try again.';
      
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessage = errorMessages.join(', ');
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setImageUploading(false);
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
              src={profileImage} 
              alt="Profile" 
              className="avatar-img"
              onError={() => setProfileImage(userAvatar)}
            />
            <div 
              className={`edit-avatar-btn ${imageUploading ? 'uploading' : ''}`}
              onClick={handleEditAvatarClick}
              style={{ cursor: imageUploading ? 'not-allowed' : 'pointer' }}
            >
              {imageUploading ? (
                <i className="bi bi-arrow-clockwise spin"></i>
              ) : (
                <i className="bi bi-pencil-square"></i>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
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