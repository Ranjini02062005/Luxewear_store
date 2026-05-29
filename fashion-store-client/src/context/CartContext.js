import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getCart().then(setCart).catch(() => setCart([]));
    } else {
      setCart([]);
    }
  }, [user]);

  const refreshCart = () => getCart().then(setCart).catch(() => {});

  const addItem = async (product_id, quantity = 1) => {
    await addToCart(product_id, quantity);
    await refreshCart();
  };

  const updateItem = async (id, quantity) => {
    await updateCartItem(id, quantity);
    await refreshCart();
  };

  const removeItem = async (id) => {
    await removeFromCart(id);
    await refreshCart();
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, updateItem, removeItem, cartCount, cartTotal, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);