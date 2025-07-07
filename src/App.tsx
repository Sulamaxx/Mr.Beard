import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext"; // Make sure to create this file
import "./App.scss";

// Customer pages
import Home from "./pages/home/Home";
import SignIn from "./pages/signin/SignIn";
import AboutUs from "./pages/aboutUs/AboutUs";
import TopNav from "./components/ui/topNav/TopNav";
import Footer from "./components/ui/footer/Footer";
import ProductView from "./pages/productView/ProductView";
import ContactUs from "./pages/contactUs/ContactUs";
import BeardProducts from "./pages/beardProducts/BeardProducts";
import HairProducts from "./pages/hairProducts/HairProducts";
import Accessories from "./pages/accessories/Accessories";
import Cart from "./pages/cart/Cart";

// Admin pages
import AdminDashboard from "./pages/admin/dashboard/Dashboard";
import AdminSidebar from "./components/ui/admin/sidebar/Sidebar";
import AdminTopbar from "./components/ui/admin/topbar/Topbar";
import AllProducts from "./pages/admin/allProducts/AllProducts";
import OrderHistory from "./pages/admin/orderHistory/OrderHistory";
import UserList from "./pages/admin/userList/UserList";
import OrdersDetails from "./pages/admin/orderDetails/OrdersDetails";
import AddNewProduct from "./pages/admin/addNewProduct/AddNewProduct";
import UpdateProduct from "./pages/admin/UpdateProduct/UpdateProduct";

// Import the Unauthorized component
import Unauthorized from "./pages/unathorized/Unauthorized";
import StaffList from "./pages/admin/staffList/StaffList";
import ApparelProducts from "./pages/apparelProducts/ApparelProducts";
import ReturnPolicy from "./pages/policies/ReturnPolicy";
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import TermsConditions from "./pages/policies/TermsConditions";
import ProfilePage from "./pages/profile/profile";
import MyOrders from "./pages/myOrders/OrderDetails";

// Protected route component for both types of users
// Admin route (requires authentication and admin role)
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  // Check if user has admin role
  if (user?.user_type !== 'admin') {
    return <Unauthorized />;
  }
  
  return children;
};

// Staff route (requires authentication and staff role)
const StaffRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  // Check if user has staff role
  if (user?.user_type !== 'staff') {
    return <Unauthorized />;
  }
  
  return children;
};

// Admin or Staff route (requires authentication and either admin or staff role)
const AdminOrStaffRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  // Check if user has admin or staff role
  if (user?.user_type !== 'admin' && user?.user_type !== 'staff') {
    return <Unauthorized />;
  }
  
  return children;
};

// Customer route (requires authentication and customer role)
const CustomerRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  // Check if user has customer role
  if (user?.user_type !== 'customer') {
    return <Unauthorized />;
  }
  
  return children;
};

// Customer Layout
const CustomerLayout = () => {
  return (
    <div className="customer-layout">
      <TopNav />
      <main className="customer-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Admin Layout - Updated to pass userType to sidebar
const AdminLayout = () => {
  const { user } = useAuth();
  
  return (
    <div className="admin-layout">
      <AdminSidebar userType={user?.user_type as "admin" | "staff"} />
      <div className="admin-main-wrapper">
        <AdminTopbar />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Authentication page layout (no nav or footer)
const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <Outlet />
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<SignIn />} />
      </Route>
      
      {/* Admin routes - protected for admin and staff users */}
      <Route path="/admin" element={
        <AdminOrStaffRoute>
          <AdminLayout />
        </AdminOrStaffRoute>
      }>
        {/* Admin only routes */}
        <Route index element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="users" element={
          <AdminRoute>
            <UserList />
          </AdminRoute>
        } />
        <Route path="staff" element={
          <AdminRoute>
            <StaffList />
          </AdminRoute>
        } />
        <Route path="products/add-new-product" element={
          <AdminRoute>
            <AddNewProduct />
          </AdminRoute>
        } />
        {/* <Route path="products/:product_id" element={
          <AdminRoute>
            <UpdateProduct />
          </AdminRoute>
        } /> */}
        
        {/* Shared routes - accessible by both admin and staff */}
        <Route path="products" element={<AllProducts />} />
        <Route path="products/:product_id" element={<UpdateProduct />} />
        <Route path="orders" element={<OrdersDetails />} />
        <Route path="order-history" element={<OrderHistory />} />
        
        {/* Redirect staff users from dashboard to orders page */}
        <Route path="*" element={<Navigate to="/admin/orders" replace />} />
      </Route>
      
      {/* Staff-specific redirect route */}
      <Route path="/staff" element={
        <StaffRoute>
          <Navigate to="/admin/orders" replace />
        </StaffRoute>
      } />
      
      {/* Customer routes */}
      <Route element={<CustomerLayout />}>
        {/* Public routes - accessible to all */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/product/:id" element={<ProductView />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/beard" element={<BeardProducts />} />
        <Route path="/hair" element={<HairProducts />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/apparel" element={<ApparelProducts />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        
        {/* Protected customer routes - only for customers */}
        <Route path="/cart" element={
          <CustomerRoute>
            <Cart />
          </CustomerRoute>
        } />

        <Route path="/profile" element={
          <CustomerRoute>
            <ProfilePage />
          </CustomerRoute>
        } />

        <Route path="/orders" element={
          <CustomerRoute>
            <MyOrders />
          </CustomerRoute>
        } />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

// @ts-ignore
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

// @ts-ignore
export default App;