import { Handler } from '@netlify/functions';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const ordersTable = base(process.env.AIRTABLE_TABLE_ORDERS!);
const orderItemsTable = base(process.env.AIRTABLE_TABLE_ORDERITEMS!);

const handler: Handler = async (event) => {
  try {
    const data = JSON.parse(event.body || '{}');

    console.log('📦 Payload received:', data);

    // ✅ Creamos la orden principal
    const order = await ordersTable.create({
      Name: data.customer_name,
      Phone: data.customer_phone,
      Address: data.address,
      OrderType: data.order_type,
      ScheduleDate: data.schedule_date,
      ScheduleTime: data.schedule_time,
      Subtotal: data.subtotal,
      Discount: data.discount,
      Total: data.total,
      Coupon: data.coupon_code,
      Notes: data.notes,
    });

    const orderId = order.id;

    // ✅ Creamos cada producto como "OrderItem"
    for (const item of data.items) {
      await orderItemsTable.create({
        ProductName: item.name,
        Option: item.option,
        Price: item.price,
        AddOns: (item.addons || [])
          .map((addon: { name: string; price: number }) => `${addon.name} (+$${addon.price})`)
          .join(', '),
        Qty: item.qty ?? 1,
        Order: orderId,
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Order created!' }),
    };
  } catch (error) {
    console.error('❌ Error in orders-new.ts:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create order' }),
    };
  }
};

export { handler };
