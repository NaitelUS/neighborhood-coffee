import { useEffect, useState } from "react";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [creating, setCreating] = useState(false);

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

  const handleSave = async (product: any) => {
    try {
      const res = await fetch("/.netlify/functions/products-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error("Failed to update product");

      alert("✅ Product updated successfully!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Error updating product");
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const newProduct = {
        name: "New Product",
        description: "Describe this product...",
        price: 0,
        image_url: "",
        active: false,
      };

      const res = await fetch("/.netlify/functions/products-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) throw new Error("Failed to create product");

      alert("✅ New product added!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Error creating product");
    } finally {
      setCreating(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (filter === "active") return p.active === true;
    if (filter === "inactive") return p.active === false;
    return true; // all
  });

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">🛠 Manage Products</h1>

        {/* ➕ Add Product Button */}
        <button
          onClick={handleCreate}
          disabled={creating}
          className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {creating ? "Adding..." : "➕ Add Product"}
        </button>
      </div>

      {/* 🔍 Filter bar */}
      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded text-sm font-semibold ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-3 py-1 rounded text-sm font-semibold ${
            filter === "active"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("inactive")}
          className={`px-3 py-1 rounded text-sm font-semibold ${
            filter === "inactive"
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Inactive
        </button>
      </div>

      {/* 🧩 Product list */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={`border rounded-lg p-4 shadow-sm bg-white ${
              product.active ? "" : "opacity-70"
            }`}
          >
            <input
              type="text"
              defaultValue={product.name}
              onChange={(e) => (product.name = e.target.value)}
              className="font-semibold text-lg w-full mb-2 border-b"
            />

            <textarea
              defaultValue={product.description}
              onChange={(e) => (product.description = e.target.value)}
              className="w-full text-sm border rounded p-2 mb-2"
            />

            <input
              type="number"
              defaultValue={product.price}
              onChange={(e) =>
                (product.price = parseFloat(e.target.value) || 0)
              }
              step="0.01"
              className="border p-2 w-full text-sm mb-2"
            />

            <input
              type="text"
              defaultValue={product.image_url}
              onChange={(e) => (product.image_url = e.target.value)}
              placeholder="Image URL"
              className="border p-2 w-full text-sm mb-2"
            />

            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700">
                Active:
              </label>
              <input
                type="checkbox"
                checked={product.active}
                onChange={async (e) => {
                  const newValue = e.target.checked;
                  try {
                    const res = await fetch(
                      "/.netlify/functions/products-update",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          id: product.id,
                          active: newValue,
                        }),
                      }
                    );
                    if (res.ok) {
                      alert(
                        `✅ Product ${
                          newValue ? "activated" : "deactivated"
                        } successfully`
                      );
                      fetchProducts();
                    } else {
                      const err = await res.json();
                      alert("Error: " + err.error);
                    }
                  } catch (err) {
                    console.error(err);
                    alert("Error updating product status");
                  }
                }}
              />
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleSave(product)}
                className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
              >
                💾 Save
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No products found for this filter.
        </p>
      )}
    </div>
  );
}
