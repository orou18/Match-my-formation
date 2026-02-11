import React from "react";
import HeroSection from "@/components/landing/HeroSection";
import FeaturedCourses from "@/components/landing/FeaturedCourses";
import PartnersSection from "@/components/landing/PartnersSection";
import WhyUs from "@/components/landing/WhyUs";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import FAQSection from "@/components/landing/FAQSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCourses />
      <PartnersSection />
      <WhyUs />
      <HowItWorks />
      <Testimonials />
      <FAQSection />
    </>
  );
}
