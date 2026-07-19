import { createServerFn } from "@tanstack/react-start";

export type NearbyPub = {
  place_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

const GATEWAY = "https://connector-gateway.lovable.dev/google_maps";

const EXCLUDE_NAME_PATTERNS = [
  /hotel/i,
  /hostel/i,
  /inn\b/i,
  /lodge/i,
  /resort/i,
  /members'? club/i,
  /private club/i,
  /soho house/i,
  /annabel'?s/i,
  /5 hertford/i,
  /mark'?s club/i,
  /george club/i,
  /oswald'?s/i,
  /loulou'?s/i,
  /home house/i,
  /the arts club/i,
  /the ned/i,
  /the conduit/i,
  /the h club/i,
  /the curtain/i,
  /the century club/i,
  /the hospital club/i,
  /groucho club/i,
  /blacks club/i,
  /devonshire club/i,
  /pall mall/i,
];

function isExcluded(name: string, address: string): boolean {
  const hay = `${name} ${address}`;
  return EXCLUDE_NAME_PATTERNS.some((r) => r.test(hay));
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
        "places.id,places.displayName,places.formattedAddress,places.location",
    };

    let res: Response;
    if (data.query) {
      res = await fetch(`${GATEWAY}/places/v1/places:searchText`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          textQuery: `${data.query} pub bar London`,
          includedType: "bar",
          excludedTypes: ["restaurant", "hotel", "lodging"],
          maxResultCount: 20,
          locationBias: {
            circle: {
              center: { latitude: data.lat, longitude: data.lng },
              radius: data.radius,
            },
          },
        }),
      });
    } else {
      res = await fetch(`${GATEWAY}/places/v1/places:searchNearby`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          includedTypes: ["bar", "pub", "night_club"],
          excludedTypes: ["restaurant", "hotel", "lodging"],
          maxResultCount: 20,
          locationRestriction: {
            circle: {
              center: { latitude: data.lat, longitude: data.lng },
              radius: data.radius,
            },
          },
        }),
      });
    }

    if (!res.ok) {
      const body = await res.text();
      console.error("Places API error", res.status, body);
      throw new Error(`Places search failed: ${res.status}`);
    }

    const json = (await res.json()) as {
      places?: Array<{
        id: string;
        displayName?: { text?: string };
        formattedAddress?: string;
        location?: { latitude: number; longitude: number };
      }>;
    };

    return (json.places ?? [])
      .filter((p) => p.id && p.location)
      .map((p) => ({
        place_id: p.id,
        name: p.displayName?.text ?? "Unnamed",
        address: p.formattedAddress ?? "",
        lat: p.location!.latitude,
        lng: p.location!.longitude,
      }))
      .filter((p) => !isExcluded(p.name, p.address));
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