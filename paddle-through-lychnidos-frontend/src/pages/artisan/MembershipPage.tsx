import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Check, ChevronLeft, CreditCard, Crown, Lock } from "lucide-react";
import { artisanService } from "../../services/artisanService";
import { getErrorMessage } from "../../services/errorMessage";
import { MembershipTier } from "../../types";
import type { MembershipTierName, OwnedShop } from "../../types";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { TextField } from "../../components/TextField";

interface PlanCardProps {
  title: string;
  price: string;
  perks: string[];
  isCurrent: boolean;
  isPremium: boolean;
  isSubmitting: boolean;
  onSelect: () => void;
}

function PlanCard({ title, price, perks, isCurrent, isPremium, isSubmitting, onSelect }: PlanCardProps) {
  return (
    <div
      className={`flex flex-1 flex-col gap-4 rounded-2xl border p-5 ${
        isPremium
          ? "border-nosija-gold-500 bg-nosija-gold-100"
          : "border-border-default bg-surface-card"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {isPremium && <Crown size={16} className="text-nosija-gold-900" />}
          <p
            className={`text-sm font-extrabold ${
              isPremium ? "text-nosija-gold-900" : "text-text-primary"
            }`}
          >
            {title}
          </p>
        </div>
        {isCurrent && <Badge variant={isPremium ? "nosijaGold" : "primary"}>Current plan</Badge>}
      </div>

      <p className={`text-xl font-extrabold ${isPremium ? "text-nosija-gold-900" : "text-primary-900"}`}>
        {price}
      </p>

      <ul className="flex flex-1 flex-col gap-2">
        {perks.map((perk) => (
          <li
            key={perk}
            className={`flex items-start gap-2 text-xs ${
              isPremium ? "text-nosija-gold-900/90" : "text-text-secondary"
            }`}
          >
            <Check size={14} className="mt-0.5 flex-none" />
            {perk}
          </li>
        ))}
      </ul>

      <Button
        variant={isPremium ? "secondary" : "outline"}
        onClick={onSelect}
        disabled={isCurrent || isSubmitting}
        className={`w-full ${isPremium ? "!bg-nosija-gold-700 hover:!bg-nosija-gold-800" : ""}`}
      >
        {isCurrent ? "Current plan" : isSubmitting ? "Saving..." : `Select ${title}`}
      </Button>
    </div>
  );
}

// Digits only, grouped in 4s for readability - purely cosmetic formatting,
// nothing here is validated as a real card number (no Luhn check, no brand
// detection) since none of it is ever sent anywhere.
function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

interface DemoPaymentModalProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
}

function DemoPaymentModal({ onCancel, onSubmit, isSubmitting, error }: DemoPaymentModalProps) {
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/34");
  const [cvv, setCvv] = useState("123");
  const [name, setName] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  const canSubmit = cardNumber.trim() && expiry.trim() && cvv.trim() && name.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border-default bg-surface-card p-5 shadow-lg">
        <p className="mb-4 flex items-center gap-1.5 text-sm font-bold text-text-primary">
          <CreditCard size={16} />
          Upgrade to Premium
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <TextField
            id="demo-card-number"
            label="Card number"
            inputMode="numeric"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            maxLength={19}
          />
          <div className="flex gap-3">
            <div className="min-w-0 flex-1">
              <TextField
                id="demo-card-expiry"
                label="Expiry"
                placeholder="MM/YY"
                inputMode="numeric"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                className="w-full"
                maxLength={5}
              />
            </div>
            <div className="w-20 min-w-0 flex-none">
              <TextField
                id="demo-card-cvv"
                label="CVV"
                inputMode="numeric"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                className="w-full"
                maxLength={4}
              />
            </div>
          </div>
          <TextField
            id="demo-card-name"
            label="Name on card"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />

          {error && <p className="text-xs text-nosija-red-700">{error}</p>}

          <Button type="submit" disabled={isSubmitting || !canSubmit} className="mt-1 w-full">
            {isSubmitting ? "Processing..." : "Submit payment"}
          </Button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-center text-sm font-semibold text-text-secondary"
          >
            Cancel
          </button>
        </form>

        <p className="mt-4 flex items-center justify-center gap-1 text-[11px] text-text-secondary">
          <Lock size={11} className="flex-none" />
          Demo mode - no real payment is processed
        </p>
      </div>
    </div>
  );
}

export function MembershipPage() {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const note = (location.state as { note?: string } | null)?.note;

  const [shop, setShop] = useState<OwnedShop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingTier, setSubmittingTier] = useState<MembershipTierName | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (!shopId) return;
    let cancelled = false;
    artisanService
      .getShop(Number(shopId))
      .then((response) => {
        if (!cancelled) setShop(response);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, "Could not load your shop."));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [shopId]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function applyTier(tier: MembershipTierName) {
    if (!shop) return;
    setSubmittingTier(tier);
    setError(null);
    try {
      const response = await artisanService.selectMembership(
        shop.id,
        tier === "Premium" ? MembershipTier.Premium : MembershipTier.Free,
      );
      setShop({
        ...shop,
        membershipTier: response.membershipTier,
        membershipActivatedAt: response.membershipActivatedAt,
      });
      setToast(response.message);
      return true;
    } catch (err) {
      const message = getErrorMessage(err, "Could not update your membership.");
      setError(message);
      setPaymentError(message);
      return false;
    } finally {
      setSubmittingTier(null);
    }
  }

  function handleSelect(tier: MembershipTierName) {
    if (tier === "Premium") {
      setPaymentError(null);
      setIsPaymentOpen(true);
      return;
    }
    applyTier("Free");
  }

  async function handleDemoPaymentSubmit() {
    const ok = await applyTier("Premium");
    if (ok) {
      setIsPaymentOpen(false);
      navigate("/profile", { state: { message: "Premium activated" } });
    }
  }

  return (
    <div className="min-h-svh bg-surface-bg pb-24">
      <header className="flex items-center gap-3 px-6 pt-8">
        <button
          type="button"
          onClick={() => navigate("/artisan/dashboard")}
          aria-label="Back"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-border-default bg-surface-card text-primary-900"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-extrabold text-primary-900">Membership</h1>
      </header>

      <div className="mx-auto mt-6 flex w-full max-w-2xl flex-col gap-4 px-6">
        {note && (
          <p className="rounded-lg bg-secondary-100 px-3 py-2 text-sm font-semibold text-secondary-900">
            {note}
          </p>
        )}

        {toast && (
          <p className="rounded-lg bg-nosija-gold-100 px-3 py-2 text-sm font-semibold text-nosija-gold-900">
            {toast}
          </p>
        )}

        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading...</p>
        ) : error && !shop ? (
          <p className="text-sm text-text-secondary">{error}</p>
        ) : !shop ? (
          <p className="text-sm text-text-secondary">
            Create your shop first to choose a membership plan.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-4 sm:flex-row">
              <PlanCard
                title="Free"
                price="0 MKD"
                perks={["Up to 5 products", "Standard listing"]}
                isCurrent={shop.membershipTier === "Free"}
                isPremium={false}
                isSubmitting={submittingTier === "Free"}
                onSelect={() => handleSelect("Free")}
              />
              <PlanCard
                title="Premium"
                price="Premium"
                perks={[
                  "Unlimited products",
                  "Priority placement in search results",
                  '"Premium" badge on your shop',
                ]}
                isCurrent={shop.membershipTier === "Premium"}
                isPremium
                isSubmitting={submittingTier === "Premium"}
                onSelect={() => handleSelect("Premium")}
              />
            </div>

            {error && <p className="text-xs text-nosija-red-700">{error}</p>}

            <button
              type="button"
              onClick={() => navigate("/artisan/dashboard")}
              className="mt-2 text-center text-sm font-semibold text-primary-800"
            >
              Continue with {shop.membershipTier === "Premium" ? "Premium" : "Free"}
            </button>
          </>
        )}
      </div>

      {isPaymentOpen && (
        <DemoPaymentModal
          onCancel={() => setIsPaymentOpen(false)}
          onSubmit={handleDemoPaymentSubmit}
          isSubmitting={submittingTier === "Premium"}
          error={paymentError}
        />
      )}
    </div>
  );
}
