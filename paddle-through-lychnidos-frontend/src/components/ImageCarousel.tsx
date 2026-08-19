import { useEffect, useState } from "react";

export interface ImageCarouselProps {
  images: string[];
  intervalMs?: number;
  className?: string;
}

export function ImageCarousel({
  images,
  intervalMs = 4500,
  className = "",
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [images.length, intervalMs]);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden={index !== activeIndex}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            aria-label={`Show slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex
                ? "w-6 bg-white"
                : "w-2 bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
