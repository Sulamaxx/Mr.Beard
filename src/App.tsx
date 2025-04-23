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

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="loading-spinner">Loading...</div>; // Replace with your spinner component
  }
  
  if (!isAuthenticated) {
    // Redirect to signin page with return url
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  return children;
};

// Admin route (requires authentication)
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  // Check if user is authenticated and has admin role (you might need to adjust based on your user structure)
  // if (!isAuthenticated || user?.role !== 'admin') {
  //   return <Navigate to="/signin" state={{ from: location }} replace />;
  // }
  
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

// Admin Layout
const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
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
      
      {/* Admin routes - protected */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AllProducts />} />
        <Route path="orders" element={<OrdersDetails />} />
        <Route path="users" element={<UserList />} />
        <Route path="order-history" element={<OrderHistory />} />
        <Route path="products/add-new-product" element={<AddNewProduct />} />
        {/* Add more admin routes as needed */}
      </Route>
      
      {/* Customer routes */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/product/:id" element={<ProductView />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/beard" element={<BeardProducts />} />
        <Route path="/hair" element={<HairProducts />} />
        <Route path="/accessories" element={<Accessories />} />
        
        {/* Protected customer routes */}
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;