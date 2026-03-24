# Hero Plasma Effect — Creative Exploration

> **Status**: Active exploration
> **Goal**: Tie the homepage plasma effect to Semantic UI's identity as a framework, not just a decorative hero graphic
> **Approach**: Experimental — prototype each idea, evaluate visually, iterate or discard

---

## Current State

The hero uses `plasma.js`, an adaptation of a demoscene plasma effect (4rknova/Shane GLSL shader). It renders via WebGL with a canvas fallback, supports mouse interaction (gravity warp + specular highlights), and fades in on load.

A radial gradient overlay in `Homepage.css` (line 86–87) creates a dark center with a brighter teal ring, giving the plasma a planetary/orb quality. The three feature cards below use negative margin to emerge from the bottom of the hero.

The plasma already accidentally embodies framework themes:
- Computed at runtime (no pre-rendered asset) → "no build step"
- Responds reactively to mouse input → signals/reactivity
- Powered by a shader language → "a new language"

The task is making these connections visible rather than coincidental.

---

## Exploration Order

| Priority | Concept | Difficulty | Reversibility |
|----------|---------|------------|---------------|
| 1 | Signal Traces | High | Easy (separate layer) |
| 2 | Markup Particles | Low | Easy (DOM layer) |
| 3 | Live Proof Annotation | Trivial | Easy (single element) |
| 4 | Crystallization | Medium | Easy (separate layer) |
| 5 | Spec Orb | Medium | Easy (separate layer) |

---

## Concept 1: Reactive Signal Traces

### The Idea

Thin, bright accent lines (1px, high brightness, short lifespan) trace along the ridges of the plasma bands — like electrical impulses traveling through a nervous system. These are *signals propagating*.

When the mouse moves, a burst of new traces radiates outward from the cursor — visualizing reactive state change. Input changes → signals fire → system responds. This is literally what the framework's reactivity model does.

### Why First

Most technically impressive. Most conceptually tight — the plasma bands *become* the reactive graph. Hardest to get right, which means the most reward if it works. The other concepts layer on top trivially; this one defines the visual language.

### Visual Character

- Traces follow the "ridges" of the plasma (local brightness maxima)
- Thin (1–2px), bright teal/white, with a fast fade tail
- Speed: fast enough to feel like electricity, slow enough to track visually
- Mouse interaction: traces radiate from cursor on movement, denser near cursor
- Density: sparse — 10-20 active traces at any time, not a swarm
- They should feel like neural impulses or circuit paths, not particle effects

### Implementation Notes

**Approach A — Second WebGL pass (ideal)**
- Render plasma to a framebuffer, sample in a second pass
- Compute gradient magnitude to find ridges (edges of color bands)
- Spawn trace particles along ridges, animate with velocity along the ridge direction
- Requires ping-pong buffers or a compute texture for particle state
- Most performant, best visual integration (traces are lit by the plasma)

**Approach B — Canvas overlay sampling (pragmatic)**
- Thin canvas layer on top of the plasma canvas
- Each frame, sample a grid of points from the plasma (via `getImageData` or by running the plasma math in JS for sample points)
- Find ridges by comparing neighboring brightness values
- Draw short animated line segments along detected ridge directions
- Simpler to prototype, may have performance concerns with `getImageData`

**Approach C — Approximated ridges (fastest to prototype)**
- Skip reading the plasma entirely
- Use the same math from the plasma shader (the `s` value computation) to analytically compute ridge positions
- The plasma's `s` function is: `s = intensity * cos(d + w) * sin(k + w)` — ridges are where `|s|` is near local maxima
- Compute partial derivatives of `s` to get ridge direction, spawn traces along them
- Could run entirely in a second canvas using the same wave parameters
- Best approach if it works — no coupling, no pixel reading, pure math

**Mouse Burst Behavior**
- On `pointermove`, spawn 2-4 trace seeds at cursor position
- Seeds find nearest ridge and begin traveling along it
- Traces have a lifespan (0.5–1.5s), fade out over final 30%
- Stationary cursor: traces still spawn but at lower rate (1/sec)
- Cursor leaves: traces continue until lifespan expires, no new spawns

