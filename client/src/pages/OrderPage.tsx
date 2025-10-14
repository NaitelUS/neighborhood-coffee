import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import OrderSummary from '../components/OrderSummary';

const OrderPage: React.FC = () => {
  const {
    cart,
    total,
    discount,
    coupon,
    clearCart,
    subtotal,
  } = useContext(CartContext);

  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [orderType, setOrderType] = useState('Pickup');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !scheduleDate || !scheduleTime) {
      setError(true);
      return;
    }

    setError(false);
    setIsSubmitting(true);

    const payload = {
      customer_name: name,
      customer_phone: phone,
      address: '',
      order_type: orderType,
      schedule_date: scheduleDate,
      schedule_time: scheduleTime,
      subtotal,
      discount,
      total,
      coupon_code: coupon?.code || '',
      notes,
      items: cart,
    };

    try {
      const res = await fetch('/.netlify/functions/orders-new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.orderId) {
        throw new Error('Order creation failed');
      }

      clearCart();
      navigate(`/thank-you?id=${result.orderId}`);
    } catch (err) {
      console.error('❌ Order submission error:', err);
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Pickup Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="time"
          value={scheduleTime}
          onChange={(e) => setScheduleTime(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full p-3 bg-teal-800 text-white font-bold rounded hover:bg-teal-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Place Order'}
        </button>
        {error && (
          <p className="text-red-600 text-sm italic">
            There was an error submitting your order. Please try again.
          </p>
        )}
      </form>

      <h2 className="text-2xl font-bold my-6">Review your Order</h2>
      <OrderSummary />
    </div>
  );
};

export default OrderPage;
