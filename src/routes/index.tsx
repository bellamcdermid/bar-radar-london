import { createFileRoute } from "@tanstack/react-router";
import { PubMap } from "@/components/PubMap";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hot Or Not Pubs — Rate London's bars by who's there" },
      { name: "description", content: "A crowdsourced map of London pubs and bars, scored by how attractive the men are — filterable by day of the week." },
      { property: "og:title", content: "Hot Or Not Pubs" },
      { property: "og:description", content: "Find London's flirtiest pubs. Honest ratings, by night." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <PubMap />
      </main>
    </div>
  );
}
