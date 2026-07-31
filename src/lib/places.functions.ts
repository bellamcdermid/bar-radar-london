import { createServerFn } from "@tanstack/react-start";

export type NearbyPub = {
  place_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

const GATEWAY = "https://connector-gateway.lovable.dev/google_maps";

// Only match the venue NAME (never the address — "Pall Mall" or "Hotel Street"
// in an address is not a reason to drop a genuine pub). Patterns are anchored
// tightly so classic pubs like "The Spaniards Inn" survive.
const EXCLUDE_NAME_PATTERNS = [
  /\bhotel\b/i,
  /\bhostel\b/i,
  /\bresort\b/i,
  /members'? club\b/i,
  /\bprivate club\b/i,
  /soho house/i,
  /annabel'?s/i,
  /5 hertford/i,
  /mark'?s club/i,
  /oswald'?s/i,
  /loulou'?s/i,
  /home house/i,
  /the arts club/i,
  /^the ned$/i,
  /the conduit/i,
  /groucho/i,
  /blacks club/i,
  /devonshire club/i,
];

// Place types that mean "this is lodging, not a bar".
const LODGING_TYPES = new Set(["hotel", "lodging", "motel", "resort_hotel", "extended_stay_hotel", "bed_and_breakfast", "guest_house", "inn", "hostel"]);
// A venue is only kept if it actually is a drinking venue.
const DRINK_TYPES = new Set(["bar", "pub", "wine_bar", "night_club", "bar_and_grill"]);

function isExcluded(name: string, types: string[], primaryType?: string): boolean {
  if (EXCLUDE_NAME_PATTERNS.some((r) => r.test(name))) return true;
  if (primaryType && LODGING_TYPES.has(primaryType)) return true;
  // Drop lodging unless it also registers as a drinking venue (pub-with-rooms).
  const hasLodging = types.some((t) => LODGING_TYPES.has(t));
  const hasDrink = types.some((t) => DRINK_TYPES.has(t));
  if (hasLodging && !hasDrink) return true;
  return false;
}

export const searchNearbyPubs = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { lat: number; lng: number; radius?: number; query?: string }) => {
      if (typeof data.lat !== "number" || typeof data.lng !== "number") {
        throw new Error("lat and lng required");
      }
      return {
        lat: data.lat,
        lng: data.lng,
        radius: Math.min(Math.max(data.radius ?? 1500, 200), 5000),
        query: (data.query ?? "").slice(0, 100),
      };
    },
  )
  .handler(async ({ data }): Promise<NearbyPub[]> => {
    const lovableKey = process.env.LOVABLE_API_KEY;
    const connectionKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!lovableKey || !connectionKey) {
      throw new Error("Google Maps connector not configured");
    }

    const headers = {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": connectionKey,
      "Content-Type": "application/json",
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.location,places.types,places.primaryType",
    };

    type RawPlace = {
      id: string;
      displayName?: { text?: string };
      formattedAddress?: string;
      location?: { latitude: number; longitude: number };
      types?: string[];
      primaryType?: string;
    };

    async function call(path: string, body: unknown): Promise<RawPlace[]> {
      const res = await fetch(`${GATEWAY}${path}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        console.error("Places API error", path, res.status, await res.text());
        return [];
      }
      const json = (await res.json()) as { places?: RawPlace[] };
      return json.places ?? [];
    }

    let raw: RawPlace[];
    if (data.query) {
      raw = await call("/places/v1/places:searchText", {
        textQuery: `${data.query} pub bar London`,
        maxResultCount: 20,
        locationBias: {
          circle: {
            center: { latitude: data.lat, longitude: data.lng },
            radius: data.radius,
          },
        },
      });
    } else {
      // Nearby search caps at 20 results PER request, so a single call misses
      // most venues in dense areas. Run one request per type group (ranked by
      // distance) and merge, which gives far better coverage.
      const groups = [
        ["pub"],
        ["bar"],
        ["wine_bar", "bar_and_grill"],
        ["night_club"],
      ];
      const results = await Promise.all(
        groups.map((includedTypes) =>
          call("/places/v1/places:searchNearby", {
            includedTypes,
            maxResultCount: 20,
            rankPreference: "DISTANCE",
            locationRestriction: {
              circle: {
                center: { latitude: data.lat, longitude: data.lng },
                radius: data.radius,
              },
            },
          }),
        ),
      );
      raw = results.flat();
    }

    const seen = new Set<string>();
    return raw
      .filter((p) => p.id && p.location)
      .filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)))
      .filter((p) => !isExcluded(p.displayName?.text ?? "", p.types ?? [], p.primaryType))
      .map((p) => ({
        place_id: p.id,
        name: p.displayName?.text ?? "Unnamed",
        address: p.formattedAddress ?? "",
        lat: p.location!.latitude,
        lng: p.location!.longitude,
      }));
  });

export const fetchPlaceDetails = createServerFn({ method: "POST" })
  .inputValidator((data: { placeId: string }) => {
    if (!data.placeId || typeof data.placeId !== "string") {
      throw new Error("placeId required");
    }
    return { placeId: data.placeId.slice(0, 200) };
  })
  .handler(async ({ data }): Promise<NearbyPub> => {
    const lovableKey = process.env.LOVABLE_API_KEY;
    const connectionKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!lovableKey || !connectionKey) {
      throw new Error("Google Maps connector not configured");
    }
    const res = await fetch(
      `${GATEWAY}/places/v1/places/${encodeURIComponent(data.placeId)}`,
      {
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": connectionKey,
          "X-Goog-FieldMask": "id,displayName,formattedAddress,location",
        },
      },
    );
    if (!res.ok) {
      const body = await res.text();
      console.error("Place details error", res.status, body);
      throw new Error(`Place details failed: ${res.status}`);
    }
    const p = (await res.json()) as {
      id: string;
      displayName?: { text?: string };
      formattedAddress?: string;
      location?: { latitude: number; longitude: number };
    };
    if (!p.location) throw new Error("Place has no location");
    return {
      place_id: p.id,
      name: p.displayName?.text ?? "Unnamed",
      address: p.formattedAddress ?? "",
      lat: p.location.latitude,
      lng: p.location.longitude,
    };
  });