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
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().optional(),
  isDelivery: z.boolean(),
  preferredDate: z.string().min(1),
  preferredTime: z.string().min(1),
  specialNotes: z.string().optional(),
});

type CustomerInfo = z.infer<typeof customerInfoSchema>;

interface CustomerInfoFormProps {
  onInfoChange: (info: CustomerInfo) => void;
  orderDetails: string;
}

export default function CustomerInfoForm({ onInfoChange, orderDetails }: CustomerInfoFormProps) {
  const form = useForm<CustomerInfo>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      isDelivery: false,
      preferredDate: new Date().toISOString().split("T")[0],
      preferredTime: "",
      specialNotes: "",
    },
  });

  const today = new Date().toISOString().split("T")[0];

  const watchedValues = form.watch();
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
            <input type="hidden" name="orderDetails" value={orderDetails} />
            <p hidden>
              <label>
                Don’t fill this out if you’re human: <input name="bot-field" />
              </label>
            </p>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
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
                  <FormControl><Input type="email" {...field} /></FormControl>
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
                  <FormControl><Input type="tel" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
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
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div>
                    <FormLabel>Delivery (otherwise pickup at store)</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      12821 Little Misty ln, El Paso, Texas 79938<br />
                      (915) 401-5547 ☕
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Date</FormLabel>
                  <FormControl><Input type="date" min={today} {...field} /></FormControl>
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
                      <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["06:00", "07:00", "08:00", "09:00", "10:00", "11:00"].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <p className="text-sm text-muted-foreground">
              We accept CashApp, Zelle and Cash.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
