import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Helpers
function isSunday(yyyyMmDd: string) {
  // Interpretar como local date (evitar TZ issues)
  const [y, m, d] = yyyyMmDd.split("-").map((n) => parseInt(n));
  const dt = new Date(y, (m - 1), d, 0, 0, 0, 0);
  return dt.getDay() === 0; // 0 = Sunday
}
function isBetween6and11(timeHHmm: string) {
  // "HH:MM"
  const [hh, mm] = timeHHmm.split(":").map((n) => parseInt(n));
  // Permitimos desde 06:00 hasta 11:00 inclusive
  if (hh < 6) return false;
  if (hh > 11) return false;
  // Si es 11, permitir 11:00 exacto (no 11:15+)
  if (hh === 11 && mm > 0) return false;
  return true;
}
function todayYmd() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function roundToNext15Minutes(date = new Date()) {
  const d = new Date(date);
  const ms = 1000 * 60 * 15;
  return new Date(Math.ceil(d.getTime() / ms) * ms);
}
function timeToHHmm(d = new Date()) {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

// Schema
const customerInfoSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    address: z.string().optional(),
    deliveryMethod: z.enum(["pickup", "delivery"]),
    preferredDate: z.string().min(1, "Please select a preferred date"),
    preferredTime: z.string().min(1, "Please select a preferred time"),
    specialNotes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.deliveryMethod === "delivery") {
        return !!(data.address && data.address.trim().length >= 5);
      }
      return true;
    },
    {
      message: "Address is required when delivery is selected",
      path: ["address"],
    }
  )
  .refine(
    (data) => !isSunday(data.preferredDate),
    {
      message: "We’re closed on Sundays. Please choose another date.",
      path: ["preferredDate"],
    }
  )
  .refine(
    (data) => isBetween6and11(data.preferredTime),
    {
      message: "Please select a time between 6:00 AM and 11:00 AM.",
      path: ["preferredTime"],
    }
  );

type CustomerInfo = z.infer<typeof customerInfoSchema>;

interface CustomerInfoFormProps {
  onInfoChange: (info: CustomerInfo) => void;
  initialValues?: Partial<CustomerInfo>;
}

export default function CustomerInfoForm({
  onInfoChange,
  initialValues,
}: CustomerInfoFormProps) {
  // Defaults
  const defaultDate = todayYmd();
  const roundedNow = roundToNext15Minutes();
  const defaultTime = timeToHHmm(roundedNow);

  const form = useForm<CustomerInfo>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      phone: initialValues?.phone || "",
      address: initialValues?.address || "",
      deliveryMethod: initialValues?.deliveryMethod ?? "pickup",
      preferredDate: initialValues?.preferredDate || defaultDate,
      preferredTime: initialValues?.preferredTime || defaultTime,
      specialNotes: initialValues?.specialNotes || "",
    },
    mode: "onChange",
  });

  // Watch & bubble up when valid
  React.useEffect(() => {
    const sub = form.watch(() => {
      if (form.formState.isValid) {
        onInfoChange(form.getValues());
      }
    });
    return () => sub.unsubscribe();
  }, [form, onInfoChange]);

  // Handlers to enforce Sunday & time constraints proactively
  const handleDateChange = (onChange: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val && isSunday(val)) {
      form.setError("preferredDate", {
        type: "manual",
        message: "We’re closed on Sundays. Please choose another date.",
      });
    } else {
      form.clearErrors("preferredDate");
    }
    onChange(val);
  };

  const handleTimeChange = (onChange: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val && !isBetween6and11(val)) {
      form.setError("preferredTime", {
        type: "manual",
        message: "Please select a time between 6:00 AM and 11:00 AM.",
      });
    } else {
      form.clearErrors("preferredTime");
    }
    onChange(val);
  };

  const deliveryMethod = form.watch("deliveryMethod");

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
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      {...field}
                    />
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
                    <Input type="tel" placeholder="(915) 401-5547" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pickup / Delivery */}
            <FormField
              control={form.control}
              name="deliveryMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <FormLabel htmlFor="pickup">Pick up</FormLabel>
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
            {deliveryMethod === "delivery" && (
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main St, City, State 12345"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Store Info */}
            <div className="text-sm mt-2">
              <p className="font-bold">The Neighborhood Coffee</p>
              <p>12821 Little Misty ln</p>
              <p>El Paso, Texas 79938</p>
              <p>(915) 401-5547 ☕</p>
            </div>

            {/* Preferred Date + Time */}
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
                        min={todayYmd()}
                        value={field.value}
                        onChange={handleDateChange(field.onChange)}
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
                    <FormControl>
                      <Input
                        type="time"
                        step={900} // pasos de 15 min
                        value={field.value}
                        onChange={handleTimeChange(field.onChange)}
                      />
                    </FormControl>
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

            {/* Legend */}
            <p className="text-xs text-muted-foreground pt-1">
              We proudly serve daily from <strong>6:00 AM</strong> to <strong>11:00 AM</strong>. 
              On Sundays, we rest and recharge so we can serve you even better the rest of the week ☕✨
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
