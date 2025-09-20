import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
}).refine((data) => {
  // If delivery is selected, address is required
  if (data.isDelivery && (!data.address || data.address.length < 5)) {
    return false;
  }
  return true;
}, {
  message: "Address is required when delivery is selected",
  path: ["address"],
});

type CustomerInfo = z.infer<typeof customerInfoSchema>;

interface CustomerInfoFormProps {
  onInfoChange: (info: CustomerInfo) => void;
  initialValues?: Partial<CustomerInfo>;
}

export default function CustomerInfoForm({ onInfoChange, initialValues }: CustomerInfoFormProps) {
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
    }
  });

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Generate time options
  const timeOptions: { value: string; label: string }[] = [];
  for (let hour = 7; hour <= 19; hour++) {
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

  // Update parent whenever form values change
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
                  <FormLabel>Address {!isDeliveryChecked && "(Enable delivery to enter address)"}</FormLabel>
                  <FormControl>
                    <Input 
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
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="checkbox-delivery"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Delivery (otherwise pickup at store)
                    </FormLabel>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
