import React, { useEffect, useState } from "react";
import { fetchCollection } from "./api";

const modules = ["news", "activities", "events", "blogs", "videos", "store", "donations"];

export default function Dashboard() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    Promise.all(modules.map((m) => fetchCollection(m, true).then((rows) => [m, rows.length]).catch(() => [m, 0]))).then((entries) => {
      setCounts(Object.fromEntries(entries));
    });
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {modules.map((m) => (
          <div key={m} className="bg-white border rounded-xl p-4">
            <p className="text-sm capitalize text-gray-600">{m}</p>
            <p className="text-2xl font-bold">{counts[m] ?? "-"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
