import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { AddOn } from "@shared/schema";

interface AddOnSelectorProps {
  addOns: AddOn[];
  selectedAddOns: string[];
  onAddOnChange: (addOnId: string, checked: boolean) => void;
}

export default function AddOnSelector({ addOns, selectedAddOns, onAddOnChange }: AddOnSelectorProps) {
  if (!addOns || addOns.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-serif">Customize Your Drink</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {addOns.map((addOn) => (
          <div
            key={addOn.id}
            className="flex items-center justify-between p-3 rounded-lg hover-elevate"
            data-testid={`addon-${addOn.id}`}
          >
            <div className="flex items-center space-x-3">
              <Checkbox
                id={addOn.id}
                checked={selectedAddOns.includes(addOn.id)}
                onCheckedChange={(checked) => onAddOnChange(addOn.id, !!checked)}
                data-testid={`checkbox-${addOn.id}`}
              />
              <label
                htmlFor={addOn.id}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {addOn.name}
              </label>
            </div>
            <Badge variant="outline" data-testid={`price-${addOn.id}`}>
              +${addOn.price.toFixed(2)}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}