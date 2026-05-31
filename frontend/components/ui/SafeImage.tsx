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

  const handleError = () => {
    setImageError(true);
    setUseFallback(true);
    if (onError) onError();
  };

  const isStringSrc = typeof src === "string";
  
  const isExternalForbidden = isStringSrc && (
    src.includes("img.youtube.com") ||
    src.includes("youtube.com") ||
    src.includes("commondatastorage.googleapis.com") ||
    src.includes("images.unsplash.com") ||
    src.includes("images.pexels.com") ||
    src.includes("cdn.pixabay.com") ||
    src.includes("storage.googleapis.com")
  );

  const isLocalMissing = isStringSrc && (
    src.includes("/videos/video") ||
    src.includes("/matchmyformation_footer.png")
  );

  const forceNative = isExternalForbidden || isLocalMissing || useFallback || imageError;

  // RENDU BLINDÉ : Si c'est une image externe ou suspecte, on retourne le JSX immédiatement
  // pour couper court à toute exécution ou vérification de Next.js dans ce scope.
  if (forceNative) {
    return (
      <img
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={className}
        style={
          fill
            ? { ...style, width: "100%", height: "100%", objectFit: "cover" }
            : style
        }
        loading={loading}
        onError={handleError}
        onLoad={onLoad}
      />
    );
  }

  // On englobe l'appel Next.js dans un composant local isolé pour empêcher le compilateur
  // d'évaluer la prop problématique en amont.
  return (
    <SafeNextImage
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
      handleError={handleError}
      onLoad={onLoad}
    />
  );
}

// Composant interne purement Next.js, appelé uniquement si l'image est 100% locale et sûre
function SafeNextImage({ src, handleError, ...props }: any) {
  return (
    <Image
      src={src}
      {...props}
      onError={handleError}
    />
  );
}