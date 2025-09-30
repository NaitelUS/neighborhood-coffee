<div className="mt-4 pt-2 border-t border-border">
  <p
    className={`flex items-center gap-2 text-sm font-medium mb-2 transition-all duration-500 ${
      discount > 0
        ? "text-green-600 animate-pulseOnce"
        : "text-muted-foreground opacity-90"
    }`}
  >
    {discount > 0 ? (
      <>
        <CheckCircle
          size={16}
          strokeWidth={2}
          className="text-green-600 transition-transform duration-500 scale-110"
        />
        Coupon applied 🎉
      </>
    ) : (
      "Have a coupon?"
    )}
  </p>

  <CouponField onDiscountApply={(val) => setDiscount(val)} />
</div>
