import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";

const LogOut = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    useCartStore.getState().clearCart();

    navigate("/login");
  };
  return (
    <button
      onClick={handleLogout}
      className="text-white font-medium hover:opacity-80 transition bg-[#792573] px-6 py-1 rounded-2xl flex justify-end"
    >
      Log out
    </button>
  );
};

export default LogOut;
