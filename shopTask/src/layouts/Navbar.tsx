import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');

    localStorage.removeItem('user');

    navigate('/login');
  };

  return (
    <nav className="flex w-full justify-end shadow py-5 px-10 ">
      <button
        onClick={handleLogout}
        className="text-white font-medium hover:opacity-80 transition bg-[#792573] px-6 py-1 rounded-2xl flex justify-end"
      >
        Log out
      </button>
    </nav>
  );
};

export default Navbar;
