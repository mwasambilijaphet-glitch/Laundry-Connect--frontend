import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

// Shared pages
import WelcomePage from './pages/WelcomePage';
import AuthPage from './pages/AuthPage';

// Customer pages
import HomePage from './pages/HomePage';
import ShopListPage from './pages/ShopListPage';
import ShopDetailPage from './pages/ShopDetailPage';
import OrderBuilderPage from './pages/OrderBuilderPage';
import PaymentPage from './pages/PaymentPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProfilePage from './pages/ProfilePage';
import NearbyPage from './pages/NearbyPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Owner pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerServices from './pages/owner/OwnerServices';
import OwnerOrders from './pages/owner/OwnerOrders';
import OwnerEarnings from './pages/owner/OwnerEarnings';
import OwnerSettings from './pages/owner/OwnerSettings';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminShops from './pages/admin/AdminShops';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminTransactions from './pages/admin/AdminTransactions';

// Components
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import OwnerLayout from './components/OwnerLayout';
import AdminLayout from './components/AdminLayout';
import WhatsAppButton from './components/WhatsAppButton';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

function OwnerRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== 'owner') return <Navigate to="/home" replace />;
  return <OwnerLayout>{children}</OwnerLayout>;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== 'admin') return <Navigate to="/home" replace />;
  return <AdminLayout>{children}</AdminLayout>;
}

function CustomerLayout({ children, showNav = true, showFooter = false }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 md:pb-0 transition-colors duration-300">
      {children}
      {showFooter && <Footer />}
      {showNav && <BottomNav />}
    </div>
  );
}

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (user.role === 'owner') return <Navigate to="/owner" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return <Navigate to="/home" replace />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/" element={user ? <RoleRedirect /> : <WelcomePage />} />
        <Route path="/auth" element={user ? <RoleRedirect /> : <AuthPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Customer routes */}
        <Route path="/home" element={<ProtectedRoute><CustomerLayout showFooter><HomePage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/shops" element={<ProtectedRoute><CustomerLayout><ShopListPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/shop/:id" element={<ProtectedRoute><CustomerLayout><ShopDetailPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/order/build" element={<ProtectedRoute><CustomerLayout showNav={false}><OrderBuilderPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/order/pay" element={<ProtectedRoute><CustomerLayout showNav={false}><PaymentPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/order/:id" element={<ProtectedRoute><CustomerLayout><OrderTrackingPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><CustomerLayout><OrderHistoryPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/nearby" element={<ProtectedRoute><CustomerLayout><NearbyPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><CustomerLayout showFooter><ProfilePage /></CustomerLayout></ProtectedRoute>} />

        {/* Owner routes */}
        <Route path="/owner" element={<OwnerRoute><OwnerDashboard /></OwnerRoute>} />
        <Route path="/owner/services" element={<OwnerRoute><OwnerServices /></OwnerRoute>} />
        <Route path="/owner/orders" element={<OwnerRoute><OwnerOrders /></OwnerRoute>} />
        <Route path="/owner/earnings" element={<OwnerRoute><OwnerEarnings /></OwnerRoute>} />
        <Route path="/owner/settings" element={<OwnerRoute><OwnerSettings /></OwnerRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/shops" element={<AdminRoute><AdminShops /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/transactions" element={<AdminRoute><AdminTransactions /></AdminRoute>} />
      </Routes>

      {/* WhatsApp floating button */}
      {user && <WhatsAppButton />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
