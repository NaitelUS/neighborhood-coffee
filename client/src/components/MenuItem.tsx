<label className="flex items-center gap-2 mb-3">
  <input
    type="checkbox"
    checked={customize}
    onChange={(e) => setCustomize(e.target.checked)}
  />
  <span className="font-medium">Customize your drink</span>
</label>

{customize && (
  <AddOnSelector
    onSelect={(addons) => {
      setSelectedAddOns(addons);
    }}
  />
)}
