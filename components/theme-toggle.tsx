"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface ThemeToggleProps {
  variant?: "floating" | "inline";
}

export function ThemeToggle({ variant = "inline" }: ThemeToggleProps) {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration issues
  useEffect(() => {
    setMounted(true);

    // Check for saved preference on load
    const savedTheme = localStorage.getItem("theme-preference");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  // Handle theme change
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);

    // Save preference to localStorage
    localStorage.setItem("theme-preference", newTheme);

    // Show confirmation toast
    toast({
      title: "Preference saved",
      description: `${
        newTheme === "dark" ? "Dark" : "Light"
      } theme set as preference.`,
      action: (
        <ToastAction altText="OK">
          <Check className="h-4 w-4 mr-1" /> OK
        </ToastAction>
      ),
    });
  };

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === "dark";

  // Inline variant (for header)
  if (variant === "inline") {
    return (
      <motion.button
        onClick={() => handleThemeChange(isDark ? "light" : "dark")}
        className="p-2 rounded-full bg-blue-50/80 dark:bg-slate-800/80 hover:bg-blue-100/80 dark:hover:bg-slate-700/80 flex items-center justify-center border-none shadow-sm hover:shadow-md transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isDark ? "dark" : "light"}
            initial={{ rotate: -30, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 30, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isDark ? (
              <Moon className="h-5 w-5 text-cyan-300" />
            ) : (
              <Sun className="h-5 w-5 text-cyan-600" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    );
  }

  // Floating variant (original)
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
    >
      <motion.button
        onClick={() => handleThemeChange(isDark ? "light" : "dark")}
        className="neo-button flex items-center justify-center gap-2 px-4 py-2 rounded-full border-none shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isDark ? "dark" : "light"}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center"
          >
            {isDark ? (
              <>
                <Moon className="h-4 w-4 text-cyan-300 mr-2" />
                <span className="text-sm font-medium text-cyan-300">
                  Dark Mode
                </span>
              </>
            ) : (
              <>
                <Sun className="h-4 w-4 text-cyan-600 mr-2" />
                <span className="text-sm font-medium text-cyan-600">
                  Light Mode
                </span>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}
