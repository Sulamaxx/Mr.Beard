import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import Home from "./pages/home/Home";
import SignIn from "./pages/signin/SignIn";
import { Row } from "react-bootstrap";
import SignUp from "./pages/signup/SignUp";

function App() {
  return (
    <Router>
      <Row className="container-fluid">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Row>
    </Router>
  );
}

export default App;
