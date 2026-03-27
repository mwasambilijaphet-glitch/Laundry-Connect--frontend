import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiCreateOrder } from '../api/client';
import { formatTZS, getClothingLabel, getClothingIcon, getServiceLabel } from '../data/mockData';
import { isDemoMode } from '../data/demoData';
import { ArrowLeft, Plus, Minus, Trash2, MapPin, Truck, MessageSquare, ChevronDown, Loader2 } from 'lucide-react';

export default function OrderBuilderPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartItems, cartShop, deliveryZone, deliveryAddress, specialInstructions,
    updateItemQuantity, removeItem, clearCart,
    setDeliveryZone, setDeliveryAddress, setSpecialInstructions,
    subtotal, deliveryFee, totalAmount, itemCount,
    setOrderId,
  } = useCart();
  const [showAddressInput, setShowAddressInput] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  if (!cartShop || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 animate-fade-in">
        <div className="text-6xl mb-4">🧺</div>
        <h2 className="text-xl font-bold text-slate-800 font-display mb-2">Your cart is empty</h2>
        <p className="text-slate-500 text-sm mb-6">Browse shops and add items to get started</p>
        <button onClick={() => navigate('/shops')} className="btn-primary">
          Find Shops
        </button>
      </div>
    );
  }

  const savedAddresses = user?.saved_addresses || [];

  return (
    <div className="min-h-screen bg-slate-50 animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-800 font-display">Your Order</h1>
            <p className="text-xs text-slate-500">{cartShop.name} • {itemCount} items</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 space-y-4 pb-40">
        {/* Cart Items */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              🧺 Items
            </h2>
          </div>
          <div className="divide-y divide-slate-50">
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-4">
                <span className="text-2xl">{getClothingIcon(item.clothing_type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-800 truncate">
                    {getClothingLabel(item.clothing_type)}
                  </p>
                  <p className="text-xs text-slate-400">{getServiceLabel(item.service_type)}</p>
                  <p className="text-sm font-semibold text-primary-600 text-price mt-0.5">
                    {formatTZS(item.unit_price)} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateItemQuantity(index, item.quantity - 1)}
                    className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors"
                  >
                    <Minus size={14} className="text-slate-600" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-slate-800">{item.quantity}</span>
                  <button
                    onClick={() => updateItemQuantity(index, item.quantity + 1)}
                    className="w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center hover:bg-primary-700 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="w-8 h-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="card p-4">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-primary-600" /> Delivery Address
          </h2>

          {savedAddresses.length > 0 && (
            <div className="space-y-2 mb-3">
              {savedAddresses.map(addr => (
                <button
                  key={addr.id}
                  onClick={() => setDeliveryAddress(addr.address)}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                    deliveryAddress === addr.address
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700">{addr.label}</span>
                    {addr.is_default && <span className="badge-blue text-[10px]">Default</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{addr.address}</p>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowAddressInput(!showAddressInput)}
            className="text-sm text-primary-600 font-semibold hover:underline"
          >
            + Enter a different address
          </button>

          {showAddressInput && (
            <textarea
              placeholder="Enter your delivery address..."
              value={deliveryAddress}
              onChange={e => setDeliveryAddress(e.target.value)}
              rows={2}
              className="input-field mt-2 resize-none"
            />
          )}
        </div>

        {/* Delivery Zone */}
        <div className="card p-4">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
            <Truck size={16} className="text-fresh-600" /> Delivery Zone
          </h2>
          <div className="space-y-2">
            {(cartShop.delivery_zones || []).map((zone, i) => (
              <button
                key={i}
                onClick={() => setDeliveryZone(zone)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                  deliveryZone?.zone_name === zone.zone_name
                    ? 'border-fresh-500 bg-fresh-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-700">{zone.zone_name}</p>
                  <p className="text-xs text-slate-400">{zone.description}</p>
                </div>
                <span className="font-bold text-fresh-600 text-price">{formatTZS(zone.fee)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Special Instructions */}
        <div className="card p-4">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
            <MessageSquare size={16} className="text-accent-500" /> Special Instructions
          </h2>
          <textarea
            placeholder="e.g., Please use gentle detergent for the Kitenge..."
            value={specialInstructions}
            onChange={e => setSpecialInstructions(e.target.value)}
            rows={2}
            className="input-field resize-none"
          />
        </div>

        {/* Clear cart */}
        <button onClick={() => { clearCart(); navigate('/shops'); }} className="text-sm text-red-500 font-medium hover:underline">
          Clear entire cart
        </button>
      </div>

      {/* Bottom checkout bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 z-20">
        {orderError && (
          <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400 font-medium">
            {orderError}
          </div>
        )}
        <div className="space-y-1 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Subtotal ({itemCount} items)</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200 text-price">{formatTZS(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Delivery Fee</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200 text-price">
              {deliveryZone ? formatTZS(deliveryFee) : 'Select zone'}
            </span>
          </div>
          <div className="flex justify-between text-base pt-1 border-t border-slate-100 dark:border-slate-700">
            <span className="font-bold text-slate-800 dark:text-white">Total</span>
            <span className="font-bold text-primary-600 dark:text-primary-400 text-price text-lg">{formatTZS(totalAmount)}</span>
          </div>
        </div>
        <button
          onClick={async () => {
            if (!deliveryAddress) { setOrderError('Please enter a delivery address'); return; }
            if (!deliveryZone) { setOrderError('Please select a delivery zone'); return; }

            setOrderError('');
            setPlacingOrder(true);
            try {
              // In demo mode, skip API and go straight to payment
              if (isDemoMode()) {
                setOrderId(1);
                navigate('/order/pay');
                return;
              }
              const data = await apiCreateOrder({
                shop_id: cartShop.id,
                items: cartItems.map(item => ({
                  service_id: item.service_id,
                  quantity: item.quantity,
                })),
                delivery_zone_id: deliveryZone.id,
                delivery_address: deliveryAddress,
                special_instructions: specialInstructions || undefined,
              });

              // Store order ID for payment page
              setOrderId(data.order?.id || data.id);
              navigate('/order/pay');
            } catch (err) {
              console.error('Order creation error:', err);
              setOrderError(err.message || 'Failed to create order. Please try again.');
            } finally {
              setPlacingOrder(false);
            }
          }}
          disabled={placingOrder}
          className="btn-primary w-full py-4 text-base disabled:opacity-50"
        >
          {placingOrder ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={18} className="animate-spin" /> Placing Order...
            </span>
          ) : (
            'Proceed to Payment — Lipa Sasa'
          )}
        </button>
      </div>
    </div>
  );
}
