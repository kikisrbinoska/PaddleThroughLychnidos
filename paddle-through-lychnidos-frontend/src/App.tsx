import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { BottomNav } from "./components/BottomNav";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { MapPage } from "./pages/MapPage";
import { ShopsPage } from "./pages/ShopsPage";
import { ItinerariesPage } from "./pages/ItinerariesPage";
import { ItineraryDetailPage } from "./pages/ItineraryDetailPage";
import { LearnPage } from "./pages/LearnPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { NewsFeedPage } from "./pages/NewsFeedPage";
import { NewsDetailPage } from "./pages/NewsDetailPage";
import { ProfilePage } from "./pages/ProfilePage";
import { PassportPage } from "./pages/PassportPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ShopDetailPage } from "./pages/ShopDetailPage";
import { VideoDetailPage } from "./pages/VideoDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { SplashPage } from "./pages/SplashPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ForgotPasswordConfirmationPage } from "./pages/ForgotPasswordConfirmationPage";
import { ArtisanDashboardPage } from "./pages/ArtisanDashboardPage";
import { MembershipPage } from "./pages/artisan/MembershipPage";
import { EditShopPage } from "./pages/EditShopPage";
import { ManageProductsPage } from "./pages/ManageProductsPage";
import { EditProductPage } from "./pages/EditProductPage";
import { VerificationRequestPage } from "./pages/VerificationRequestPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { ManageUsersPage } from "./pages/admin/ManageUsersPage";
import { PendingShopsPage } from "./pages/admin/PendingShopsPage";
import { VerificationRequestsPage } from "./pages/admin/VerificationRequestsPage";
import { ManageCategoriesPage } from "./pages/admin/ManageCategoriesPage";
import { ManageRegionsPage } from "./pages/admin/ManageRegionsPage";
import { ManageItinerariesPage } from "./pages/admin/ManageItinerariesPage";
import { EditItineraryPage } from "./pages/admin/EditItineraryPage";

const ROUTES_WITHOUT_BOTTOM_NAV = [
  "/",
  "/onboarding",
  "/login",
  "/register",
  "/forgot-password",
  "/forgot-password/sent",
];

function AppLayout() {
  const location = useLocation();
  // Admin pages bring their own AdminLayout sidebar nav (desktop-first,
  // deliberately distinct from the rest of the mobile-first app) - the
  // tourist-facing BottomNav would just overlap it.
  const showBottomNav =
    !ROUTES_WITHOUT_BOTTOM_NAV.includes(location.pathname) &&
    !location.pathname.startsWith("/admin");

  return (
    <>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/shops" element={<ShopsPage />} />
        <Route path="/itineraries" element={<ItinerariesPage />} />
        <Route path="/itineraries/:id" element={<ItineraryDetailPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/video/:id" element={<VideoDetailPage />} />
        <Route path="/products" element={<MarketplacePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/magazine" element={<NewsFeedPage />} />
        <Route path="/magazine/:id" element={<NewsDetailPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/passport"
          element={
            <ProtectedRoute>
              <PassportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artisan/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Artisan"]}>
              <ArtisanDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artisan/shop/create"
          element={
            <ProtectedRoute allowedRoles={["Artisan"]}>
              <EditShopPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artisan/shops/:shopId/edit"
          element={
            <ProtectedRoute allowedRoles={["Artisan"]}>
              <EditShopPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artisan/shops/:shopId/products"
          element={
            <ProtectedRoute allowedRoles={["Artisan"]}>
              <ManageProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artisan/shops/:shopId/products/new"
          element={
            <ProtectedRoute allowedRoles={["Artisan"]}>
              <EditProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artisan/shops/:shopId/products/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["Artisan"]}>
              <EditProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artisan/shops/:shopId/verification"
          element={
            <ProtectedRoute allowedRoles={["Artisan"]}>
              <VerificationRequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artisan/shops/:shopId/membership"
          element={
            <ProtectedRoute allowedRoles={["Artisan"]}>
              <MembershipPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Administrator"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["Administrator"]}>
              <ManageUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/shops/pending"
          element={
            <ProtectedRoute allowedRoles={["Administrator"]}>
              <PendingShopsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/verifications"
          element={
            <ProtectedRoute allowedRoles={["Administrator"]}>
              <VerificationRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute allowedRoles={["Administrator"]}>
              <ManageCategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/regions"
          element={
            <ProtectedRoute allowedRoles={["Administrator"]}>
              <ManageRegionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/itineraries"
          element={
            <ProtectedRoute allowedRoles={["Administrator"]}>
              <ManageItinerariesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/itineraries/new"
          element={
            <ProtectedRoute allowedRoles={["Administrator"]}>
              <EditItineraryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/itineraries/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["Administrator"]}>
              <EditItineraryPage />
            </ProtectedRoute>
          }
        />
        <Route path="/shop/:id" element={<ShopDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/forgot-password/sent"
          element={<ForgotPasswordConfirmationPage />}
        />
      </Routes>
      {showBottomNav && <BottomNav />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppLayout />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
