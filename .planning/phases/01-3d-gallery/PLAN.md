# Phase 01: 3D Luxury Gallery Section

## Goal
Build a world-class, ultra-smooth **3D Gallery Section** directly beneath the **Hosted Events** section on the main page. The component will faithfully recreate the interactive visual experience demonstrated in the reference recording (`Screen Recording 2026-09-25 214847.mp4`), utilizing all 53 gallery images with custom easing, inertia drag physics, 2.5D scattered depth-of-field mode, and a 3D perspective rectangular card carousel mode.

---

## Technical Architecture & Design Specs

### 1. Asset Pipeline
- Copy all 53 images from `/gallery/` into `/public/gallery/` with URL-safe filenames/mappings so they can be loaded by Next.js static asset server with instant caching.
- Create a data module `data/galleryImages.js` containing the array of image paths and metadata for seamless layout calculations.

### 2. Dual-Mode Interactive Experience (matching reference video)

#### Mode A: Scattered 2.5D Depth Canvas ("Floating Plane")
- **Visuals**:
  - Luxury serif typography overlay: `A NEW ERA OF LUXURY` (or `A LUXURY GALLERY OF MEMORIES`).
  - Floating image cards scattered across multi-layered depth planes (Z-index, scale `0.5`–`1.1`, dynamic CSS backdrop / depth blur `filter: blur(...)` for distant cards, crisp focus for foreground cards).
  - Floating magnetic interactive badge `"DRAG"` following cursor motion with smooth spring inertia.
- **Interactions**:
  - Inertia drag & pan across the entire canvas with custom momentum easing.
  - Smooth parallax on mousemove and touch drag.
  - Click on any card or switch button to smoothly transition into **3D Perspective Deck**.

#### Mode B: 3D Rectangular Perspective Deck ("3D Cover Flow / Arc Carousel")
- **Visuals**:
  - 3D perspective viewport (`perspective: 1400px`, `transform-style: preserve-3d`).
  - Cards arranged in a 3D perspective arc with dynamic `rotateY`, `translateZ`, `translateX`, `scale`, and elevation shadows.
  - Center active card is front-facing, elevated, crisp and illuminated; side cards smoothly angle backward with depth shading and progressive opacity.
  - Top floating close pill button (`✕`) to transition smoothly back to scattered canvas.
- **Interactions**:
  - Smooth wheel / horizontal drag / keyboard arrow navigation.
  - Momentum inertia gliding using custom cubic-bezier / GSAP easing curves (`cubic-bezier(0.19, 1, 0.22, 1)` / `power3.out`).
  - Click-to-center on any card.

### 3. Custom Easing & Performance
- GPU acceleration (`transform: translate3d(...)`, `will-change: transform`).
- RequestAnimationFrame physics loop with friction / lerp dampening for 60fps / 120fps ultra-fluid movement.
- Full responsive adaptation for mobile (touch gestures, swipe velocity) and desktop (drag, mouse parallax, scroll wheel).

---

## Detailed Task Breakdown

### Task 1: Asset Preparation & Static Serving Setup
- Copy all 53 gallery images from `c:/Users/ASUS/Documents/GitHub/EP1/gallery/` into `public/gallery/`.
- Create `data/galleryImages.js` exporting the list of all images with metadata.

### Task 2: Build `Gallery3D.jsx` Component
- Implement the core React component in `components/Gallery3D.jsx` featuring:
  - State management for active mode (`scattered` vs `deck3d`), active card index, drag offsets, momentum velocity.
  - Custom easing math (cubic lerp / exponential decay) for buttery smooth drag release and track panning.
  - Mode A: Scattered multi-depth plane with `"DRAG"` magnetic follower badge and luxury serif headline.
  - Mode B: 3D Perspective Card Deck with angle-stepping, depth attenuation, active magnification, and top `✕` toggle pill.
  - Transition animations between Mode A and Mode B using Framer Motion / GSAP.

### Task 3: Styling & 3D CSS Architecture
- Add dedicated gallery styles in `app/globals.css`:
  - 3D perspective container styles (`perspective`, `preserve-3d`, `backface-visibility: hidden`).
  - Luxury typography styling, subtle glow accents, rounded corner cards, backdrop blur layers.
  - Responsive breakpoints for mobile/tablet screens.

### Task 4: Integrate into Navigation & Page Hierarchy
- Update `app/page.js` to insert `<Gallery3D />` directly beneath `<EventJourney />` (Hosted Events section).
- Update `components/Navbar.jsx` navigation items to include `GALLERY` linking smoothly to `#gallery`.
- Update scroll-spy in `app/page.js` so `#gallery` is highlighted when scrolling into view.

### Task 5: Verification & End-to-End Validation
- Verify dev server build without errors.
- Test interactive drag on both scattered canvas and 3D perspective deck.
- Verify smooth transitions, custom easing physics, mobile touch support, and responsive layouts.
