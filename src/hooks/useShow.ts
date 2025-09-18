import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { getDecryptedToken } from "./DecryptToken";
import { url } from "./useGetData";

export default function useShow<T>(endpiont: string ) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async()=>{
      try {
          const token = getDecryptedToken()
            if(!token)return null;
        setLoading(true);
        const res = await axios.get(`${url}${endpiont}`,{
               headers:{
      Authorization:`Bearer ${token}`,
      Accept:'application/json; charset=UTF-8'
    }
        });
       
        setData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },[]
  )
   useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading ,reftch:fetchData};
}
