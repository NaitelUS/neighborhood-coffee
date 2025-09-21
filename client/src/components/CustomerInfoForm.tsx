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
});

type CustomerInfo = z.infer<typeof customerInfoSchema>;

interface CustomerInfoFormProps {
  onInfoChange: (info: CustomerInfo) => void;
  initialValues?: Partial<CustomerInfo>;
  orderDetails: string;
  orderNumber: number;
}

export default function CustomerInfoForm({ onInfoChange, initialValues, orderDetails, orderNumber }: CustomerInfoFormProps) {
  const form = useForm<CustomerInfo>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      phone: initialValues?.phone || "",
      address: initialValues?.address || "",
      isDelivery: initialValues?.isDelivery ?? false,
      preferredDate: initialValues?.preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: initialValues?.preferredTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      specialNotes: initialValues?.specialNotes || "",
    }
  });

  const today = new Date().toISOString().split('T')[0];
  const dayOfWeek = new Date().getDay();

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
            <input type="hidden" name="form-name" value="order" />
            <input type="hidden" name="orderDetails" value={orderDetails} />
            <input type="hidden" name="orderNumber" value={`ORD-${orderNumber}`} />
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
                    <Input placeholder="Enter your full name" {...field} />
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
                    <Input type="email" placeholder="your.email@example.com" {...field} />
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
                    <Input type="tel" placeholder="(555) 123-4567" {...field} />
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
                  <FormLabel>Address {!isDeliveryChecked && "(Enable delivery to enter address)"}</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St, City, State 12345" disabled={!isDeliveryChecked} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isDelivery"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start space-y-1">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>
                    Delivery (otherwise pickup at store)
                  </FormLabel>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>12821 Little Misty Ln, El Paso TX 79938</span>
                    <span>(915) 401-5547</span>
                    <span>☕</span>
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
                        min={today}
                        value={field.value}
                        disabled={new Date(field.value).getDay() === 0}
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

            <FormField
              control={form.control}
              name="specialNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any special requests or notes about your order..." className="min-h-[80px]" {...field} />
                  </FormControl>
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
