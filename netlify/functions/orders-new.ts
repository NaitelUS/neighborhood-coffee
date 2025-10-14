import { Handler } from '@netlify/functions';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    console.log('📦 Payload received:', data);

    // Crear orden en tabla Orders
    const order = await base('Orders').create({
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
    console.log('✅ Order created with ID:', orderId);

    // Crear items
    const items = data.items || [];

    for (const item of items) {
      await base('OrderItems').create({
        ProductName: item.name,
        Option: item.option,
        Price: item.price,
        AddOns: (item.addons || [])
          .map((a: any) => `${a.name} (+$${a.price})`)
          .join(', '),
        Qty: item.qty ?? 1,
        Order: orderId,
      });
      console.log('   ➕ Created item:', item.name, 'qty:', item.qty);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ orderId }),
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