### Key Risks

- Ridges might be too chaotic / move too fast to trace cleanly
- Could look noisy rather than elegant if density is wrong
- Computing ridges analytically requires matching the shader math exactly
- Performance of approach B on lower-end devices

### Prototype Steps

1. Render the plasma, manually identify what "ridges" look like at current settings
2. Implement ridge detection (approach C first — analytical)
3. Draw static ridge points as dots to verify detection
4. Animate a single trace along a ridge
5. Add spawning, lifespan, fade
6. Add mouse burst behavior
7. Tune density, speed, brightness until it feels right

---

## Concept 2: Semantic Markup Particles

### The Idea

Float actual Semantic UI syntax fragments through the plasma field — specifically the syntax that differentiates this framework:

```
<ui-button primary>        {#each item in items}
   toggle()               {counter}
<ui-icon save>             {>userCard}
   signal()               <ui-card>
```

Individual fragments, semi-transparent, monospace, drifting at different speeds and rotations. They use the plasma's teal/blue palette so they feel part of the plasma rather than overlaid. 4-8% opacity, `mix-blend-mode: screen`.

### Why It Works

Directly reinforces the headline "A New Language for UI." You're looking *into* the language. The plasma is the medium in which this language exists. Immediately communicates "this is about code" without being heavy-handed.

### Visual Character

- Monospace font (system UI mono or JetBrains Mono if loaded)
- Teal/cyan tinted, matching the plasma's specular highlight color
- Very low opacity (4-8%), `mix-blend-mode: screen` or `overlay`
- Varying sizes (12-18px) suggesting depth / distance
- Slow drift (30-90s to cross the viewport), slight rotation (-5 to 5deg)
- 8-15 fragments visible at any time
- Fragments enter from edges, exit opposite side, recycle

### Fragment Content

Use syntax that is distinctly Semantic UI and reads naturally:

```javascript
const fragments = [
  '<ui-button primary>',
  '<ui-icon save>',
  '{#each item in items}',
  '{counter}',
  'toggle()',
  '<ui-card>',
  '{>userCard}',
  'signal(initialValue)',
  '<ui-buttons large>',
  '{#if isActive}',
  'state.items.push()',
  '<ui-input>',
  'increment()',
  '{getDisplayName}',
  '<ui-menu vertical>',
];
```

### Implementation Notes

- Pure DOM layer — `<div>` container with `pointer-events: none` over the canvas
- Each fragment is a `<span>` with CSS keyframe animation (translateX + translateY + slight rotate)
- Stagger start times with `animation-delay`
- Use `will-change: transform` for GPU compositing
- Recycle fragments when they exit viewport (reset position, pick new content)
- Could also use a single canvas for all text if DOM count is a concern, but 15 spans is trivial

### Interaction with Signal Traces

If concept 1 works, the markup fragments could occasionally "spark" when a signal trace passes near them — a brief brightness pulse. This would connect the two layers: the language generates signals, signals animate the system.

---

## Concept 3: Live Proof Annotation

### The Idea

A small, tasteful annotation in the hero that reframes the plasma from decoration to demonstration:

```
rendered live · webgl · 60fps
```

Or more pointed:

```
no build step — rendered in your browser
```

The plasma IS computed at runtime without pre-rendering — just like Semantic UI templates compile to an AST at runtime in the browser. The annotation makes this connection explicit.

### Visual Character

- 9-10px, monospace
- 15-25% opacity, white or teal-tinted
- Bottom-right or bottom-left of the hero area
- No background, no border — just text
- Could show live data: actual fps, renderer type, resolution

### Implementation Notes

- Single DOM element, absolutely positioned
- Could pull live data from the plasma instance (`plasma.renderer`, fps if enabled)
- Example: `live · webgl · display-p3 · 1920×960`
- The fps overlay system already exists in plasma.js — this would be a minimal, always-on version

### Variants

**Minimal**: Static text, no live data
```
computed at runtime
```

