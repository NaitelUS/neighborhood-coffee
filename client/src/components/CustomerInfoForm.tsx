import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const customerInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().optional(),
  isDelivery: z.boolean(),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
  specialNotes: z.string().optional(),
  coupon: z.string().optional(),
});

type CustomerInfo = z.infer<typeof customerInfoSchema>;

interface CustomerInfoFormProps {
  onInfoChange: (info: CustomerInfo) => void;
  orderDetails: string;         // nuevo campo para enviar al correo
  orderNumber: number;          // numero de orden generado
  initialValues?: Partial<CustomerInfo>;
}

export default function CustomerInfoForm({ onInfoChange, orderDetails, orderNumber, initialValues }: CustomerInfoFormProps) {
  const form = useForm<CustomerInfo>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      phone: initialValues?.phone || "",
      address: initialValues?.address || "",
      isDelivery: initialValues?.isDelivery ?? false,
      preferredDate: initialValues?.preferredDate || "",
      preferredTime: initialValues?.preferredTime || "",
      specialNotes: initialValues?.specialNotes || "",
      coupon: "",
    }
  });

  // 🔹 Fecha de hoy
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // 🔹 Generar opciones de tiempo (6:00 AM – 11:00 AM)
  const timeOptions: { value: string; label: string }[] = [];
  for (let hour = 6; hour <= 11; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const displayTime = new Date(`2000-01-01 ${time}`).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      timeOptions.push({ value: time, label: displayTime });
    }
  }

  const watchedValues = form.watch();
  const isDeliveryChecked = form.watch('isDelivery');

  // 🔹 Filtrar domingos
  const isSunday = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.getDay() === 0;
  };

  // 🔹 Pasar valores al padre
  React.useEffect(() => {
    if (form.formState.isValid) {
      onInfoChange(watchedValues);
    }
  }, [watchedValues, form.formState.isValid, onInfoChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-serif">Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form 
            name="order" 
            method="POST" 
            data-netlify="true" 
            netlify-honeypot="bot-field"
            className="space-y-4"
        >
          {/* Hidden inputs para Netlify */}
          <input type="hidden" name="form-name" value="order" />
          <input type="hidden" name="orderDetails" value={orderDetails} />
          <input type="hidden" name="orderNumber" value={orderNumber} />
          <p hidden>
            <label>Don’t fill this out if you’re human: <input name="bot-field" /></label>
          </p>

          {/* Full Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input name="name" placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" name="email" placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" name="phone" placeholder="(555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address {!isDeliveryChecked && "(Enable delivery to enter address)"}</FormLabel>
                <FormControl>
                  <Input 
                    name="address"
                    placeholder="123 Main St, City, State 12345" 
                    disabled={!isDeliveryChecked}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Delivery Checkbox + Store Info */}
          <FormField
            control={form.control}
            name="isDelivery"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2">
                <div className="flex flex-row items-start space-x-3">
                  <FormControl>
                    <Checkbox
                      name="isDelivery"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Delivery (otherwise pickup at store)</FormLabel>
                </div>
                {/* Store Info */}
                <div className="text-sm text-muted-foreground flex items-center gap-2 pl-6">
                  ☕ 12821 Little Misty Ln, El Paso, TX 79938 – (915) 401-5547
                </div>
              </FormItem>
            )}
          />

          {/* Date + Time */}
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
                      name="preferredDate"
                      min={todayStr}
                      value={field.value || todayStr}
                      onChange={(e) => {
                        if (!isSunday(e.target.value)) {
                          field.onChange(e);
                        }
                      }}
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
                  <Select onValueChange={field.onChange} defaultValue={timeOptions[0].value}>
                    <FormControl>
                      <SelectTrigger>
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

          {/* Notes */}
          <FormField
            control={form.control}
            name="specialNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Instructions (Optional)</FormLabel>
                <FormControl>
                  <Textarea name="specialNotes" placeholder="Any special requests..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Coupon */}
          <FormField
            control={form.control}
            name="coupon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coupon Code</FormLabel>
                <div className="flex gap-2">
                  <Input name="coupon" placeholder="Enter coupon" {...field} />
                  <button
                    type="button"
                    className="bg-[#1D9099] hover:bg-[#00454E] text-white px-3 py-2 rounded"
                    onClick={() => alert("Coupon not valid")}
                  >
                    Apply
                  </button>
                </div>
              </FormItem>
            )}
          />

          {/* Submit */}
          <button 
            type="submit" 
            className="w-full h-12 text-lg bg-[#1D9099] hover:bg-[#00454E] text-white rounded"
          >
            Submit Order
          </button>
        </form>
        </Form>
      </CardContent>
    </Card>
  );
}
