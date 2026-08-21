import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Globe, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/userService";
import { getErrorMessage } from "../services/errorMessage";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export function SettingsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [profileFormError, setProfileFormError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [passwordFormError, setPasswordFormError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/profile/settings" } } });
      return;
    }

    let cancelled = false;
    userService
      .getMe()
      .then((profile) => {
        if (cancelled) return;
        setName(profile.name);
        setUsername(profile.username);
        setEmail(profile.email);
      })
      .catch((err) => {
        if (!cancelled) {
          setProfileFormError(getErrorMessage(err, "Could not load your profile."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingProfile(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isAuthLoading, navigate]);

  function validateProfile(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = "Name is required";
    if (!username.trim()) nextErrors.username = "Username is required";
    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }
    setProfileErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleProfileSubmit(event: FormEvent) {
    event.preventDefault();
    setProfileFormError("");
    setProfileSuccess("");

    if (!validateProfile()) return;

    setIsSavingProfile(true);
    try {
      await userService.updateMe({
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
      });
      setProfileSuccess("Profile updated successfully.");
    } catch (err) {
      setProfileFormError(getErrorMessage(err, "Could not update your profile."));
    } finally {
      setIsSavingProfile(false);
    }
  }

  function validatePassword(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!currentPassword) nextErrors.currentPassword = "Current password is required";
    if (!newPassword) {
      nextErrors.newPassword = "New password is required";
    } else if (newPassword.length < MIN_PASSWORD_LENGTH) {
      nextErrors.newPassword = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }
    if (confirmNewPassword !== newPassword) {
      nextErrors.confirmNewPassword = "Passwords do not match";
    }
    setPasswordErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handlePasswordSubmit(event: FormEvent) {
    event.preventDefault();
    setPasswordFormError("");
    setPasswordSuccess("");

    if (!validatePassword()) return;

    setIsSavingPassword(true);
    try {
      await userService.changePassword(currentPassword, newPassword);
      setPasswordSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setPasswordFormError(getErrorMessage(err, "Could not change your password."));
    } finally {
      setIsSavingPassword(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-svh bg-surface-bg pb-24">
      <header className="flex items-center gap-3 px-6 pt-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-border-default bg-surface-card text-primary-900"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-extrabold text-primary-900">Settings</h1>
      </header>

      <div className="mx-auto mt-6 flex w-full max-w-sm flex-col gap-8 px-6">
        {isLoadingProfile ? (
          <p className="text-sm text-text-secondary">Loading your settings...</p>
        ) : (
          <>
            <section>
              <h2 className="mb-3 text-sm font-bold text-text-primary">
                Account details
              </h2>
              <form
                onSubmit={handleProfileSubmit}
                noValidate
                className="flex flex-col gap-4"
              >
                <TextField
                  id="name"
                  label="Full name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={profileErrors.name}
                />
                <TextField
                  id="username"
                  label="Username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={profileErrors.username}
                />
                <TextField
                  id="email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={profileErrors.email}
                />

                {profileFormError && (
                  <p className="rounded-lg bg-nosija-red-100 px-3 py-2 text-sm text-nosija-red-900">
                    {profileFormError}
                  </p>
                )}
                {profileSuccess && (
                  <p className="rounded-lg bg-secondary-100 px-3 py-2 text-sm text-secondary-900">
                    {profileSuccess}
                  </p>
                )}

                <Button type="submit" disabled={isSavingProfile} className="w-full">
                  {isSavingProfile ? "Saving..." : "Save changes"}
                </Button>
              </form>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-bold text-text-primary">
                Change password
              </h2>
              <form
                onSubmit={handlePasswordSubmit}
                noValidate
                className="flex flex-col gap-4"
              >
                <TextField
                  id="currentPassword"
                  label="Current password"
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  error={passwordErrors.currentPassword}
                />
                <TextField
                  id="newPassword"
                  label="New password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={passwordErrors.newPassword}
                />
                <TextField
                  id="confirmNewPassword"
                  label="Confirm new password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  error={passwordErrors.confirmNewPassword}
                />

                {passwordFormError && (
                  <p className="rounded-lg bg-nosija-red-100 px-3 py-2 text-sm text-nosija-red-900">
                    {passwordFormError}
                  </p>
                )}
                {passwordSuccess && (
                  <p className="rounded-lg bg-secondary-100 px-3 py-2 text-sm text-secondary-900">
                    {passwordSuccess}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="outline"
                  disabled={isSavingPassword}
                  className="w-full"
                >
                  {isSavingPassword ? "Saving..." : "Change password"}
                </Button>
              </form>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-bold text-text-primary">Language</h2>
              {/* Placeholder - no localization is implemented yet. */}
              <div className="flex items-center justify-between rounded-xl border border-border-default bg-surface-card px-4 py-3 opacity-60">
                <div className="flex items-center gap-2 text-sm text-text-primary">
                  <Globe size={16} />
                  English
                </div>
                <span className="text-xs text-text-secondary">Coming soon</span>
              </div>
            </section>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-nosija-red-700 py-3 text-sm font-semibold text-nosija-red-700"
            >
              <LogOut size={16} />
              Log out
            </button>
          </>
        )}
      </div>
    </div>
  );
}
