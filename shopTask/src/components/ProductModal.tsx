// components/ProductModal.tsx
import { useState } from 'react';

interface IProduct {
  id: number;
  name: string;
  picture: string;
  price: number;
  description: string;
}

interface Props {
  product: IProduct;
  onClose: () => void;
}

const ProductModal = ({ product, onClose }: Props) => {
  const [quantity, setQuantity] = useState(0);

  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => setQuantity(quantity - 1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full flex gap-4">
        {/* Image on the left */}
        <div className="flex-shrink-0 w-1/2">
          <img
            src={`http://localhost:4000${product.picture}`}
            alt={product.name}
            className="w-full h-full object-contain rounded"
          />
        </div>

        {/* Info on the right */}
        <div className="flex flex-col justify-between w-1/2">
          <div>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-2 py-1 text-black text-lg font-bold"
              >
                X
              </button>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-black">{product.name}</h2>
            <p className='text-[#792573] mb-4'>Description</p>
            <hr className="border-gray-500 mb-2" />
            <p className="text-gray-600 mb-4">{product.description}</p>
          
            <p className="font-semibold mb-4 text-gray-700">${product.price}</p>
          </div>

          {/* Add to Cart / Quantity Selector */}
          <div className="flex justify-end">
            {quantity === 0 ? (
              <button
                onClick={() => setQuantity(1)}
                className="px-4 py-2 bg-purple-600 text-white rounded"
              >
                Add to cart
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDecrement}
                  className="px-3 py-1 bg-gray-200 rounded text-black"
                >
                  -
                </button>
                <span className='text-black'>{quantity}</span>
                <button
                  onClick={handleIncrement}
                  className="px-3 py-1 bg-gray-200 rounded text-black"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
