import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY_TOKEN || "fallback-key";

export function getDecryptedToken() {
  if (typeof window === "undefined") return null;

  const encryptedToken = localStorage.getItem("token");
  if (!encryptedToken || !SECRET_KEY) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) throw new Error("Invalid token decryption");
    return decrypted;
  } catch (err) {
    console.error("فشل في فك تشفير التوكن:", err);
    return null;
  }
}
