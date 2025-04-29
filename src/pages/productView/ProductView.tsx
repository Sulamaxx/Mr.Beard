import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { QuantityInput } from "../../components/ui/quantityInput/QuantityInput";
import "./ProductView.scss";
import { useParams } from "react-router-dom";
import ApiService from "../../services/ApiService";

interface ProductImage {
  id: number;
  path: string;
  product_id: number;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: number;
  name: string;
  user_guide_pdf: string | null;
  description: string;
  price: string;
  discount: string;
  category: string;
  currency: string;
  isNew: number;
  rating: number;
  initial_stock: number;
  stock: number;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
}

interface ApiResponse {
  status: string;
  data: Product;
}

interface CartResponse {
  status: boolean;
  message: string;
  data?: any;
}

const ProductView: React.FC = () => {
  // Extract the productId parameter
  const { id } = useParams<{ id: string }>();
  
  // State variables
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [cartMessage, setCartMessage] = useState<{ type: string; text: string } | null>(null);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await ApiService.get<ApiResponse>(`/v2/product/${id}`);
        if (response.status === "success") {
          setProduct(response.data);
        } else {
          setError("Failed to load product data");
        }
      } catch (err) {
        setError("Error fetching product data");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handlePrevImage = () => {
    if (!product || product.images.length === 0) return;
    setCurrentImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!product || product.images.length === 0) return;
    setCurrentImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImage(index);
  };

  const addToCart = async () => {
    if (!product) return;
    
    try {
      setAddingToCart(true);
      const response = await ApiService.post<CartResponse>("/v2/cart/add", {
        product_id: product.id,
        quantity: quantity
      });
      
      if (response.status) {
        setCartMessage({ type: "success", text: "Product added to cart successfully!" });
      } else {
        setCartMessage({ type: "danger", text: response.message || "Failed to add product to cart" });
      }
    } catch (err: any) {
      // Handle specific error responses
      if (err.response) {
        if (err.response.status === 422) {
          setCartMessage({ type: "danger", text: "Please provide valid quantity" });
        } else if (err.response.status === 400) {
          setCartMessage({ 
            type: "danger", 
            text: err.response.data?.message || "Not enough stock available" 
          });
        } else {
          setCartMessage({ type: "danger", text: "Failed to add product to cart" });
        }
      } else {
        setCartMessage({ type: "danger", text: "An error occurred while adding to cart" });
      }
      console.error("Error adding to cart:", err);
    } finally {
      setAddingToCart(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setCartMessage(null);
      }, 5000);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Container fluid className="product-view-container py-5">
        <Row className="justify-content-center">
          <Col lg={10} md={11} sm={12} className="text-center">
            <div className="py-5">Loading product information...</div>
          </Col>
        </Row>
      </Container>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <Container fluid className="product-view-container py-5">
        <Row className="justify-content-center">
          <Col lg={10} md={11} sm={12} className="text-center">
            <div className="py-5 text-danger">{error || "Product not found"}</div>
          </Col>
        </Row>
      </Container>
    );
  }

  // Calculate sale percentage if discount is present
  const discountPrice = product.discount && product.price 
    ? Math.round((parseFloat(product.price) * parseFloat(product.discount)) / 100) 
    : 0;

  // Calculate final price after discount
  const finalPrice = parseFloat(product.price) - discountPrice;

  return (
    <Container fluid className="product-view-container py-5 overflow-hidden">
      <Row className="justify-content-center">
        <Col lg={10} md={11} sm={12}>
          <Row>
            {/* Product Image Section */}
            <Col lg={6} md={12} className="mb-4 mb-lg-0">
              <div className="product-image-display">
                {/* Product Tags */}
                <div className="product-tags">
                  {product.isNew && (
                    <span className="tag tag-new">NEW</span>
                  )}
                  {parseFloat(product.discount) > 0 && (
                    <span className="tag tag-sale">
                      -{parseFloat(product.discount)}%
                    </span>
                  )}
                </div>

                {/* Main Image with Navigation */}
                <div className="main-image-container">
                  {product.images.length > 0 && (
                    <img
                      src={product.images[currentImage]?.path}
                      alt={`${product.name} view ${currentImage + 1}`}
                      className="product-main-image"
                    />
                  )}

                  {product.images.length > 1 && (
                    <>
                      <button
                        className="nav-button prev-button"
                        onClick={handlePrevImage}
                        aria-label="Previous image"
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>

                      <button
                        className="nav-button next-button"
                        onClick={handleNextImage}
                        aria-label="Next image"
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Images */}
                {product.images.length > 1 && (
                  <div className="thumbnail-container">
                    {product.images.map((image, index) => (
                      <div
                        key={image.id}
                        className={`thumbnail ${
                          currentImage === index ? "active" : ""
                        }`}
                        onClick={() => handleThumbnailClick(index)}
                      >
                        <img
                          src={image.path}
                          alt={`${product.name} thumbnail ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Col>

            {/* Product Details Section */}
            <Col lg={6} md={12}>
              <div className="product-details">
                <h1 className="product-title text-start">
                  {product.name.toUpperCase()}
                </h1>

                <p className="product-description text-start">
                  {product.description}
                </p>

                <div className="product-price mb-4 text-start">
                  {parseFloat(product.discount) > 0 ? (
                    <>
                      <h2>
                        {product.currency} {finalPrice.toFixed(2)}
                        <small className="text-danger text-decoration-line-through ms-2">
                          {product.currency}{" "}
                          {parseFloat(product.price).toFixed(2)}
                        </small>
                      </h2>
                    </>
                  ) : (
                    <h2>
                      {product.currency} {parseFloat(product.price).toFixed(2)}
                    </h2>
                  )}
                  <hr />
                </div>

                {/* Stock information */}
                <div className="stock-info mb-3 text-start">
                  <span
                    className={
                      product.stock > 5 ? "text-success" : "text-danger"
                    }
                  >
                    {product.stock > 0
                      ? product.stock > 5
                        ? `In Stock`
                        : `Only (${product.stock} available)`
                      : "Out of Stock"}
                  </span>
                </div>

                {/* Cart message alert */}
                {cartMessage && (
                  <div className={`alert alert-${cartMessage.type} mb-3`}>
                    {cartMessage.text}
                  </div>
                )}

                {/* Product actions */}
                <div className="product-actions">
                  <div className="quantity-section mb-4">
                    <div className="row">
                      <div className="col-auto">
                        <QuantityInput
                          value={quantity}
                          onChange={setQuantity}
                          min={1}
                          max={product.stock}
                        />
                      </div>
                      {product.user_guide_pdf != null && (
                        <div className="col-auto">
                          <a href={product.user_guide_pdf}>Download User Manual</a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col">
                    <Button
                      variant="primary"
                      className="btn-add-to-cart w-100"
                      onClick={addToCart}
                      disabled={product.stock <= 0 || addingToCart}
                    >
                      {addingToCart ? "Adding..." : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductView;