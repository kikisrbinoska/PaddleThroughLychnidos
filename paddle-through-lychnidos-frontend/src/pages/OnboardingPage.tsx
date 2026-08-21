import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Map, Bookmark, GraduationCap, Compass } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "../components/Button";

interface FeatureCard {
  icon: LucideIcon;
  accent: "primary" | "secondary";
  title: string;
  description: string;
  to: string;
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    icon: ShoppingBag,
    accent: "primary",
    title: "Products",
    description: "Discover handmade treasures from local artisans.",
    to: "/products",
  },
  {
    icon: Map,
    accent: "secondary",
    title: "Regions",
    description: "Explore Ohrid by region - Old Town, Bazaar, St. Naum, and more.",
    to: "/map",
  },
  {
    icon: Bookmark,
    accent: "primary",
    title: "Planner",
    description: "Save shops and routes to your personal travel plan.",
    to: "/itineraries?view=plan",
  },
  {
    icon: GraduationCap,
    accent: "secondary",
    title: "Learn",
    description: "Dive into the traditions behind local crafts and food.",
    to: "/learn",
  },
  {
    icon: Compass,
    accent: "primary",
    title: "Favorite Routes",
    description: "Browse curated itineraries around Lake Ohrid.",
    to: "/itineraries",
  },
];

const accentClasses: Record<FeatureCard["accent"], string> = {
  primary: "bg-primary-100 text-primary-900",
  secondary: "bg-secondary-100 text-secondary-900",
};

export function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-svh flex-col bg-surface-bg px-6 py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-2 pb-8">
        {/* Placeholder for the app logo/wordmark, to be added later */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-border-default text-xs text-text-secondary">
          Logo
        </div>
        <h1 className="mt-2 text-xl font-extrabold text-primary-900 md:text-2xl">
          Why are you here?
        </h1>
      </div>

      <div className="mx-auto grid w-full max-w-3xl flex-1 grid-cols-2 gap-4 content-start md:grid-cols-3">
        {FEATURE_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.title}
              type="button"
              onClick={() => navigate(card.to)}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border-default bg-surface-card p-4 text-center shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
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
            </button>
          );
        })}
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-3xl flex-col items-center gap-4">
        <Button onClick={() => navigate("/register")} className="w-full max-w-xs">
          Get Started
        </Button>

        <p className="text-sm text-text-secondary">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary-800">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
