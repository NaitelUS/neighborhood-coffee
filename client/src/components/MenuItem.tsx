import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";

export default function MenuItem({ item, options = [] }: any) {
  const { addToCart } = useCart();
  const [selectedOption, setSelectedOption] = useState<any>(null);

  // Si tiene opciones, selecciona la primera; si no, usa el item base
  useEffect(() => {
    if (options.length > 0) setSelectedOption(options[0]);
  }, [options]);

  const handleOptionChange = (opt: any) => {
    setSelectedOption(opt);
  };

  const handleAdd = () => {
    const productToAdd = {
      id: selectedOption ? selectedOption.id : item.id,
      name: selectedOption
        ? `${item.name} - ${selectedOption.optionName}`
        : item.name,
      price: selectedOption ? selectedOption.price : item.price,
      image_url: selectedOption
        ? selectedOption.image_url
        : item.image_url,
      description: selectedOption
        ? selectedOption.description
        : item.description,
    };
    addToCart(productToAdd);
  };

  const display = selectedOption || item;

  return (
    <div className="border rounded-lg shadow-sm bg-white p-4 flex flex-col">
      <img
        src={display.image_url}
        alt={display.name}
        className="w-full h-48 object-cover rounded-md mb-3"
      />

      <h2 className="font-semibold text-lg mb-1">{item.name}</h2>

      {/* 🔀 Selector dinámico de opciones */}
      {options.length > 1 && (
        <div className="flex justify-center gap-2 mb-3 flex-wrap">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleOptionChange(opt)}
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                selectedOption?.id === opt.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {opt.optionName}
            </button>
          ))}
        </div>
      )}

      <p className="text-gray-600 text-sm mb-2">{display.description}</p>

      <p className="font-semibold text-lg mb-4">${display.price.toFixed(2)}</p>

      <button
        onClick={handleAdd}
        className="bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
