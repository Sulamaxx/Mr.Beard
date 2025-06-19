import React, { useState, useEffect } from "react";
import { Card, Table, Button, Form } from "react-bootstrap";
import "./OrderList.scss";
import PaginationComponent from "../../../components/ui/admin/pagination/PaginationComponent";

// Sample order data
const sampleOrders = [
  {
    id: "25426",
    product: "Lorem Ipsum",
    date: "Nov 8th, 2023",
    customerName: "Kavin",
    status: "Delivered",
    amount: "LKR2400.00"
  },
  {
    id: "25425",
    product: "Lorem Ipsum",
    date: "Nov 7th, 2023",
    customerName: "Komael",
    status: "Cancelled",
    amount: "LKR2400.00"
  },
  {
    id: "25424",
    product: "Lorem Ipsum",
    date: "Nov 6th, 2023",
    customerName: "Nikhil",
    status: "Delivered",
    amount: "LKR2400.00"
  },
  {
    id: "25423",
    product: "Lorem Ipsum",
    date: "Nov 5th, 2023",
    customerName: "Shivam",
    status: "Cancelled",
    amount: "LKR2400.00"
  },
  {
    id: "25422",
    product: "Lorem Ipsum",
    date: "Nov 4th, 2023",
    customerName: "Shadab",
    status: "Delivered",
    amount: "LKR2400.00"
  },
  {
    id: "25421",
    product: "Lorem Ipsum",
    date: "Nov 2nd, 2023",
    customerName: "Yogesh",
    status: "Delivered",
    amount: "LKR2400.00"
  }
];

interface Order {
  id: string;
  product: string;
  date: string;
  customerName: string;
  status: string;
  amount: string;
}

const OrderList: React.FC = () => {
  // @ts-ignore
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const ordersPerPage = 5;
  
  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Handle select all checkbox
  const handleSelectAll = () => {
    if (!selectAll) {
      const allOrderIds = currentOrders.map(order => order.id);
      setSelectedOrders(allOrderIds);
    } else {
      setSelectedOrders([]);
    }
    setSelectAll(!selectAll);
  };
  
  // Handle individual order selection
  const handleSelectOrder = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };
  
  // Update selectAll state when individual selections change
  useEffect(() => {
    if (currentOrders.length > 0 && selectedOrders.length === currentOrders.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedOrders, currentOrders]);
  
  return (
    <div className="order-list">
      <div className="order-header">
        <div>
          <h1>Order List</h1>
          <div className="breadcrumb">Home &gt; Orders</div>
        </div>
      </div>
      
      <Card className="order-table-card">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table className="mb-0">
              <thead>
                <tr>
                  <th>
                    <Form.Check 
                      type="checkbox" 
                      checked={selectAll}
                      onChange={handleSelectAll}
                      aria-label="Select all orders"
                    />
                  </th>
                  <th>Product</th>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer Name</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Form.Check 
                        type="checkbox" 
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                        aria-label={`Select order ${order.id}`}
                      />
                    </td>
                    <td>{order.product}</td>
                    <td>{order.id}</td>
                    <td>{order.date}</td>
                    <td>{order.customerName}</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.amount}</td>
                    <td>
                      <Button variant="link" className="p-0 view-btn">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
      
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

export default OrderList;