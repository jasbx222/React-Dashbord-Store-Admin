import axios from "axios";
import { useState } from "react";
import { getDecryptedToken } from "./DecryptToken";
import { url } from "./useGetData";


export default function usePost<T = any>() {
  const [response, setResponse] = useState<string | null>(null); // حددت النوع هنا
  const [loading, setLoading] = useState(false);

  const add = async (endpiont: string, data: T, isFormData = false) => {
    try {
      const token = getDecryptedToken();

      setLoading(true);

      const headers = {
        ...(isFormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const body = isFormData ? data : JSON.stringify(data);

      const res = await axios.post(`${url}${endpiont}`, body, { headers });

      if (res.status === 400) {
        setResponse(" لا يمكن الارسال ربما العنصر مغلق   ");
      } else {
        setResponse(" تمت الإضافة بنجاح");
      }

    } catch (error: unknown) {
      console.error("فشل الإرسال:", error);
      setResponse("حدث خطأ أثناء الإرسال");
    } finally {
      setLoading(false);
    }
  };

  return { add, response, loading };
}
