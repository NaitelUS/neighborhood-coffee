import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const customerInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  orderType: z.enum(["pickup", "delivery"]),
  address: z.string().optional(),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
  specialNotes: z.string().optional(),
}).refine(
  (data) => {
    if (data.orderType === "delivery" && (!data.address || data.address.length < 5)) {
      return false;
    }
    return true;
  },
  {
    message: "Address is required when delivery is selected",
    path: ["address"],
  }
);

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
      orderType: initialValues?.orderType || "pickup",
      address: initialValues?.address || "",
      preferredDate: initialValues?.preferredDate || "",
      preferredTime: initialValues?.preferredTime || "",
      specialNotes: initialValues?.specialNotes || "",
    },
  });

  const today = new Date().toISOString().split("T")[0];

  React.useEffect(() => {
    if (form.formState.isValid) {
      onInfoChange(form.getValues());
    }
  }, [form.watch(), form.formState.isValid]);

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

            {/* Pickup / Delivery */}
            <FormField
              control={form.control}
              name="orderType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <FormLabel htmlFor="pickup">Pickup</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <FormLabel htmlFor="delivery">Delivery</FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address (only if Delivery) */}
            {form.watch("orderType") === "delivery" && (
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
            )}

            {/* Café Address */}
            <div className="text-sm text-muted-foreground mt-2">
              <p className="font-semibold">The Neighborhood Coffee</p>
              <p>12821 Little Misty Ln</p>
              <p>El Paso, Texas 79938</p>
              <p>(915) 401-5547 ☕</p>
            </div>

            {/* Preferred Date */}
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

            {/* Preferred Time */}
            <FormField
              control={form.control}
              name="preferredTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
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
                  <FormLabel>Special Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requests or notes about your order..."
                      className="min-h-[80px]"
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
