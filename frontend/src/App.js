import "@/App.css";
import "./i18n";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

// Layout Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Auth Context
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages
import Home from "./pages/Home";
import AdminApp from "./admin/AdminApp";
import About from "./pages/About";
import Mahamana from "./pages/Mahamana";
import Objectives from "./pages/Objectives";
import Activities from "./pages/Activities";
import Gallery from "./pages/Gallery";
import Join from "./pages/Join";
import Donation from "./pages/donation";
import Contact from "./pages/Contact";
import News from "./pages/News";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import VideoTour from "./pages/VideoTour";
import Store from "./pages/Store";
import AuthPage from "./pages/AuthPage"; // Make sure this is imported!

// ==========================================
// Protected Route Wrapper
// ==========================================
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show a loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F4C430]"></div>
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If route requires admin but user is a regular client, redirect to home
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ==========================================
// Main App Shell
// ==========================================
function Shell() {
  const location = useLocation();
  const admin = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Hide standard Header on Admin routes */}
      {!admin && <Header />}
      
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/mahamana" element={<Mahamana />} />
          <Route path="/objectives" element={<Objectives />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/video-tour" element={<VideoTour />} />
          <Route path="/store" element={<Store />} />
          <Route path="/join" element={<Join />} />
          <Route path="/donation" element={<Donation />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Authentication Route */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected Admin Routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminApp />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>

      {/* Hide standard Footer on Admin routes */}
      {!admin && <Footer />}
      
      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />
    </>
  );
}

// ==========================================
// Root Component
// ==========================================
function App() {
  return (
    <div className="App">
      {/* Wrap everything in AuthProvider so auth state is available globally */}
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Shell />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
