"use client";

import React, { createContext, useContext, useState } from "react";

type AuthModalContextType = {
  signInModalOpen: boolean;
  signUpModalOpen: boolean;
  openSignIn: () => void;
  closeSignIn: () => void;
  openSignUp: () => void;
  closeSignUp: () => void;
};

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);

  const openSignIn = () => setSignInModalOpen(true);
  const closeSignIn = () => setSignInModalOpen(false);

  const openSignUp = () => setSignUpModalOpen(true);
  const closeSignUp = () => setSignUpModalOpen(false);

  return (
    <AuthModalContext.Provider
      value={{
        signInModalOpen,
        signUpModalOpen,
        openSignIn,
        closeSignIn,
        openSignUp,
        closeSignUp,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);

  if (!context) {
    throw new Error("useAtuhModal must be used whitin AuthModalProvider");
  }

  return context;
}
