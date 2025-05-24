import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuthGuard = (expectedRole: "admin" | "customer") => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
    } else if (role !== expectedRole) {
      navigate("/NoPermission");
    }
  }, [navigate, expectedRole]);
};

export default useAuthGuard;
