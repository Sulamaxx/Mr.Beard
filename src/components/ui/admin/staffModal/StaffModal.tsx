import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { Staff } from "../../../../services/StaffService";
import StaffService from "../../../../services/StaffService";
import "./StaffModal.scss";

interface StaffModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (staffData: Partial<Staff>) => void;
  staffMember: Staff | null;
  mode: "add" | "edit";
}

const StaffModal: React.FC<StaffModalProps> = ({
  show,
  onHide,
  onSave,
  staffMember,
  mode,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    company: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Reset form when modal opens/closes or staff member changes
  useEffect(() => {
    if (show) {
      if (mode === "edit" && staffMember) {
        setFormData({
          firstName: staffMember.firstName || "",
          lastName: staffMember.lastName || "",
          mobile: staffMember.mobile || "",
          email: staffMember.email || "",
          company: staffMember.company || "",
          password: staffMember.password || "",
        });
      } else {
        setFormData({
          firstName: "",
          lastName: "",
          mobile: "",
          email: "",
          company: "",
          password: "",
        });
      }
      setErrors({});
      setShowDeleteConfirm(false);
      setDeleteError(null);
      setApiError(null);
    }
  }, [show, mode, staffMember]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    
    // Clear API error when user makes changes
    if (apiError) {
      setApiError(null);
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\s/g, ""))) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
    }

    if (!formData.password.trim() && mode === "add") {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      if (formData.password.trim() && mode === "edit") {
        newErrors.password = "Password must be at least 6 characters long";
      } else if (mode === "add") {
        newErrors.password = "Password must be at least 6 characters long";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      await onSave(formData);
    } catch (error: any) {
      console.error("Error saving staff member:", error);
      
      // Handle different error response structures
      let errorData = null;
      
      // Check if error has response data (axios error structure)
      if (error.response && error.response.data) {
        errorData = error.response.data;
      } 
      // Check if error itself is the error data (direct API response)
      else if (error.status && error.message) {
        errorData = error;
      }
      
      if (errorData) {
        // Handle validation errors from API
        if (errorData.status === "error" && errorData.errors) {
          const apiErrors: Record<string, string> = {};
          
          // Convert API errors to form errors
          Object.keys(errorData.errors).forEach((field) => {
            const errorMessages = errorData.errors[field];
            if (Array.isArray(errorMessages) && errorMessages.length > 0) {
              apiErrors[field] = errorMessages[0];
            }
          });
          
          setErrors(apiErrors);
          
          // Set a general error message
          if (errorData.message) {
            setApiError(errorData.message + ". Please check the form for details.");
          } else {
            setApiError("Please check the form for errors.");
          }
        } 
        // Handle general error messages
        else if (errorData.message) {
          setApiError(errorData.message);
        } else {
          setApiError("An error occurred while saving. Please try again.");
        }
      } 
      // Handle generic errors
      else if (error.message) {
        setApiError(error.message);
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete button click
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
    setDeleteError(null);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!staffMember) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await StaffService.deleteStaff(staffMember.id);
      
      if (response.status === "success") {
        // Close modal and trigger refresh by calling onHide
        setShowDeleteConfirm(false);
        onHide();
      } else {
        setDeleteError("Failed to delete staff member. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting staff member:", error);
      setDeleteError("An error occurred while deleting the staff member.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteError(null);
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      company: "",
      password: "",
    });
    setErrors({});
    setShowDeleteConfirm(false);
    setDeleteError(null);
    setApiError(null);
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleCancel}
      size="lg"
      centered
      className="staff-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "add" ? "Add New Staff Member" : "Edit Staff Member"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* API Error Alert */}
        {apiError && !showDeleteConfirm && (
          <Alert variant="danger" className="mb-3" dismissible onClose={() => setApiError(null)}>
            <Alert.Heading>Error</Alert.Heading>
            <p className="mb-0">{apiError}</p>
          </Alert>
        )}

        {/* Delete Confirmation Alert */}
        {showDeleteConfirm && (
          <Alert variant="danger" className="mb-3">
            <Alert.Heading>Confirm Deletion</Alert.Heading>
            <p>
              Are you sure you want to delete{" "}
              <strong>
                {formData.firstName} {formData.lastName}
              </strong>
              ? This action cannot be undone.
            </p>
            {deleteError && (
              <p className="text-danger mb-2">{deleteError}</p>
            )}
            <div className="d-flex gap-2">
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDeleteCancel}
                disabled={isDeleting}
              >
                Cancel
              </Button>
            </div>
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  isInvalid={!!errors.firstName}
                  disabled={showDeleteConfirm}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  isInvalid={!!errors.lastName}
                  disabled={showDeleteConfirm}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lastName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Mobile</Form.Label>
            <Form.Control
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="Mobile"
              isInvalid={!!errors.mobile}
              disabled={showDeleteConfirm}
            />
            <Form.Control.Feedback type="invalid">
              {errors.mobile}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email"
              isInvalid={!!errors.email}
              disabled={showDeleteConfirm}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Company</Form.Label>
            <Form.Control
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Company Name"
              isInvalid={!!errors.company}
              disabled={showDeleteConfirm}
            />
            <Form.Control.Feedback type="invalid">
              {errors.company}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="text"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={
                mode === "add"
                  ? "Password"
                  : "Keep it blank if you don't want to change"
              }
              isInvalid={!!errors.password}
              disabled={showDeleteConfirm}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center">
            {/* Delete button - only show in edit mode */}
            <div>
              {mode === "edit" && !showDeleteConfirm && (
                <Button
                  variant="danger"
                  type="button"
                  onClick={handleDeleteClick}
                  disabled={isSubmitting}
                  className="delete-btn"
                >
                  <i className="bi bi-trash me-2"></i>
                  DELETE
                </Button>
              )}
            </div>

            {/* Save/Update and Cancel buttons */}
            <div className="d-flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting || showDeleteConfirm}
                className="btn-secondary save-btn"
              >
                {isSubmitting
                  ? mode === "add"
                    ? "SAVING..."
                    : "UPDATING..."
                  : mode === "add"
                  ? "SAVE"
                  : "UPDATE"}
              </Button>

              <Button
                variant="outline-secondary"
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting || isDeleting}
                className="cancel-btn"
              >
                CANCEL
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default StaffModal;