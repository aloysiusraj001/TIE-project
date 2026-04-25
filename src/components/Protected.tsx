import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Role } from "@/data/types";
import { useApp } from "@/data/store";

const Protected = ({ role, children }: { role: Role; children: ReactNode }) => {
  const user = useApp((s) => s.users.find((u) => u.id === s.currentUserId));
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />;
  return <>{children}</>;
};

export default Protected;
