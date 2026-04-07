import React, { useEffect, useState } from "react";
import { getPublic } from "../lib/contentApi";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublic("activities").then(setActivities).finally(() => setLoading(false));
  }, []);

  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Activities</h1>
      {loading ? <p>Loading activities...</p> : (
        activities.length ? <div className="grid md:grid-cols-2 gap-5">
          {activities.map((a) => (
            <article key={a.id} className="bg-white rounded-xl border p-4">
              <h2 className="text-xl font-semibold">{a.title}</h2>
              <p className="text-sm text-gray-500">{a.date || ""} {a.category ? `• ${a.category}` : ""}</p>
              <p className="mt-2">{a.description}</p>
              {a.image_url && <img src={a.image_url} alt={a.title} className="mt-3 h-48 w-full object-cover rounded" />}
              {!!a.gallery?.length && <div className="grid grid-cols-3 gap-2 mt-2">{a.gallery.map((img, idx) => <img key={idx} src={img} alt={`${a.title}-${idx}`} className="h-20 w-full object-cover rounded" />)}</div>}
            </article>
          ))}
        </div> : <p>No activities published yet.</p>
      )}
    </section>
  );
};

export default Activities;