**Technical**: Live renderer info
```
webgl · display-p3 · 60fps
```

**Conceptual**: Ties to framework message
```
no build step — this is running live
```

**Interactive**: Updates on hover to show mouse coords (matching the fps overlay format)

---

## Concept 4: Progressive Enhancement Crystallization

### The Idea

Small geometric shapes — rectangle (button), rounded rect (card), circle (icon), line (input) — drift inward from the plasma's edges, gradually gaining definition as they approach the center orb. Near the edges they're vague glowing shapes; near the center they have crisp borders and recognizable silhouettes.

The message: raw HTML enters → the framework enhances it → structured UI emerges. The plasma is the transformation medium.

### Visual Character

- Simple geometric primitives only — no rendered components, just shapes
- Outer zone: blurred, low opacity (2-5%), large, soft glow
- Inner zone: sharper, slightly higher opacity (8-12%), smaller, crisp edges
- Shapes dissolve before reaching the text area (don't compete with headline)
- Very slow inward drift (60-120s radial journey)
- 5-10 shapes visible at various stages of crystallization

### Implementation Notes

- SVG overlay with shapes on radial paths
- Blur and opacity as functions of distance from center: `blur = maxBlur * (dist / maxDist)`, `opacity = maxOpacity * (1 - dist / maxDist)`
- CSS `filter: blur()` per element, or SVG `feGaussianBlur`
- Shapes spawn at random angles on the outer ring, move inward, fade at inner threshold
- Could use CSS animations entirely (radial motion via `offset-path` or manual keyframes)

### Key Risks

- Could feel like a generic particle effect rather than communicating "UI components"
- Shapes need to be recognizable enough to read as "button," "card," etc.
- Must not compete with the text or feel cluttered

---

## Concept 5: The Spec Orb

### The Idea

The radial gradient already creates a planetary body. The orb is the *specification* — the nucleus from which all components emerge. Faint, structured text (resembling a component spec) wraps around the surface, barely legible. Moving the mouse modulates which part is slightly more visible.

### Visual Character

- Text follows curved/circular paths around the orb center
- Extremely low opacity (2-4%) — subliminal rather than readable
- Content resembles spec structure: attribute names, type annotations, description fragments
- Warps/distorts with the plasma underneath
- Mouse proximity slightly increases local brightness

### Implementation Notes

- SVG with `<textPath>` elements on circular `<path>` elements
- Multiple concentric rings of text at different radii
- Opacity modulated by a radial gradient mask
- Mouse interaction: JS updates a CSS custom property for mouse position, used in a radial gradient mask that brightens the area near the cursor
- Could also be a canvas with text drawn on arcs, composited with `globalCompositeOperation`

### Key Risks

- Most abstract concept — may not read as anything meaningful
- Thin line between "intriguing subliminal texture" and "unreadable noise"
- Text at low opacity on a dark, moving background may just look like artifacts
- Hardest to evaluate without seeing it

---

## Combination Strategy

These concepts are layered and mostly independent. The planned approach:

1. **Prototype concept 1 (signal traces)** — this is the foundation layer. If it works, it defines the visual vocabulary for everything else.
2. **Add concept 2 (markup particles)** — complements traces. If traces don't work, this stands alone.
3. **Add concept 3 (annotation)** — trivial to add regardless of what else works.
4. **Evaluate** — at this point we have enough to judge the direction. Concepts 4 and 5 may be unnecessary if 1+2+3 work well together.

The goal is not to use all five. It's to find the 1-2 that make the plasma feel like *Semantic UI's* hero rather than a generic demoscene effect.

---

## Technical Constraints

- All additions must be separate layers (canvas/SVG/DOM) — plasma.js modifications only as a last resort
- Must not degrade plasma performance (maintain 60fps on mid-range hardware)
- Must respect `prefers-reduced-motion` (static or disabled state)
- Must work with both WebGL and canvas fallback renderers
- Mobile: particles/traces should be reduced or disabled (already no mouse interaction)
- The plasma's existing `time`, `mouseX`, `mouseY` values are useful for syncing additional layers
