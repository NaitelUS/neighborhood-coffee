import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";

export default function MenuItem({ item, options = [] }: any) {
  const { addToCart } = useCart();
  const [selectedOption, setSelectedOption] = useState<any>(null);

  useEffect(() => {
    if (options.length > 0) {
      const firstActive = options.find((opt) => opt.active !== false);
      setSelectedOption(firstActive || options[0]);
    }
  }, [options]);

  const handleOptionChange = (opt: any) => {
    setSelectedOption(opt);
  };

  const handleAdd = () => {
    const selected = selectedOption || item;
    const productToAdd = {
      id: selected.id,
      name: selectedOption
        ? `${item.name} - ${selected.optionName}`
        : item.name,
      price: selected.price || item.price,
      image_url: selected.image_url || item.image_url,
      description: selected.description || item.description,
    };
    addToCart(productToAdd);
  };

  const display = selectedOption || item;
  const hasTwoOptions = options.length === 2;

  return (
    <div className="border rounded-lg shadow-sm bg-white p-4 flex flex-col hover:shadow-md transition">
      {/* Imagen dinámica */}
      <img
        src={display.image_url}
        alt={display.name}
        className="w-full h-48 object-cover rounded-md mb-3"
      />

      {/* Nombre principal */}
      <h2 className="font-semibold text-lg mb-1 text-center">{item.name}</h2>

      {/* 🔀 Selector dinámico */}
      {options.length > 1 && (
        <div className="flex justify-center items-center mb-3">
          {/* ✅ Si hay solo 2 opciones → usar switch */}
          {hasTwoOptions ? (
            <div className="relative flex items-center bg-gray-200 rounded-full px-1 py-1 w-40">
              {options.map((opt, index) => (
                <div
                  key={opt.id}
                  onClick={() => handleOptionChange(opt)}
                  className={`flex-1 text-center cursor-pointer text-sm font-semibold py-1 transition-all duration-300 rounded-full ${
                    selectedOption?.id === opt.id
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-700"
                  }`}
                >
                  {opt.optionName}
                </div>
              ))}
            </div>
          ) : (
            // 🔸 Si hay más de 2 opciones, usar botones individuales
            <div className="flex justify-center gap-2">
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
        </div>
      )}

      {/* Descripción */}
      {display.description && (
        <p className="text-gray-600 text-sm mb-2 text-center">
          {display.description}
        </p>
      )}

      {/* Precio */}
      <p className="font-semibold text-lg mb-4 text-center">
        ${display.price?.toFixed(2) ?? "0.00"}
      </p>

      {/* Botón de agregar */}
      <button
        onClick={handleAdd}
        className="bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
