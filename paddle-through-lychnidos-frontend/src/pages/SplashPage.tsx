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
    <div className="relative flex h-svh flex-col overflow-hidden">
      <div className="h-[34vh] w-full shrink-0 sm:h-[42vh] md:h-[50vh]">
        <ImageCarousel images={SPLASH_IMAGES} />
      </div>

      <BackgroundBlob position="-bottom-16 -right-16" tint="secondary" />
      <BackgroundBlob position="top-8 -left-20" size="h-56 w-56" tint="primary" />

      <div
        {...swipeHandlers}
        className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-2 px-6 py-2 text-center md:gap-4"
      >
        <Wordmark className="text-3xl md:text-5xl" />
        <p className="text-xs text-text-secondary md:text-base">
          Let your adventure begin
        </p>

        <GlassCard className="mt-1 max-w-sm py-3 md:mt-2 md:py-4">
          <Quote
            size={16}
            className="mx-auto mb-1 text-primary-700"
            fill="currentColor"
          />
          <p className="font-serif text-sm italic text-text-primary md:text-lg">
            "Upon the road of autumn's forest, sleeps the endless lake"
          </p>
          <p className="mt-1 text-xs text-text-secondary md:mt-2">
            — Lasgush Poradeci
          </p>
        </GlassCard>

        <div className="mt-2 flex flex-col items-center gap-0.5 md:hidden">
          <ChevronUp size={18} className="animate-bounce text-primary-700" />
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
