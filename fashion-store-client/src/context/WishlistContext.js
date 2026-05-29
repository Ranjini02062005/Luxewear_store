import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

// Get storage key specific to each user
const getKey = (userId) => `luxewear_wishlist_user_${userId}`;

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // ── Load wishlist when user changes (login / logout / switch user) ──
  useEffect(() => {
    if (!user) {
      // No user logged in — clear wishlist from state
      setWishlist([]);
      return;
    }
    // Load THIS user's wishlist from localStorage
    try {
      const key = getKey(user.id);
      const saved = localStorage.getItem(key);
      setWishlist(saved ? JSON.parse(saved) : []);
    } catch {
      setWishlist([]);
    }
  }, [user]);

  // ── Save to localStorage whenever wishlist changes ──
  useEffect(() => {
    if (!user) return; // Don't save if no user logged in
    try {
      const key = getKey(user.id);
      localStorage.setItem(key, JSON.stringify(wishlist));
    } catch {
      // localStorage full or unavailable
    }
  }, [wishlist, user]);

  const toggleWishlist = (product) => {
    if (!user) return; // Must be logged in
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          category: product.category,
          stock: product.stock
        }];
      }
    });
  };

  const isWished = (productId) => {
    if (!user) return false;
    return wishlist.some(p => p.id === productId);
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(p => p.id !== productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
    if (user) {
      try {
        localStorage.removeItem(getKey(user.id));
      } catch {}
    }
  };

  const wishCount = wishlist.length;

  return (
    <WishlistContext.Provider value={{
      wishlist,
      toggleWishlist,
      isWished,
      removeFromWishlist,
      clearWishlist,
      wishCount
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);