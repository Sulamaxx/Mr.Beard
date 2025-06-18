import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { Staff } from "../../../../services/StaffService"; // Adjust the import path as necessary
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
        if(formData.password.trim() && mode === "edit"){
            newErrors.password = "Password must be at least 6 characters long";
        }else if(mode === "add"){
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

    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error saving staff member:", error);
    } finally {
      setIsSubmitting(false);
    }
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
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-center gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              className="cancel-btn"
            >
              CANCEL
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default StaffModal;
