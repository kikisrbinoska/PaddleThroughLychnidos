import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { getErrorMessage } from "../services/errorMessage";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";
import { BackgroundBlob } from "../components/BackgroundBlob";

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.forgotPassword(email.trim());
      navigate("/forgot-password/sent");
    } catch (err) {
      setError(getErrorMessage(err, "Could not send reset link"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-svh flex-col justify-center overflow-hidden px-6 pb-24">
      <BackgroundBlob position="top-8 -right-16" tint="primary" />
      <BackgroundBlob position="bottom-8 -left-16" size="h-56 w-56" tint="secondary" />

      <div className="relative mx-auto w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-extrabold text-primary-900">
          Reset your password
        </h1>
        <p className="mb-6 text-sm text-text-secondary">
          Enter the email associated with your account and we'll send you a
          link to reset your password.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4 rounded-2xl border border-white/60 bg-white/55 p-6 shadow-lg shadow-primary-900/5 backdrop-blur-xl"
        >
          <TextField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />

          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting ? "Sending..." : "Send reset link"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          <Link to="/login" className="font-semibold text-primary-800">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
