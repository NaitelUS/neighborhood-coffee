import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";

export default function MenuItem({ item, options = [] }: any) {
  const { addToCart } = useCart();
  const [selectedOption, setSelectedOption] = useState<any>(null);

  // Selecciona la primera opción activa por defecto
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

      {/* 🔀 Selector de opciones dinámico */}
      {options.length > 1 && (
        <div className="flex justify-center gap-2 mb-3">
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
