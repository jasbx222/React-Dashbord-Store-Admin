
import { useState, useCallback } from "react";
import axios from "axios";
import { getDecryptedToken } from "./DecryptToken";
import { url } from "./useGetData";
// Hook الحذف
const useDelete = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>("");
  const remove = useCallback(async (endpoint: string) => {
    setLoading(true);
    try {
      const token = getDecryptedToken();
      if (!token) {
        setResponse("المستخدم غير مصرح");
        setLoading(false);
        return;
      }
      const res = await axios.delete(`${url}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (res.status >= 200 && res.status < 300) {
        setResponse("تم الحذف بنجاح");
      } else {
        setResponse("فشل في الحذف");
      }
    } catch (error: any) {
      setResponse(error?.response?.data?.message || "حدث خطأ أثناء الحذف");
    } finally {
      setLoading(false);
    }
  }, []);
  return { remove, response, loading };
};

export default useDelete;
