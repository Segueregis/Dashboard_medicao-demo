// src/components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (session) {
        const user = session.user;
        const roles = user.raw_app_meta_data?.roles || [];
        if (roles.includes("admin")) {
          setSession(session);
        } else {
          setSession(null);
        }
      } else {
        setSession(null);
      }

      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) return null;

  if (!session) {
    return <Navigate to="/admin-login" />;
  }

  return <>{children}</>;
}