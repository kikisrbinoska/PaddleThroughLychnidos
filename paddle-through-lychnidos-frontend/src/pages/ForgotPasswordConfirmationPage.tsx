import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { BackgroundBlob } from "../components/BackgroundBlob";

export function ForgotPasswordConfirmationPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pb-24 text-center">
      <BackgroundBlob position="top-8 -right-16" tint="secondary" />
      <BackgroundBlob position="bottom-8 -left-16" size="h-56 w-56" tint="primary" />

      <div className="relative mx-auto w-full max-w-sm rounded-2xl border border-white/60 bg-white/55 p-6 shadow-lg shadow-primary-900/5 backdrop-blur-xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary-100">
          <MailCheck size={32} className="text-secondary-700" />
        </div>

        <h1 className="mb-2 text-2xl font-extrabold text-primary-900">
          Check your email
        </h1>
        <p className="mb-6 text-sm text-text-secondary">
          If an account exists for that email, we've sent a password reset
          link.
        </p>

        <Link to="/login" className="text-sm font-semibold text-primary-800">
          Back to login
        </Link>
      </div>
    </div>
  );
}
