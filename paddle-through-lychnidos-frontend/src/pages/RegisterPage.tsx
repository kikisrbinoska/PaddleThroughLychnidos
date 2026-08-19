import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../services/errorMessage";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";
import { RoleSelector, type RegistrationRole } from "../components/RoleSelector";

interface FormErrors {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<RegistrationRole>("RegularUser");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const nextErrors: FormErrors = {};
    if (!name.trim()) nextErrors.name = "Name is required";
    if (!username.trim()) nextErrors.username = "Username is required";
    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }
    if (!password) {
      nextErrors.password = "Password is required";
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = "Confirm your password";
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError("");

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register({
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        role,
      });
      navigate("/home");
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not create account"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col justify-center px-6 pb-24">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-extrabold text-primary-900">
          Create an account
        </h1>
        <p className="mb-6 text-sm text-text-secondary">
          Join Paddle Through Lychnidos
        </p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <RoleSelector value={role} onChange={setRole} />
          {role === "Artisan" && (
            <p className="rounded-lg bg-secondary-100 px-3 py-2 text-xs text-secondary-900">
              You'll be able to set up your shop profile after registering.
            </p>
          )}

          <TextField
            id="name"
            label="Full name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <TextField
            id="username"
            label="Username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <TextField
            id="confirmPassword"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />

          {formError && (
            <p className="rounded-lg bg-nosija-red-100 px-3 py-2 text-sm text-nosija-red-900">
              {formError}
            </p>
          )}

          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary-800">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
