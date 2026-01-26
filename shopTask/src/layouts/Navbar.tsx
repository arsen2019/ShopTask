import Cart from '../components/Cart';
import LogOut from '../components/LogOut';

const Navbar = () => {



  return (
    <nav className="flex w-full justify-end shadow py-5 px-10 ">
      <div className="cart mr-4">
        <Cart/>
      </div>
      <div>
        <LogOut/>
      </div>

      
    </nav>
  );
};

export default Navbar;
