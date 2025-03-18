import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { QuantityInput } from "../../components/ui/quantityInput/QuantityInput";
import "./ProductView.scss";

interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

const ProductView: React.FC = () => {
  // Sample product data
  const productImages: ProductImage[] = [
    {
      id: 1,
      src: "/src/assets/images/products/wax1.png",
      alt: "Beard Wax Main View",
    },
    {
      id: 2,
      src: "/src/assets/images/products/wax-preview.png",
      alt: "Beard Wax Side View",
    },
    {
      id: 3,
      src: "/src/assets/images/products/wax-preview.png",
      alt: "Beard Wax Top View",
    },
  ];

  const [currentImage, setCurrentImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const handlePrevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImage((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImage(index);
  };

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
                  <span className="tag tag-new">NEW</span>
                  <span className="tag tag-sale">-50%</span>
                </div>

                {/* Main Image with Navigation */}
                <div className="main-image-container">
                  <img
                    src={productImages[currentImage].src}
                    alt={productImages[currentImage].alt}
                    className="product-main-image"
                  />

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
                </div>

                {/* Thumbnail Images */}
                <div className="thumbnail-container">
                  {productImages.map((image, index) => (
                    <div
                      key={image.id}
                      className={`thumbnail ${
                        currentImage === index ? "active" : ""
                      }`}
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <img src={image.src} alt={`Thumbnail ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </Col>

            {/* Product Details Section */}
            <Col lg={6} md={12}>
              <div className="product-details">
                <h1 className="product-title text-start">BEARD OIL</h1>

                <p className="product-description text-start">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s,
                </p>

                <div className="product-price mb-4 text-start">
                  <h2>LKR 1500.00</h2>
                  <hr />
                </div>

                <div className="product-actions">
                  <div className="quantity-section mb-4">
                    <div className="row">
                      <div className="col-auto">
                        <QuantityInput
                          value={quantity}
                          onChange={setQuantity}
                          min={1}
                          max={20}
                        />
                      </div>
                      <div className="col">
                          <Button
                            variant="outline-primary"
                            className="btn-wishlist mb-3 w-100"
                          >
                            <i className="bi bi-heart"></i> Wishlist
                          </Button>
                      </div>
                    </div>
                  </div>

                  <div className="col">
                    <Button variant="primary" className="btn-add-to-cart w-100">
                      Add to Cart
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
