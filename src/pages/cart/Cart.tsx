import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import "./Cart.scss";
import ApiService from "../../services/ApiService"; // Update this path as needed
import { toast } from "react-toastify";
import DeliveryDate from "../../components/util/DeliveryDate";

// Add PayHere types for window object
declare global {
  interface Window {
    payhere: any;
  }
}

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

// Delivery zones and rates configuration
const DELIVERY_ZONES = {
  "Zone A": {
    rate: 300,
    cities: ["Gampaha"]
  },
  "Zone B": {
    rate: 350,
    cities: ["Colombo", "Kurunegala", "Kegalle", "Chilaw", "Kandy"]
  },
  "Zone C": {
    rate: 400,
    cities: [
      "Jaffna", "Kilinochchi", "Mannar", "Vavunia", "Anuradhapura", "Trincomalee",
      "Batticaloa", "Ampara", "Monaragala", "Polonnaruwa", "Badulla",
      "Puttalam", "Mahiyangana", "Nuwara Eliya", "Ambalangoda", "Kaluthara",
      "Galle", "Matara", "Hambantota", "Embilipitiya", "Rathnapura", "Awissawella"
    ]
  }
};

// Get all cities for dropdown
const getAllCities = () => {
  const cities: string[] = [];
  Object.values(DELIVERY_ZONES).forEach(zone => {
    cities.push(...zone.cities);
  });
  return cities.sort();
};

// Get delivery rate based on city
const getDeliveryRate = (city: string): number => {
  for (const zone of Object.values(DELIVERY_ZONES)) {
    if (zone.cities.includes(city)) {
      return zone.rate;
    }
  }
  return 400; // Default rate if city not found
};

