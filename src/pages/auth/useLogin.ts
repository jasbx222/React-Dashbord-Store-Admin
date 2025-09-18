"use client";

import { useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";

const SECRET_KEY =import.meta.env.VITE_SECRET_KEY_TOKEN;
export const API_URL = import.meta.env.VITE_BASE_URL;
export default function useLogin() {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (url: string, data: any) => {
    try {
      setLoading(true);
      const res = await axios.post(url, data);
      const token = res?.data?.token;

      if (token && typeof token === "string") {
        const encryptedToken = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
        localStorage.setItem("token", encryptedToken);
        window.location.href = "/home";
      } else {
        console.error("التوكن غير صالح:", token);
        setResponse("حدث خطأ: التوكن غير صالح");
      }

      setLoading(false);
    } catch (error: any) {
      console.error("فشل الإرسال:", error);
      setResponse(" حدث خطأ أثناء الإرسال");
      setLoading(false);
    }
  };

  return { login, response, loading };
}
