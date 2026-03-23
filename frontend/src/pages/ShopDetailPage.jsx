import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { apiGetShop } from '../api/client';
import { CLOTHING_TYPES, SERVICE_TYPES, formatTZS, getClothingIcon, getServiceLabel } from '../data/mockData';
import StarRating from '../components/StarRating';
import { apiStartConversation } from '../api/client';
import { ArrowLeft, MapPin, Clock, Phone, Star, ShoppingBag, Plus, Truck, ChevronDown, ChevronUp, Loader2, MessageCircle } from 'lucide-react';

export default function ShopDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, cartShop, itemCount } = useCart();
  const [activeTab, setActiveTab] = useState('services');
  const [expandedClothing, setExpandedClothing] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchShop() {
      try {
        setLoading(true);
        const data = await apiGetShop(id);
        setShop(data.shop);
      } catch (err) {
        setError('Failed to load shop');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchShop();
  }, [id]);

  // Group services by clothing type
  const servicesByClothing = useMemo(() => {
    if (!shop?.services) return {};
    const grouped = {};
    shop.services.forEach(svc => {
      if (!grouped[svc.clothing_type]) grouped[svc.clothing_type] = [];
      grouped[svc.clothing_type].push(svc);
    });
    return grouped;
  }, [shop?.services]);

  const clothingTypes = Object.keys(servicesByClothing);

  const handleAddToCart = (service) => {
    addItem(
      { id: shop.id, name: shop.name, delivery_zones: shop.delivery_zones || [] },
      {
        service_id: service.id,
        clothing_type: service.clothing_type,
        service_type: service.service_type,
        quantity: 1,
        unit_price: service.price,
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="text-primary-500 animate-spin" />
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Shop not found</h2>
        <button onClick={() => navigate('/shops')} className="btn-primary mt-4">Browse Shops</button>
      </div>
    );
  }

  const isDifferentShop = cartShop && cartShop.id !== shop.id;

  return (
    <div className="animate-fade-in pb-24">
      {/* Hero */}
      <div className="relative h-56 bg-gradient-to-br from-primary-500 to-primary-700 overflow-hidden">
        {shop.photos && shop.photos[0] && (
          <img src={shop.photos[0]} alt={shop.name} className="w-full h-full object-cover opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-12 left-4 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-black/50 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Shop info card */}
      <div className="px-6 -mt-16 relative z-10">
        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800 font-display">{shop.name}</h1>
              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                <MapPin size={13} /> {shop.address}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Star size={16} className="text-accent-500 fill-accent-500" />
                <span className="text-lg font-bold text-slate-800">{parseFloat(shop.rating_avg).toFixed(1)}</span>
              </div>
              <span className="text-xs text-slate-400">{shop.total_reviews} reviews</span>
            </div>
          </div>

          {shop.description && (
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">{shop.description}</p>
          )}

          <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock size={13} className="text-fresh-500" />
              {shop.operating_hours?.open || '07:00'}–{shop.operating_hours?.close || '20:00'}
            </span>
            <span className="flex items-center gap-1">
              <ShoppingBag size={13} className="text-accent-500" />
              {shop.total_orders} orders
            </span>
          </div>

          {/* Action buttons — Chat & Call */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={async () => {
                try {
                  const data = await apiStartConversation(shop.id);
                  navigate(`/chat/${data.conversation.id}`);
                } catch (err) {
                  console.error('Failed to start chat:', err);
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-sm transition-colors active:scale-95"
            >
              <MessageCircle size={16} /> Chat with Shop
            </button>
            {shop.phone && (
              <a
                href={`tel:${shop.phone}`}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-fresh-50 dark:bg-fresh-900/30 text-fresh-600 dark:text-fresh-400 rounded-xl font-semibold text-sm hover:bg-fresh-100 dark:hover:bg-fresh-900/50 transition-colors active:scale-95"
              >
                <Phone size={16} /> Call
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 mt-4">
        <div className="flex bg-slate-100 rounded-xl p-1">
          {[
            { id: 'services', label: 'Services & Prices' },
            { id: 'reviews', label: `Reviews (${shop.reviews?.length || 0})` },
            { id: 'delivery', label: 'Delivery' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-6 mt-4">
        {activeTab === 'services' && (
          <div className="space-y-3">
            {isDifferentShop && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
                ⚠️ You have items from <strong>{cartShop.name}</strong> in your cart. Adding items here will replace them.
              </div>
            )}

            {clothingTypes.length === 0 && (
              <p className="text-slate-500 text-sm py-4">No services listed yet.</p>
            )}

            {clothingTypes.map(clothingId => {
              const clothing = CLOTHING_TYPES.find(c => c.id === clothingId);
              const services = servicesByClothing[clothingId];
              const isExpanded = expandedClothing === clothingId;

              return (
                <div key={clothingId} className="card overflow-hidden">
                  <button
                    onClick={() => setExpandedClothing(isExpanded ? null : clothingId)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{clothing?.icon || '👕'}</span>
                      <div className="text-left">
                        <h3 className="font-semibold text-slate-800">{clothing?.label || clothingId}</h3>
                        <p className="text-xs text-slate-400">{services.length} service{services.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-primary-600 text-price">
                        {formatTZS(Math.min(...services.map(s => s.price)))}+
                      </span>
                      {isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-100 divide-y divide-slate-50">
                      {services.map(svc => (
                        <div key={svc.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50">
                          <div>
                            <span className="text-sm text-slate-700 font-medium">{getServiceLabel(svc.service_type)}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-800 text-price">{formatTZS(svc.price)}</span>
                            <button
                              onClick={() => handleAddToCart(svc)}
                              className="w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center hover:bg-primary-700 active:scale-90 transition-all"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-3">
            {(!shop.reviews || shop.reviews.length === 0) && (
              <p className="text-slate-500 text-sm py-4">No reviews yet.</p>
            )}
            {shop.reviews?.map(review => (
              <div key={review.id} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-600">
                      {(review.customer_name || 'U')[0]}
                    </div>
                    <span className="font-semibold text-sm text-slate-700">{review.customer_name || 'Customer'}</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(review.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <StarRating rating={review.rating} size={14} showNumber={false} />
                {review.comment && <p className="text-sm text-slate-600 mt-2">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'delivery' && (
          <div className="space-y-3">
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Truck size={18} className="text-primary-600" />
                <h3 className="font-semibold text-slate-800">Delivery Zones</h3>
              </div>
              {(!shop.delivery_zones || shop.delivery_zones.length === 0) ? (
                <p className="text-slate-500 text-sm">No delivery zones set up yet.</p>
              ) : (
                <div className="space-y-2">
                  {shop.delivery_zones.map((zone) => (
                    <div key={zone.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-medium text-sm text-slate-700">{zone.zone_name}</p>
                        {zone.description && <p className="text-xs text-slate-400">{zone.description}</p>}
                      </div>
                      <span className="font-bold text-primary-600 text-price">{formatTZS(zone.fee)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating cart button */}
      {itemCount > 0 && cartShop?.id === shop.id && (
        <div className="fixed bottom-20 md:bottom-6 left-0 right-0 px-6 z-20 animate-slide-up">
          <button
            onClick={() => navigate('/order/build')}
            className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl shadow-elevated hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm font-bold">
                {itemCount}
              </div>
              <span className="font-semibold">View Order</span>
            </div>
            <span className="font-bold text-price">Agiza Sasa →</span>
          </button>
        </div>
      )}
    </div>
  );
}
