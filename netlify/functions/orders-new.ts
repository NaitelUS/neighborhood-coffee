// netlify/functions/orders-new.ts
import { Handler } from "@netlify/functions";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID as string
);

const TABLE_ORDERS = process.env.AIRTABLE_TABLE_ORDERS || "Orders";
const TABLE_ORDERITEMS = process.env.AIRTABLE_TABLE_ORDERITEMS || "OrderItems";

export const handler: Handler = async (event) => {
  try {
    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing request body" }) };
    }

    const data = JSON.parse(event.body);

    // ----- Normalización de payload (acepta múltiples variantes) -----
    const customer_name  = data.customer_name ?? data.name ?? "";
    const customer_phone = data.customer_phone ?? data.phone ?? "";
    const order_type     = data.order_type ?? data.method ?? "Pickup";
    const address        = order_type === "Delivery" ? (data.address ?? "") : "";

    // Fecha y hora pueden venir como campos sueltos o dentro de schedule{}
    const schedule_date =
      data.schedule_date ?? data.scheduleDate ?? data.schedule?.date ?? data.date ?? "";
    const schedule_time =
      data.schedule_time ?? data.scheduleTime ?? data.schedule?.time ?? data.time ?? "";

    // Importes / cupon
    const subtotal  = Number(data.subtotal ?? data.Subtotal ?? 0);
    const discount  = Number(
      data.discount ?? data.discount_value ?? data.Discount ?? 0
    );
    const total     = Number(data.total ?? data.Total ?? 0);
    const coupon    = data.coupon ?? data.coupon_code ?? data.appliedCoupon ?? "";

    // Ítems (acepta items o cartItems)
    const items: any[] = Array.isArray(data.items) ? data.items :
                         Array.isArray(data.cartItems) ? data.cartItems : [];

    if (!customer_name || !Array.isArray(items)) {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid order data" }) };
    }

    // ----- Crear orden principal -----
    const orderCreateResp = await base(TABLE_ORDERS).create([
      {
        fields: {
          Name: customer_name,
          Phone: customer_phone,
          Address: address,
          OrderType: order_type,
          // 👇 Los dejamos como Single line text para evitar rechazos por formato
          ScheduleDate: schedule_date || "",
          ScheduleTime: schedule_time || "",
          Subtotal: subtotal,
          Discount: discount,
          Total: total,
          // Guardamos en dos variantes por si cambió el nombre del campo
          Coupon: coupon,
          CouponCode: coupon,
          Status: "Received",
        },
      },
    ]);

    const orderId = orderCreateResp[0].id;

    // ----- Crear items (si hay) -----
    if (items.length > 0) {
      // Preparamos lotes de 10 por limitación de Airtable
      const rows = items.map((item) => {
        const addonsStr = Array.isArray(item.addons)
          ? item.addons
              .map((a: any) => {
                const name = a?.name ?? a?.Name ?? "";
                const price = Number(a?.price ?? a?.Price ?? 0);
                return `${name} (+$${price.toFixed(2)})`;
              })
              .join(", ")
          : "";

        // Enlace a la orden: escribimos en "Order" y "Orders" (Airtable ignora el que no exista)
        const linkFields: Record<string, any> = {
          Order: [orderId],
          Orders: [orderId],
        };

        // Campo de addons: soporta "AddOns" o "Add-Ons"
        const addonsFields: Record<string, any> = {
          AddOns: addonsStr,
          "Add-Ons": addonsStr,
        };

        return {
          fields: {
            ...linkFields,
            ProductName: item.name ?? item.ProductName ?? "",
            Option: item.option ?? item.Option ?? "",
            Price: Number(item.price ?? item.Price ?? 0),
            ...addonsFields,
          },
        };
      });

      // Crea en lotes de 10
      while (rows.length) {
        await base(TABLE_ORDERITEMS).create(rows.splice(0, 10));
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, orderId }),
    };
  } catch (err: any) {
    console.error("❌ Error creating order:", err?.message, err);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to create order" }) };
  }
};
