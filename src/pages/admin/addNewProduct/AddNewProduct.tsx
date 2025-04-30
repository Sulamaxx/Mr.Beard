import React, { useState, useRef } from "react";
import { Form, Button, Container, Row, Col, Card, ProgressBar } from "react-bootstrap";
import "./AddNewProduct.scss";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../../../services/ApiService";

interface ProductImage {
  id: string;
  file: File;
  preview: string;
  uploadProgress: number;
}

interface ProductFile {
  id: string;
  file: File;
  name: string;
  size: string;
  uploadProgress: number;
}

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  brandName: string;
  sku: string;
  stockQuantity: string;
  price: string;
  discountPercentage: string;
  images: ProductImage[];
  userGuide: ProductFile | null;
}

interface ApiResponse {
  status: string;
  message: string;
  data?: any;
  errors?: Record<string, string[]>;
}

const AddNewProduct: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    category: "",
    brandName: "",
    sku: "",
    stockQuantity: "",
    price: "",
    discountPercentage: "",
    images: [],
    userGuide: null
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isPdfDragging, setIsPdfDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  
  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };
  
  // Handle image selection from file input
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addNewImages(Array.from(e.target.files));
    }
  };
  
  // Process and add new images
  const addNewImages = (files: File[]) => {
    // Filter to only accept image files
    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    
    // Check if adding these would exceed the 3 image limit
    if (formData.images.length + imageFiles.length > 3) {
      setErrors({
        ...errors,
        images: "Maximum 3 images allowed"
      });
      
      // Only add images up to the limit
      const availableSlots = 3 - formData.images.length;
      if (availableSlots <= 0) return;
      
      imageFiles.splice(availableSlots);
    }
    
    // Process each image file
    const newImages = imageFiles.map(file => ({
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
      uploadProgress: 0 // Start at 0 for new images
    }));
    
    setFormData({
      ...formData,
      images: [...formData.images, ...newImages]
    });

    // Clear any image-related errors
    if (errors.images) {
      setErrors({
        ...errors,
        images: ""
      });
    }
  };
  
  // Handle PDF file selection
  const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check if file is a PDF
      if (!file.type.includes('pdf')) {
        setErrors({
          ...errors,
          userGuide: "Only PDF files are allowed"
        });
        return;
      }
      
      // Format file size
      const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
      };
      
      const newUserGuide = {
        id: `pdf_${Date.now()}`,
        file: file,
        name: file.name,
        size: formatFileSize(file.size),
        uploadProgress: 0 // Start at 0 for new uploads
      };
      
      setFormData({
        ...formData,
        userGuide: newUserGuide
      });
      
      // Clear any PDF-related errors
      if (errors.userGuide) {
        setErrors({
          ...errors,
          userGuide: ""
        });
      }
    }
  };
  
  // Handle drag and drop events for images
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addNewImages(Array.from(e.dataTransfer.files));
    }
  };
  
  // Handle drag and drop events for PDF
  const handlePdfDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPdfDragging(true);
  };
  
  const handlePdfDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPdfDragging(false);
  };
  
  const handlePdfDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handlePdfDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPdfDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Check if file is a PDF
      if (!file.type.includes('pdf')) {
        setErrors({
          ...errors,
          userGuide: "Only PDF files are allowed"
        });
        return;
      }
      
      // Create a change event-like object
      const changeEvent = {
        target: {
          files: e.dataTransfer.files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      handlePdfSelect(changeEvent);
    }
  };
  
  // Remove an image
  const handleRemoveImage = (imageId: string) => {
    const updatedImages = formData.images.filter(img => img.id !== imageId);
    
    // Release object URL to avoid memory leaks
    const imageToRemove = formData.images.find(img => img.id === imageId);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    
    setFormData({
      ...formData,
      images: updatedImages
    });
    
    // Clear any image-related errors
    if (errors.images) {
      setErrors({
        ...errors,
        images: ""
      });
    }
  };
  
  // Remove user guide PDF
  const handleRemoveUserGuide = () => {
    setFormData({
      ...formData,
      userGuide: null
    });
    
    // Clear any PDF-related errors
    if (errors.userGuide) {
      setErrors({
        ...errors,
        userGuide: ""
      });
    }
  };
  
  // Trigger file input click
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Trigger PDF input click
  const handlePdfBrowseClick = () => {
    if (pdfInputRef.current) {
      pdfInputRef.current.click();
    }
  };
  
  // Validate form before submission
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.category.trim()) {
      newErrors.category = "Please select a category";
    }
    
    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required";
    }
    
    if (!formData.stockQuantity.trim()) {
      newErrors.stockQuantity = "Stock quantity is required";
    } else if (isNaN(Number(formData.stockQuantity))) {
      newErrors.stockQuantity = "Stock quantity must be a number";
    }
    
    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price))) {
      newErrors.price = "Price must be a number";
    }
    
    if (formData.discountPercentage.trim() && isNaN(Number(formData.discountPercentage))) {
      newErrors.discountPercentage = "Discount percentage must be a number";
    } else if (formData.discountPercentage.trim() && Number(formData.discountPercentage) < 0 || Number(formData.discountPercentage) > 100) {
      newErrors.discountPercentage = "Discount percentage must be between 0 and 100";
    }
    
    if (formData.images.length === 0) {
      newErrors.images = "At least one product image is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission with API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        
        // Create a FormData object to send multipart/form-data
        const productFormData = new FormData();
        
        // Add text fields
        productFormData.append('name', formData.name);
        productFormData.append('description', formData.description);
        productFormData.append('category', formData.category);
        productFormData.append('brandName', formData.brandName);
        productFormData.append('sku', formData.sku);
        productFormData.append('stockQuantity', formData.stockQuantity);
        productFormData.append('price', formData.price);
        productFormData.append('discountPercentage', formData.discountPercentage || '0');
        
        // Add images
        formData.images.forEach((image, index) => {
          productFormData.append(`images[${index}]`, image.file);
        });
        
        // Add user guide PDF if present
        if (formData.userGuide) {
          productFormData.append('userGuide', formData.userGuide.file);
        }
        
        // Make API call with proper content type for file uploads
        const response = await ApiService.post<ApiResponse>(
          '/v2/products/add_new_product', 
          productFormData, 
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
              
              // Update progress for images and PDF
              const updatedImages = formData.images.map(img => ({
                ...img,
                uploadProgress: percentCompleted
              }));
              
              let updatedUserGuide = formData.userGuide;
              if (updatedUserGuide) {
                updatedUserGuide = {
                  ...updatedUserGuide,
                  uploadProgress: percentCompleted
                };
              }
              
              setFormData(prev => ({
                ...prev,
                images: updatedImages,
                userGuide: updatedUserGuide
              }));
            }
          }
        );
        
        // Handle successful response
        if (response.status === 'success') {
          // Show success message
          alert("Product added successfully!");
          
          // Redirect to products list page
          navigate('/admin/products');
        } else {
          // Handle error in response
          throw new Error(response.message || 'Failed to add product');
        }
      } catch (error: any) {
        console.error('Error adding product:', error);
        
        // Handle validation errors from server
        if (error.response && error.response.status === 422 && error.response.data.errors) {
          const serverErrors: Record<string, string> = {};
          
          // Format server validation errors
          Object.entries(error.response.data.errors).forEach(([key, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              serverErrors[key] = messages[0];
            }
          });
          
          setErrors(serverErrors);
        } else {
          // Show generic error
          alert(`Failed to add product: ${error.message || 'Unknown error occurred'}`);
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log("Form validation failed");
    }
  };
  
  // Handle cancel button
  const handleCancel = () => {
    // Clean up object URLs to prevent memory leaks
    formData.images.forEach(img => {
      URL.revokeObjectURL(img.preview);
    });
    
    // Navigate to products list
    navigate('/admin/products');
  };
  
  return (
    <div className="add-product-page">
      <div className="product-header">
        <div>
          <h1>Product Details</h1>
          <div className="breadcrumb">
            Home &gt; All Products &gt; Add New Product
          </div>
        </div>
      </div>

      <Form onSubmit={handleSubmit}>
        <Card className="product-form-card">
          <Card.Body>
            <Row>
              {/* Left Column - Product Details */}
              <Col lg={7} md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Type name here"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.name}
                    disabled={isSubmitting}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Type Description here"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    isInvalid={!!errors.description}
                    disabled={isSubmitting}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    isInvalid={!!errors.category}
                    disabled={isSubmitting}
                  >
                    <option value="">Select</option>
                    <option value="Beard">Beard</option>
                    <option value="Hair">Hair</option>
                    <option value="Accessories">Accessories</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.category}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Brand Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Type brand name here"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleInputChange}
                    isInvalid={!!errors.brandName}
                    disabled={isSubmitting}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.brandName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>SKU</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. FOX-3983"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        isInvalid={!!errors.sku}
                        disabled={isSubmitting}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.sku}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Stock Quantity</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. 1258"
                        name="stockQuantity"
                        value={formData.stockQuantity}
                        onChange={handleInputChange}
                        isInvalid={!!errors.stockQuantity}
                        disabled={isSubmitting}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.stockQuantity}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. ₹1000"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        isInvalid={!!errors.price}
                        disabled={isSubmitting}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.price}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Discount Percentage</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. 15"
                        name="discountPercentage"
                        value={formData.discountPercentage}
                        onChange={handleInputChange}
                        isInvalid={!!errors.discountPercentage}
                        disabled={isSubmitting}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.discountPercentage}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Enter a value between 0-100
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>

              {/* Right Column - Product Images */}
              <Col lg={5} md={12}>
                <Form.Group className="mb-4">
                  <Form.Label>Product Gallery</Form.Label>

                  {/* Main Image Preview */}
                  <div className="main-image-preview mb-3">
                    {formData.images.length > 0 ? (
                      <img
                        src={formData.images[0].preview}
                        alt="Product preview"
                        className="img-fluid"
                      />
                    ) : (
                      <div className="empty-preview">
                        <i className="bi bi-image"></i>
                      </div>
                    )}
                  </div>

                  {/* Image Upload Area */}
                  <div
                    className={`image-upload-area ${
                      isDragging ? "dragging" : ""
                    } ${errors.images ? "is-invalid" : ""} mb-3`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleBrowseClick}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/jpeg, image/png"
                      multiple
                      className="d-none"
                      disabled={isSubmitting}
                    />
                    <div className="upload-icon">
                      <i className="bi bi-image"></i>
                    </div>
                    <div className="upload-text">
                      <p>
                        Drop your images here, or{" "}
                        <span className="browse-link">browse</span>
                      </p>
                      <small>jpeg, png are allowed</small>
                    </div>
                  </div>
                  {errors.images && (
                    <div className="invalid-feedback d-block mb-3">
                      {errors.images}
                    </div>
                  )}

                  {/* Image List */}
                  <div className="image-list">
                    {formData.images.map((image, index) => (
                      <div key={image.id} className="image-item">
                        <div className="d-flex align-items-center">
                          <div className="image-thumbnail me-2">
                            <img
                              src={image.preview}
                              alt={`Thumbnail ${index + 1}`}
                            />
                          </div>
                          <div className="image-details flex-grow-1">
                            <p className="mb-1">{image.file.name}</p>
                            <ProgressBar
                              now={image.uploadProgress}
                              className="progress-sm"
                              animated={isSubmitting}
                            />
                          </div>
                          <Button
                            variant="link"
                            className="delete-btn text-danger"
                            onClick={() => handleRemoveImage(image.id)}
                            disabled={isSubmitting}
                          >
                            {image.uploadProgress === 100 && (
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                            )}
                            <i className="bi bi-trash"></i>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Form.Group>

                {/* User Guide PDF Upload */}
                <Form.Group className="mb-3">
                  <Form.Label>User Guide PDF</Form.Label>

                  {/* PDF Upload Area */}
                  {!formData.userGuide ? (
                    <div
                      className={`pdf-upload-area ${
                        isPdfDragging ? "dragging" : ""
                      } ${errors.userGuide ? "is-invalid" : ""}`}
                      onDragEnter={handlePdfDragEnter}
                      onDragLeave={handlePdfDragLeave}
                      onDragOver={handlePdfDragOver}
                      onDrop={handlePdfDrop}
                      onClick={handlePdfBrowseClick}
                    >
                      <input
                        type="file"
                        ref={pdfInputRef}
                        onChange={handlePdfSelect}
                        accept="application/pdf"
                        className="d-none"
                        disabled={isSubmitting}
                      />
                      <div className="upload-icon">
                        <i className="bi bi-file-earmark-pdf"></i>
                      </div>
                      <div className="upload-text">
                        <p>
                          Drop your user guide PDF here, or{" "}
                          <span className="browse-link">browse</span>
                        </p>
                        <small>Only PDF format is allowed</small>
                      </div>
                    </div>
                  ) : (
                    <div className="pdf-item">
                      <div className="d-flex align-items-center">
                        <div className="pdf-icon me-2">
                          <i className="bi bi-file-earmark-pdf"></i>
                        </div>
                        <div className="pdf-details flex-grow-1">
                          <p className="mb-1">{formData.userGuide.name}</p>
                          <small>{formData.userGuide.size}</small>
                          <ProgressBar
                            now={formData.userGuide.uploadProgress}
                            className="progress-sm mt-1"
                            animated={isSubmitting}
                          />
                        </div>
                        <Button
                          variant="link"
                          className="delete-btn text-danger"
                          onClick={handleRemoveUserGuide}
                          disabled={isSubmitting}
                        >
                          {formData.userGuide.uploadProgress === 100 && (
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                          )}
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </div>
                  )}

                  {errors.userGuide && (
                    <div className="invalid-feedback d-block">
                      {errors.userGuide}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Action Buttons */}
        <Row className="mt-3 mb-4">
          <Col xs={12} className="d-flex justify-content-end">
            <Button
              variant="secondary"
              type="submit"
              className="save-btn me-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "SAVING..." : "SAVE"}
            </Button>
            <Button
              variant="outline-secondary"
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              CANCEL
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AddNewProduct;