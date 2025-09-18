
import axios from "axios";
import { useCallback, useState } from "react";
import { getDecryptedToken } from "./DecryptToken";
import { url } from "./useGetData";

const useUpdate = <T = unknown>() => {
  const [response, setResponse] = useState<string>("");
  const [loading, setLoad] = useState<boolean>(false);

  const update = useCallback(async (endpiont: string, data: T ,isFormData = false) => {
    setLoad(true);
    setResponse(""); 
    
    try {
      const token = getDecryptedToken();
      if (!token) return null;
 const headers = {
        ...(isFormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const body = isFormData ? data : JSON.stringify(data);

      const res = await axios.put(`${url}${endpiont}`, body, {
       headers
      });

      if (res.status >= 200 && res.status < 300) {
        setResponse("تم التعديل بنجاح");
      } else {
        setResponse("حدث خطأ أثناء التعديل");
      }
    } catch (error: unknown) {
      console.error("Post error:", error);
      setResponse("تأكد من الاتصال بالإنترنت أو أن البيانات مستخدمة بالفعل");
    } finally {
      setLoad(false);
    }
  }, []);

  return { update, response, loading };
};

export default useUpdate;
