import { Handler } from '@netlify/functions';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID || ''
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
    console.info('📦 Payload received:', data);

    const {
      customer_name,
      customer_phone,
      address,
      order_type,
      schedule_date,
      schedule_time,
      subtotal,
      discount,
      total,
      coupon_code,
      notes,
      items,
    } = data;

    // Crear orden principal
    const order = await base('Orders').create({
      customer_name,
      customer_phone,
      address,
      order_type,
      schedule_date,
      schedule_time,
      subtotal,
      discount,
      total,
      coupon_code,
      notes,
    });

    const orderId = order.id;

    // Crear cada OrderItem
    for (const item of items) {
      await base('OrderItems').create({
        order: [orderId],
        product: item.name,
        option: item.option,
        addons: Array.isArray(item.addons)
          ? item.addons.map((a: any) => (typeof a === 'string' ? a : a.name)).join(', ')
          : '',
        qty: item.qty || 1,
        price: item.price,
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Order created successfully.' }),
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
