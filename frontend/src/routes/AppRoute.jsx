import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/SignUp';
import About from '../pages/About';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';
import Landing from '../pages/Landing';
import AdminLogin from '../AdminLogin';
import Profile from "../pages/Profile";
import CustomerDash from '../CustomerDash';
import AnalyticsCustomer from '../AnalyticsCustomer';
import SellerDashboard from '../seller/sellerDashboard';
import SellerCreate from '../seller/sellerCreate';
import Wishlist from "../pages/Wishlist";

const RouteHandler = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} /> {/* Changed from <Login /> to <Landing /> */}
      <Route path="/about" element={<About />} />
      <Route path="/adminlogin" element={<AdminLogin />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/customerDashboard" element={<CustomerDash />} />
      <Route path="/analyticsCustomer" element={<AnalyticsCustomer />} />
      <Route path="/sellerDashboard" element={<SellerDashboard />} />
      <Route path="/sellerCreate" element={<SellerCreate />} />
      <Route path="wishlist" element={<Wishlist />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <RouteHandler />
    </Router>
  );
};

export default AppRoutes;