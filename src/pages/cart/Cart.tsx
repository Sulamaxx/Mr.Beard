import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import "./Cart.scss";
import ApiService from "../../services/ApiService"; // Update this path as needed
import { toast } from "react-toastify";
import DeliveryDate from "../../components/util/DeliveryDate";

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    discount: number;
    stock: number;
    category: string;
    image: string;
  };
  total_price: number;
}

interface ApiCartResponse {
  status: boolean;
  message: string;
  data: CartItem[];
  total_items: number;
  total_amount: number;
}

interface UserData {
  id?: number;
  name?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  country?: string;
  company?: string;
  address?: string;
  apartment?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  phone?: string;
  mobile?: string;
}

const Cart: React.FC = () => {
  // Keep your original state
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeStep, setActiveStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [shippingAddress, setShippingAddress] = useState("Same");
  const [differentShippingAddressValue, setDifferentShippingAddressValue] = useState("");
  const [saveDetails, setSaveDetails] = useState<boolean>(false);
  // @ts-ignore
  const [userData, setUserData] = useState<UserData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState({
    firstName: "",
    lastName: "",
    country: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
    sameAsShipping: true,
    cardNumber: "",
    cardHolderName: "",
    expireDate: "",
    cvv: ""
  });

  // Fetch cart items on component mount
  useEffect(() => {
    fetchCartItems();
    fetchUserDetails();
  }, []);

  // Fetch user details from API
  const fetchUserDetails = async () => {
    try {
      const response = await ApiService.get<any>('/v2/user/');

      console.log("User details response:", response);
      
      if (response) {
        const user = response;

        console.log("User details:", user);
        
        // Update checkout form with user details
        setCheckoutDetails({
          ...checkoutDetails,
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          country: user.country || "",
          company: user.company || "",
          address: user.address || "",
          apartment: user.apartment || "",
          city: user.city || "",
          state: user.state || "",
          postalCode: user.postal_code || "",
          phone: user.phone || user.mobile || "",
        });
        
        // Store user data
        setUserData(user);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Error loading user details. Please try again.");
    }
  };

  // Fetch cart items from API
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await ApiService.get<ApiCartResponse>('/v2/cart');
      
      if (response.status) {
        setCartItems(response.data);
      } else {
        alert("Failed to load cart items: " + response.message);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      alert("Error loading cart items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

// Calculate subtotal (sum of all products' prices without discounts)
const calculateSubtotal = () => {
  return cartItems.reduce(
    (total, item) => total + (parseFloat(item.product.price) * item.quantity),
    0
  );
};

// Calculate total discounts
const calculateTotalDiscounts = () => {
  return cartItems.reduce(
    (total, item) => {
      const itemPrice = parseFloat(item.product.price);
      const discountPercentage = parseFloat(item.product.discount);
      const discountAmount = (itemPrice * discountPercentage) / 100;
      return total + (discountAmount * item.quantity);
    },
    0
  );
};

// Calculate final total (subtotal minus discounts)
const calculateTotal = () => {
  const subtotal = calculateSubtotal();
  const totalDiscounts = calculateTotalDiscounts();
  return subtotal - totalDiscounts;
};

  const handleCheckoutDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCheckoutDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleDifferentShippingAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDifferentShippingAddressValue(e.target.value);
  };

  const proceedToNextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, 3));
  };

  // Save user checkout details
  const saveUserCheckoutDetails = async () => {
    if (!saveDetails) return;
    
    setIsSubmitting(true);
    
    try {
      const userData = {
        first_name: checkoutDetails.firstName,
        last_name: checkoutDetails.lastName,
        country: checkoutDetails.country,
        company: checkoutDetails.company,
        address: checkoutDetails.address,
        apartment: checkoutDetails.apartment,
        city: checkoutDetails.city,
        state: checkoutDetails.state,
        postal_code: checkoutDetails.postalCode,
        phone: checkoutDetails.phone
      };
      
      const response:any = await ApiService.put('/v2/users/', userData);
      
      if (response.status) {
        toast.success("Your information has been saved successfully.");
      }
    } catch (error) {
      console.error("Error saving user details:", error);
      toast.error("Failed to save your information. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit order
  const submitOrder = async () => {
    setIsSubmitting(true);
    
    try {
      // Prepare order data
      const orderData = {
        payment_method: paymentMethod === "Card" ? "CARD" : "COD",
        first_name: checkoutDetails.firstName,
        last_name: checkoutDetails.lastName,
        country: checkoutDetails.country,
        company: checkoutDetails.company,
        address: checkoutDetails.address,
        shipping_address: shippingAddress === "Same" ? 
          checkoutDetails.address : differentShippingAddressValue,
        apartment: checkoutDetails.apartment,
        city: checkoutDetails.city,
        state: checkoutDetails.state,
        postal_code: checkoutDetails.postalCode,
        phone: checkoutDetails.phone,
        shipping_rate: 500,
        tax: 0, // Default to 0 as it wasn't specified
        discount: 0 // Default to 0 as it wasn't specified
      };
      
      const response:any = await ApiService.post('/v2/checkout', orderData);
      
      if (response && response.message === "Order created successfully") {
        proceedToNextStep(); // Move to order complete step
        toast.success("Order placed successfully!");
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch (error: any) {
      console.error("Error placing order:", error);
      
      // Handle specific error messages
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error placing order. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update cart item quantity
  const updateQuantity = async (id: number, newQuantity: number) => {
    try {
      // Call API to update quantity
      const response = await ApiService.put<any>(`/v2/cart/${id}`, {
        quantity: newQuantity
      });

      if (response.status) {
        // Refresh cart items to get updated data
        fetchCartItems();
      } else {
        alert(response.message || "Failed to update cart");
      }
    } catch (error: any) {
      console.error("Error updating cart:", error);
      
      // Handle stock availability error
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Error updating cart. Please try again.");
      }
      
      // Refresh cart to ensure we have the latest data
      fetchCartItems();
    }
  };

  // Remove item from cart
  const removeItem = async (id: number) => {
    try {
      const response = await ApiService.delete<any>(`/v2/cart/${id}`);
      
      if (response.status) {
        // Refresh cart after deleting the item
        fetchCartItems();
      } else {
        alert(response.message || "Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Error removing item. Please try again.");
      // Refresh cart to ensure we have the latest data
      fetchCartItems();
    }
  };

  // Updated renderShoppingCart function that only modifies the data source
  const renderShoppingCart = () => {
    if (loading) {
      return <div className="text-center p-5">Loading cart items...</div>;
    }

    if (cartItems.length === 0) {
      return <div className="text-center p-5">Your cart is empty</div>;
    }

    return (
      <Row>
        <Col xs={12} md={8}>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-details">
                  <div className="cart-item-image">
                    <img src={item.product.image} alt={item.product.name} />
                  </div>
                  <div className="cart-item-info">
                    <h3>{item.product.name}</h3>
                    {/* <p>Category: {item.product.category}</p> */}
                  </div>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-control">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="item-price">
                    LKR {item.total_price.toLocaleString()}
                  </div>
                  <button
                    className="remove-item"
                    onClick={() => removeItem(item.id)}
                  >
                    × Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="cart-summary">
            <h3>Cart summary</h3>
            {/* <div className="payment-method">
              <Form.Check 
                type="radio"
                label="Card"
                name="paymentMethod"
                id="cardPayment"
                checked={paymentMethod === 'Card'}
                onChange={() => setPaymentMethod('Card')}
              />
              <Form.Check 
                type="radio"
                label="Cash On Delivery"
                name="paymentMethod"
                id="codPayment"
                checked={paymentMethod === 'COD'}
                onChange={() => setPaymentMethod('COD')}
              />
            </div> */}
            <div className="price-details">
              <div className="subtotal">
                <span>Subtotal</span>
                <span>{calculateSubtotal().toLocaleString()} LKR</span>
              </div>
              <div className="discount">
                <span>Discounts</span>
                <span>- {calculateTotalDiscounts().toLocaleString()} LKR</span>
              </div>
              <div className="total">
                <span>Total</span>
                <span>{calculateTotal().toLocaleString()} LKR</span>
              </div>
            </div>
            <button className="checkout-button btn btn-primary" onClick={proceedToNextStep}>
              Proceed to Checkout
            </button>
          </div>
        </Col>
      </Row>
    );
  };

  // Updated renderCheckoutDetails with API integration
  const renderCheckoutDetails = () => {
    return (
      <Row>
        <Col xs={12} md={8}>
          <div className="checkout-container">
            <h3>Checkout</h3>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name*</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={checkoutDetails.firstName}
                      onChange={handleCheckoutDetailsChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name*</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={checkoutDetails.lastName}
                      onChange={handleCheckoutDetailsChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Country/Region*</Form.Label>
                    <Form.Control
                      type="text"
                      name="country"
                      value={checkoutDetails.country}
                      onChange={handleCheckoutDetailsChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Company (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="company"
                      value={checkoutDetails.company}
                      onChange={handleCheckoutDetailsChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Street Address*</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={checkoutDetails.address}
                  onChange={handleCheckoutDetailsChange}
                  required
                  placeholder="House number and street name"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="apartment"
                  value={checkoutDetails.apartment}
                  onChange={handleCheckoutDetailsChange}
                  placeholder="Apartment, suite, unit, etc. (optional)"
                />
              </Form.Group>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>City*</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={checkoutDetails.city}
                      onChange={handleCheckoutDetailsChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>State*</Form.Label>
                    <Form.Control
                      type="text"
                      name="state"
                      value={checkoutDetails.state}
                      onChange={handleCheckoutDetailsChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Postal Code*</Form.Label>
                    <Form.Control
                      type="text"
                      name="postalCode"
                      value={checkoutDetails.postalCode}
                      onChange={handleCheckoutDetailsChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Phone*</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={checkoutDetails.phone}
                  onChange={handleCheckoutDetailsChange}
                  required
                />
              </Form.Group>

              <Form.Check
                className="text-white"
                type="checkbox"
                label="Save my information for a faster checkout"
                name="saveDetails"
                id="saveDetails"
                checked={saveDetails}
                onChange={() => setSaveDetails(!saveDetails)}
              />

              <button
                type="button"
                className="continue-button btn btn-primary"
                onClick={async () => {
                  // Save user details if checkbox is checked
                  if (saveDetails) {
                    await saveUserCheckoutDetails();
                  }
                  // Scroll to shipping address section
                  document.getElementById('shipping-address')?.scrollIntoView({ behavior: 'smooth' });
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Continue to delivery'}
              </button>

              <div className="shipping-address" id="shipping-address">
                <h4 className="text-start">Shipping Address</h4>
                <p className="text-white">
                  Select the address that matches your card or payment method.
                </p>
                <div className="bg-white p-4 rounded-3 text-start">
                  <div>
                    <Form.Check
                      className="text-black-50 fs-4"
                      type="radio"
                      label="Same as Billing address"
                      name="shippingAddressType"
                      id="sameBillingAddress"
                      checked={shippingAddress === "Same"}
                      onChange={() => setShippingAddress("Same")}
                    />
                  </div>
                  <hr className="border-2 border-black" />
                  <div className="d-flex align-items-center">
                    <Form.Check
                      className="text-black-50 fs-4 me-2"
                      type="radio"
                      name="shippingAddressType"
                      id="differentShippingAddress"
                      checked={shippingAddress === "Different"}
                      onChange={() => setShippingAddress("Different")}
                    />
                    <Form.Control
                      type="text"
                      placeholder="Use a different shipping address"
                      disabled={shippingAddress !== "Different"}
                      className="flex-grow-1"
                      value={differentShippingAddressValue}
                      onChange={handleDifferentShippingAddressChange}
                    />
                  </div>
                </div>
              </div>

              <hr className="border-2" />

              <div className="shipping-method">
                <h4 className="text-start">Shipping Method</h4>
                <div className="bg-white p-4 rounded-3 text-start">
                  <DeliveryDate />
                  <hr className="border-2 border-black" />
                  <div className="row">
                    <div className="col">
                      <h5 className="text-black-50">Delivery Charges: </h5>
                      <p>Additional fees may apply</p>
                    </div>
                    <div className="col">
                      <h3 className="text-black text-end">500.00 LKR</h3>
                    </div>
                  </div>
                </div>
              </div>

              <div className="payment-method">
                <h4 className="text-start">Payment Method</h4>
                <p className="text-white">
                  All transactions are secure and encrypted.
                </p>
                <div className="bg-white p-4 rounded-3 text-start">
                  <div>
                    <Form.Check
                      className="text-black fs-4"
                      type="radio"
                      label="Card"
                      name="paymentMethod"
                      id="cardPayment"
                      checked={paymentMethod === "Card"}
                      onChange={() => setPaymentMethod("Card")}
                    />
                    <p className="ms-4">We accept all major credit cards.</p>
                    <Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Control
                              className="p-3"
                              placeholder="Card number"
                              type="text"
                              name="cardNumber"
                              value={checkoutDetails.cardNumber}
                              onChange={handleCheckoutDetailsChange}
                              required={paymentMethod === "Card"}
                              disabled={paymentMethod !== "Card"}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Control
                              className="p-3"
                              type="text"
                              name="cardHolderName"
                              placeholder="Name of card"
                              value={checkoutDetails.cardHolderName}
                              onChange={handleCheckoutDetailsChange}
                              required={paymentMethod === "Card"}
                              disabled={paymentMethod !== "Card"}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Control
                              className="p-3"
                              type="text"
                              name="expireDate"
                              placeholder="Expiration date (MM/YY)"
                              value={checkoutDetails.expireDate}
                              onChange={handleCheckoutDetailsChange}
                              required={paymentMethod === "Card"}
                              disabled={paymentMethod !== "Card"}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Control
                              className="p-3"
                              type="password"
                              name="cvv"
                              placeholder="Security Code"
                              value={checkoutDetails.cvv}
                              onChange={handleCheckoutDetailsChange}
                              required={paymentMethod === "Card"}
                              disabled={paymentMethod !== "Card"}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Row>
                  </div>
                  <hr className="border-2 border-black" />
                  <div>
                    <Form.Check
                      className="text-black fs-4"
                      type="radio"
                      label="Cash On Delivery"
                      name="paymentMethod"
                      id="codPayment"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                    />
                    <p className="ms-4">Pay with cash upon delivery.</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="pay-button btn btn-primary"
                onClick={submitOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Pay Now"}
              </button>
            </Form>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="cart-summary">
            <h3>Cart summary</h3>
            <div className="price-details">
              <div className="subtotal">
                <span>Subtotal</span>
                <span>{calculateSubtotal().toLocaleString()} LKR</span>
              </div>
              <div className="discount">
                <span>Discounts</span>
                <span>- {calculateTotalDiscounts().toLocaleString()} LKR</span>
              </div>
              <div className="shipping">
                <span>Shipping</span>
                <span>+ 500 LKR</span>
              </div>
              <div className="total">
                <span>Total</span>
                <span>{(calculateTotal() + 500).toLocaleString()} LKR</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    );
  };

  const renderOrderComplete = () => {
    return (
      <div className="order-complete">
        <div className="success-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2ecc71"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2>Your order is placed successfully.</h2>
        <p>
          Thank you for your purchase! We truly appreciate your support and are
          thrilled to have you as a valued customer. Your order is being
          processed, we'll ensure it reaches you promptly. If you have any
          questions, feel free to reach out. Thanks again for choosing us!
        </p>
        <div className="order-actions">
          <button
            className="go-shopping-button btn btn-light"
            onClick={() => setActiveStep(1)}
          >
            Go to shopping
          </button>
          <button className="view-order-button btn btn-primary">View Order</button>
        </div>
      </div>
    );
  };

  return (
    <div className="cart-page">
      <Container>
        <div className="cart-steps">
          <Row className="justify-content-center">
            <Col
              xs={4}
              className={`text-center ${activeStep >= 1 ? "active" : ""}`}
            >
              <span className={activeStep >= 1 ? "active-step" : ""}>1</span>{" "}
              Shopping cart
            </Col>
            <Col
              xs={4}
              className={`text-center ${activeStep >= 2 ? "active" : ""}`}
            >
              <span className={activeStep >= 2 ? "active-step" : ""}>2</span>{" "}
              Checkout details
            </Col>
            <Col
              xs={4}
              className={`text-center ${activeStep >= 3 ? "active" : ""}`}
            >
              <span className={activeStep >= 3 ? "active-step" : ""}>3</span>{" "}
              Order complete
            </Col>
          </Row>
        </div>

        {activeStep === 1 && renderShoppingCart()}
        {activeStep === 2 && renderCheckoutDetails()}
        {activeStep === 3 && renderOrderComplete()}
      </Container>
    </div>
  );
};

export default Cart;