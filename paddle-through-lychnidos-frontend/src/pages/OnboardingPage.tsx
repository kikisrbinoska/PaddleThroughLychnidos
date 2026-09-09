import { useNavigate } from "react-router-dom";
import { ShoppingBag, Map, Bookmark, GraduationCap, Compass } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "../components/Button";
import { LakeWaveBackground } from "../components/LakeWaveBackground";
import { BackgroundBlob } from "../components/BackgroundBlob";
import logo from "../assets/logo.png";

interface FeatureCard {
  icon: LucideIcon;
  accent: "primary" | "secondary";
  title: string;
  description: string;
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    icon: ShoppingBag,
    accent: "primary",
    title: "Products",
    description: "Discover handmade treasures from local artisans.",
  },
  {
    icon: Map,
    accent: "secondary",
    title: "Regions",
    description: "Explore Ohrid by region - Old Town, Bazaar, St. Naum, and more.",
  },
  {
    icon: Bookmark,
    accent: "primary",
    title: "Planner",
    description: "Save shops and routes to your personal travel plan.",
  },
  {
    icon: GraduationCap,
    accent: "secondary",
    title: "Learn",
    description: "Dive into the traditions behind local crafts and food.",
  },
  {
    icon: Compass,
    accent: "primary",
    title: "Favorite Routes",
    description: "Browse curated itineraries around Lake Ohrid.",
  },
];

const accentClasses: Record<FeatureCard["accent"], string> = {
  primary: "bg-primary-100 text-primary-900",
  secondary: "bg-secondary-100 text-secondary-900",
};

export function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden px-6 py-10">
      <LakeWaveBackground />
      <BackgroundBlob position="-top-16 -right-16" tint="primary" />
      <BackgroundBlob position="bottom-16 -left-16" size="h-56 w-56" tint="secondary" />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-2 pb-8">
        <img src={logo} alt="Paddle through Lychnidos" className="h-36 w-36 object-contain md:h-44 md:w-44" />
        <h1 className="mt-2 text-xl font-extrabold text-primary-900 md:text-2xl">
          Why are you here?
        </h1>
      </div>

      <div className="relative mx-auto grid w-full max-w-3xl flex-1 grid-cols-2 gap-4 content-start md:grid-cols-3">
        {FEATURE_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="flex flex-col items-center gap-3 rounded-2xl border border-white/60 bg-white/55 p-4 text-center shadow-lg shadow-primary-900/5 backdrop-blur-xl"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full ${accentClasses[card.accent]}`}
              >
                <Icon size={26} />
              </div>
              <h2 className="text-sm font-bold text-text-primary">
                {card.title}
              </h2>
              <p className="text-xs text-text-secondary">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="relative mx-auto mt-8 flex w-full max-w-3xl flex-col items-center gap-4">
        <Button onClick={() => navigate("/home")} className="w-full max-w-xs">
          Get Started
        </Button>
      </div>
    </div>
  );
}
