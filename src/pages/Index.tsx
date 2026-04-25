import { Navigate } from "react-router-dom";
import { useApp } from "@/data/store";

const Index = () => {
  const authReady = useApp((s) => s.authReady);
  const user = useApp((s) => s.users.find((u) => u.id === s.currentUserId));
  if (!authReady) return null;
  if (user) return <Navigate to={`/${user.role}`} replace />;
  return <Navigate to="/login" replace />;
};

export default Index;
