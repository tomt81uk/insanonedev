// components/theme-provider.tsx
"use client";
import * as React from "react";

type Props = {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
};

export function ThemeProvider({ children }: Props) {
  return <>{children}</>;
}
