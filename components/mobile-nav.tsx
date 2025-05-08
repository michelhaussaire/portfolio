"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: "0%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const linkVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 lg:hidden"
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={menuVariants}
    >
      <div className="absolute inset-0 backdrop-blur-md bg-white/70 dark:bg-slate-900/70"></div>
      <div className="absolute top-0 right-0 bottom-0 w-full max-w-xs neo-card border-none">
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="text-xl font-bold text-cyan-600 dark:text-cyan-300 neon-text">
              Michel Haussaire
            </div>
            <button
              onClick={onClose}
              className="text-cyan-700 dark:text-cyan-300 p-2 rounded-full hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-col space-y-5">
            {[
              { name: "Home", href: "#" },
              { name: "About", href: "#about" },
              { name: "Skills", href: "#skills" },
              { name: "Projects", href: "#projects" },
              { name: "Contact", href: "#contact" },
            ].map((item, index) => (
              <motion.div key={item.name} variants={linkVariants}>
                <Link
                  href={item.href}
                  className="flex items-center py-2 text-xl font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
                  onClick={onClose}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="mt-8 bg-slate-100/50 dark:bg-slate-800/30 rounded-xl p-4">
            <motion.div
              variants={linkVariants}
              className="flex items-center justify-between"
            >
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Theme
              </span>
              <ThemeToggle />
            </motion.div>
          </div>

          <div className="mt-auto pt-8">
            <motion.div
              variants={linkVariants}
              className="text-sm text-slate-500 dark:text-slate-400"
            >
              © {new Date().getFullYear()} Michel Haussaire
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
