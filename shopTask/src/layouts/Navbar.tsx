import { useNavigate } from 'react-router-dom';
import Cart from '../components/Cart';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');


    navigate('/login');
  };


  return (
    <nav className="flex w-full justify-end shadow py-5 px-10 ">
      <div className="cart mr-4">
        <Cart/>
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="text-white font-medium hover:opacity-80 transition bg-[#792573] px-6 py-1 rounded-2xl flex justify-end"
        >
          Log out
        </button>
      </div>

      
    </nav>
  );
};

export default Navbar;
