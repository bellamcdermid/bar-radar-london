const KEY = "honp_viewed_pubs_v1";
const LIMIT = 3;

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export function recordView(placeId: string) {
  const ids = read();
  if (!ids.includes(placeId)) {
    ids.push(placeId);
    write(ids);
  }
}

export function viewedCount() {
  return read().length;
}

export function isOverFreeLimit(placeId: string) {
  const ids = read();
  const set = new Set(ids);
  set.add(placeId);
  return set.size > LIMIT;
}

export const FREE_VIEW_LIMIT = LIMIT;