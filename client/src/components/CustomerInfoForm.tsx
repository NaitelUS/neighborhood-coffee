import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
}

export default function CustomerInfoForm({
  onInfoChange,
  initialValues,
}: CustomerInfoFormProps) {
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
    },
  });

  const today = new Date().toISOString().split("T")[0];
  const isDeliveryChecked = form.watch("isDelivery");

  React.useEffect(() => {
    if (form.formState.isValid) {
      onInfoChange(form.getValues());
    }
  }, [form.watch(), form.formState.isValid]);

  // Block Sundays
  const isSunday = (date: string) => {
    const d = new Date(date);
    return d.getDay() === 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-serif">Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      {...field}
                    />
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
                    <Input type="email" placeholder="your@email.com" {...field} />
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
                    <Input type="tel" placeholder="(555) 123-4567" {...field} />
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
                  <FormLabel>
                    Address {isDeliveryChecked ? "" : "(Enable delivery to enter address)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Main St"
                      disabled={!isDeliveryChecked}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Delivery */}
            <FormField
              control={form.control}
              name="isDelivery"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div>
                    <FormLabel>
                      Delivery (otherwise pickup at store)
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      12821 Little Misty ln, El Paso, Texas 79938 (915) 401-5547 ☕
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* Date & Time */}
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
                        onChange={(e) => {
                          if (isSunday(e.target.value)) {
                            alert("Sundays not allowed");
                            return;
                          }
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        min="06:00"
                        max="11:00"
                        step="900"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
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
                  <FormLabel>Special Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requests..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Payment Info */}
            <p className="text-sm text-muted-foreground">
              We accept Cash App, Zelle and Cash.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
