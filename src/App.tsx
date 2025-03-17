import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.scss";
import Home from "./pages/home/Home";
import SignIn from "./pages/signin/SignIn";
import AboutUs from "./pages/aboutUs/AboutUs";
import TopNav from "./components/ui/topNav/TopNav";

// Create a layout component that conditionally renders TopNav
const AppLayout = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/signin']; // Add any paths where you don't want TopNav
  
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);
  
  return (
    <div className="App">
      {shouldShowNavbar && <TopNav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;