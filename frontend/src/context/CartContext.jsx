import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartShop, setCartShop] = useState(null);
  const [deliveryZone, setDeliveryZone] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [orderId, setOrderId] = useState(null);

  const addItem = (shop, item) => {
    // If adding from a different shop, clear cart first
    if (cartShop && cartShop.id !== shop.id) {
      setCartItems([item]);
      setCartShop(shop);
      setDeliveryZone(null);
      return;
    }
    setCartShop(shop);
    setCartItems(prev => {
      const existing = prev.findIndex(
        i => i.clothing_type === item.clothing_type && i.service_type === item.service_type
      );
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], quantity: updated[existing].quantity + item.quantity };
        return updated;
      }
      return [...prev, item];
    });
  };

  const updateItemQuantity = (index, quantity) => {
    if (quantity <= 0) {
      removeItem(index);
      return;
    }
    setCartItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity };
      return updated;
    });
  };

  const removeItem = (index) => {
    setCartItems(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) {
        setCartShop(null);
        setDeliveryZone(null);
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setCartShop(null);
    setDeliveryZone(null);
    setDeliveryAddress('');
    setSpecialInstructions('');
    setOrderId(null);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const deliveryFee = deliveryZone?.fee || 0;
  const totalAmount = subtotal + deliveryFee;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, cartShop, deliveryZone, deliveryAddress, specialInstructions,
      addItem, updateItemQuantity, removeItem, clearCart,
      setDeliveryZone, setDeliveryAddress, setSpecialInstructions,
      subtotal, deliveryFee, totalAmount, itemCount,
      orderId, setOrderId,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
