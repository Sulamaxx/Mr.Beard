// src/pages/admin/Dashboard.tsx
import React, { useState } from "react";
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

const Dashboard: React.FC = () => {
  const [chartPeriod, setChartPeriod] = useState("monthly");

  const chartData = {
    labels: ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
    datasets: [
      {
        label: "Sales",
        data: [50, 60, 70, 80, 95, 400],
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
            return "₹" + value;
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

  const recentOrders = [
    {
      id: "#25426",
      product: "Lorem Ipsum",
      date: "Nov 8th,2023",
      customer: "Kavin",
      status: "Delivered",
      amount: "LKR2400.00",
    },
    {
      id: "#25425",
      product: "Lorem Ipsum",
      date: "Nov 7th,2023",
      customer: "Komael",
      status: "Canceled",
      amount: "LKR2400.00",
    },
    {
      id: "#25424",
      product: "Lorem Ipsum",
      date: "Nov 6th,2023",
      customer: "Nikhil",
      status: "Delivered",
      amount: "LKR2400.00",
    },
    {
      id: "#25423",
      product: "Lorem Ipsum",
      date: "Nov 5th,2023",
      customer: "Shivam",
      status: "Canceled",
      amount: "LKR2400.00",
    },
    {
      id: "#25422",
      product: "Lorem Ipsum",
      date: "Nov 4th,2023",
      customer: "Shadab",
      status: "Delivered",
      amount: "LKR2400.00",
    },
    {
      id: "#25421",
      product: "Lorem Ipsum",
      date: "Nov 2nd,2023",
      customer: "Yogesh",
      status: "Delivered",
      amount: "LKR2400.00",
    },
  ];

  const bestSellingProducts = [
    {
      product: "Lorem Ipsum",
      price: "LKR 2500",
      sales: 10,
      total: "LKR 36000",
    },
    {
      product: "Lorem Ipsum",
      price: "LKR 2000",
      sales: 74,
      total: "LKR 70000",
    },
    {
      product: "Lorem Ipsum",
      price: "LKR 2300",
      sales: 20,
      total: "LKR 25000",
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="col-auto">
          <h1>Dashboard</h1>
          <div className="breadcrumb">Home &gt; Dashboard</div>
        </div>
        <div className="date-display">
          <i className="bi bi-calendar"></i>
          <span>Oct 11,2023 - Nov 11,2022</span>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col xl={3} md={6} className="mb-3">
          <Card className="stats-card">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Total Orders</h5>
                <h2 className="mb-0">67</h2>
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
                <h2 className="mb-0">56</h2>
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
                <h2 className="mb-0">100</h2>
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
                <h2 className="mb-0">2</h2>
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
        <Col lg={8} className="mb-3 table-responsive" style={{ maxWidth: "100vw" }}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Sale Graph</h5>
                <div className="period-buttons">
                  <Button
                    variant={
                      chartPeriod === "weekly" ? "secondary" : "outline-secondary"
                    }
                    className="me-2"
                    onClick={() => setChartPeriod("weekly")}
                  >
                    WEEKLY
                  </Button>
                  <Button
                    variant={
                      chartPeriod === "monthly" ? "secondary" : "outline-secondary"
                    }
                    className="me-2"
                    onClick={() => setChartPeriod("monthly")}
                  >
                    MONTHLY
                  </Button>
                  <Button
                    variant={
                      chartPeriod === "yearly" ? "secondary" : "outline-secondary"
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
                {bestSellingProducts.map((product, index) => (
                  <div
                    key={index}
                    className="best-selling-item d-flex justify-content-between align-items-center mb-3"
                  >
                    <div className="d-flex align-items-center">
                      <div className="product-img-placeholder me-3"></div>
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
                    {recentOrders.map((order, index) => (
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
                              order.status === "Delivered"
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
