"use client";

import Image from "next/image";
import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  style?: React.CSSProperties;
  onError?: () => void;
  onLoad?: () => void;
}

export default function SafeImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  sizes,
  loading = "lazy",
  priority = false,
  quality = 75,
  placeholder = "empty",
  blurDataURL,
  style,
  onError,
  onLoad,
}: SafeImageProps) {
  const [useFallback, setUseFallback] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Liste des domaines externes qui causent des problèmes avec next/image
  const externalDomains = [
    "commondatastorage.googleapis.com",
    "images.unsplash.com",
    "images.pexels.com",
    "cdn.pixabay.com",
    "storage.googleapis.com",
  ];

  // Vérifier si l'URL provient d'un domaine externe
  const isExternal = externalDomains.some(domain => 
    typeof src === 'string' && src.includes(domain)
  );

  // Vérifier si l'image est une URL locale qui n'existe pas
  const isLocalMissing = typeof src === 'string' && 
    (src.includes('/videos/video') || src.includes('/matchmyformation_footer.png'));

  // Utiliser le fallback si nécessaire
  const shouldUseFallback = useFallback || imageError || isExternal || isLocalMissing;

  const handleError = () => {
    setImageError(true);
    if (onError) onError();
  };

  // Si fallback nécessaire, utiliser img natif
  if (shouldUseFallback) {
    if (fill) {
      return (
        <img
          src={src}
          alt={alt}
          className={className}
          style={{
            ...style,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          loading={loading}
          onError={handleError}
          onLoad={onLoad}
        />
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
        loading={loading}
        onError={handleError}
        onLoad={onLoad}
      />
    );
  }

  // Sinon, utiliser next/image optimisé
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      sizes={sizes}
      loading={loading}
      priority={priority}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      style={style}
      onError={() => {
        setUseFallback(true);
        if (onError) onError();
      }}
      onLoad={onLoad}
    />
  );
}
