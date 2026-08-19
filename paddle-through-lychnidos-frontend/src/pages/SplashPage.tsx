import { useRef, type TouchEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ImageCarousel } from "../components/ImageCarousel";
import { Wordmark } from "../components/Wordmark";
import { Button } from "../components/Button";
import photo1 from "../assets/splash/adventure-albania-WUYC7hbia6Y-unsplash.jpg";
import photo2 from "../assets/splash/bushra-shabani-oa8oxsxcL6o-unsplash.jpg";
import photo3 from "../assets/splash/private-tour-to-ohrid-and-ohrid-lake-from-skopje_2S6w7.jpeg";

const SPLASH_IMAGES = [photo1, photo2, photo3];
const SWIPE_THRESHOLD_PX = 50;

export function SplashPage() {
  const navigate = useNavigate();
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  function handleTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event: TouchEvent) {
    if (!touchStart.current) return;

    const touch = event.changedTouches[0];
    const deltaX = touchStart.current.x - touch.clientX;
    const deltaY = touchStart.current.y - touch.clientY;
    touchStart.current = null;

    const isSwipeUp = deltaY > SWIPE_THRESHOLD_PX && deltaY > Math.abs(deltaX);
    const isSwipeLeft = deltaX > SWIPE_THRESHOLD_PX && deltaX > Math.abs(deltaY);

    if (isSwipeUp || isSwipeLeft) {
      navigate("/onboarding");
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-surface-bg">
      <div className="h-[50vh] w-full">
        <ImageCarousel images={SPLASH_IMAGES} />
      </div>

      <div
        className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center md:gap-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Wordmark className="text-4xl md:text-5xl" />
        <p className="text-sm text-text-secondary md:text-base">
          Let your adventure begin
        </p>

        <p className="mt-4 text-xs text-text-secondary md:hidden">
          Swipe up to continue
        </p>

        <Button
          onClick={() => navigate("/onboarding")}
          className="mt-4 hidden md:inline-flex"
        >
          Start
        </Button>
      </div>
    </div>
  );
}
