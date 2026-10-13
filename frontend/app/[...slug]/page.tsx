import GalleryApp from "../../components/GalleryApp";
import { notFound } from "next/navigation";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  if (
    slug.length !== 1 ||
    !["gallery", "artists", "mypage", "login", "studio", "space"].includes(slug[0])
  )
    notFound();
  return <GalleryApp />;
}
