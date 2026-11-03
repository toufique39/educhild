
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  UserRound,
  Camera,
  Save,
  Loader2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();

  // Better Auth session
  const {
    data: session,
    isPending,
    refetch,
  } = authClient.useSession();

  // Form states
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [nameEdited, setNameEdited] = useState(false);
  const [imageEdited, setImageEdited] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Protect profile page
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login?callbackUrl=%2Fprofile");
    }
  }, [isPending, session, router]);

  // Handle profile update
  const handleUpdateProfile = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const trimmedName = (nameEdited ? name : session?.user.name || "").trim();
    const trimmedImage = (imageEdited ? image : session?.user.image || "").trim();

    if (!trimmedName) {
      setErrorMessage("Please enter your name.");
      return;
    }

    // Validate image URL if provided
    if (trimmedImage) {
      try {
        const imageUrl = new URL(trimmedImage);

        if (!["http:", "https:"].includes(imageUrl.protocol)) {
          throw new Error("Invalid image URL");
        }
      } catch {
        setErrorMessage("Please provide a valid profile image URL.");
        return;
      }
    }

    try {
      setIsUpdating(true);

      // Prepare profile update data
      const updateData: {
        name: string;
        image?: string;
      } = {
        name: trimmedName,
      };

      if (trimmedImage) {
        updateData.image = trimmedImage;
      }

      // Update using Better Auth
      const { error } = await authClient.updateUser(updateData);

      if (error) {
        throw new Error(
          error.message || "Failed to update profile."
        );
      }

      // Refresh session information
      await refetch();

      setSuccessMessage("Your profile has been updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Loading state
  if (isPending) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-background">
        <Loader2 className="h-9 w-9 animate-spin text-brand-text" />
      </main>
    );
  }

  // Redirecting guest users
  if (!session) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">
          Redirecting to login...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Back Navigation */}
        <Link
          href="/"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-text hover:text-brand-text-hover"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Page Heading */}
        <div className="mb-8">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-brand-text">
            Account Settings
          </span>

          <h1 className="mt-4 text-3xl font-bold text-heading sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Manage your personal information and profile picture.
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">

          {/* Profile Preview */}
          <div className="mb-8 flex flex-col items-center border-b border-border pb-8">
            {(imageEdited ? image : session.user.image || "") ? (
              <Image
                src={imageEdited ? image : session.user.image || ""}
                alt={(nameEdited ? name : session.user.name || "") || "User profile"}
                className="h-28 w-28 rounded-full border-4 border-primary/10 object-cover"
                width={112}
                height={112}
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary/10 text-brand-text">
                <UserRound className="h-14 w-14" />
              </div>
            )}

            <h2 className="mt-4 text-lg font-bold text-heading">
              {nameEdited ? name : session.user.name}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {session.user.email}
            </p>
          </div>

          {/* Profile Update Form */}
          <form
            onSubmit={handleUpdateProfile}
            className="space-y-6"
          >

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                value={nameEdited ? name : session.user.name || ""}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameEdited(true);
                }}
                placeholder="Enter your full name"
                required
                maxLength={100}
                className="w-full rounded-lg border border-border bg-field px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Email - Read Only */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={session.user.email}
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-border bg-muted px-4 py-3 text-sm text-muted-foreground outline-none"
              />

              <p className="mt-2 text-xs text-muted-foreground">
                Email address cannot be changed from this page.
              </p>
            </div>

            {/* Profile Image */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"
              >
                <Camera className="h-4 w-4 text-brand-text" />
                Profile Photo URL
              </label>

              <input
                id="image"
                type="url"
                value={imageEdited ? image : session.user.image || ""}
                onChange={(e) => {
                  setImage(e.target.value);
                  setImageEdited(true);
                }}
                placeholder="https://example.com/profile.jpg"
                className="w-full rounded-lg border border-border bg-field px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              <p className="mt-2 text-xs text-muted-foreground">
                Provide a publicly accessible image URL.
                Leave blank to keep your existing photo.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
              >
                {errorMessage}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div
                role="status"
                className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300"
              >
                {successMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUpdating}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating Profile...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
