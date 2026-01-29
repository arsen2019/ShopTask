import { authApi } from "../api/services/auth.service";

const LogOut = () => {
  return (
    <button
      onClick={authApi.logout}
      className="text-white font-medium hover:opacity-80 transition bg-[#792573] px-6 py-1 rounded-2xl flex justify-end"
    >
      Log out
    </button>
  );
};

export default LogOut;
