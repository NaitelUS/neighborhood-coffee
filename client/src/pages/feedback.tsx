import { useSearchParams, Link } from "react-router-dom";
import { useState } from "react";

export default function Feedback() {
  const [params] = useSearchParams();
  const orderId = params.get("order");

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) {
      alert("Please select a rating.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/feedback-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, rating, comment }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const err = await res.json();
        alert("Error: " + err.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting feedback");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-3">
          ✅ Thank you!
        </h1>
        <p className="text-gray-700 mb-4">
          Your feedback helps us improve our service ☕
        </p>
        <Link
          to="/"
          className="text-blue-600 underline font-medium hover:text-blue-800"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Invalid Link</h1>
        <p className="text-gray-600">
          Feedback link must include an order ID.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Rate Your Order</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl ${
                rating >= star ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave an optional comment..."
          className="w-full border rounded p-2 text-sm"
          rows={3}
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}
