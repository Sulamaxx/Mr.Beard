import React, { useState, useEffect } from "react";
import { Card, Button, Table, Form, Dropdown } from "react-bootstrap";
import "./OrdersDetails.scss";
import PaginationComponent from "../../../components/ui/admin/pagination/PaginationComponent";
import ApiService from "../../../services/ApiService";

interface Product {
  name: string;
  orderId: string;
  quantity: number;
  total: string;
}

interface Summary {
  subtotal: string;
  tax: string;
  discount: string;
  shipping: string;
  total: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  orderInfo: {
    shipping: string;
    paymentMethod: string;
    status: string;
  };
  deliverTo: {
    address: string;
  };
  paymentInfo: {
    cardType?: string;
    cardNumber?: string;
    paymentMethod?: string;
    businessName: string;
    phone: string;
  };
  products: Product[];
  summary: Summary;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalOrders: number;
}

interface OrdersResponse {
  status: string;
  data: {
    orders: Order[];
    pagination: PaginationInfo;
  };
}

interface OrderUpdateResponse {
  message: string;
  order: {
    id: number;
    status: string;
    [key: string]: any;
  };
}

// Available order statuses
const ORDER_STATUSES = ["processing", "shipped", "delivered", "canceled"];

const OrdersDetails: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    totalOrders: 0
  });

  // Fetch orders from API
  const fetchOrders = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await ApiService.get<OrdersResponse>(`/v2/orders/all`, { page });
      
      if (response.status === "success" && response.data) {
        // Sort orders with pending status first
        const sortedOrders = [...response.data.orders].sort((a, b) => {
          if (a.status.toLowerCase() === "pending" && b.status.toLowerCase() !== "pending") return -1;
          if (a.status.toLowerCase() !== "pending" && b.status.toLowerCase() === "pending") return 1;
          return 0;
        });
        
        setOrders(sortedOrders);
        setPaginationInfo(response.data.pagination);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      setError("Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

// Handle order status update
const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    setUpdatingStatus(orderId);
    
    // Send PUT request to update order status
    const response = await ApiService.put<OrderUpdateResponse>(`/v2/order/${orderId}`, {
      status: newStatus
    });
    
    // Check for successful response based on the actual API response format
    if (response.message === "Order updated successfully" && response.order) {
      // Extract the updated status from the response
      const updatedStatus = response.order.status;
      
      // Update order status in local state
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          return { 
            ...order, 
            status: updatedStatus,
            // Also update the status in orderInfo to keep UI consistent
            orderInfo: {
              ...order.orderInfo,
              status: updatedStatus
            }
          };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      
      // Show success notification
      // Note: You might want to add a toast notification library here
      console.log(`Order ${orderId} status updated to ${updatedStatus}`);
    } else {
      // Show error notification
      console.error("Failed to update order status");
    }
  } catch (err) {
    console.error("Error updating order status:", err);
  } finally {
    setUpdatingStatus(null);
  }
};

  // Handle page change
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    fetchOrders(pageNumber);
  };
  
  // Toggle order expansion
  const toggleOrderExpand = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchOrders(currentPage);
  }, []);
  
  return (
    <div className="orders-details">
      <div className="orders-header">
        <div>
          <h1>Orders Details</h1>
          <div className="breadcrumb">Home &gt; Order List &gt; Order Details</div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading orders...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No orders found.
        </div>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="order-card mb-4">
            <Card.Body className="p-0">
              <div className="order-header d-flex justify-content-between align-items-center p-3">
                <div className="d-flex align-items-center">
                  <div>
                    <div className="order-id-status">
                      <span className="order-id">Orders ID: #{order.id}</span>
                      <div className="d-flex align-items-center">
                        <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                        
                        {/* Status Update Dropdown */}
                        <Dropdown className="status-update-dropdown ms-2">
                          <Dropdown.Toggle 
                            variant="light" 
                            size="sm" 
                            id={`status-dropdown-${order.id}`}
                            className="status-edit-btn"
                            disabled={updatingStatus === order.id}
                          >
                            {updatingStatus === order.id ? (
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                              <i className="bi bi-pencil-fill"></i>
                            )}
                          </Dropdown.Toggle>
                          
                          <Dropdown.Menu>
                            <Dropdown.Header>Update Status</Dropdown.Header>
                            {ORDER_STATUSES.map(status => (
                              <Dropdown.Item 
                                key={status}
                                className={order.status.toLowerCase() === status ? "active" : ""}
                                onClick={() => {
                                  if (order.status.toLowerCase() !== status) {
                                    updateOrderStatus(order.id, status);
                                  }
                                }}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>                  
                    </div>
                    <div className="order-date text-start"><i className="bi bi-calendar">&nbsp;&nbsp;</i>{order.date}</div>
                  </div>
                </div>
                <div className="d-flex">
                  <Button 
                    variant="primary" 
                    className="view-more-btn me-2"
                    onClick={() => toggleOrderExpand(order.id)}
                  >
                    {expandedOrder === order.id ? "Back" : "View More"}
                  </Button>
                  {/* <Button variant="light" className="print-btn">
                    <i className="bi bi-printer"></i>
                  </Button> */}
                </div>
              </div>
              
              <div className="order-info p-3 text-start">
                <div className="row">
                  <div className="col-md-4 mb-3 mb-md-0">
                    <div className="info-box">
                      <div className="info-header d-flex align-items-center mb-2">
                        <div className="icon-box me-2">
                          <i className="bi bi-person"></i>
                        </div>
                        <h5 className="mb-0">Customer</h5>
                      </div>
                      <div className="info-content">
                        <p className="mb-1"><strong>Full Name:</strong> {order.customer.fullName}</p>
                        <p className="mb-1"><strong>Email:</strong> {order.customer.email}</p>
                        <p className="mb-1"><strong>Phone:</strong> {order.customer.phone}</p>
                        {/* <Button variant="outline-primary" className="view-profile-btn mt-2">View profile</Button> */}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-4 mb-3 mb-md-0">
                    <div className="info-box">
                      <div className="info-header d-flex align-items-center mb-2">
                        <div className="icon-box me-2">
                          <i className="bi bi-bag"></i>
                        </div>
                        <h5 className="mb-0">Order Info</h5>
                      </div>
                      <div className="info-content">
                        <p className="mb-1"><strong>Shipping:</strong> {order.orderInfo.shipping}</p>
                        <p className="mb-1"><strong>Payment Method:</strong> {order.orderInfo.paymentMethod}</p>
                        <p className="mb-1"><strong>Status:</strong> {order.orderInfo.status}</p>
                        {/* <Button variant="outline-primary" className="download-info-btn mt-2">Download info</Button> */}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="info-box">
                      <div className="info-header d-flex align-items-center mb-2">
                        <div className="icon-box me-2">
                          <i className="bi bi-truck"></i>
                        </div>
                        <h5 className="mb-0">Deliver to</h5>
                      </div>
                      <div className="info-content">
                        <p className="mb-1"><strong>Address:</strong> {order.deliverTo.address}</p>
                        {/* <Button variant="outline-primary" className="view-profile-btn mt-2">View profile</Button> */}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="row mt-4">
                  <div className="col-md-4 mb-3 mb-md-0">
                    <div className="info-box">
                      <div className="info-header d-flex align-items-center mb-2">
                        <div className="icon-box me-2">
                          <i className="bi bi-credit-card"></i>
                        </div>
                        <h5 className="mb-0">Payment Info</h5>
                      </div>
                      <div className="info-content">
                        {order.paymentInfo.paymentMethod && (
                          <p className="mb-1"><strong>Payment Method:</strong> {order.paymentInfo.paymentMethod}</p>
                        )}
                        <p className="mb-1"><strong>Business name:</strong> {order.paymentInfo.businessName}</p>
                        <p className="mb-1"><strong>Phone:</strong> {order.paymentInfo.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-8">
                    <div className="info-box">
                      <div className="info-header d-flex align-items-center mb-2">
                        <div className="icon-box me-2">
                          <i className="bi bi-sticky"></i>
                        </div>
                        <h5 className="mb-0">Note</h5>
                      </div>
                      <div className="info-content">
                        <Form.Control 
                          as="textarea" 
                          placeholder="Type some notes" 
                          className="note-textarea" 
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Products section - only shown when expanded */}
                {expandedOrder === order.id && (
                  <div className="products-section mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Products</h5>
                      <Button variant="light" className="options-btn">
                        <i className="bi bi-three-dots-vertical"></i>
                      </Button>
                    </div>
                    
                    <div className="table-responsive" style={{ maxWidth: "80vw" }}>
                      <Table className="products-table">
                        <thead>
                          <tr>
                            {/* <th></th> */}
                            <th>Product Name</th>
                            <th>Order ID</th>
                            <th>Quantity</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.products.map((product, index) => (
                            <tr key={index}>
                              {/* <td>
                                <Form.Check 
                                  type="checkbox" 
                                  className="product-checkbox" 
                                />
                              </td> */}
                              <td>
                                <div className="product-info d-flex align-items-center">
                                  {/* <div className="product-image me-2"></div> */}
                                  <span>{product.name}</span>
                                </div>
                              </td>
                              <td>{product.orderId}</td>
                              <td>{product.quantity}</td>
                              <td>{product.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                    
                    <div className="order-summary mt-4">
                      <div className="row justify-content-end">
                        <div className="col-md-5">
                          <div className="summary-item d-flex justify-content-between mb-2">
                            <span>Subtotal</span>
                            <span>{order.summary.subtotal}</span>
                          </div>
                          <div className="summary-item d-flex justify-content-between mb-2">
                            <span>Tax</span>
                            <span>{order.summary.tax}</span>
                          </div>
                          <div className="summary-item d-flex justify-content-between mb-2">
                            <span>Discount</span>
                            <span>{order.summary.discount}</span>
                          </div>
                          <div className="summary-item d-flex justify-content-between mb-3">
                            <span>Shipping Rate</span>
                            <span>{order.summary.shipping}</span>
                          </div>
                          <div className="summary-total d-flex justify-content-between">
                            <span><strong>Total</strong></span>
                            <span><strong>{order.summary.total}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        ))
      )}
      
      {!loading && !error && paginationInfo.totalPages > 1 && (
        <PaginationComponent 
          currentPage={paginationInfo.currentPage}
          totalPages={paginationInfo.totalPages}
          onPageChange={paginate}
          showNextButton={true}
          className="mt-4"
        />
      )}
    </div>
  );
};

export default OrdersDetails;