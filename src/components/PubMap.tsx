import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { loadGoogleMaps } from "@/lib/google-maps";
import { useServerFn } from "@tanstack/react-start";
import { searchNearbyPubs, type NearbyPub } from "@/lib/places.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";

const LONDON = { lat: 51.5074, lng: -0.1278 };

type RatedPub = NearbyPub & { avg: number | null; count: number };

export function PubMap() {
  const mapDiv = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const navigate = useNavigate();
  const search = useServerFn(searchNearbyPubs);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then((google) => {
        if (cancelled || !mapDiv.current) return;
        mapRef.current = new google.maps.Map(mapDiv.current, {
          center: LONDON,
          zoom: 14,
          disableDefaultUI: true,
          zoomControl: true,
          styles: warmMapStyle,
          clickableIcons: false,
        });
        setReady(true);
        runSearch();
      })
      .catch((e) => console.error(e));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runSearch() {
    if (!mapRef.current) return;
    setLoading(true);
    try {
      const center = mapRef.current.getCenter();
      const lat = center.lat();
      const lng = center.lng();
      const pubs = await search({ data: { lat, lng, radius: 1500 } });
      if (pubs.length === 0) {
        setLoading(false);
        return;
      }
      // Cache pubs
      await supabase.from("pubs").upsert(pubs, { onConflict: "place_id" });
      // Get ratings averages
      const { data: ratings } = await supabase
        .from("ratings")
        .select("place_id, score")
        .in("place_id", pubs.map((p) => p.place_id));
      const stats: Record<string, { total: number; count: number }> = {};
      ratings?.forEach((r) => {
        const s = stats[r.place_id] ?? (stats[r.place_id] = { total: 0, count: 0 });
        s.total += r.score;
        s.count += 1;
      });
      const rated: RatedPub[] = pubs.map((p) => {
        const s = stats[p.place_id];
        return {
          ...p,
          avg: s ? s.total / s.count : null,
          count: s?.count ?? 0,
        };
      });
      renderMarkers(rated);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function renderMarkers(pubs: RatedPub[]) {
    const google = (window as any).google;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    pubs.forEach((p) => {
      const marker = new google.maps.Marker({
        position: { lat: p.lat, lng: p.lng },
        map: mapRef.current,
        title: p.name,
        icon: pinIcon(p.avg),
      });
      marker.addListener("click", () => {
        navigate({ to: "/pubs/$placeId", params: { placeId: p.place_id } });
      });
      markersRef.current.push(marker);
    });
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      <div ref={mapDiv} className="absolute inset-0 bg-muted" />
      <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center">
        <Button
          onClick={runSearch}
          disabled={!ready || loading}
          variant="default"
          className="pointer-events-auto shadow-[var(--shadow-warm)] rounded-full px-6 h-11 bg-[var(--burgundy)] hover:bg-[var(--burgundy)]/90 text-primary-foreground"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span className="ml-2 font-medium">Search this area</span>
        </Button>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-card/95 backdrop-blur px-4 py-2 text-xs text-muted-foreground shadow-[var(--shadow-soft)]">
        <span className="inline-flex items-center gap-3">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[var(--burgundy)]" /> 8+</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[var(--coral)]" /> 6–8</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[var(--rose)]" /> &lt; 6</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/50" /> Unrated</span>
        </span>
      </div>
    </div>
  );
}

function pinIcon(avg: number | null) {
  let fill = "#d4a59a"; // rose-ish unrated
  if (avg !== null) {
    if (avg >= 8) fill = "#6b1f2e"; // burgundy
    else if (avg >= 6) fill = "#e87b4e"; // coral
    else fill = "#c97b8c"; // rose
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='36' height='44' viewBox='0 0 36 44'><path d='M18 0C8 0 0 7.8 0 17.4 0 30 18 44 18 44s18-14 18-26.6C36 7.8 28 0 18 0z' fill='${fill}' stroke='white' stroke-width='2'/><circle cx='18' cy='17' r='6' fill='white'/></svg>`;
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new (window as any).google.maps.Size(32, 40),
    anchor: new (window as any).google.maps.Point(16, 40),
  };
}

const warmMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#f7eee3" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6b3a3a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#fdf6ed" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#e8c7b8" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#a05a4a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#fff8ee" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#ffeed8" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#f5d6b0" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#f0e0d0" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#d8e6c0" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#d4a590" }] },
];