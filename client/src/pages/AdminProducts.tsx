import { useEffect, useState } from "react";

interface Product {
  id: string;
  Name: string;
  Description?: string;
  Price?: number;
  Image?: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/.netlify/functions/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (id: string, field: keyof Product, value: string | number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSave = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    setSaving(true);
    try {
      const res = await fetch("/.netlify/functions/products-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          fields: {
            Name: product.Name,
            Description: product.Description,
            Price: Number(product.Price),
            Image: product.Image,
          },
        }),
      });

      if (!res.ok) throw new Error("Error saving product");
      alert(`✅ Saved changes for ${product.Name}`);
    } catch (err) {
      console.error(err);
      alert("Error saving product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading products...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Image URL</th>
              <th className="border p-2">Preview</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="border p-2">
                  <input
                    value={p.Name}
                    onChange={(e) => handleChange(p.id, "Name", e.target.value)}
                    className="border rounded w-full px-2 py-1 text-sm"
                  />
                </td>
                <td className="border p-2">
                  <textarea
                    value={p.Description || ""}
                    onChange={(e) => handleChange(p.id, "Description", e.target.value)}
                    className="border rounded w-full px-2 py-1 text-sm"
                    rows={2}
                  />
                </td>
                <td className="border p-2 w-24">
                  <input
                    type="number"
                    step="0.01"
                    value={p.Price || ""}
                    onChange={(e) =>
                      handleChange(p.id, "Price", Number(e.target.value))
                    }
                    className="border rounded w-full px-2 py-1 text-sm"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={p.Image || ""}
                    onChange={(e) => handleChange(p.id, "Image", e.target.value)}
                    className="border rounded w-full px-2 py-1 text-sm"
                    placeholder="https://..."
                  />
                </td>
                <td className="border p-2 text-center">
                  {p.Image ? (
                    <img
                      src={p.Image}
                      alt={p.Name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleSave(p.id)}
                    disabled={saving}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
