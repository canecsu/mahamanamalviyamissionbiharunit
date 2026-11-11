import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight, CalendarDays, Flag, HeartHandshake, Image,
  Newspaper, PenLine, Play, Plus, ShoppingBag,
} from "lucide-react";
import { fetchCollection } from "./api";

const modules = [
  { key: "news", label: "News", icon: Newspaper, tone: "maroon", path: "/admin/news" },
  { key: "activities", label: "Activities", icon: Flag, tone: "gold", path: "/admin/activities" },
  { key: "events", label: "Events", icon: CalendarDays, tone: "maroon", path: "/admin/events" },
  { key: "blogs", label: "Blogs", icon: PenLine, tone: "gold", path: "/admin/blogs" },
  { key: "videos", label: "Videos", icon: Play, tone: "gold", path: "/admin/videos" },
  { key: "store", label: "Store", icon: ShoppingBag, tone: "maroon", path: "/admin/store" },
  { key: "donations", label: "Donations", icon: HeartHandshake, tone: "gold", path: "/admin/donations" },
];

const quickActions = [
  { label: "Add News", path: "/admin/news", icon: Plus, tone: "maroon" },
  { label: "Add Activity", path: "/admin/activities", icon: Flag, tone: "gold" },
  { label: "Add Event", path: "/admin/events", icon: CalendarDays, tone: "light" },
  { label: "Upload Gallery", path: "/admin/gallery", icon: Image, tone: "light" },
];

export default function Dashboard() {
  const [counts, setCounts] = useState({});
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all(modules.map(async ({ key }) => {
      try {
        const rows = await fetchCollection(key, true);
        return { key, value: Array.isArray(rows) ? rows.length : null, success: Array.isArray(rows) };
      } catch (_error) {
        return { key, value: null, success: false };
      }
    })).then((results) => {
      if (!active) return;
      setCounts(Object.fromEntries(results.map(({ key, value }) => [key, value])));
      setFailed(results.some(({ success }) => !success));
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="mm-dashboard">
      <div className="mm-dashboard-intro">
        <span className="mm-dashboard-eyebrow">MAHAMANA MALAVIYA MISSION · BIHAR UNIT</span>
        <h1>Welcome to <span>Admin Dashboard</span></h1>
        <p>Manage website content, members, events and mission activities.</p>
      </div>

      <section aria-label="Website content overview">
        <div className="mm-dashboard-section-heading">
          <h2>Content overview</h2>
          <span>At a glance</span>
        </div>
        <div className="mm-dashboard-stats">
          {modules.map(({ key, label, icon: Icon, tone, path }) => (
            <Link to={path} key={key} className={"mm-stat-card mm-stat-" + tone}
              aria-label={label + ": " + (counts[key] ?? "not available") + ". Open manager"}>
              <div className="mm-stat-icon"><Icon size={26} strokeWidth={1.9} /></div>
              <div className="mm-stat-data">
                <span className="mm-stat-label">{label}</span>
                <strong>{counts[key] === undefined ? "—" : counts[key] === null ? "—" : counts[key]}</strong>
              </div>
              <ArrowUpRight className="mm-stat-arrow" size={16} />
            </Link>
          ))}
        </div>
        {failed && <p role="alert" className="mm-stat-error">Some counts could not be loaded. Check your connection or sign in again.</p>}
      </section>

      <section className="mm-dashboard-actions" aria-label="Quick actions">
        <div className="mm-dashboard-section-heading">
          <h2>Quick Actions</h2>
          <span>Start managing content</span>
        </div>
        <div className="mm-dashboard-quick-grid">
          {quickActions.map(({ label, path, icon: Icon, tone }) => (
            <Link to={path} key={path} className={"mm-quick-action mm-quick-" + tone}>
              <span className="mm-quick-icon"><Icon size={23} strokeWidth={2} /></span>
              <span>{label}</span>
              <ArrowUpRight size={15} className="mm-quick-arrow" />
            </Link>
          ))}
        </div>
      </section>

      <div className="mm-dashboard-gate" aria-hidden="true">
        <img src="/admin-bhu-gate-watercolor.svg" alt="" loading="lazy" />
      </div>
      <p className="mm-dashboard-footer-note">Mahamana Malaviya Mission · Bihar Unit <span>•</span> Website Administration</p>
    </div>
  );
}
