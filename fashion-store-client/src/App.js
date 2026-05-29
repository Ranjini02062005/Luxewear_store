import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }     from './context/AuthContext';
import { CartProvider }     from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { VoiceProvider }    from './context/VoiceContext';   // ← ADD
import VoiceModal           from './components/VoiceModal';  // ← ADD
import VoiceButton          from './components/VoiceButton'; // ← ADD
import Navbar      from './components/Navbar';
import Home        from './pages/Home';
import Login       from './pages/Login';
import Register    from './pages/Register';
import Cart        from './pages/Cart';
import Checkout    from './pages/Checkout';
import Orders      from './pages/Orders';
import ProductDetail from './pages/ProductDetail';
import Wishlist    from './pages/Wishlist';
import Landing     from './pages/Landing';
import MenCategory from './pages/MenCategory';   // ← ADD import
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <VoiceProvider>        {/* ← WRAP everything */}

              <VoiceModal />       {/* ← ADD — shows floating modal */}
              <VoiceButton />      {/* ← ADD — shows floating mic button */}

              <Routes>
                <Route path="/"            element={<Landing />} />
                <Route path="/landing"     element={<Landing />} />
                <Route path="/home"        element={<AppLayout><Home /></AppLayout>} />
                <Route path="/men" element={<AppLayout><MenCategory /></AppLayout>} />
                <Route path="/product/:id" element={<AppLayout><ProductDetail /></AppLayout>} />
                <Route path="/login"       element={<Login />} />
                <Route path="/register"    element={<Register />} />
                <Route path="/cart"        element={<AppLayout><Cart /></AppLayout>} />
                <Route path="/checkout"    element={<AppLayout><Checkout /></AppLayout>} />
                <Route path="/orders"      element={<AppLayout><Orders /></AppLayout>} />
                <Route path="/wishlist"    element={<AppLayout><Wishlist /></AppLayout>} />
              </Routes>

            </VoiceProvider>       {/* ← CLOSE */}
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}