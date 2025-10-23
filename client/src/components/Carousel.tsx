import { useEffect, useState } from "react";

const images = [
  "/attached_assets/Carrousel_1.png",
  "/attached_assets/Carrousel_2.png",
  "/attached_assets/Carrousel_3.png",
];

export default function Carousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-white select-none">
      {/* 🖼 Contenedor principal */}
      <div className="relative max-w-6xl mx-auto">
        {images.map((img, i) => (
          <img
            key={img}
            src={img}
            alt={`Slide ${i + 1}`}
            className={`absolute top-0 left-0 w-full h-[40vh] md:h-[50vh] object-contain transition-opacity duration-1000 ease-in-out ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            draggable={false}
          />
        ))}
      </div>

      {/* ⚫ Indicadores */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === index
                ? "bg-[#00454E] scale-110"
                : "bg-gray-300 hover:bg-[#1D9099]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
