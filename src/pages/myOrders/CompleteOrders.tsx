import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert } from 'react-bootstrap';
import ApiService from '../../services/ApiService';
import './CompleteOrders.scss';

interface OrderItemData {
  order_id: number;
  order_number: string;
  status: string;
  created_at: string;
  item: {
    id: number;
    product_id: number;
    product_name: string;
    product_image: string | null;
    quantity: number;
    price: number;
    subtotal: number;
    original_price: number;
    discount_percentage: number;
  };
}

interface ApiResponse {
  status: string;
  data: OrderItemData[];
  filter: string;
  total_items: number;
}

const CompleteOrders: React.FC = () => {
  const [orderItems, setOrderItems] = useState<OrderItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompleteOrders();
  }, []);

  const fetchCompleteOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiService.get<ApiResponse>('/v2/user/orders?status=complete');
      
      if (response.status === 'success') {
        setOrderItems(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch orders');
      }
    } catch (err: any) {
      console.error('Error fetching complete orders:', err);
      setError('Failed to load complete orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="warning" />
        <p className="text-white mt-3">Loading complete orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }

  if (orderItems.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-white">No complete orders found.</p>
      </div>
    );
  }

  return (
    <div className="complete-orders">
      <div className="orders-table-container">
        <Table responsive className="orders-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((orderItem, index) => (
              <tr key={`${orderItem.order_id}-${orderItem.item.id}`}>
                <td>
                  <div className="product-info">
                    <div className="product-image">
                      <img 
                        src={orderItem.item.product_image || '/api/placeholder/80/80'} 
                        alt={orderItem.item.product_name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/api/placeholder/80/80';
                        }}
                      />
                    </div>
                    <div className="product-name">
                      {orderItem.item.product_name}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="quantity-container">
                    <input 
                      type="number" 
                      value={orderItem.item.quantity} 
                      className="quantity-input"
                      readOnly
                    />
                  </div>
                </td>
                <td className="price-cell">
                  LKR {orderItem.item.price}
                </td>
                <td className="subtotal-cell">
                  LKR {orderItem.item.subtotal}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default CompleteOrders;