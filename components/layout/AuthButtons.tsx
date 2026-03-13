"use client";

import { useAuth, UserButton, SignInButton } from "@clerk/nextjs";

export function AuthButtons() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return (
      <UserButton>
        <UserButton.MenuItems>
          <UserButton.Link
            label="Affiliate Dashboard"
            labelIcon={<span>💸</span>}
            href="/account"
          />
        </UserButton.MenuItems>
      </UserButton>
    );
  }

  return (
    <SignInButton mode="modal">
      <button className="text-sm font-medium text-gray-700 hover:text-black transition px-3 py-1.5">
        Log in
      </button>
    </SignInButton>
  );
}
