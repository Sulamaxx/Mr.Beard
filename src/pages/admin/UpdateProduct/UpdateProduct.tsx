import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Row, Col, Card, ProgressBar, Spinner } from "react-bootstrap";
import "./UpdateProduct.scss";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../../services/ApiService";

// Define User interface for user type checking
interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  role: string | null;
  user_type?: 'admin' | 'staff' | 'customer';
}

interface ProductImage {
  id: number | string;
  path?: string;
  file?: File;
  preview: string;
  uploadProgress: number;
  isExisting?: boolean;
}

interface ProductFile {
  id: string;
  file?: File;
  name: string;
  size: string;
  path?: string;
  uploadProgress: number;
  isExisting?: boolean;
}

interface ProductFormData {
  id: number | string;
  name: string;
  description: string;
  category: string;
  brandName: string;
  sku: string;
  stockQuantity: string;
  price: string;
  discountType: 'percentage' | 'amount';
  discountValue: string;
  images: ProductImage[];
  userGuide: ProductFile | null;
  removedImageIds: number[];
  isUserGuideRemoved: boolean;
}

interface ApiProductImage {
  id: number;
  product_id: number;
  path: string;
}

interface ApiProduct {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  discount: number;
  discount_type: string;
  stock: number;
  sku: string;
  brandName?: string;
  user_guide_pdf: string | null;
  images: ApiProductImage[];
}

