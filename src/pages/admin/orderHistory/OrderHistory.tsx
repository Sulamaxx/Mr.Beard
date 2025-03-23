import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Badge, Button } from "react-bootstrap";
import "./OrderHistory.scss";
import PaginationComponent from "../../../components/ui/admin/pagination/PaginationComponent";

// Sample order data
const sampleOrders = [
  { id: "0001", total: "05", date: "Mar 8th, 2025", status: "Delivered" },
  { id: "0002", total: "10", date: "Mar 7th, 2025", status: "Canceled" },
  { id: "0003", total: "08", date: "Mar 6th, 2025", status: "Delivered" },
  { id: "0004", total: "02", date: "Mar 5th, 2025", status: "Canceled" },
  { id: "0005", total: "15", date: "Mar 4th, 2025", status: "Delivered" },
  { id: "0006", total: "03", date: "Mar 2nd, 2025", status: "Delivered" }
];

interface Order {
  id: string;
  total: string;
  date: string;
  status: string;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  
  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  return (
    <div className="order-history">
      <div className="order-header">
        <div>
          <h1>Order History</h1>
          <div className="breadcrumb">Home &gt; Order History</div>
        </div>
      </div>
      
      <Card className="order-table-card">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table className="mb-0">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.id}</td>
                    <td>{order.total}</td>
                    <td>{order.date}</td>
                    <td>
                      <Badge 
                        pill 
                        className={`status-badge ${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </Badge>
                    </td>
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

export default OrderHistory;