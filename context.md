# DUALITY — Project Context

## What is this
A browser game built for the **Cursor Vibe Jam 2026** (vibej.am/2026).
Deadline: **May 1, 2026 @ 13:37 UTC**.
Single file: `index.html`. Everything (JS, CSS, shaders, audio) lives inside it.

## Concept
You are a quantum entity existing simultaneously in two parallel dimensions.
The dimensions are mirrored. What you do in one, you do in the other.
"Void Agents" try to capture your consciousness in both dimensions to split you apart forever.
You must reach the escape portal in both dimensions simultaneously.

## Tech stack
- **Three.js r128** via CDN (no install, no build step)
- **Web Audio API** for all sound — procedural, zero file downloads
- **GLSL shaders** for the mirror line distortion effect
- **Vanilla JS** — no frameworks
- One file: `index.html`

## Required jam elements
- Widget snippet (MUST be in <head>):
  `<script async src="https://vibej.am/2026/widget.js"></script>`
- At least 90% AI-written code
- No login, no signup, free to play
- No loading screens
- Playable on web (Vercel deployment)

## Core mechanic
Screen split into two dimensions (left = cold blue, right = warm amber).
Player controls one entity; the mirrored entity moves simultaneously.
Mirroring mode changes per level (see Difficulty Progression).
Both entities must survive and reach the portal together.

## Difficulty progression / mirror modes
1. **Mirror X** (base): reflection on vertical axis (left/right swapped)
2. **Mirror Y**: reflection on horizontal axis (up/down swapped)
3. **Mirror 180°**: both axes flipped
4. **Delayed mirror**: right entity follows left with ~0.4s delay
5. **Swap**: player controls right entity instead of left
6. **Convergence**: the two dimensions physically narrow over time

New modes are introduced gradually. Each introduction = a "wow moment".

## Visual design
- Left dimension: deep navy/midnight blue palette
- Right dimension: dark amber/burnt orange palette
- Mirror line center: GLSL shader with glass distortion + color bleed effect
- Player entity: glowing orb with particle trail
- Void Agents (enemies): angular, geometric shapes with light cone vision
- Death: both entities shatter into glass fragments, slow motion, sfx
- Ghost overlay: semi-transparent replay of the player's personal best run

## Audio (all Web Audio API, zero files)
- On load: "🎧 headphones recommended for the full experience" message
- Audio OFF by default, visible toggle always present — never a barrier to play
- Ambient: layered procedural synth that intensifies near danger
- Heartbeat: accelerates proportionally to nearest Void Agent distance
- Tension sting: when an agent spots you — sudden musical cut + near-silence
- Triumph: short orchestral sting on portal reached
- Combo voice: Web Speech API announces "DUAL... TRIPLE... PERFECT SYNC" on streaks
- Glass shatter SFX on death

## Game loop & retention mechanics
- **Roguelite streak**: each portal reached multiplies score. Dying resets streak.
  Score = base_points * streak_multiplier * level_multiplier
- **Ghost of best run**: player's personal best is stored in localStorage and
  replayed as a semi-transparent ghost every new attempt
- **Daily Challenge**: daily seed (date-based) generates same map for all players.
  One attempt per day. Score posted to global leaderboard.
- **Global leaderboard**: simple backend or localStorage fallback

## Ironic/funny messages
Displayed on death, level complete, and streak milestones.
Tone: dry, witty, slightly condescending — like a bored museum security AI.
Examples:
- Good run: "synchronization detected. we're unsettled." / "parallel selves aligned. deeply concerning."
- Bad run: "the void agents were embarrassed for you" / "both dimensions flinched simultaneously"
- Mediocre: "you survived. the definition of 'technically'" / "your ghost will do better. it always does"
- On streak: "are you two the same person? trick question." / "the multiverse is watching. unfortunately."

## Mobile support
- Single virtual joystick: appears where the player touches, drag to move
- No buttons, no dpad — one finger controls both entities
- Portrait and landscape both supported
- Layout adapts: in portrait, dimensions stack or compress

## Portals (optional jam feature — implement if time allows)
- Exit portal redirects to: https://vibej.am/portal/2026
- Sends query params: username, color, ref (current game URL)
- On receiving ?portal=true, spawn player from a start portal instantly
- No loading/input screens when receiving portal players

## Deployment
- Repo: GitHub (user has account)
- Hosting: Vercel (user has account), connected to GitHub repo
- Every push to main auto-deploys
- Final URL submitted to vibej.am/2026 before May 1 @ 13:37 UTC

## File structure
```
duality-game/
  index.html        ← entire game lives here
  CONTEXT.md        ← this file (do not deploy, for dev reference only)
```

## Development workflow
1. Claude produces code (full file or targeted diffs)
2. Developer copies into index.html in VS Code
3. Open index.html in browser to test locally
4. Git commit + push → Vercel auto-deploys
5. Test on mobile via Vercel URL

## Session continuity
If starting a new Claude chat session, paste the contents of this CONTEXT.md
as the first message to restore full project context before asking for changes.