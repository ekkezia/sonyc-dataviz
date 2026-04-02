// noiseColors.js — Noise type display configuration
// Each noise type has a unique color, emoji icon, and label.
// Add new types here and they will be picked up automatically.
// config.js — Grid configuration
const COLS = 7;
const ROWS = 5;

const NOISE_CONFIG = {
  // ── Sounds present in data.json ─────────────────────────────────
  // icon values are Material Symbols Outlined ligature names
  alert_signal:         { color: '#F72585', icon: 'crisis_alert',       label: 'Alert Signal',         sound: 'sounds/siren.wav'        },
  dog:                  { color: '#FF6B35', icon: 'pets',               label: 'Dog',                  sound: 'sounds/dog.wav'          },
  engine:               { color: '#4285F4', icon: 'directions_car',     label: 'Engine',               sound: 'sounds/car.wav'          },
  human_voice:          { color: '#FFD93D', icon: 'record_voice_over',  label: 'Human Voice',          sound: 'sounds/crowd.wav'        },
  machinery_impact:     { color: '#DB4437', icon: 'construction',       label: 'Machinery Impact',     sound: 'sounds/drilling.wav'     },
  music:                { color: '#A78BFA', icon: 'music_note',         label: 'Music',                sound: 'sounds/music.wav'        },
  non_machinery_impact: { color: '#F4845F', icon: 'bolt',              label: 'Non-Machinery Impact', sound: 'sounds/construction.wav' },
  powered_saw:          { color: '#DB4437', icon: 'handyman',           label: 'Powered Saw',          sound: 'sounds/drilling.wav'     },
};

// Legacy helpers kept for any existing callers
const NOISE_COLORS = Object.fromEntries(
  Object.entries(NOISE_CONFIG).map(([k, v]) => [k, v.color])
);

function getNoiseColor(type) {
  if (NOISE_CONFIG[type]) return NOISE_CONFIG[type].color;
  // Generate a stable random color for unknown types
  let hash = 0;
  for (let i = 0; i < type.length; i++) hash = type.charCodeAt(i) + ((hash << 5) - hash);
  const c = (hash & 0x00ffffff).toString(16).padStart(6, '0');
  NOISE_CONFIG[type] = { color: '#' + c, icon: '?', label: type };
  return NOISE_CONFIG[type].color;
}
