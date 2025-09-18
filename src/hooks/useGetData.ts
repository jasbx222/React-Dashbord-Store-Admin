import axios from "axios";
  export const url = import.meta.env.VITE_BASE_URL
import { useEffect, useState, useCallback } from "react";
import { getDecryptedToken } from "./DecryptToken";

export default function useGetData<T>(endpiont: string) {

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const token = getDecryptedToken();
      if (!token) return;
      setLoading(true);
      const res = await axios.get(`${url}${endpiont}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json; charset=UTF-8",
        },
      });
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, refetch: fetchData };
}
