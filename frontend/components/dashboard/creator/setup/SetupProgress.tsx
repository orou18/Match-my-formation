"use client";

import { motion } from "framer-motion";

interface SetupProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function SetupProgress({
  currentStep,
  totalSteps,
}: SetupProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-center gap-4">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;

          return (
            <div
              key={stepNumber}
              className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-primary text-white scale-110"
                  : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              {isCompleted ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010-1.414l-8 8a1 1 0 01-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 00-1.414 1.414L10 12.586l8.293 8.293a1 1 0 001.414 1.414L12.586 10l1.293-1.293a1 1 0 001.414-1.414L10 7.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                stepNumber
              )}
            </div>
          );
        })}
        <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{
              width: `${(currentStep / totalSteps) * 100}%`,
            }}
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
          />
        </div>
      </div>

      {/* Step Labels */}
      <div className="flex justify-between mt-4 text-sm text-gray-600">
        <span className={currentStep >= 1 ? "text-primary font-medium" : ""}>
          Informations du profil
        </span>
        <span className={currentStep >= 2 ? "text-primary font-medium" : ""}>
          Informations légales
        </span>
      </div>
    </motion.div>
  );
}
