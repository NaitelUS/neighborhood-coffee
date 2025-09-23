import { addOnOptions } from "@/data/menuData";

interface Props {
  items: any[];
  subtotal: number;
  discount: number;
  total: number;
  applyCoupon: (code: string) => void;
  couponApplied: boolean;
  removeItem: (index: number) => void;
}

export default function OrderSummary({
  items,
  subtotal,
  discount,
  total,
  applyCoupon,
  couponApplied,
  removeItem,
}: Props) {
  const handleApply = () => {
    const code = (document.getElementById("coupon") as HTMLInputElement).value;
    applyCoupon(code);
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-bold mb-2">Your Order</h3>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No items yet</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex justify-between items-start border-b pb-1">
              <div>
                <p className="font-semibold">
                  {item.name} ({item.temperature}) x{item.quantity}
                </p>
                {item.addOns.length > 0 && (
                  <ul className="ml-4 list-disc text-sm text-gray-600">
                    {item.addOns.map((id: string) => {
                      const addOn = addOnOptions.find((a) => a.id === id);
                      return <li key={id}>{addOn ? addOn.name : id}</li>;
                    })}
                  </ul>
                )}
              </div>
              <div className="text-right">
                <p>
                  $
                  {(
                    (item.basePrice +
                      item.addOns.reduce((sum, id) => {
                        const addOn = addOnOptions.find((a) => a.id === id);
                        return sum + (addOn ? addOn.price : 0);
                      }, 0)) *
                    item.quantity
                  ).toFixed(2)}
                </p>
                <button
                  onClick={() => removeItem(index)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 space-y-1 text-sm">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Discount: -${discount.toFixed(2)}</p>
        <p className="font-bold">Total: ${total.toFixed(2)}</p>
      </div>

      {!couponApplied && (
        <div className="mt-3 flex gap-2">
          <input id="coupon" type="text" placeholder="Coupon code" className="border rounded p-1 flex-grow" />
          <button
            onClick={handleApply}
            className="bg-[#1D9099] text-white px-3 py-1 rounded hover:bg-[#00454E]"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
