import { useState } from "react";
import client from "../api/client";

export function useApi<T = any>(endpoint: string, options?: any) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async (config?: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await client(endpoint, { ...options, ...config });
      setData(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.message || "Error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, request };
}
