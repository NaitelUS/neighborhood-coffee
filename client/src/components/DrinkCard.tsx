import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Minus } from "lucide-react";
import AddOnSelector from "./AddOnSelector";
import type { DrinkOption, AddOn } from "@shared/schema";

interface DrinkCardProps {
  drink: DrinkOption;
  addOns: AddOn[];
  onAddToOrder: (drinkId: string, temperature: 'hot' | 'iced', quantity: number, selectedAddOns: string[]) => void;
}

export default function DrinkCard({ drink, addOns, onAddToOrder }: DrinkCardProps) {
  const [temperature, setTemperature] = useState<'hot' | 'iced'>(drink.availableTemperatures[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [showCustomization, setShowCustomization] = useState(false);

  const handleAddToOrder = () => {
    onAddToOrder(drink.id, temperature, quantity, selectedAddOns);
    console.log(`Added ${quantity}x ${temperature} ${drink.name} with add-ons: ${selectedAddOns.join(', ')}`);
    // Reset selections after adding to order
    setQuantity(1);
    setSelectedAddOns([]);
    setShowCustomization(false);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleAddOnChange = (addOnId: string, checked: boolean) => {
    setSelectedAddOns(prev => 
      checked 
        ? [...prev, addOnId]
        : prev.filter(id => id !== addOnId)
    );
  };

  // Calculate total price including add-ons
  const addOnCost = selectedAddOns.reduce((total, addOnId) => {
    const addOn = addOns.find(a => a.id === addOnId);
    return total + (addOn?.price || 0);
  }, 0);
  const totalPrice = (drink.basePrice + addOnCost) * quantity;

  return (
    <Card className="overflow-hidden hover-elevate">
      <div className="relative h-48 overflow-hidden">
        <img
          src={temperature === 'hot' ? drink.images.hot : drink.images.iced}
          alt={`${temperature} ${drink.name}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-serif text-lg font-semibold">{drink.name}</h3>
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              ${drink.basePrice.toFixed(2)}
            </Badge>
          </div>
          <p className="text-white/90 text-sm">{drink.description}</p>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-4">
        {/* Temperature Toggle */}
        {drink.availableTemperatures.length > 1 ? (
          <div className="flex bg-muted rounded-lg p-1" data-testid="temperature-toggle">
            {drink.availableTemperatures.includes('hot') && (
              <Button
                variant={temperature === 'hot' ? 'default' : 'ghost'}
                size="sm"
                className="flex-1"
                onClick={() => setTemperature('hot')}
                data-testid="button-hot"
              >
                Hot
              </Button>
            )}
            {drink.availableTemperatures.includes('iced') && (
              <Button
                variant={temperature === 'iced' ? 'default' : 'ghost'}
                size="sm"
                className="flex-1"
                onClick={() => setTemperature('iced')}
                data-testid="button-iced"
              >
                Iced
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-2">
            <Badge variant="outline" data-testid="single-temperature">
              Available {drink.availableTemperatures[0]} only
            </Badge>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Quantity</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              data-testid="button-decrease-quantity"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center" data-testid="text-quantity">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={incrementQuantity}
              data-testid="button-increase-quantity"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Customize Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`customize-${drink.id}`}
            checked={showCustomization}
            onCheckedChange={(checked) => setShowCustomization(!!checked)}
            data-testid="checkbox-customize"
          />
          <label
            htmlFor={`customize-${drink.id}`}
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Customize your drink
          </label>
        </div>

        {/* Add-ons - Only show when customization is enabled */}
        {showCustomization && (
          <div className="border-t pt-4">
            <AddOnSelector
              addOns={addOns}
              selectedAddOns={selectedAddOns}
              onAddOnChange={handleAddOnChange}
            />
          </div>
        )}

        {/* Add to Order Button */}
        <Button
          onClick={handleAddToOrder}
          className="w-full"
          data-testid="button-add-to-order"
        >
          Add to Order - ${totalPrice.toFixed(2)}
        </Button>
      </CardContent>
    </Card>
  );
}