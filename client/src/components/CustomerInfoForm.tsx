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
import { Coffee } from "lucide-react";

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
  initialValues?: Partial<CustomerInfo>;
  orderItems: any[];
  total: number;
  orderNumber: number;
}

export default function CustomerInfoForm({
  onInfoChange,
  initialValues,
  orderItems,
  total,
  orderNumber,
}: CustomerInfoFormProps) {
  const form = useForm<CustomerInfo>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      phone: initialValues?.phone || "",
      address: initialValues?.address || "",
      isDelivery: initialValues?.isDelivery ?? false,
      preferredDate: initialValues?.preferredDate || new Date().toISOString().split("T")[0],
      preferredTime: initialValues?.preferredTime || new Date().toISOString().slice(11, 16),
      specialNotes: initialValues?.specialNotes || "",
    },
  });

  const today = new Date().toISOString().split("T")[0];
  const timeOptions: { value: string; label: string }[] = [];
  for (let hour = 6; hour <= 11; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      const displayTime = new Date(`2000-01-01 ${time}`).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      timeOptions.push({ value: time, label: displayTime });
    }
  }

  const watchedValues = form.watch();
  const isDeliveryChecked = form.watch("isDelivery");

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
          <form name="order" method="POST" data-netlify="true" netlify-honeypot="bot-field" className="space-y-4">
            <input type="hidden" name="form-name" value="order" />
            <p hidden>
              <label>Don’t fill this out if you’re human: <input name="bot-field" /></label>
            </p>

            {/* Hidden order details */}
            <input
              type="hidden"
              name="orderDetails"
              value={JSON.stringify({
                orderNumber,
                items: orderItems.map((item) => ({
                  drink: `${item.quantity}x ${item.temperature} ${item.drinkName}`,
                  addOns: item.addOns,
                  price: `$${item.totalPrice.toFixed(2)}`,
                })),
                total: `$${total.toFixed(2)}`,
              })}
            />

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input {...field} placeholder="Enter your full name" /></FormControl>
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
                  <FormControl><Input {...field} type="email" placeholder="your@email.com" /></FormControl>
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
                  <FormControl><Input {...field} type="tel" placeholder="(555) 123-4567" /></FormControl>
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
                  <FormLabel>
                    Address {!isDeliveryChecked && "(Enable delivery to enter address)"}
                  </FormLabel>
                  <FormControl><Input {...field} disabled={!isDeliveryChecked} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Delivery */}
            <FormField
              control={form.control}
              name="isDelivery"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div>
                    <FormLabel>Delivery (otherwise pickup at store)</FormLabel>
                    <div className="text-sm flex items-center gap-2 text-gray-600">
                      <Coffee className="h-4 w-4" /> 12821 Little Misty Ln, El Paso, TX 79938 • (915) 401-5547
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="preferredDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" min={today} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time */}
            <FormField
              control={form.control}
              name="preferredTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Time</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="specialNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Instructions</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
