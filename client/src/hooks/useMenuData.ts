import { useEffect, useState } from "react";

export function useMenuData() {
  const [products, setProducts] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  const [addons, setAddons] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pRes, oRes, aRes, cRes] = await Promise.all([
          fetch("/.netlify/functions/products"),
          fetch("/.netlify/functions/productoptions"),
          fetch("/.netlify/functions/addons"),
          fetch("/.netlify/functions/coupons"),
        ]);

        const [pData, oData, aData, cData] = await Promise.all([
          pRes.json(),
          oRes.json(),
          aRes.json(),
          cRes.json(),
        ]);

        setProducts(pData.filter((x: any) => x.active));
        setOptions(oData);
        setAddons(aData);
        setCoupons(cData);
      } catch (err) {
        console.error("Error loading menu data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { products, options, addons, coupons, loading };
}
