import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BottomNav } from "./components/BottomNav";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { MapPage } from "./pages/MapPage";
import { ItinerariesPage } from "./pages/ItinerariesPage";
import { LearnPage } from "./pages/LearnPage";
import { ProductsPage } from "./pages/ProductsPage";
import { PlannerPage } from "./pages/PlannerPage";
import { MagazinePage } from "./pages/MagazinePage";
import { ProfilePage } from "./pages/ProfilePage";
import { ShopDetailPage } from "./pages/ShopDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { SplashPage } from "./pages/SplashPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ForgotPasswordConfirmationPage } from "./pages/ForgotPasswordConfirmationPage";

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
  const showBottomNav = !ROUTES_WITHOUT_BOTTOM_NAV.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/itineraries" element={<ItinerariesPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/magazine" element={<MagazinePage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
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
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
