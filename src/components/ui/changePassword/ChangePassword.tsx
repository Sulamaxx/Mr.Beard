import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import './ChangePassword.scss';

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordResult {
  success: boolean;
  message: string;
}

interface ChangePasswordProps {
  onSubmit?: (data: PasswordData) => Promise<ChangePasswordResult>;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onSubmit }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
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
      const result = await onSubmit(passwordData);
      
      if (result.success) {
        setSuccessMessage(result.message);
        
        // Clear form if password was changed successfully
        if (result.message === 'Password updated successfully!') {
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="change-password-card">
      <Card.Body>
        <div className="password-header">
          <h4 className="password-title">CHANGE PASSWORD</h4>
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

        <Form onSubmit={handleSubmit} className="password-form text-md-start">
          <Form.Group className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <div className="password-input-group">
              <Form.Control
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handleChange}
                className="password-input"
              />
              <Button
                variant="link"
                className="password-toggle"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <i className='bi bi-eye-slash' /> : <i className='bi bi-eye' />}
              </Button>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Re-enter New Password</Form.Label>
            <div className="password-input-group">
              <Form.Control
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handleChange}
                className="password-input"
              />
              <Button
                variant="link"
                className="password-toggle"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <i className='bi bi-eye-slash' /> : <i className='bi bi-eye' />}
              </Button>
            </div>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>New</Form.Label>
            <div className="password-input-group">
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handleChange}
                className="password-input"
              />
              <Button
                variant="link"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <i className='bi bi-eye-slash' /> : <i className='bi bi-eye' />}
              </Button>
            </div>
          </Form.Group>

          <Button type="submit" className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>

        </Form>
      </Card.Body>
    </Card>
  );
};

export default ChangePassword;