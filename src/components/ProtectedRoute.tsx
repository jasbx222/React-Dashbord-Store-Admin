// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { getDecryptedToken } from "../hooks/DecryptToken";
import type { JSX } from "react";

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  const token = getDecryptedToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
