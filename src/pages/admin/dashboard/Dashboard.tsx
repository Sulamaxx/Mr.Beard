// src/pages/admin/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Table, Form } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ApiService from "../../../services/ApiService"; // Adjust the import path as needed
import "./Dashboard.scss";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define interfaces for our data types
interface DashboardStats {
  total_orders: number;
  active_orders: number;
  completed_orders: number;
  returned_orders: number;
  start_date: string;
  end_date: string;
}

interface SalesGraphData {
  labels: string[];
  data: number[];
}

interface BestSellingProduct {
  product: string;
  image: string;
  price: string;
  sales: string;
  total: string;
}

interface RecentOrder {
  id: string;
  product: string;
  date: string;
  customer: string;
  status: string;
  amount: string;
}

interface DashboardData {
  stats: DashboardStats;
  sales_graph: SalesGraphData;
  best_selling_products: BestSellingProduct[];
  recent_orders: RecentOrder[];
}

interface ApiResponse {
  status: string;
  data: DashboardData;
}

const Dashboard: React.FC = () => {
  const [chartPeriod, setChartPeriod] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData(chartPeriod);
  }, [chartPeriod]);

  const fetchDashboardData = async (period: string) => {
    try {
      setLoading(true);
      const response = await ApiService.post<ApiResponse>('/v2/admin/dashboard', { period });
      
      if (response.status === "success" && response.data) {
        setDashboardData(response.data);
      } else {
        setError("Invalid data received from the server");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data from API response
  const chartData = {
    labels: dashboardData?.sales_graph?.labels || [],
    datasets: [
      {
        label: "Sales",
        data: dashboardData?.sales_graph?.data || [],
        fill: false,
        borderColor: "rgb(65, 105, 225)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {

            if(value === 0) {
              return value + " LKR";
            }

            return "" + value;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  if (loading && !dashboardData) {
    return <div className="loading-spinner">Loading dashboard data...</div>;
  }

  if (error && !dashboardData) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="col-auto">
          <h1>Dashboard</h1>
          <div className="breadcrumb">Home &gt; Dashboard</div>
        </div>
        <div className="date-display">
          <i className="bi bi-calendar"></i>
          <span>
            {dashboardData?.stats?.start_date} -{" "}
            {dashboardData?.stats?.end_date}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col xl={3} md={6} className="mb-3">
          <Card className="stats-card">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Total Orders</h5>
                <h2 className="mb-0">
                  {dashboardData?.stats?.total_orders || 0}
                </h2>
              </div>
              <div className="stats-icon">
                <i className="bi bi-bag text-secondary"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6} className="mb-3">
          <Card className="stats-card">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Active Orders</h5>
                <h2 className="mb-0">
                  {dashboardData?.stats?.active_orders || 0}
                </h2>
              </div>
              <div className="stats-icon">
                <i className="bi bi-bag-check text-secondary"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6} className="mb-3">
          <Card className="stats-card">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Completed Orders</h5>
                <h2 className="mb-0">
                  {dashboardData?.stats?.completed_orders || 0}
                </h2>
              </div>
              <div className="stats-icon">
                <i className="bi bi-check-circle text-secondary"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6} className="mb-3">
          <Card className="stats-card">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Return Orders</h5>
                <h2 className="mb-0">
                  {dashboardData?.stats?.returned_orders || 0}
                </h2>
              </div>
              <div className="stats-icon">
                <i className="bi bi-arrow-return-left text-secondary"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Sales Graph and Best Selling Products */}
      <Row className="mb-4">
        <Col
          lg={8}
          className="mb-3 table-responsive"
          style={{ maxWidth: "100vw" }}
        >
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Sale Graph</h5>
                <div className="period-buttons">
                  <Button
                    variant={
                      chartPeriod === "weekly"
                        ? "secondary"
                        : "outline-secondary"
                    }
                    className="me-2"
                    onClick={() => setChartPeriod("weekly")}
                  >
                    WEEKLY
                  </Button>
                  <Button
                    variant={
                      chartPeriod === "monthly"
                        ? "secondary"
                        : "outline-secondary"
                    }
                    className="me-2"
                    onClick={() => setChartPeriod("monthly")}
                  >
                    MONTHLY
                  </Button>
                  <Button
                    variant={
                      chartPeriod === "yearly"
                        ? "secondary"
                        : "outline-secondary"
                    }
                    onClick={() => setChartPeriod("yearly")}
                  >
                    YEARLY
                  </Button>
                </div>
              </div>
              <div className="chart-container table-responsive">
                <Line data={chartData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-3">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Best Selling Products</h5>
                <Button variant="link" className="p-0">
                  <i className="bi bi-three-dots-vertical"></i>
                </Button>
              </div>
              <div className="best-selling-list">
                {dashboardData?.best_selling_products?.map((product, index) => (
                  <div
                    key={index}
                    className="best-selling-item d-flex justify-content-between align-items-center mb-3"
                  >
                    <div className="d-flex align-items-center">
                      <div className="product-img-placeholder me-3">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.product}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <h6 className="mb-0">{product.product}</h6>
                        <small className="text-muted">{product.price}</small>
                      </div>
                    </div>
                    <div className="text-end">
                      <h6 className="mb-0">{product.total}</h6>
                      <small className="text-muted">
                        {product.sales} sales
                      </small>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-3">
                <Button variant="secondary" className="report-btn">
                  REPORT
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders */}
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Recent Orders</h5>
                <Button variant="link" className="p-0">
                  <i className="bi bi-three-dots-vertical"></i>
                </Button>
              </div>
              <div className="table-responsive" style={{ maxWidth: "80vw" }}>
                <Table hover>
                  <thead>
                    <tr>
                      <th>
                        <Form.Check type="checkbox" />
                      </th>
                      <th>Product</th>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Customer Name</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.recent_orders?.map((order, index) => (
                      <tr key={index}>
                        <td>
                          <Form.Check type="checkbox" />
                        </td>
                        <td>{order.product}</td>
                        <td>{order.id}</td>
                        <td>{order.date}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar me-2"></div>
                            {order.customer}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${
                              order.status.toLowerCase() === "processing"
                                ? "processing"
                                : order.status.toLowerCase() === "shipped"
                                ? "shipped"
                                : order.status.toLowerCase() === "delivered"
                                ? "delivered"
                                : "canceled"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>{order.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;