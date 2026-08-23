/**
 * Cesium singleton loader.
 *
 * Loads Cesium.js from CDN exactly once per browser session regardless of
 * how many times the map page mounts/unmounts. Subsequent calls return the
 * cached promise — no duplicate <script> injection, no extra network round-trip.
 *
 * Also centralises the Ion token validation so the check logic is in one place.
 */

const CDN_BASE = "https://unpkg.com/cesium@1.122.0/Build/Cesium";

let _loadPromise: Promise<Record<string, any>> | null = null;

export function getCesiumCDNBase() {
  return CDN_BASE;
}

/** Returns true only if the env var looks like a real Cesium Ion token */
export function hasCesiumToken(): boolean {
  const token = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;
  return (
    !!token &&
    token.length > 20 &&
    !token.startsWith("your-") &&
    token !== "REPLACE_ME"
  );
}

/**
 * Loads Cesium from CDN (or returns the cached global).
 * Safe to call concurrently — all callers share the same promise.
 */
export function loadCesium(): Promise<Record<string, any>> {
  // Already on window (page already loaded it)
  if (typeof window !== "undefined" && (window as any).Cesium) {
    return Promise.resolve((window as any).Cesium);
  }

  // Return existing in-flight promise
  if (_loadPromise) return _loadPromise;

  _loadPromise = new Promise<Record<string, any>>((resolve, reject) => {
    // Set CESIUM_BASE_URL before script loads
    (window as any).CESIUM_BASE_URL = CDN_BASE;

    // Inject CSS once
    if (!document.querySelector("link[data-cesium-css]")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `${CDN_BASE}/Widgets/widgets.css`;
      link.dataset.cesiumCss = "1";
      document.head.appendChild(link);
    }

    // Inject script once
    const existing = document.querySelector(`script[data-cesium-js]`);
    if (existing) {
      // Script already injected — wait for window.Cesium to appear
      const poll = setInterval(() => {
        if ((window as any).Cesium) {
          clearInterval(poll);
          resolve((window as any).Cesium);
        }
      }, 50);
      return;
    }

    const script = document.createElement("script");
    script.src = `${CDN_BASE}/Cesium.js`;
    script.dataset.cesiumJs = "1";
    script.onload = () => resolve((window as any).Cesium);
    script.onerror = () => {
      _loadPromise = null; // allow retry
      reject(new Error("Failed to load Cesium from CDN. Check your internet connection."));
    };
    document.head.appendChild(script);
  });

  return _loadPromise;
}
