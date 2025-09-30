import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

interface Version {
  price: number;
  description: string;
  image_url: string;
}

interface MenuItemProps {
  item: {
    id: string;
    name: string;
    hotVersion: Version;
    icedVersion: Version;
  };
}

export default function MenuItem({ item }: MenuItemProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [isHot, setIsHot] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<Version>(item.hotVersion);

  // 🔄 Cada vez que cambie el modo, actualiza la versión
  useEffect(() => {
    setSelectedVersion(isHot ? item.hotVersion : item.icedVersion);
  }, [isHot, item]);

  const handleToggle = () => setIsHot(!isHot);

  const handleAdd = () => {
    try {
      const productToAdd = {
        id: `${item.id}-${isHot ? "hot" : "iced"}`,
        name: `${item.name} (${isHot ? "Hot" : "Iced"})`,
        price: selectedVersion.price,
        image_url: selectedVersion.image_url,
        description: selectedVersion.description,
      };

      addToCart(productToAdd);
      showToast(`✅ Added ${productToAdd.name} ($${productToAdd.price.toFixed(2)})`, "success");
    } catch (err) {
      console.error("Add to cart error:", err);
      showToast("❌ Something went wrong adding this item", "error");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white flex flex-col items-center text-center">
      {/* 🖼️ Imagen dinámica */}
      <img
        src={selectedVersion.image_url || "/placeholder.png"}
        alt={item.name}
        className="w-32 h-32 object-cover rounded-lg mb-3"
      />

      {/* ☕ Nombre y descripción */}
      <h3 className="font-semibold text-lg">{item.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{selectedVersion.description}</p>

      {/* 💲 Precio */}
      <p className="font-bold mb-3">${selectedVersion.price.toFixed(2)}</p>

      {/* 🔘 Botón para alternar Hot/Iced */}
      <button
        onClick={handleToggle}
        className="mb-3 px-3 py-1 text-sm bg-gray-200 rounded-full hover:bg-gray-300 transition"
      >
        {isHot ? "Switch to Iced" : "Switch to Hot"}
      </button>

      {/* 🛒 Botón agregar al carrito */}
      <button
        onClick={handleAdd}
        className="mt-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
