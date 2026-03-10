"use client";

import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";

interface PageLoaderProps {
  text?: string;
  fullScreen?: boolean;
}

export default function PageLoader({ 
  text = "Chargement...", 
  fullScreen = true 
}: PageLoaderProps) {
  const containerClass = fullScreen 
    ? "min-h-screen flex items-center justify-center bg-gray-50"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClass}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <LoadingSpinner size="lg" text={text} />
      </motion.div>
    </div>
  );
}
