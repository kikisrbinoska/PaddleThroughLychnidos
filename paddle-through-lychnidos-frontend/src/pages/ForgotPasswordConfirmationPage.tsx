import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";

export function ForgotPasswordConfirmationPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 pb-24 text-center">
      <div className="mx-auto w-full max-w-sm">
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
