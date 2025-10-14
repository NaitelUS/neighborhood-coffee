import { Handler } from '@netlify/functions'
import Airtable from 'airtable'
import { v4 as uuidv4 } from 'uuid'

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID as string
)

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    }
  }

  try {
    const data = JSON.parse(event.body || '{}')

    console.info('📦 Payload received:', data)

    const orderId = uuidv4()

    // Crear el Order en Airtable (tabla "Orders")
    const order = await base('Orders').create({
      fields: {
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
        OrderID: orderId,
      },
    })

    // Crear los OrderItems relacionados
    const items = data.items || []

    const itemRecords = items.map((item: any) => {
      return {
        fields: {
          Order: orderId,
          ProductName: item.name,
          Option: item.option,
          Price: item.price,
          AddOns: (item.addons || [])
            .map((a: any) => `${a.name} (+$${a.price})`)
            .join(', '),
          Qty: item.qty || 1,
        },
      }
    })

    await base('OrderItems').create(itemRecords)

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Order created successfully' }),
    }
  } catch (error: any) {
    console.error('❌ Error in orders-new.ts:', error)

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create order' }),
    }
  }
}

export { handler }
