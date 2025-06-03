import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Helper function to handle image paths with basePath for GitHub Pages
 * @param imagePath - The image path relative to the public directory
 * @returns The full image path including basePath when in production
 */
export function getImageSrc(imagePath: string): string {
  const basePath = process.env.NODE_ENV === "production" ? "/portfolio-v2" : "";
  return `${basePath}${
    imagePath.startsWith("/") ? imagePath : `/${imagePath}`
  }`;
}
