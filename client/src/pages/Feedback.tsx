import React, { useState } from "react";

export default function Feedback() {
  const orderId = new URLSearchParams(window.location.search).get("order_id");

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) {
      alert("Please select a rating before submitting.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/feedback-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId || "N/A",
          rating,
          comment,
        }),
      });

      if (!res.ok) throw new Error("Error sending feedback");

      setSubmitted(true);
    } catch (error) {
      console.error("❌ Error sending feedback:", error);
      alert("There was a problem submitting your feedback.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 text-center mt-10">
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          Thank You for Your Feedback!
        </h2>
        <p className="text-gray-700">We truly appreciate your input 🙏</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        How was your experience?
      </h2>

      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-3xl ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        placeholder="Leave a comment (optional)"
        className="w-full border rounded-lg p-3 mb-4 text-gray-700"
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>

      <button
        disabled={loading}
        onClick={handleSubmit}
        className={`w-full py-3 rounded-lg font-semibold text-white ${
          loading ? "bg-gray-400" : "bg-amber-600 hover:bg-amber-700"
        }`}
      >
        {loading ? "Sending..." : "Submit Feedback"}
      </button>
    </div>
  );
}
