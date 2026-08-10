import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const GUEST_CART_KEY = 'shopez_guest_cart';

const getGuestCart = () => {
  try {
    const data = localStorage.getItem(GUEST_CART_KEY);
    return data ? JSON.parse(data) : { items: [] };
  } catch {
    return { items: [] };
  }
};

const saveGuestCart = (cart) => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  } catch { /* ignore */ }
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(getGuestCart());
      return;
    }

    try {
      setLoading(true);
      // Merge guest cart items if any exist
      const guestCart = getGuestCart();
      if (guestCart.items && guestCart.items.length > 0) {
        for (const item of guestCart.items) {
          const pId = item.product?._id || item.product;
          if (pId) {
            try {
              await axios.post('/api/cart', { productId: pId, quantity: item.quantity });
            } catch { /* ignore individual merge error */ }
          }
        }
        localStorage.removeItem(GUEST_CART_KEY);
      }

      const { data } = await axios.get('/api/cart');
      setCart(data);
    } catch {
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addGuestItem = async (pId, quantity, productObj) => {
    const currentGuest = getGuestCart();
    let pData = productObj;
    if (!pData) {
      try {
        const { data } = await axios.get(`/api/products/${pId}`);
        pData = data;
      } catch (e) {
        console.error('Failed to fetch product details for guest cart', e);
      }
    }

    const existingIndex = currentGuest.items.findIndex(
      (i) => (i.product?._id || i.product) === pId
    );

    let updatedItems = [...currentGuest.items];
    if (existingIndex >= 0) {
      updatedItems[existingIndex].quantity += quantity;
    } else {
      updatedItems.push({
        _id: `guest_${pId}_${Date.now()}`,
        product: pData || { _id: pId, name: 'Product', price: 0, image: '' },
        quantity
      });
    }

    const newGuestCart = { items: updatedItems };
    saveGuestCart(newGuestCart);
    setCart(newGuestCart);
    return newGuestCart;
  };

  const addToCart = async (productId, quantity = 1, productObj = null) => {
    const pId = typeof productId === 'object' ? productId._id : productId;
    const pData = productObj || (typeof productId === 'object' ? productId : null);

    if (!user) {
      return addGuestItem(pId, quantity, pData);
    } else {
      try {
        const { data } = await axios.post('/api/cart', { productId: pId, quantity });
        setCart(data);
        return data;
      } catch (err) {
        console.warn('Server add to cart failed, falling back to local cart:', err);
        return addGuestItem(pId, quantity, pData);
      }
    }
  };

  const updateItem = async (itemId, quantity) => {
    if (!user) {
      const currentGuest = getGuestCart();
      let updatedItems;
      if (quantity <= 0) {
        updatedItems = currentGuest.items.filter((i) => i._id !== itemId);
      } else {
        updatedItems = currentGuest.items.map((i) =>
          i._id === itemId ? { ...i, quantity } : i
        );
      }
      const newGuestCart = { items: updatedItems };
      saveGuestCart(newGuestCart);
      setCart(newGuestCart);
      return;
    }

    const { data } = await axios.put(`/api/cart/${itemId}`, { quantity });
    setCart(data);
  };

  const removeItem = async (itemId) => {
    if (!user) {
      const currentGuest = getGuestCart();
      const updatedItems = currentGuest.items.filter((i) => i._id !== itemId);
      const newGuestCart = { items: updatedItems };
      saveGuestCart(newGuestCart);
      setCart(newGuestCart);
      return;
    }

    const { data } = await axios.delete(`/api/cart/${itemId}`);
    setCart(data);
  };

  const clearCart = async () => {
    if (!user) {
      localStorage.removeItem(GUEST_CART_KEY);
      setCart({ items: [] });
      return;
    }

    await axios.delete('/api/cart/clear');
    setCart({ items: [] });
  };

  const cartCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const cartTotal = cart.items?.reduce((sum, i) => {
    const p = i.product;
    if (!p) return sum;
    const price = p.discount ? +(p.price * (1 - p.discount / 100)).toFixed(2) : p.price;
    return sum + price * i.quantity;
  }, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
        cartCount,
        cartTotal,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
