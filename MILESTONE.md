# Milestone: Flowing Lens Desktop Pet

Date: 2026-07-24

This checkpoint records the first visually convincing and operationally stable
version of the M87* Black Hole Desktop Pet.

## Included

- Transparent, frameless Electron desktop window
- Strong always-on-top behavior on Windows
- Stable free dragging without progressive scaling
- Right-click and Escape exit controls
- Original 93-frame black-hole animation accelerated to 40 ms per frame
- Custom soft SVG matte following the accretion-flow silhouette
- Preserved black event-horizon and gravitational-lens structure
- Layered star field with restrained lensing and occasional cross-glow stars
- Modular renderer, particle, state, preload, and main-process structure

## Visual intent

The current approach deliberately preserves the source GIF's black spatial
structure and fades only its outer rectangular background through a flowing,
feathered matte. This avoids destructive color-key extraction and keeps the
lower lensed image visually coherent.

## Run

```powershell
npm.cmd start
```

Git tag: `milestone-flowing-lens-v1`
