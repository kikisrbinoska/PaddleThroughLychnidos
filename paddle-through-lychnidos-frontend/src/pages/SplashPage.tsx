import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";
import { ChevronUp, Quote } from "lucide-react";
import { ImageCarousel } from "../components/ImageCarousel";
import { Wordmark } from "../components/Wordmark";
import { Button } from "../components/Button";
import { BackgroundBlob } from "../components/BackgroundBlob";
import { GlassCard } from "../components/Card";
import photo1 from "../assets/splash/adventure-albania-WUYC7hbia6Y-unsplash.jpg";
import photo2 from "../assets/splash/bushra-shabani-oa8oxsxcL6o-unsplash.jpg";
import photo3 from "../assets/splash/private-tour-to-ohrid-and-ohrid-lake-from-skopje_2S6w7.jpeg";

const SPLASH_IMAGES = [photo1, photo2, photo3];

export function SplashPage() {
  const navigate = useNavigate();

  const swipeHandlers = useSwipeable({
    onSwipedUp: () => navigate("/onboarding"),
    onSwipedLeft: () => navigate("/onboarding"),
    preventScrollOnSwipe: true,
    trackMouse: false,
  });

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <div className="h-[50vh] w-full">
        <ImageCarousel images={SPLASH_IMAGES} />
      </div>

      <BackgroundBlob position="-bottom-16 -right-16" tint="secondary" />
      <BackgroundBlob position="top-8 -left-20" size="h-56 w-56" tint="primary" />

      <div
        {...swipeHandlers}
        className="relative flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center md:gap-4"
      >
        <Wordmark className="text-4xl md:text-5xl" />
        <p className="text-sm text-text-secondary md:text-base">
          Let your adventure begin
        </p>

        <GlassCard className="mt-2 max-w-sm">
          <Quote
            size={18}
            className="mx-auto mb-1 text-primary-700"
            fill="currentColor"
          />
          <p className="font-serif text-base italic text-text-primary md:text-lg">
            "Upon the road of autumn's forest, sleeps the endless lake"
          </p>
          <p className="mt-2 text-xs text-text-secondary">
            — Lasgush Poradeci
          </p>
        </GlassCard>

        <div className="mt-4 flex flex-col items-center gap-1 md:hidden">
          <ChevronUp size={20} className="animate-bounce text-primary-700" />
          <p className="text-xs text-text-secondary">Swipe to continue</p>
        </div>

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
