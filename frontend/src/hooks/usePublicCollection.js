import { useEffect, useState } from "react";
import { getPublic } from "../lib/contentApi";

export default function usePublicCollection(type) {
  const [state, setState] = useState({ items: [], loading: true, error: "" });

  useEffect(() => {
    const controller = new AbortController();
    setState({ items: [], loading: true, error: "" });

    getPublic(type, { signal: controller.signal })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("INVALID_RESPONSE");
        setState({ items: data, loading: false, error: "" });
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setState({ items: [], loading: false, error: err.message || "API_ERROR" });
      });

    return () => controller.abort();
  }, [type]);

  return state;
}
