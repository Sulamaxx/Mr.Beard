import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from "react-router-dom";
import "./App.scss";
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

// Import admin components
import AdminDashboard from "./pages/admin/dashboard/Dashboard";
import AdminSidebar from "./components/ui/admin/sidebar/Sidebar";
import AdminTopbar from "./components/ui/admin/topbar/Topbar";
import AllProducts from "./pages/admin/allProducts/AllProducts";
import OrderHistory from "./pages/admin/orderHistory/OrderHistory";
import UserList from "./pages/admin/userList/UserList";
import Cart from "./pages/cart/Cart";
import OrdersDetails from "./pages/admin/orderDetails/OrdersDetails";

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

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignIn />} />
        </Route>
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AllProducts />} />
          <Route path="orders" element={<OrdersDetails />} />
          <Route path="users" element={<UserList />} />
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="gallery" element={<div>Photo Gallery</div>} />
          {/* Add more admin routes as needed */}
        </Route>
        
        {/* Customer routes */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/product" element={<ProductView />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/beard" element={<BeardProducts />} />
          <Route path="/hair" element={<HairProducts />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;