const UpdateProduct: React.FC = () => {
  const { product_id } = useParams<{ product_id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<ProductFormData>({
    id:"",
    name: "",
    description: "",
    category: "",
    brandName: "",
    sku: "",
    stockQuantity: "",
    price: "",
    discountType: "percentage",
    discountValue: "",
    images: [],
    userGuide: null,
    removedImageIds: [],
    isUserGuideRemoved: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isPdfDragging, setIsPdfDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Get current user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);

  // Check if current user is admin
  const isAdmin = currentUser?.user_type === 'admin';
  
  // Format file size helper function
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // Fetch product data when component mounts
  useEffect(() => {
    if (product_id) {
      fetchProductData(parseInt(product_id));
    } else {
      setLoading(false);
      setErrors({ general: "Product ID not found in URL" });
    }
  }, [product_id]);
  
  const fetchProductData = async (productId: number) => {
    try {
      setLoading(true);
      const response = await ApiService.get<{status: string, data: ApiProduct}>(`/v2/product/${productId}`);
      
      if (response.status === 'success' && response.data) {
        const product = response.data;
        
        // Map API data to form state
        const productImages: ProductImage[] = product.images.map(img => ({
          id: img.id,
          path: img.path,
          preview: img.path, // Use the full path provided by API
          uploadProgress: 100,
          isExisting: true
        }));
        
        // Handle user guide if exists
        let userGuide: ProductFile | null = null;
        if (product.user_guide_pdf) {
          const fileName = product.user_guide_pdf.split('/').pop() || 'user-guide.pdf';
          userGuide = {
            id: `existing_pdf`,
            path: product.user_guide_pdf,
            name: fileName,
            size: 'Unknown size', // API doesn't return size
            uploadProgress: 100,
            isExisting: true
          };
        }
        
        setFormData({
          id: product.id,
          name: product.name,
          description: product.description,
          category: product.category,
          brandName: product.brandName || "",
          sku: product.sku || "",
          stockQuantity: product.stock.toString(),
          price: product.price.toString(),
          discountType: (product.discount_type as 'percentage' | 'amount') || 'percentage',
          discountValue: product.discount?.toString() || "0",
          images: productImages,
          userGuide: userGuide,
          removedImageIds: [],
          isUserGuideRemoved: false
        });
      } else {
        setErrors({ general: "Failed to fetch product data" });
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setErrors({ general: "Error loading product data. Please try again." });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      id: `new_img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
      uploadProgress: 100 // Simulate completed upload for this example
    }));
    
    setFormData({
      ...formData,
      images: [...formData.images, ...newImages]
    });
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
      
      const newUserGuide = {
        id: `new_pdf_${Date.now()}`,
        file: file,
        name: file.name,
        size: formatFileSize(file.size),
        uploadProgress: 100 // Simulate completed upload
      };
      
      setFormData({
        ...formData,
        userGuide: newUserGuide,
        isUserGuideRemoved: false
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

  // Add discount type handler
  const handleDiscountTypeChange = (type: 'percentage' | 'amount') => {
    setFormData({
      ...formData,
      discountType: type,
      discountValue: type === 'percentage' ? 
          (parseFloat(formData.discountValue) > 100 ? '100' : formData.discountValue) :
          (parseFloat(formData.discountValue) > parseFloat(formData.price) ? formData.price : formData.discountValue)
    });
  };

  const generateSKU = () => {
    if(formData.category=== "Beard") {
      formData.sku =  `BEARD-${formData.id}`;
    } else if(formData.category=== "Hair") {
      formData.sku = `HAIR-${formData.id}`;
    } else if(formData.category=== "Accessories") {
      formData.sku = `ACCESSORIES-${formData.id}`;
    } else if(formData.category=== "Apparel") {
      formData.sku = `APPAREL-${formData.id}`;
    }
    return formData.sku;
  }
  
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
  const handleRemoveImage = (imageId: string | number) => {
    // If it's an existing image (has a numeric ID), add to removedImageIds
    if (typeof imageId === 'number') {
      setFormData({
        ...formData,
        removedImageIds: [...formData.removedImageIds, imageId],
        images: formData.images.filter(img => img.id !== imageId)
      });
    } else {
      // For new images, just remove from the array
      const updatedImages = formData.images.filter(img => img.id !== imageId);
      
      // Release object URL to avoid memory leaks
      const imageToRemove = formData.images.find(img => img.id === imageId);
      if (imageToRemove && imageToRemove.preview && !imageToRemove.isExisting) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      
      setFormData({
        ...formData,
        images: updatedImages
      });
    }
    
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
      userGuide: null,
      isUserGuideRemoved: formData.userGuide?.isExisting ? true : false
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
    
    // Validate discount based on type
    if (formData.discountType === 'percentage') {
      if (formData.discountValue.trim() && 
          (Number(formData.discountValue) < 0 || Number(formData.discountValue) > 100)) {
        newErrors.discountValue = "Discount percentage must be between 0 and 100";
      }
    } else {
      if (formData.discountValue.trim() && 
          (Number(formData.discountValue) < 0 || Number(formData.discountValue) > Number(formData.price))) {
        newErrors.discountValue = "Discount amount cannot exceed product price";
      }
    }
    
    if (formData.images.length === 0) {
      newErrors.images = "At least one product image is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product_id) {
      setErrors({ general: "Product ID not found" });
      return;
    }
    
    if (validateForm()) {
      try {
        setSubmitting(true);
        
        // Prepare FormData for multipart/form-data submission
        const apiFormData = new FormData();
        
        // Add basic text fields
        apiFormData.append('name', formData.name);
        apiFormData.append('description', formData.description);
        apiFormData.append('category', formData.category);
        apiFormData.append('brandName', formData.brandName);
        apiFormData.append('sku', formData.sku);
        apiFormData.append('stockQuantity', formData.stockQuantity);
        apiFormData.append('price', parseInt(formData.price).toString());
        apiFormData.append('discountType', formData.discountType);
        apiFormData.append('discount', formData.discountValue || '0'); // SEND TO EXISTING DISCOUNT COLUMN
        
        // Add removed image IDs if any
        formData.removedImageIds.forEach(id => {
          apiFormData.append('removeImages[]', id.toString());
        });
        
        // Add flag to remove user guide if applicable
        if (formData.isUserGuideRemoved) {
          apiFormData.append('removeUserGuide', 'true');
        }
        
        // Add new images if any
        const newImages = formData.images.filter(img => !img.isExisting && img.file);
        if (newImages.length > 0) {
          newImages.forEach(img => {
            if (img.file) {
              apiFormData.append('images[]', img.file);
            }
          });
        }
        
        // Add new user guide if any
        if (formData.userGuide && formData.userGuide.file && !formData.userGuide.isExisting) {
          apiFormData.append('userGuide', formData.userGuide.file);
        }
        
        // Send update request
        const response = await ApiService.request<{status: string, message: string, data: any}>({
          method: 'post',
          url: `/v2/products/${product_id}`,
          data: apiFormData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-HTTP-Method-Override': 'PUT' // Some servers require this for PUT with FormData
          }
        });
        
        if (response.status === 'success') {
          alert("Product updated successfully!");
          navigate('/admin/products');
        } else {
          setErrors({ general: response.message || "Failed to update product" });
        }
      } catch (error: any) {
        console.error("Error updating product:", error);
        
        // Handle validation errors from API
        if (error.response && error.response.data && error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else {
          setErrors({ 
            general: error.response?.data?.message || "An error occurred while updating the product" 
          });
        }
      } finally {
        setSubmitting(false);
      }
    } else {
      console.log("Form validation failed");
    }
  };
  
  // Handle cancel button
  const handleCancel = () => {
    // Clean up object URLs to prevent memory leaks
    formData.images.forEach(img => {
      if (!img.isExisting && img.preview) {
        URL.revokeObjectURL(img.preview);
      }
    });
    
    // Navigate back to products list
    navigate('/admin/products');
  };
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }
  
  return (
    <div className="add-product-page">
      <div className="product-header">
        <div>
          <h1>Update Product</h1>
          <div className="breadcrumb">
            Home &gt; All Products &gt; Update Product
          </div>
        </div>
      </div>

      {errors.general && (
        <div className="alert alert-danger mb-3">{errors.general}</div>
      )}

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
                    disabled={isAdmin ? false : true} // Disable for non-admin users
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
                    disabled={isAdmin ? false : true} // Disable for non-admin users
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
                    disabled={isAdmin ? false : true} // Disable for non-admin users
                  >
                    <option value="">Select</option>
                    <option value="Beard">Beard</option>
                    <option value="Hair">Hair</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Apparel">Apparel</option>
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
                    disabled={isAdmin ? false : true} // Disable for non-admin users
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
                        value={generateSKU()}
                        onChange={handleInputChange}
                        disabled={isAdmin ? false : true} // Disable for non-admin users
                      />
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
                        disabled={isAdmin ? false : true} // Disable for non-admin users
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
                        placeholder="e.g. 1000"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        isInvalid={!!errors.price}
                        disabled={isAdmin ? false : true} // Disable for non-admin users
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.price}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    {/* Discount Type Toggle */}
                    <Form.Group className="mb-3">
                      <Form.Label>Discount Type</Form.Label>
                      <div className="discount-type-toggle">
                        <Button
                          variant={formData.discountType === 'amount' ? 'primary' : 'outline-primary'}
                          onClick={() => handleDiscountTypeChange('amount')}
                          className="me-2"
                          disabled={isAdmin ? false : true}
                        >
                          Amount (LKR)
                        </Button>
                        <Button
                          variant={formData.discountType === 'percentage' ? 'primary' : 'outline-primary'}
                          onClick={() => handleDiscountTypeChange('percentage')}
                          disabled={isAdmin ? false : true}
                        >
                          Percentage
                        </Button>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        {formData.discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount (LKR)'}
                      </Form.Label>
                      <Form.Control
                        type="number"
                        placeholder={formData.discountType === 'percentage' ? 'e.g. 15' : 'e.g. 500'}
                        name="discountValue"
                        value={formData.discountValue}
                        onChange={handleInputChange}
                        isInvalid={!!errors.discountValue}
                        disabled={isAdmin ? false : true}
                        min="0"
                        max={formData.discountType === 'percentage' ? '100' : formData.price}
                        step={formData.discountType === 'percentage' ? '1' : '0.01'}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.discountValue}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        {formData.discountType === 'percentage' 
                          ? 'Enter a value between 0-100' 
                          : `Enter amount up to ${formData.price} LKR`}
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
                      disabled={isAdmin ? false : true} // Disable for non-admin users
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
                            <p className="mb-1">
                              {image.isExisting
                                ? `Existing image ${index + 1}`
                                : `New image ${index + 1}`}
                            </p>
                            <ProgressBar
                              now={image.uploadProgress}
                              className="progress-sm"
                            />
                          </div>
                          <Button
                            variant="link"
                            className="delete-btn text-danger"
                            onClick={() => handleRemoveImage(image.id)}
                            disabled={isAdmin ? false : true} // Disable for non-admin users
                          >
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
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
                        disabled={isAdmin ? false : true} // Disable for non-admin users
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
                          />
                        </div>
                        <Button
                          variant="link"
                          className="delete-btn text-danger"
                          onClick={handleRemoveUserGuide}
                        >
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
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
            {/* Only show ADD NEW PRODUCT button for admin users */}
            {isAdmin && (
              <Button
                variant="secondary"
                type="submit"
                className="save-btn me-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Updating...
                  </>
                ) : (
                  "SAVE"
                )}
              </Button>
            )}
            <Button
              variant="outline-secondary"
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
              disabled={submitting}
            >
              CANCEL
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default UpdateProduct;