const Cart: React.FC = () => {
  // Keep your original state
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeStep, setActiveStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Card"); // Changed default to COD
  const [shippingAddress, setShippingAddress] = useState("Same");
  const [differentShippingAddressValue, setDifferentShippingAddressValue] = useState("");
  const [saveDetails, setSaveDetails] = useState<boolean>(false);
  // @ts-ignore
  const [userData, setUserData] = useState<UserData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryRate, setDeliveryRate] = useState(400); // Changed default to 400
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
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

  // Setup PayHere callbacks
  useEffect(() => {
    if (window.payhere) {
      window.payhere.onCompleted = function (orderId: string) {
        console.log("Payment completed. OrderID:" + orderId);
        proceedToNextStep();
        toast.success("Payment successful!");
      };

      window.payhere.onDismissed = function () {
        console.log("Payment dismissed");
        toast.warn("Payment was cancelled.");
      };

      window.payhere.onError = function (error: string) {
        console.log("Error:" + error);
        toast.error("An error occurred during payment. Please try again.");
      };
    }
  }, []);

  // Update delivery rate when city changes
  useEffect(() => {
    if (checkoutDetails.city) {
      const newRate = getDeliveryRate(checkoutDetails.city);
      setDeliveryRate(newRate);
    }
  }, [checkoutDetails.city]);

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
        
        // Set delivery rate based on user's city
        if (user.city) {
          const rate = getDeliveryRate(user.city);
          setDeliveryRate(rate);
        }
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCheckoutDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };
  
  const handleDifferentShippingAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDifferentShippingAddressValue(e.target.value);
  };

  const proceedToNextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, 3));
  };

  // Validate billing form
  const validateBillingForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!checkoutDetails.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    
    if (!checkoutDetails.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    
    if (!checkoutDetails.country.trim()) {
      errors.country = "Country/Region is required";
    }
    
    if (!checkoutDetails.address.trim()) {
      errors.address = "Street address is required";
    }
    
    if (!checkoutDetails.city.trim()) {
      errors.city = "City is required";
    }
    
    if (!checkoutDetails.state.trim()) {
      errors.state = "State is required";
    }
    
    if (!checkoutDetails.postalCode.trim()) {
      errors.postalCode = "Postal code is required";
    }
    
    if (!checkoutDetails.phone.trim()) {
      errors.phone = "Phone number is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate payment form
  const validatePaymentForm = () => {
    const errors: {[key: string]: string} = {};
    
    // Only validate card details if Card payment is selected
    if (paymentMethod === "Card") {
      if (!checkoutDetails.cardNumber.trim()) {
        errors.cardNumber = "Card number is required";
      }
      
      if (!checkoutDetails.cardHolderName.trim()) {
        errors.cardHolderName = "Card holder name is required";
      }
      
      if (!checkoutDetails.expireDate.trim()) {
        errors.expireDate = "Expiration date is required";
      }
      
      if (!checkoutDetails.cvv.trim()) {
        errors.cvv = "Security code is required";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
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

  // Handle Card Payment
  const handleCardPayment = async () => {
    setIsSubmitting(true);
    try {
      const shippingDetails = {
        first_name: checkoutDetails.firstName,
        last_name: checkoutDetails.lastName,
        country: checkoutDetails.country,
        company: checkoutDetails.company,
        shipping_address: shippingAddress === "Same" ? checkoutDetails.address : differentShippingAddressValue,
        address: checkoutDetails.address,
        apartment: checkoutDetails.apartment,
        city: checkoutDetails.city,
        state: checkoutDetails.state,
        postal_code: checkoutDetails.postalCode,
        phone: checkoutDetails.phone,
        shipping_rate: deliveryRate,
        tax: 0, // Assuming no tax for now
        discount: 0, // Assuming no discount for now
      };

      const response = await ApiService.post<any>('/v2/payhere/checkout', shippingDetails);
      
      if (response && response.payhere) {
        window.payhere.startPayment(response.payhere);
      } else {
        toast.error("Failed to initiate payment. Please try again.");
      }
    } catch (error: any) {
      console.error("Failed to initiate payment:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to initiate payment. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit order
  const submitOrder = async () => {
    // Validate form before submitting
    if (!validateBillingForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    if (paymentMethod === "Card") {
      handleCardPayment();
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare order data for COD
      const orderData = {
        payment_method: "COD",
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
        shipping_rate: deliveryRate, // Use dynamic delivery rate
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
    // Optimistically update the UI first
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const itemPrice = parseFloat(item.product.price);
          const discountPercentage = parseFloat(item.product.discount);
          const discountAmount = (itemPrice * discountPercentage) / 100;
          const priceAfterDiscount = itemPrice - discountAmount;
          
          return {
            ...item,
            quantity: newQuantity,
            total_price: priceAfterDiscount * newQuantity
          };
        }
        return item;
      })
    );

    try {
      // Call API to update quantity
      const response = await ApiService.put<any>(`/v2/cart/${id}`, {
        quantity: newQuantity
      });

      if (!response.status) {
        // If API fails, revert by fetching fresh data
        alert(response.message || "Failed to update cart");
        fetchCartItems();
      }
    } catch (error: any) {
      console.error("Error updating cart:", error);
      
      // Handle stock availability error
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Error updating cart. Please try again.");
      }
      
      // Refresh cart to ensure we have the latest data (revert optimistic update)
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
          <div className="cart-table">
            {/* Table Header */}
            <div className="cart-table-header">
              <div className="header-product">Product</div>
              <div className="header-quantity">Quantity</div>
              <div className="header-price">Price</div>
              <div className="header-subtotal">Subtotal</div>
            </div>
            
            {/* Table Items */}
            <div className="cart-table-body">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-table-row">
                  <div className="cart-product">
                    <div className="product-image">
                      <img src={item.product.image} alt={item.product.name} />
                    </div>
                    <div className="product-info">
                      <h3>{item.product.name}</h3>
                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item.id)}
                      >
                        × Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="cart-quantity">
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
                  </div>
                  
                  <div className="cart-price">
                    LKR {parseFloat(item.product.price).toLocaleString()}
                  </div>
                  
                  <div className="cart-subtotal">
                    LKR {item.total_price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
        <Col xs={12} md={4}>
          {/* Keep your existing cart summary */}
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
        <Row>
          <div className="cart-summary">
            <h3 className="text-start">Cart summary</h3>
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
                <span>+ {deliveryRate} LKR</span>
              </div>
              <hr />
              <div className="total">
                <span>Total</span>
                <span>
                  {(calculateTotal() + deliveryRate).toLocaleString()} LKR
                </span>
              </div>
            </div>
          </div>
        </Row>
        <Col xs={12} md={9} className="mt-4">
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
                      isInvalid={!!formErrors.firstName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.firstName}
                    </Form.Control.Feedback>
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
                      isInvalid={!!formErrors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.lastName}
                    </Form.Control.Feedback>
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
                      isInvalid={!!formErrors.country}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.country}
                    </Form.Control.Feedback>
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
                  isInvalid={!!formErrors.address}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.address}
                </Form.Control.Feedback>
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
                    <Form.Select
                      name="city"
                      value={checkoutDetails.city}
                      onChange={handleCheckoutDetailsChange}
                      required
                      isInvalid={!!formErrors.city}
                    >
                      <option value="">Select City</option>
                      {getAllCities().map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formErrors.city}
                    </Form.Control.Feedback>
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
                      isInvalid={!!formErrors.state}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.state}
                    </Form.Control.Feedback>
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
                      isInvalid={!!formErrors.postalCode}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.postalCode}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone*</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={checkoutDetails.phone}
                      onChange={handleCheckoutDetailsChange}
                      required
                      isInvalid={!!formErrors.phone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.phone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

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
                  // Validate billing form first
                  if (!validateBillingForm()) {
                    toast.error(
                      "Please fill in all required billing information."
                    );
                    return;
                  }

                  // Save user details if checkbox is checked
                  if (saveDetails) {
                    await saveUserCheckoutDetails();
                  }
                  // Scroll to shipping address section
                  document
                    .getElementById("shipping-address")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Continue to delivery"}
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
                      <h3 className="text-black text-end">
                        {deliveryRate.toFixed(2)} LKR
                      </h3>
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
                      onChange={() => handlePaymentMethodChange("Card")}
                    />
                    <p className="ms-4 text-muted">
                      We accept all major bank cards.
                    </p>
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
                      onChange={() => handlePaymentMethodChange("COD")}
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
        <Row>
          <h1 className="fw-bolder mb-4">CART</h1>
        </Row>
        <div className="cart-steps">
          <Row className="justify-content-center">
            <Col
              xs={4}
              className={`text-center ${
                activeStep === 1 ? "active" : activeStep > 1 ? "completed" : ""
              }`}
            >
              <span>1</span> Shopping cart
            </Col>
            <Col
              xs={4}
              className={`text-center ${
                activeStep === 2 ? "active" : activeStep > 2 ? "completed" : ""
              }`}
            >
              <span>2</span> Checkout details
            </Col>
            <Col
              xs={4}
              className={`text-center ${activeStep === 3 ? "active" : ""}`}
            >
              <span>3</span> Order complete
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