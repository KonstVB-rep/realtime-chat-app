'use client';

import { SignOutButton, useAuth } from "@clerk/nextjs";

export const LogoutButton = () => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return null;
  }

  return (
    <SignOutButton redirectUrl="/">
      <button className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors">
        Выйти
      </button>
    </SignOutButton>
  );
};