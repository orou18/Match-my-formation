"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import ProfileSetupStep from "@/components/dashboard/creator/setup/ProfileSetupStep";
import LegalInfoStep from "@/components/dashboard/creator/setup/LegalInfoStep";
import SetupProgress from "@/components/dashboard/creator/setup/SetupProgress";

export default function SetupCreatorPage() {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    companyName: "",
    specialization: "",
  });

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSave = () => {
    // TODO: Implement API call
    console.log("Profile saved:", profileData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Progress Indicator */}
        <SetupProgress currentStep={step} totalSteps={2} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Step 1 */}
          {step === 1 && (
            <ProfileSetupStep
              step={step}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSave={handleSave}
            />
          )}

          {/* Step 2 */}
          {step === 2 && (
            <LegalInfoStep
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}
        </div>
      </div>
    </div>
  );
}
