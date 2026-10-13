import Image from "next/image";
export default function ArtworkImage({
  src,
  alt,
  loading,
  fetchPriority,
}: {
  src?: string;
  alt: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
}) {
  if (!src) return null;
  return (
    <Image
      src={src}
      alt={alt}
      width={1122}
      height={1402}
      sizes="(max-width: 650px) 90vw, (max-width: 950px) 50vw, 640px"
      loading={loading || "lazy"}
      fetchPriority={fetchPriority}
      unoptimized={!src.startsWith("/artworks/")}
    />
  );
}
