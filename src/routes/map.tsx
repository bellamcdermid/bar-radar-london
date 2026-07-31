import { createFileRoute } from "@tanstack/react-router";
import { PubMap } from "@/components/PubMap";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Explore the map — Hot Or Not Pubs" },
      { name: "description", content: "Find London pubs and bars on the map and see honest crowd ratings." },
      { property: "og:title", content: "Explore the map — Hot Or Not Pubs" },
      { property: "og:description", content: "Find London pubs and bars on the map and see honest crowd ratings." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <PubMap />
      </main>
    </div>
  );
}
