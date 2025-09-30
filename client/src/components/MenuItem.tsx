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
      <h2 className="font-semibold text-lg mb-2 text-center">{item.name}</h2>

      {/* 🔀 Selector dinámico */}
      {options.length > 1 && (
        <div className="flex justify-center items-center mb-4">
          {hasTwoOptions ? (
            <div className="relative flex w-52 bg-gray-200 rounded-full cursor-pointer select-none flex-col items-center py-1">
              {/* Fondo animado */}
              <div
                className={`absolute top-0 bottom-0 w-1/2 bg-blue-600 rounded-full shadow transition-all duration-300 ${
                  selectedOption?.id === options[1].id
                    ? "translate-x-full"
                    : "translate-x-0"
                }`}
              ></div>

              <div className="flex w-full z-10">
                {options.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => handleOptionChange(opt)}
                    className={`flex-1 text-center py-1 transition-colors duration-300 ${
                      selectedOption?.id === opt.id
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="font-semibold text-sm leading-tight">
                      {opt.optionName}
                    </div>
                    <div
                      className={`text-[10px] ${
                        selectedOption?.id === opt.id
                          ? "text-white/80"
                          : "text-gray-500"
                      }`}
                    >
                      ${opt.price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
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
                  {opt.optionName} (${opt.price.toFixed(2)})
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

      {/* Precio principal */}
      <p className="font-semibold text-lg mb-4 text-center">
        ${display.price?.toFixed(2) ?? "0.00"}
      </p>

      {/* Botón agregar */}
      <button
        onClick={handleAdd}
        className="bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
