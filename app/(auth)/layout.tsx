import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="h-screen flex flex-col items-center justify-center">
        {children}
      </div>
    </main>
  );
}
