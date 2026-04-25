import { Navigate } from "react-router-dom";
import { useApp } from "@/data/store";

const Index = () => {
  const user = useApp((s) => s.users.find((u) => u.id === s.currentUserId));
  if (user) return <Navigate to={`/${user.role}`} replace />;
  return <Navigate to="/login" replace />;
};

export default Index;
