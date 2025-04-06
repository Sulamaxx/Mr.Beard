import React, { useState, useEffect } from "react";
import { Card, Button, Table, Form } from "react-bootstrap";
import "./OrdersDetails.scss";
import PaginationComponent from "../../../components/ui/admin/pagination/PaginationComponent";

// Sample orders data
const sampleOrders = [
  {
    id: "6743",
    date: "Feb 16,2025",
    status: "Pending",
    customer: {
      fullName: "Shristi Singh",
      email: "shristi@gmail.com",
      phone: "+91 904 231 1212"
    },
    orderInfo: {
      shipping: "Next express",
      paymentMethod: "Card",
      status: "Completed"
    },
    deliverTo: {
      address: "Dharam Colony, Palam Vihar, Gurgaon, Haryana"
    },
    paymentInfo: {
      cardType: "Master Card",
      cardNumber: "**** **** 6557",
      businessName: "Shristi Singh",
      phone: "+91 904 231 1212"
    },
    products: [
      { name: "Lorem Ipsum", orderId: "#25421", quantity: 2, total: "LKR 1000" },
      { name: "Lorem Ipsum", orderId: "#25421", quantity: 2, total: "LKR 1000" },
      { name: "Lorem Ipsum", orderId: "#25421", quantity: 2, total: "LKR 1000" },
      { name: "Lorem Ipsum", orderId: "#25421", quantity: 2, total: "LKR 1000" }
    ],
    summary: {
      subtotal: "LKR 4000",
      tax: "0",
      discount: "0",
      shipping: "0",
      total: "LKR 4000"
    }
  },
  {
    id: "6744",
    date: "Feb 20,2025",
    status: "Pending",
    customer: {
      fullName: "Didul Adeesha",
      email: "didul@gmail.com",
      phone: "+91 904 231 1212"
    },
    orderInfo: {
      shipping: "Next express",
      paymentMethod: "Card",
      status: "Completed"
    },
    deliverTo: {
      address: "Dharam Colony, Palam Vihar, Gurgaon, Haryana"
    },
    paymentInfo: {
      cardType: "Master Card",
      cardNumber: "**** **** 6557",
      businessName: "Shristi Singh",
      phone: "+91 904 231 1212"
    },
    products: [
      { name: "Lorem Ipsum", orderId: "#25421", quantity: 2, total: "LKR 1000" },
      { name: "Lorem Ipsum", orderId: "#25421", quantity: 2, total: "LKR 1000" }
    ],
    summary: {
      subtotal: "LKR 2000",
      tax: "0",
      discount: "0",
      shipping: "0",
      total: "LKR 2000"
    }
  },
  {
    id: "6745",
    date: "Feb 22,2025",
    status: "Delivered",
    customer: {
      fullName: "John Smith",
      email: "john@gmail.com",
      phone: "+91 904 231 1212"
    },
    orderInfo: {
      shipping: "Standard",
      paymentMethod: "Card",
      status: "Completed"
    },
    deliverTo: {
      address: "123 Main St, New York, NY 10001"
    },
    paymentInfo: {
      cardType: "Visa",
      cardNumber: "**** **** 4321",
      businessName: "John Smith",
      phone: "+91 904 231 1212"
    },
    products: [
      { name: "Lorem Ipsum", orderId: "#25421", quantity: 1, total: "LKR 500" }
    ],
    summary: {
      subtotal: "LKR 500",
      tax: "0",
      discount: "0",
      shipping: "0",
      total: "LKR 500"
    }
  }
];

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
    cardType: string;
    cardNumber: string;
    businessName: string;
    phone: string;
  };
  products: Product[];
  summary: Summary;
}

const OrdersDetails: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const ordersPerPage = 2;
  
  // Sort orders with pending status first
  useEffect(() => {
    const sortedOrders = [...sampleOrders].sort((a, b) => {
      if (a.status === "Pending" && b.status !== "Pending") return -1;
      if (a.status !== "Pending" && b.status === "Pending") return 1;
      return 0;
    });
    setOrders(sortedOrders);
  }, []);
  
  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Handle view more/back button
  const toggleOrderExpand = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };
  
  return (
    <div className="orders-details">
      <div className="orders-header">
        <div>
          <h1 className="text-start">Orders Details</h1>
          <div className="breadcrumb">Home &gt; Order List &gt; Order Details</div>
        </div>
      </div>
      
      {currentOrders.map((order) => (
        <Card key={order.id} className="order-card mb-4">
          <Card.Body className="p-0">
            <div className="order-header d-flex justify-content-between align-items-center p-3">
              <div className="d-flex align-items-center">
                <div>
                  <div className="order-id-status">
                    <span className="order-id">Orders ID: #{order.id}</span>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
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
                <Button variant="light" className="print-btn">
                  <i className="bi bi-printer"></i>
                </Button>
              </div>
            </div>
            
            <div className="order-info p-3">
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
                      <Button variant="outline-primary" className="view-profile-btn mt-2">View profile</Button>
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
                      <Button variant="outline-primary" className="download-info-btn mt-2">Download info</Button>
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
                      <Button variant="outline-primary" className="view-profile-btn mt-2">View profile</Button>
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
                      <div className="d-flex align-items-center mb-1">
                        <span className="card-icon me-2">
                          <i className="bib bi-creditcard"></i>
                        </span>
                        <span>{order.paymentInfo.cardType} {order.paymentInfo.cardNumber}</span>
                      </div>
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
                          <th></th>
                          <th>Product Name</th>
                          <th>Order ID</th>
                          <th>Quantity</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.products.map((product, index) => (
                          <tr key={index}>
                            <td>
                              <Form.Check 
                                type="checkbox" 
                                className="product-checkbox" 
                              />
                            </td>
                            <td>
                              <div className="product-info d-flex align-items-center">
                                <div className="product-image me-2"></div>
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
                          <span>Tax (20%)</span>
                          <span>{order.summary.tax}</span>
                        </div>
                        <div className="summary-item d-flex justify-content-between mb-2">
                          <span>Discount</span>
                          <span>{order.summary.discount}</span>
                        </div>
                        <div className="summary-item d-flex justify-content-between mb-3">
                          <span>Sipping Rate</span>
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
      ))}
      
      {totalPages > 1 && (
        <PaginationComponent 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
          showNextButton={true}
          className="mt-4"
        />
      )}
    </div>
  );
};

export default OrdersDetails;