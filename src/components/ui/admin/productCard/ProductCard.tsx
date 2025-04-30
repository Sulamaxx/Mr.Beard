import { Card, Dropdown } from "react-bootstrap";
import "./ProductCard.scss";
import { useNavigate } from "react-router-dom";

// Product Card Component
const ProductCard: React.FC<{product: any}> = ({ product }) => {
  const navigate = useNavigate();

  // Handle card click to navigate to product details
  const handleCardClick = () => {
    navigate(`/admin/products/${product.id}`);
  };

  return (
    <Card className="product-card" onClick={handleCardClick}>
      <div className="product-header d-flex">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-header-info text-start">
          <h5 className="product-title">{product.name}</h5>
          <p className="product-category">{product.category}</p>
          <p className="product-price">LKR {product.price.toFixed(2)}</p>
        </div>
        {/* <Dropdown className="product-actions">
          <Dropdown.Toggle variant="light" id={`dropdown-${product.id}`} className="p-0">
            <i className="bi bi-three-dots-vertical"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu align="end">
            <Dropdown.Item href="#/edit">Edit</Dropdown.Item>
            <Dropdown.Item href="#/delete">Delete</Dropdown.Item>
            <Dropdown.Item href="#/view">View Details</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown> */}
      </div>
      <Card.Body className="text-start">
        <div className="product-summary">
          <h6>Summary</h6>
          <p className="summary-text">{product.summary}</p>
        </div>
        <div className="product-stats">
          <div className="stat-item">
            <span className="label">Sales</span>
            <span className="value">
              <i className="bi bi-arrow-up text-success"></i> {product.sales}
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;