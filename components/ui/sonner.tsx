"use client";

import { useEffect, useState } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * No next-themes dependency.
 * Detects dark mode by checking .dark class on <html>.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    const update = () =>
      setTheme(root.classList.contains("dark") ? "dark" : "light");
    update();

    // Optional: watch for class changes in case you toggle modes
    const obs = new MutationObserver(update);
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return <Sonner theme={theme} {...props} />;
};

export default Toaster;
