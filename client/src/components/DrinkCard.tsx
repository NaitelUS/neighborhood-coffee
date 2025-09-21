// src/components/DrinkCard.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { drinkOptions } from "@/data/menuData";

interface DrinkCardProps {
  drink: any;
  addOns: { id: string; name: string; price: number }[];
  onAddToOrder: (
    drinkId: string,
    variant: string,
    quantity: number,
    addOns: string[]
  ) => void;
}

export default function DrinkCard({ drink, addOns, onAddToOrder }: DrinkCardProps) {
  const [variant, setVariant] = useState(
    drink.variants ? drink.variants[0].id : "hot"
  );
  const [quantity, setQuantity] = useState(1);

  const selectedVariant =
    drink.variants?.find((v: any) => v.id === variant) || null;

  const handleAdd = () => {
    if (selectedVariant?.disabled) return; // 🚫 bloquea si está disabled
    onAddToOrder(drink.id, variant, quantity, []);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-serif">{drink.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Imagen */}
        {selectedVariant ? (
          <img
            src={selectedVariant.image}
            alt={selectedVariant.name}
            className="rounded-lg h-40 w-full object-cover"
          />
        ) : (
          <img
            src={drink.images?.[variant]}
            alt={drink.name}
            className="rounded-lg h-40 w-full object-cover"
          />
        )}

        {/* Descripción */}
        <p className="text-sm text-muted-foreground">
          {selectedVariant ? selectedVariant.description : drink.description}
        </p>

        {/* Botones de variantes */}
        {drink.variants ? (
          <div className="flex gap-2">
            {drink.variants.map((v: any) => (
              <Button
                key={v.id}
                type="button"
                variant={variant === v.id ? "default" : "outline"}
                onClick={() => setVariant(v.id)}
                disabled={v.disabled}
                className={
                  variant === v.id
                    ? "bg-[#1D9099] hover:bg-[#00454E] text-white"
                    : "text-[#1D9099] border-[#1D9099]"
                }
              >
                {v.name}
              </Button>
            ))}
          </div>
        ) : (
          <div className="flex gap-2">
            {["hot", "iced"].map((opt) =>
              drink.images?.[opt] ? (
                <Button
                  key={opt}
                  type="button"
                  variant={variant === opt ? "default" : "outline"}
                  onClick={() => setVariant(opt)}
                  className={
                    variant === opt
                      ? "bg-[#1D9099] hover:bg-[#00454E] text-white"
                      : "text-[#1D9099] border-[#1D9099]"
                  }
                >
                  {opt === "hot" ? "Hot" : "Iced"}
                </Button>
              ) : null
            )}
          </div>
        )}

        {/* Precio */}
        <p className="font-semibold">
          ${selectedVariant ? selectedVariant.price : drink.basePrice}
        </p>

        {/* Cantidad */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            -
          </Button>
          <span>{quantity}</span>
          <Button
            type="button"
            variant="outline"
            onClick={() => setQuantity((q) => q + 1)}
          >
            +
          </Button>
        </div>

        {/* Botón Add to Order */}
        {selectedVariant?.disabled ? (
          <Button disabled className="w-full bg-gray-400 text-white">
            Coming Soon
          </Button>
        ) : (
          <Button
            onClick={handleAdd}
            className="w-full bg-[#1D9099] hover:bg-[#00454E] text-white"
          >
            Add to Order
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
