import { Navigate } from "react-router";

const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }
  return children;
}
