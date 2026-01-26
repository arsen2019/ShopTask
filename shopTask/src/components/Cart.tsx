// components/Cart.tsx
import { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { ShoppingCart, X, Trash2 } from 'lucide-react';

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCartStore();

  const totalItems = getTotalItems();

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ShoppingCart className="w-6 h-6 text-gray-700" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-black">Shopping Cart</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Your cart is empty
              </div>
            ) : (
              <>
                <div className="max-h-96 overflow-y-auto p-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 mb-4 pb-4 border-b border-gray-100">
                      <img
                        src={`http://localhost:4000${item.picture}`}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-black">{item.name}</h4>
                        <p className="text-gray-600 text-sm">${item.price}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 bg-gray-200 rounded text-black hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="text-black font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 bg-gray-200 rounded text-black hover:bg-gray-300"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-black">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-200">
                  <div className="flex justify-between mb-4">
                    <span className="font-bold text-black">Total:</span>
                    <span className="font-bold text-black text-xl">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={clearCart}
                      className="flex-1 px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
                    >
                      Clear Cart
                    </button>
                    <button
                      className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;