import React, { useState, useRef } from "react";
import { Form, Button, Container, Row, Col, Card, ProgressBar } from "react-bootstrap";
import "./AddNewProduct.scss";
import { Link } from "react-router-dom";

interface ProductImage {
  id: string;
  file: File;
  preview: string;
  uploadProgress: number;
}

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  brandName: string;
  sku: string;
  stockQuantity: string;
  regularPrice: string;
  salePrice: string;
  images: ProductImage[];
}

const AddNewProduct: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    category: "",
    brandName: "",
    sku: "",
    stockQuantity: "",
    regularPrice: "",
    salePrice: "",
    images: []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      uploadProgress: 100 // Simulate completed upload for this example
    }));
    
    setFormData({
      ...formData,
      images: [...formData.images, ...newImages]
    });
  };
  
  // Handle drag and drop events
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
  
  // Trigger file input click
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
      newErrors.category = "Category is required";
    }
    
    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required";
    }
    
    if (!formData.stockQuantity.trim()) {
      newErrors.stockQuantity = "Stock quantity is required";
    } else if (isNaN(Number(formData.stockQuantity))) {
      newErrors.stockQuantity = "Stock quantity must be a number";
    }
    
    if (!formData.regularPrice.trim()) {
      newErrors.regularPrice = "Regular price is required";
    } else if (isNaN(Number(formData.regularPrice))) {
      newErrors.regularPrice = "Regular price must be a number";
    }
    
    if (formData.salePrice.trim() && isNaN(Number(formData.salePrice))) {
      newErrors.salePrice = "Sale price must be a number";
    }
    
    if (formData.images.length === 0) {
      newErrors.images = "At least one product image is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Prepare data for API submission
      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        brandName: formData.brandName,
        sku: formData.sku,
        stockQuantity: Number(formData.stockQuantity),
        regularPrice: Number(formData.regularPrice),
        salePrice: formData.salePrice ? Number(formData.salePrice) : null,
        imagePaths: formData.images.map(img => img.preview) // In a real app, these would be server paths
      };
      
      console.log("Submitting product data:", productData);
      
      // Here you would send the data to your API
      // For example:
      // api.createProduct(productData)
      //   .then(response => {
      //     // Handle success
      //   })
      //   .catch(error => {
      //     // Handle error
      //   });
      
      alert("Product data ready for submission to API!");
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
    
    // Reset form or navigate away
    // window.history.back(); // Uncomment to navigate back
    
    // For this example, just reset the form
    setFormData({
      name: "",
      description: "",
      category: "",
      brandName: "",
      sku: "",
      stockQuantity: "",
      regularPrice: "",
      salePrice: "",
      images: []
    });
    setErrors({});
  };
  
  return (
    <div className="add-product-page">
      <div className="product-header">
        <div>
          <h1>Product Details</h1>
          <div className="breadcrumb">Home &gt; All Products &gt; Add New Product</div>
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
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Type Category here"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    isInvalid={!!errors.category}
                  />
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
                      <Form.Label>Regular Price</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. ₹1000"
                        name="regularPrice"
                        value={formData.regularPrice}
                        onChange={handleInputChange}
                        isInvalid={!!errors.regularPrice}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.regularPrice}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Sale Price</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. ₹450"
                        name="salePrice"
                        value={formData.salePrice}
                        onChange={handleInputChange}
                        isInvalid={!!errors.salePrice}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.salePrice}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              
              {/* Right Column - Product Images */}
              <Col lg={5} md={12}>
                <Form.Group>
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
                    className={`image-upload-area ${isDragging ? 'dragging' : ''} ${errors.images ? 'is-invalid' : ''} mb-3`}
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
                    />
                    <div className="upload-icon">
                      <i className="bi bi-image"></i>
                    </div>
                    <div className="upload-text">
                      <p>Drop your images here, or <span className="browse-link">browse</span></p>
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
                            <img src={image.preview} alt={`Thumbnail ${index + 1}`} />
                          </div>
                          <div className="image-details flex-grow-1">
                            <p className="mb-1">Product thumbnail.png</p>
                            <ProgressBar 
                              now={image.uploadProgress} 
                              className="progress-sm" 
                            />
                          </div>
                          <Button 
                            variant="link" 
                            className="delete-btn text-danger"
                            onClick={() => handleRemoveImage(image.id)}
                          >
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            <i className="bi bi-trash"></i>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
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
            >
              SAVE
            </Button>
            <Link to={"/admin/products"} >
            <Button 
              variant="outline-secondary" 
              type="button" 
              className="cancel-btn"
              onClick={handleCancel}
            >
              CANCEL
            </Button>
            </Link>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AddNewProduct;