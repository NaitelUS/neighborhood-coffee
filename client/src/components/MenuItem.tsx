import React, { useState, useContext, useMemo } from "react";
import { CartContext } from "../context/CartContext";

type AddOn = { name: string; price: number };

type Product = {
  id?: string;
  name: string;
  price: number; // base
  category?: string;
  hot_available?: boolean;
  iced_available?: boolean;
  available?: boolean;
  image_url?: string;            // normalmente "/attached_assets/americano_hot.png"
  addons?: AddOn[];              // si ya viene del backend en el objeto product
};

interface MenuItemProps {
  product: Product;
  // opcionalmente algunos listados te pasan addons aparte; usamos lo que venga
  addons?: AddOn[];
}

const MenuItem: React.FC<MenuItemProps> = ({ product, addons = [] }) => {
  const { addToCart } = useContext(CartContext);

  // Si el producto ya trae addons en el objeto, dales prioridad
  const availableAddOns: AddOn[] = useMemo(() => {
    return Array.isArray(product.addons) && product.addons.length > 0
      ? product.addons
      : addons;
  }, [product.addons, addons]);

  // Opción inicial: Hot si está disponible; si no, Iced; sino vacío
  const initialOption =
    product.hot_available ? "Hot" : product.iced_available ? "Iced" : "";

  const [selectedOption, setSelectedOption] = useState<string>(initialOption);
  const [showCustomize, setShowCustomize] = useState<boolean>(false);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [addedMessage, setAddedMessage] = useState<boolean>(false);

  const addonsTotal = useMemo(
    () => selectedAddOns.reduce((sum, a) => sum + (a.price || 0), 0),
    [selectedAddOns]
  );

  const imageSrc = useMemo(() => {
    // Respetar rutas que ya empiezan con /attached_assets/
    if (product.image_url && product.image_url.startsWith("/attached_assets/")) {
      return product.image_url;
    }
    // fallback por si algún producto trae solo el nombre de archivo
    if (product.image_url) {
      return `/attached_assets/${product.image_url}`;
    }
    return "/attached_assets/placeholder.png";
  }, [product.image_url]);

  const toggleAddOn = (addon: AddOn) => {
    setSelectedAddOns((prev) =>
      prev.find((a) => a.name === addon.name)
        ? prev.filter((a) => a.name !== addon.name)
        : [...prev, addon]
    );
  };

  const handleAddToCart = () => {
    // Construir el item para el CartContext
    const basePrice = Number(product.price || 0);
    const totalPrice = basePrice + addonsTotal;

    const item = {
      id: product.id || product.name,            // estable para merges
      name: product.name,                         // nombre limpio (formateo lo haces al render)
      option: selectedOption || undefined,        // "Hot"/"Iced" si aplica
      basePrice,                                  // precio base sin addons
      price: totalPrice,                          // precio con addons (para mostrar rápido si ocupas)
      includesAddons: selectedAddOns.length > 0,  // bandera de que ya sumamos addons
      addons: selectedAddOns,                     // [{name, price}]
      image_url: product.image_url,
      qty: 1,
    };

    addToCart(item);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 1200);
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center w-full max-w-sm mx-auto transition-transform hover:scale-[1.02]">
      {/* Imagen grande */}
      <img
        src={imageSrc}
        alt={product.name}
        className="w-36 h-36 object-cover mb-4 rounded-xl shadow-sm"
        loading="lazy"
      />

      {/* Título + precio base */}
      <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
      <p className="text-sm text-gray-600 mb-3">${product.price.toFixed(2)}</p>

      {/* Botones Hot / Iced */}
      {(product.hot_available || product.iced_available) && (
        <div className="flex justify-center space-x-2 mb-3">
          {product.hot_available && (
            <button
              type="button"
              onClick={() => setSelectedOption("Hot")}
              className={`px-3 py-1 rounded-full border transition ${
                selectedOption === "Hot"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-emerald-700 border-emerald-600"
              }`}
            >
              Hot
            </button>
          )}
          {product.iced_available && (
            <button
              type="button"
              onClick={() => setSelectedOption("Iced")}
              className={`px-3 py-1 rounded-full border transition ${
                selectedOption === "Iced"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-emerald-700 border-emerald-600"
              }`}
            >
              Iced
            </button>
          )}
        </div>
      )}

      {/* Toggle Customize */}
      {availableAddOns.length > 0 && (
        <label className="text-sm font-medium text-emerald-700 cursor-pointer mb-3 flex items-center justify-center select-none">
          <input
            type="checkbox"
            checked={showCustomize}
            onChange={() => setShowCustomize((s) => !s)}
            className="mr-2 accent-emerald-600"
          />
          Customize your drink
        </label>
      )}

      {/* Panel de Add-ons */}
      {showCustomize && availableAddOns.length > 0 && (
        <div className="w-full border rounded-xl border-gray-200 bg-emerald-50 p-3 mb-3 text-left">
          {availableAddOns.map((addon) => {
            const checked = !!selectedAddOns.find((a) => a.name === addon.name);
            return (
              <label
                key={addon.name}
                className="flex justify-between items-center py-1 text-sm text-gray-800"
              >
                <span>{addon.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 text-xs">
                    (+${(addon.price || 0).toFixed(2)})
                  </span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleAddOn(addon)}
                    className="accent-emerald-600"
                  />
                </div>
              </label>
            );
          })}
          {/* Total tentativo del ítem (base + addons) */}
          <div className="flex justify-between mt-2 pt-2 border-t text-sm">
            <span className="text-gray-600">Item total</span>
            <span className="font-semibold text-gray-800">
              ${(product.price + addonsTotal).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Botón agregar */}
      <button
        type="button"
        onClick={handleAddToCart}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full text-sm font-semibold mt-1 transition-all"
        disabled={(product.hot_available || product.iced_available) && !selectedOption}
        title={
          (product.hot_available || product.iced_available) && !selectedOption
            ? "Select Hot or Iced"
            : "Add to order"
        }
      >
        {addedMessage ? "✓ Added!" : "Add to order"}
      </button>
    </div>
  );
};

export default MenuItem;
