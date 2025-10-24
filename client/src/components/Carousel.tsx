import { useEffect, useRef, useState } from "react";

const images = [
  "/attached_assets/Carrousel_1.png",
  "/attached_assets/Carrousel_2.png",
  "/attached_assets/Carrousel_3.png",
];

export default function Carousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // 🔁 Autoplay controlado
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused]);

  // 👆 Swipe lateral
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (distance > threshold) setIndex((prev) => (prev + 1) % images.length);
    else if (distance < -threshold)
      setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-white select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={() => setPaused(true)}
      onMouseUp={() => setPaused(false)}
      onTouchStartCapture={() => setPaused(true)}
      onTouchEndCapture={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${index * 100}%)`,
          width: `${images.length * 100}%`,
        }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Slide ${i + 1}`}
            className="w-full h-[45vh] md:h-[55vh] object-cover flex-shrink-0"
            draggable={false}
          />
        ))}
      </div>
    </section>
  );
}
