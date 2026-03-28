import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiCreateOrder } from '../api/client';
import { formatTZS, getClothingLabel, getClothingIcon, getServiceLabel } from '../data/mockData';
import { isDemoMode } from '../data/demoData';
import { ArrowLeft, Plus, Minus, Trash2, MapPin, Truck, MessageSquare, ChevronDown, Loader2, Calendar, Sun, CloudSun, Sunset } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function OrderBuilderPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const {
    cartItems, cartShop, deliveryZone, deliveryAddress, specialInstructions,
    updateItemQuantity, removeItem, clearCart,
    setDeliveryZone, setDeliveryAddress, setSpecialInstructions,
    subtotal, deliveryFee, totalAmount, itemCount,
    setOrderId,
  } = useCart();
  const [showAddressInput, setShowAddressInput] = useState(true);
  const [manualArea, setManualArea] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [pickupSlot, setPickupSlot] = useState('');
  const [deliverySlot, setDeliverySlot] = useState('');

  // Time slot helpers
  const TIME_SLOTS = [
    { id: 'asubuhi', icon: Sun, label: t('slotMorning'), time: '7:00 - 11:00' },
    { id: 'mchana', icon: CloudSun, label: t('slotAfternoon'), time: '11:00 - 15:00' },
    { id: 'jioni', icon: Sunset, label: t('slotEvening'), time: '15:00 - 19:00' },
  ];

  function getQuickOptions() {
    const now = new Date();
    const hour = now.getHours();
    const options = [];

    // Today options (only show slots that haven't passed)
    if (hour < 10) options.push({ label: t('todayMorning'), day: 'today', slot: 'asubuhi' });
    if (hour < 14) options.push({ label: t('todayAfternoon'), day: 'today', slot: 'mchana' });
    if (hour < 18) options.push({ label: t('todayEvening'), day: 'today', slot: 'jioni' });

    // Tomorrow options
    options.push({ label: t('tomorrowMorning'), day: 'tomorrow', slot: 'asubuhi' });
    options.push({ label: t('tomorrowAfternoon'), day: 'tomorrow', slot: 'mchana' });
    options.push({ label: t('tomorrowEvening'), day: 'tomorrow', slot: 'jioni' });

    return options.slice(0, 4); // Show max 4 quick options
  }

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

        {/* Delivery Area */}
        <div className="card p-4">
          <h2 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-3">
            <Truck size={16} className="text-fresh-600" /> Delivery Area
          </h2>
          <input
            type="text"
            placeholder="e.g., Mikocheni, Sinza, Masaki, Kariakoo..."
            value={manualArea}
            onChange={e => {
              setManualArea(e.target.value);
              // Match to existing zone if possible
              const zones = cartShop.delivery_zones || [];
              const match = zones.find(z => z.zone_name.toLowerCase().includes(e.target.value.toLowerCase()));
              if (match) {
                setDeliveryZone(match);
              } else if (e.target.value.length > 0) {
                setDeliveryZone({ zone_name: e.target.value, fee: zones.length > 0 ? zones[zones.length - 1].fee : 3000, id: null });
              } else {
                setDeliveryZone(null);
              }
            }}
            className="input-field pl-10"
          />
          <div className="relative -mt-10 ml-3 pointer-events-none">
            <MapPin size={16} className="text-slate-400" />
          </div>
          <div className="mt-3" />
          {deliveryZone && (
            <div className="p-3 bg-fresh-50 dark:bg-fresh-900/20 border border-fresh-200 dark:border-fresh-800 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-fresh-700 dark:text-fresh-300">Delivery fee for {deliveryZone.zone_name}</span>
                <span className="font-bold text-fresh-600 text-price">{formatTZS(deliveryZone.fee)}</span>
              </div>
            </div>
          )}
          {/* Quick zone options if available */}
          {(cartShop.delivery_zones || []).length > 0 && !manualArea && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-slate-400">Or select an area:</p>
              <div className="flex flex-wrap gap-2">
                {(cartShop.delivery_zones || []).map((zone, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setManualArea(zone.zone_name);
                      setDeliveryZone(zone);
                    }}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-fresh-50 hover:text-fresh-600 transition-colors"
                  >
                    {zone.zone_name} — {formatTZS(zone.fee)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pickup & Delivery Scheduling */}
        <div className="card p-4">
          <h2 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-3">
            <Calendar size={16} className="text-primary-600" /> {t('schedulePickupDelivery')}
          </h2>

          {/* Quick options */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 -mx-1 px-1">
            {getQuickOptions().map(opt => (
              <button
                key={`${opt.day}-${opt.slot}`}
                onClick={() => {
                  setPickupSlot(`${opt.day}_${opt.slot}`);
                  // Auto-set delivery to next slot
                  const slots = ['asubuhi', 'mchana', 'jioni'];
                  const nextIdx = Math.min(slots.indexOf(opt.slot) + 1, 2);
                  setDeliverySlot(opt.day === 'today' ? `tomorrow_${slots[nextIdx]}` : `tomorrow_${slots[nextIdx]}`);
                }}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  pickupSlot === `${opt.day}_${opt.slot}`
                    ? 'bg-primary-600 text-white shadow-glow-primary'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Pickup slot */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">{t('pickupTime')}</p>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map(slot => {
                const SlotIcon = slot.icon;
                const isSelected = pickupSlot.endsWith(slot.id);
                return (
                  <button
                    key={`pickup-${slot.id}`}
                    onClick={() => setPickupSlot(pickupSlot.includes('tomorrow') ? `tomorrow_${slot.id}` : `today_${slot.id}`)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <SlotIcon size={18} className={`mx-auto mb-1 ${isSelected ? 'text-primary-600' : 'text-slate-400'}`} />
                    <p className={`text-xs font-semibold ${isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-slate-600 dark:text-slate-300'}`}>{slot.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{slot.time}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Delivery slot */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">{t('deliveryTime')}</p>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map(slot => {
                const SlotIcon = slot.icon;
                const isSelected = deliverySlot.endsWith(slot.id);
                return (
                  <button
                    key={`delivery-${slot.id}`}
                    onClick={() => setDeliverySlot(deliverySlot.includes('tomorrow') ? `tomorrow_${slot.id}` : `today_${slot.id}`)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      isSelected
                        ? 'border-fresh-500 bg-fresh-50 dark:bg-fresh-900/30'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <SlotIcon size={18} className={`mx-auto mb-1 ${isSelected ? 'text-fresh-600' : 'text-slate-400'}`} />
                    <p className={`text-xs font-semibold ${isSelected ? 'text-fresh-700 dark:text-fresh-300' : 'text-slate-600 dark:text-slate-300'}`}>{slot.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{slot.time}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected summary */}
          {(pickupSlot || deliverySlot) && (
            <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-xs text-slate-600 dark:text-slate-300">
              {pickupSlot && <p>{t('pickupTime')}: <span className="font-semibold">{pickupSlot.replace('_', ' — ').replace('today', t('today')).replace('tomorrow', t('tomorrow'))}</span></p>}
              {deliverySlot && <p className="mt-1">{t('deliveryTime')}: <span className="font-semibold">{deliverySlot.replace('_', ' — ').replace('today', t('today')).replace('tomorrow', t('tomorrow'))}</span></p>}
            </div>
          )}
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
              {deliveryZone ? formatTZS(deliveryFee) : 'Enter area'}
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
            if (!deliveryZone && !manualArea) { setOrderError('Please enter your delivery area'); return; }

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
                delivery_zone_id: deliveryZone?.id || undefined,
                delivery_area: manualArea || deliveryZone?.zone_name || undefined,
                delivery_address: deliveryAddress,
                special_instructions: specialInstructions || undefined,
                pickup_time_slot: pickupSlot || undefined,
                delivery_time_slot: deliverySlot || undefined,
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
