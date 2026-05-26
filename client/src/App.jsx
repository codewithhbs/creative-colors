import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { store } from './Page/store/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components & Pages
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Home from './Page/Home/Home';
import Shop from './Page/Shop/Shop';
import About from './Page/About/About';
import Contact from './Page/Contact/Contact';
import Register from './Page/Auth/Register';
import Login from './Page/Auth/Login';
import Forget from './Page/Auth/Forget';
import VerifyOtp from './Page/Auth/VerifyOtp';
import Privacy from './Page/Privacy/Privacy';
import Term from './Page/Term/Term';
import Refund from './Page/Refund/RefundPolicy';
import Shipping from './Page/Shippingpolicy/ShippingPolicy';
import Return from './Page/ReturnPolicy/ReturnPolicy';
import ProductDetail from './Page/ProductDetail/ProductDetail';
import CartPage from './Page/Cart/Cart';
import CheckoutFlow from './Page/Cart/CheckoutFlow';
import CheckOutWithoutLogin from './Page/Cart/CheckOutWithoutLogin';
import Profile from './Page/Profile/Profile';
import TrackYourOrder from './Page/TrackYourOrder/TrackYourOrder';
import Blogs from './Page/Blogs/Blog';
import BlogsDetals from './Components/Blog/Blog-details';
import SuccessPage from './Page/SuccessPage/SuccessPage';
import SuccessPageCOD from './Page/SuccessPage/SuccessPageCOD';
import SignupPopup from './Components/PopUp/PopUp';
import BottomNavigation from './Components/Header/BottomNavigation';

// ── New ScrollToTop component ──
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

const App = () => {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <Router>
          <ScrollToTop />           {/* ← Add here */}
          
          <Header />
          <SignupPopup />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forget" element={<Forget />} />
            <Route path="/Verify-Otp" element={<VerifyOtp />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Term />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/return" element={<Return />} />
            <Route path="/product-page/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutFlow />} />
            <Route path="/checkout-flow" element={<CheckOutWithoutLogin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/track-your-order" element={<TrackYourOrder />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs-details/:slug" element={<BlogsDetals />} />
            <Route path="/Receipt/order-confirmed" element={<SuccessPage />} />
            <Route path="/receipt-cod/order-confirmed" element={<SuccessPageCOD />} />
          </Routes>
<BottomNavigation />
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Router>
      </Provider>
    </HelmetProvider>
  );
};

export default App;