import React, { useState } from "react";
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
});

type CustomerInfo = z.infer<typeof customerInfoSchema>;

interface CustomerInfoFormProps {
  onInfoChange: (info: CustomerInfo) => void;
  orderNumber: string;
  orderDetails: string;
  total: number;
}

export default function CustomerInfoForm({ onInfoChange, orderNumber, orderDetails, total }: CustomerInfoFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<CustomerInfo>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      isDelivery: false,
      preferredDate: new Date().toISOString().split("T")[0], // hoy por default
      preferredTime: "",
      specialNotes: "",
    }
  });

  const today = new Date().toISOString().split("T")[0];

  // Horarios de 6am a 11am (sin domingos)
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

  React.useEffect(() => {
    if (form.formState.isValid) {
      onInfoChange(watchedValues);
    }
  }, [watchedValues, form.formState.isValid, onInfoChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true); // cambia a Thank You en UI
  };

  if (isSubmitted) {
    return (
      <div className="p-6 bg-green-50 rounded shadow">
        <h2 className="text-2xl font-bold mb-3">Thank you!</h2>
        <p className="mb-2">Your order submission has been received ✅</p>
        <p><strong>Order Number:</strong> {orderNumber}</p>
        <p><strong>Total:</strong> ${total.toFixed(2)}</p>
        <pre className="bg-gray-100 p-3 rounded mt-3 whitespace-pre-wrap">{orderDetails}</pre>
      </div>
    );
  }

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
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Hidden Netlify inputs */}
            <input type="hidden" name="form-name" value="order" />
            <input type="hidden" name="orderNumber" value={orderNumber} />
            <input type="hidden" name="orderDetails" value={orderDetails} />
            <input type="hidden" name="total" value={total.toFixed(2)} />

            <p hidden>
              <label>Don’t fill this out if you’re human: <input name="bot-field" /></label>
            </p>

            {/* Nombre */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
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
                    <Input type="email" placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Teléfono */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="(555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dirección */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St, City, State 12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Delivery checkbox */}
            <FormField
              control={form.control}
              name="isDelivery"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div>
                    <FormLabel>Delivery (otherwise pickup at store)</FormLabel>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                      <span>12821 Little Misty Ln, El Paso, Texas 79938</span> ☕
                      <br />(915) 401-5547
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* Fecha y hora */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="preferredDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Date</FormLabel>
                    <FormControl>
                      <Input type="date" min={today} {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            {/* Notas */}
            <FormField
              control={form.control}
              name="specialNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any special requests or notes..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botón Submit */}
            <button
              type="submit"
              className="w-full h-12 text-lg rounded bg-[#1D9099] hover:bg-[#00454E] text-white"
            >
              Submit Order
            </button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
