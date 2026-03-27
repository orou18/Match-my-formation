"use client";

import { useEffect, useState, useRef } from "react";

interface LazyLoadProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export function LazyLoad({
  children,
  threshold = 0.1,
  rootMargin = "50px",
  className = "",
}: LazyLoadProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsIntersecting(true);
          setHasLoaded(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, hasLoaded]);

  return (
    <div
      ref={elementRef}
      className={`lazy-load-container ${className}`}
      style={{
        minHeight: isIntersecting ? "auto" : "200px",
      }}
    >
      {isIntersecting ? (
        children
      ) : (
        <div className="flex items-center justify-center h-32 bg-gray-100 animate-pulse rounded">
          <div className="text-gray-400">Chargement...</div>
        </div>
      )}
    </div>
  );
}

// Hook pour le lazy loading des images
export function useLazyLoad(src: string, threshold = 0.1) {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imageRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.unobserve(imageRef);
        }
      },
      { threshold }
    );

    observer.observe(imageRef);

    return () => {
      observer.unobserve(imageRef);
    };
  }, [imageRef, src, threshold]);

  return { imageSrc, setImageRef };
}
