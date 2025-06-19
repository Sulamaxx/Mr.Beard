import React, { useState, useEffect } from "react";
import { Card, Table, Badge, Button } from "react-bootstrap";
import "./OrderHistory.scss";
import PaginationComponent from "../../../components/ui/admin/pagination/PaginationComponent";
import ApiService from "../../../services/ApiService"; // Assuming this is the correct path

interface Order {
  id: string;
  total: string;
  date: string;
  status: string;
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

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
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
      const response = await ApiService.get<OrdersResponse>(`/v2/orders/history`, { page });
      
      if (response.status === "success" && response.data) {
        setOrders(response.data.orders);
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

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    fetchOrders(pageNumber);
  };

  // Initial data fetch
  useEffect(() => {
    fetchOrders(currentPage);
  }, []);

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
          {loading ? (
            <div className="text-center p-4">Loading orders...</div>
          ) : error ? (
            <div className="text-center p-4 text-danger">{error}</div>
          ) : (
            <div className="table-responsive" style={{ maxWidth: '90vw' }}>
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
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
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
                          <Button 
                            variant="link" 
                            className="p-0 view-btn"
                            onClick={() => console.log(`Viewing order ${order.id}`)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">No orders found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {paginationInfo.totalPages > 1 && (
        <PaginationComponent
          currentPage={paginationInfo.currentPage}
          totalPages={paginationInfo.totalPages}
          onPageChange={handlePageChange}
          showNextButton={true}
          className="mt-4"
        />
      )}
    </div>
  );
};

export default OrderHistory;