import React, { useState } from "react";
import { useCart, CartItem } from "../hooks/useCart";
import { MenuItemData } from "../data/menuData";

const MenuItem: React.FC<{ item: MenuItemData }> = ({ item }) => {
  const { addItem } = useCart();
  const hasIced = !!item.variants.iced;
  const [variant, setVariant] = useState<"hot" | "iced">("hot");
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<{ name: string; price: number }[]>([]);

  const v = variant === "iced" && hasIced ? item.variants.iced! : item.variants.hot;

  const toggleAddOn = (name: string, price: number) => {
    setSelectedAddOns((prev) =>
      prev.find((a) => a.name === name)
        ? prev.filter((a) => a.name !== name)
        : [...prev, { name, price }]
    );
  };

  const handleAdd = () => {
    const cartItem: CartItem = {
      name: item.name,
      variant: variant === "hot" ? "Hot" : "Iced",
      price: v.price,
      quantity,
      addOns: selectedAddOns,
    };
    addItem(cartItem);
    setQuantity(1);
    setSelectedAddOns([]);
  };

  return (
    <div className="bg-white rounded-md shadow-md p-4 flex flex-col">
      <img src={v.image} alt={`${item.name} ${variant}`} className="w-full h-40 object-cover rounded-md mb-3" />

      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        {hasIced && (
          <div className="ml-auto flex gap-1 text-xs">
            <button
              onClick={() => setVariant("hot")}
              className={`px-2 py-1 rounded border ${variant === "hot" ? "bg-black text-white" : "bg-white"}`}
            >
              Hot
            </button>
            <button
              onClick={() => setVariant("iced")}
              className={`px-2 py-1 rounded border ${variant === "iced" ? "bg-black text-white" : "bg-white"}`}
            >
              Iced
            </button>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-2">{v.description}</p>
      <p className="font-medium mb-2">${v.price.toFixed(2)}</p>

      {item.addOns?.length ? (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-700 mb-1">Customize:</p>
          {item.addOns.map((add, idx) => {
            const checked = !!selectedAddOns.find((a) => a.name === add.name);
            return (
              <label key={idx} className="flex items-center text-sm mb-1">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAddOn(add.name, add.price)}
                  className="mr-2"
                />
                {add.name} (+${add.price.toFixed(2)})
              </label>
            );
          })}
        </div>
      ) : null}

      <div className="flex items-center gap-2 mb-3">
        <label className="text-sm">Qty:</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-16 border rounded px-2 py-1 text-center"
        />
      </div>

      <button
        onClick={handleAdd}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded w-full"
      >
        Add to Order – ${(v.price * quantity).toFixed(2)}
      </button>
    </div>
  );
};

export default MenuItem;
