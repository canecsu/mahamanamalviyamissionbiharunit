import React, { useEffect, useState } from "react";
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpenText, CalendarDays, ChevronRight, FileText, Flag, HeartHandshake,
  Image, LayoutDashboard, LogOut, Menu, Newspaper, PenLine, ShieldCheck,
  ShoppingBag, UserRound, UsersRound, Video, X, ExternalLink,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Dashboard from "./Dashboard";
import PagesManager from "./PagesManager";
import "./admin.css";

const navigation = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
  { label: "Pages", path: "/admin/pages", icon: FileText },
  { label: "Gallery", path: "/admin/gallery", icon: Image },
  { label: "Members", path: "/admin/members", icon: UsersRound },
  { label: "News", path: "/admin/news", icon: Newspaper },
  { label: "Activities", path: "/admin/activities", icon: Flag },
  { label: "Events", path: "/admin/events", icon: CalendarDays },
  { label: "Blogs", path: "/admin/blogs", icon: PenLine },
  { label: "Video Tour", path: "/admin/videos", icon: Video },
  { label: "Store", path: "/admin/store", icon: ShoppingBag },
  { label: "Donations", path: "/admin/donations", icon: HeartHandshake },
];

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="mm-admin-loading" role="status">Checking administrator access...</div>;
  }
  return user?.role === "admin" ? children : <Navigate to="/auth" replace />;
}

function AdminLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const signOut = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="mm-admin-root">
      <header className="mm-admin-header">
        <button className="mm-mobile-menu" type="button" aria-label="Open admin navigation" aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}>
          <Menu size={23} />
        </button>

        <Link to="/admin" className="mm-admin-brand" aria-label="Mahamana Malaviya Mission Bihar Unit Admin home">
          <img src="/malviyamissionbiharlogo.png" alt="Mahamana Malaviya Mission Bihar Unit logo" />
          <span className="mm-admin-brand-rule" />
          <span className="mm-admin-brand-copy">
            <strong lang="hi">महामना मालवीय मिशन</strong>
            <small lang="hi">बिहार इकाई <span className="mm-admin-dot">•</span> <span lang="en">ADMIN PANEL</span></small>
          </span>
        </Link>

        <div className="mm-admin-header-right">
          <span className="mm-admin-security"><ShieldCheck size={16}/> Secure workspace</span>
          <Link className="mm-admin-site-link" to="/" title="Open website homepage">
            View website <ExternalLink size={14} />
          </Link>
          <div className="mm-admin-profile" title="Signed in as administrator">
            <span className="mm-admin-profile-icon"><UserRound size={21}/></span>
            <span className="mm-admin-profile-text"><strong>{user?.name || "Admin"}</strong><small>Administrator</small></span>
          </div>
        </div>
      </header>

      <div className="mm-admin-body">
        {menuOpen && <button type="button" className="mm-admin-overlay" aria-label="Close navigation"
          onClick={() => setMenuOpen(false)} />}
        <aside className={"mm-admin-sidebar" + (menuOpen ? " is-open" : "")} aria-label="Admin navigation">
          <div className="mm-admin-nav-head">
            <span>MENU</span>
            <button type="button" onClick={() => setMenuOpen(false)} className="mm-admin-nav-close" aria-label="Close navigation">
              <X size={20} />
            </button>
          </div>
          <nav className="mm-admin-navigation">
            {navigation.map(({label, path, icon: Icon, end}) => (
              <NavLink key={path} to={path} end={end}
                className={({isActive}) => "mm-admin-nav-link" + (isActive ? " is-active" : "")}>
                <Icon size={19} strokeWidth={1.85} />
                <span>{label}</span>
                <ChevronRight className="mm-admin-link-chevron" size={15}/>
              </NavLink>
            ))}
          </nav>
          <div className="mm-admin-sidebar-bottom">
            <div className="mm-admin-side-caption"><BookOpenText size={16}/> Mission website management</div>
            <button className="mm-admin-logout" type="button" onClick={signOut}>
              <LogOut size={18}/> Logout
            </button>
          </div>
        </aside>
        <main id="admin-main-content" className="mm-admin-content">{children}</main>
      </div>
    </div>
  );
}

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<Navigate to="/auth" replace />} />
      <Route path="*" element={
        <Protected>
          <AdminLayout>
            <Routes>
              <Route path="" element={<Dashboard />} />
              <Route path="pages" element={<PagesManager type="pages" />} />
              <Route path="gallery" element={<PagesManager type="gallery" />} />
              <Route path="members" element={<PagesManager type="members" />} />
              <Route path="news" element={<PagesManager type="news" />} />
              <Route path="activities" element={<PagesManager type="activities" />} />
              <Route path="events" element={<PagesManager type="events" />} />
              <Route path="blogs" element={<PagesManager type="blogs" />} />
              <Route path="videos" element={<PagesManager type="videos" />} />
              <Route path="store" element={<PagesManager type="store" />} />
              <Route path="donations" element={<PagesManager type="donations" />} />
            </Routes>
          </AdminLayout>
        </Protected>
      } />
    </Routes>
  );
}
