import React from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { isLoggedIn, logoutAdmin } from "./api";
import PagesManager from "./PagesManager";

function Protected({ children }) {
  return isLoggedIn() ? children : <Navigate to="/admin/login" replace />;
}

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const links = [
    ["Dashboard", "/admin"],
    ["Pages", "/admin/pages"],
    ["Gallery", "/admin/gallery"],
    ["Members", "/admin/members"],
    ["News", "/admin/news"],
    ["Activities", "/admin/activities"],
    ["Events", "/admin/events"],
    ["Blogs", "/admin/blogs"],
    ["Video Tour", "/admin/videos"],
    ["Store", "/admin/store"],
    ["Donations", "/admin/donations"],
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        <aside className="bg-white rounded-xl border p-4 h-fit md:sticky md:top-4">
          <h2 className="font-bold mb-3">Admin Panel</h2>
          <div className="space-y-1">
            {links.map(([label, to]) => (
              <Link key={to} to={to} className={`block px-3 py-2 rounded ${location.pathname === to ? "bg-black text-white" : "hover:bg-gray-100"}`}>
                {label}
              </Link>
            ))}
          </div>
          <button
            className="mt-4 w-full border rounded px-3 py-2 hover:bg-gray-100"
            onClick={() => {
              logoutAdmin();
              navigate("/admin/login");
            }}
          >
            Logout
          </button>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route
        path="*"
        element={
          <Protected>
            <Layout>
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
            </Layout>
          </Protected>
        }
      />
    </Routes>
  );
}
