# SONYC-UST DataViz — Tabletop Pawn Tracker

An interactive two-player installation that combines real-time computer vision pawn tracking with NYC urban noise data visualization. Players move colored physical objects on a camera-monitored grid, racing from start to finish while the board reveals noise sensor data from the SONYC-UST (Sounds of New York City) project.

---

## What It Does

Two players place colored physical pawns (e.g. colored cups, discs) on a tabletop grid viewed by a webcam. The camera detects each pawn's position using HSV color blob detection. The game board is projected overhead showing noise data for each cell — but only revealing a cell's color after a pawn steps on it. Players score points by dwelling in cells, and the player with the **lower** score at the finish wins.

---

## File Structure

```
sonyc-dataviz/
├── index.html          # Full application (camera + game logic + projection)
├── config.js           # Grid dimensions + noise type configuration
├── utils.js            # Time-of-day helper (MORNING / AFTERNOON / EVENING / NIGHT)
├── mockData.json       # Mock noise sensor readings by date and time-of-day
├── mock_noise_grid.csv # Optional fallback noise grid (CSV format)
└── sounds/             # WAV files for each noise type (see below)
    ├── dog.wav
    ├── car.wav
    ├── traffic.wav
    ├── siren.wav
    ├── construction.wav
    ├── drilling.wav
    ├── crowd.wav
    ├── children.wav
    ├── music.wav
    ├── wind.wav
    ├── hvac.wav
    ├── bird.wav
    ├── birds.wav
    └── truck.wav
```

---

## Setup

### Requirements

- A modern browser with camera access (Chrome or Safari recommended)
- Must be served over HTTP/HTTPS — camera requires a secure context
- A webcam pointing at the play surface from above
- Two distinctly colored physical pawns (e.g. red and blue cups)

### Running

```bash
# Any static file server works, e.g.:
python3 -m http.server 8000
# Then open http://localhost:8000/index.html
```

Grant camera permission when prompted.

---

## Game Setup

1. **Open the page.** The camera view appears overlaid with a grid and controls.
2. **Position the grid.** Drag the blue corner handles to align the overlay grid with your physical play surface.
3. **Position the timeline bar.** Drag the orange corner handles to position the timeline scrub bar separately.
4. **Add a second pawn.** Click `+ PAWN` and select a second color (e.g. Blue).
5. **Tune HSV if needed.** Click `HSV TUNE` and adjust hue/saturation/value sliders until the blob detector reliably finds your pawn color.
6. **Pick a date.** Slide the purple timeline pawn along the timeline bar (or use the slider in the bottom UI panel). The board data changes by date.
7. **Start.** Both players place their pawns on the **top-left cell** (START). The game begins automatically.

---

## Game Rules

|            |                                              |
| ---------- | -------------------------------------------- |
| **Grid**   | 12 columns × 8 rows                          |
| **Start**  | Top-left cell (0,0)                          |
| **Finish** | Bottom-right cell (11,7)                     |
| **Score**  | +1 point per cell you dwell in for ≥1 second |
| **Winner** | Player with the **lower** score at finish    |
| **Tie**    | Equal scores = tie                           |

- The board only reveals cell colors after a pawn visits them
- Cells show a blended color of all noise types detected there (weighted by dB level)
- A dwell glow pulses around the pawn while it is earning a point
- The date slider is **locked** once the game starts and **unlocked** when the game ends
- Slide to a new date after the game to reset and restart

---

## Noise Data

Cell colors are computed by blending the colors of all noise types present, weighted by their dB reading:

| Type                    | Color        | Sound file                              |
| ----------------------- | ------------ | --------------------------------------- |
| Dog                     | `#FF6B35` 🐕 | `sounds/dog.wav`                        |
| Car / Traffic           | `#4285F4` 🚗 | `sounds/car.wav` / `sounds/traffic.wav` |
| Siren                   | `#F72585` 🚨 | `sounds/siren.wav`                      |
| Construction / Drilling | `#DB4437` 🔨 | `sounds/construction.wav`               |
| Crowd                   | `#FFD93D` 👥 | `sounds/crowd.wav`                      |
| Children                | `#FBBF24` 🧒 | `sounds/children.wav`                   |
| Music                   | `#A78BFA` ♪  | `sounds/music.wav`                      |
| Wind                    | `#6BCB77` 🌬 | `sounds/wind.wav`                       |
| HVAC                    | `#4D96FF` ❄  | `sounds/hvac.wav`                       |
| Bird / Birds            | `#0F9B58` 🐦 | `sounds/bird.wav`                       |
| Truck                   | `#F4845F` 🚛 | `sounds/truck.wav`                      |

When a pawn dwells in a cell, all associated sound files play sequentially (staggered 120ms). Volume scales with dB level.

---

## Controls

| Key | Action                                  |
| --- | --------------------------------------- |
| `M` | Toggle camera overlay / projection view |
| `F` | Fullscreen                              |

### Top Bar

- **+ PAWN** — Add a tracked pawn color
- **HSV TUNE** — Adjust color detection thresholds for the selected pawn
- **TIMELINE: [COLOR]** — Change which pawn color controls the date slider

---

## Data Format

### `mockData.json`

```json
{
  "MMDDYYYY": {
    "morning": {
      "col,row": [{ "sound": "traffic", "dB": 72 }]
    },
    "afternoon": { ... },
    "evening": { ... }
  }
}
```

Time-of-day is determined automatically from the current system clock. To add more dates or noise readings, extend `mockData.json` following the same structure.

### `config.js`

Change grid size here:

```js
const COLS = 12;
const ROWS = 8;
```

Add new noise types by adding entries to `NOISE_CONFIG`:

```js
const NOISE_CONFIG = {
  myType: { color: '#aabbcc', icon: '🔔', label: 'My Type', sound: 'sounds/mytype.wav' },
  ...
};
```

---

## Technical Notes

### Blob Detection

Each frame the camera image is scaled to 35% for performance, then:

1. Every pixel is tested against the pawn's HSV range
2. The binary mask is closed with 3× morphological dilation + 3× erosion to merge fragmented regions
3. Flood-fill finds connected components
4. Blobs are filtered by radius range, circularity (> 0.35), and aspect ratio (< 2.5)
5. Position is smoothed with an exponential moving average (`α = 0.35`) to reduce jitter

### Coordinate System

The camera output is horizontally flipped by CSS (`scaleX(-1)`) so the physical left appears as left on screen. Internal canvas coordinates are in raw camera space; flip transforms are applied manually where needed.

### Slider Dwell Lock

When the timeline pawn is stationary in the bar for 1 second, a glowing animation plays on the date label. When the animation ends, the date commits and the board redraws with new data.
