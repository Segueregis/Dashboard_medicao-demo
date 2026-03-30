import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const email = session.user?.email;

      const allowedAdmins = ["renan.crr@outlook.com", "alex.becooper@outlook.com"];
      
      if (email && allowedAdmins.includes(email)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkSession();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return null;

  if (!isAdmin) {
    // Redireciona apenas se alguém tentar acessar rota admin sem ser admin
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
}