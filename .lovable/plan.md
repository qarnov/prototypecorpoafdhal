

## Plan: Replace Fake Map with Real Leaflet Map

### Dependencies to Add
- `react-leaflet` and `leaflet` (free, no API key)
- `@types/leaflet` (dev dependency)

### Changes

**1. `src/pages/MapView.tsx` — Full rewrite**
- Replace the dark div with `MapContainer` + `TileLayer` using CartoDB dark tiles
- Use `navigator.geolocation.getCurrentPosition` on mount; fallback to Bangalore (12.9716, 77.5946)
- Place `Marker` for each filtered `DUMMY_POSTS` with small random lat/lng offsets around user location
- Use `DivIcon` with emoji content for category-styled markers (avoids default icon issues)
- Keep existing filter buttons as an overlay (absolute positioned, z-index above map)
- Keep selected post popup card at bottom on marker click
- Import `leaflet/dist/leaflet.css`
- Map fills `100vh`, bottom padding for nav

**2. Fix Leaflet default icon issue**
- Use custom `DivIcon` per category with emoji, so no need to fix the broken default marker icon paths

### Technical Notes
- `MapContainer` needs explicit height (`h-screen`)
- Will use a `useEffect` + `useState` for geolocation
- Will use `useMap()` hook inside a child component to fly to user location once obtained
- Random offsets: ±0.005–0.02 degrees (~0.5–2km) seeded by post index for consistency

