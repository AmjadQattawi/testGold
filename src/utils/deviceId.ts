const STORAGE_KEY = "testGold.deviceId";
let cachedDeviceId: string | undefined;

/** Persistent browser installation ID; not a hardware serial or fingerprint. */
export function getDeviceId(): string {
  if (cachedDeviceId) return cachedDeviceId;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && /^[a-f0-9]{32}$/.test(saved)) {
      cachedDeviceId = saved;
      return saved;
    }
  } catch {
    /* Storage may be unavailable in private or restricted browsers. */
  }
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  cachedDeviceId = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  try {
    localStorage.setItem(STORAGE_KEY, cachedDeviceId);
  } catch {
    /* Keep the identifier stable in memory for this page session. */
  }
  return cachedDeviceId;
}
