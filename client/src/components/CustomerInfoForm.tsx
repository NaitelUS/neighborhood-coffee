<form 
  name="order" 
  method="POST" 
  data-netlify="true" 
  netlify-honeypot="bot-field"
  className="space-y-4"
  action="/?success=true"
>
  {/* Hidden inputs necesarios para Netlify */}
  <input type="hidden" name="form-name" value="order" />
  <p hidden>
    <label>Don’t fill this out if you’re human: <input name="bot-field" /></label>
  </p>

  <FormField
    control={form.control}
    name="name"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Full Name</FormLabel>
        <FormControl>
          <Input
            name="name"   // 👈 NECESARIO
            placeholder="Enter your full name"
            data-testid="input-name"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email Address</FormLabel>
        <FormControl>
          <Input
            type="email"
            name="email"   // 👈 NECESARIO
            placeholder="your.email@example.com"
            data-testid="input-email"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  <FormField
    control={form.control}
    name="phone"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Phone Number</FormLabel>
        <FormControl>
          <Input
            type="tel"
            name="phone"   // 👈 NECESARIO
            placeholder="(555) 123-4567"
            data-testid="input-phone"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  <FormField
    control={form.control}
    name="address"
    render={({ field }) => (
      <FormItem>
        <FormLabel>
          Address {!isDeliveryChecked && "(Enable delivery to enter address)"}
        </FormLabel>
        <FormControl>
          <Input
            name="address"   // 👈 NECESARIO
            placeholder="123 Main St, City, State 12345"
            disabled={!isDeliveryChecked}
            data-testid="input-address"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  <FormField
    control={form.control}
    name="isDelivery"
    render={({ field }) => (
      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
        <FormControl>
          <Checkbox
            name="isDelivery"   // 👈 NECESARIO
            checked={field.value}
            onCheckedChange={field.onChange}
            data-testid="checkbox-delivery"
          />
        </FormControl>
        <div className="space-y-1 leading-none">
          <FormLabel>Delivery (otherwise pickup at store)</FormLabel>
        </div>
      </FormItem>
    )}
  />

  <div className="grid grid-cols-2 gap-4">
    <FormField
      control={form.control}
      name="preferredDate"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Preferred Date</FormLabel>
          <FormControl>
            <Input
              type="date"
              name="preferredDate"   // 👈 NECESARIO
              min={today}
              data-testid="input-date"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="preferredTime"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Preferred Time</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            name="preferredTime"   // 👈 NECESARIO
          >
            <FormControl>
              <SelectTrigger data-testid="select-time">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {timeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>

  <FormField
    control={form.control}
    name="specialNotes"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Special Instructions (Optional)</FormLabel>
        <FormControl>
          <Textarea
            name="specialNotes"   // 👈 NECESARIO
            placeholder="Any special requests or notes about your order..."
            className="min-h-[80px]"
            data-testid="textarea-notes"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  {/* Botón de envío */}
  <button
    type="submit"
    className="bg-brown-600 text-white px-4 py-2 rounded"
  >
    Submit Order
  </button>
</form>
