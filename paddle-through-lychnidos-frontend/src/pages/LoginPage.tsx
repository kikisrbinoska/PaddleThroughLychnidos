import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../services/errorMessage";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";
import { WaveBackground } from "../components/WaveBackground";
import { Wordmark } from "../components/Wordmark";

interface FormErrors {
  username?: string;
  password?: string;
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const nextErrors: FormErrors = {};
    if (!username.trim()) nextErrors.username = "Username is required";
    if (!password) nextErrors.password = "Password is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError("");

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login({ username: username.trim(), password });
      navigate("/home");
    } catch (error) {
      setFormError(getErrorMessage(error, "Invalid username or password"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-surface-bg">
      <WaveBackground />

      <div className="relative flex flex-1 flex-col justify-center px-6 pb-24 pt-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center">
            <Wordmark className="text-2xl md:text-3xl" />
            <p className="mt-2 text-sm text-text-secondary">
              Sign in to continue exploring Lychnidos
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4 rounded-2xl border border-border-default bg-surface-card p-6 shadow-sm"
          >
            <TextField
              id="username"
              label="Username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <Link
              to="/forgot-password"
              className="self-end text-xs text-text-secondary hover:text-primary-800"
            >
              Forgot password?
            </Link>

            {formError && (
              <p className="rounded-lg bg-nosija-red-100 px-3 py-2 text-sm text-nosija-red-900">
                {formError}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
              {isSubmitting ? "Signing in..." : "Log in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-primary-800">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
