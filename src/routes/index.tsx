import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { BestSellers } from "@/components/home/BestSellers";
import { CollectionShowcase } from "@/components/home/CollectionShowcase";
import { BrandStory } from "@/components/home/BrandStory";
import { Reviews } from "@/components/home/Reviews";
import { InstagramGallery } from "@/components/home/InstagramGallery";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dharmik — Wear Your Dharma | Premium Sanatan Streetwear" },
      { name: "description", content: "Modern streetwear inspired by Sanatan heritage. Hand-illustrated tees, hoodies, jackets and wall art celebrating Mahadev, Krishna, Ram, Hanuman and Sanskrit culture." },
      { property: "og:title", content: "Dharmik — Wear Your Dharma" },
      { property: "og:description", content: "Modern premium streetwear inspired by Sanatan heritage." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <BestSellers />
      <CollectionShowcase />
      <BrandStory />
      <Reviews />
      <InstagramGallery />
    </>
  );
}
