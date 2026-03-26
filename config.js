// noiseColors.js — Noise type display configuration
// Each noise type has a unique color, emoji icon, and label.
// Add new types here and they will be picked up automatically.
// config.js — Grid configuration
const COLS = 12;
const ROWS = 8;

const NOISE_CONFIG = {
  dog:          { color: '#FF6B35', icon: '🐕', label: 'Dog',          sound: 'sounds/dog.wav'          },
  car:          { color: '#4285F4', icon: '🚗', label: 'Car',          sound: 'sounds/car.wav'          },
  traffic:      { color: '#4285F4', icon: '🚗', label: 'Traffic',      sound: 'sounds/traffic.wav'      },
  drilling:     { color: '#DB4437', icon: '⚙',  label: 'Drilling',     sound: 'sounds/drilling.wav'     },
  construction: { color: '#DB4437', icon: '🔨', label: 'Construction', sound: 'sounds/construction.wav' },
  music:        { color: '#A78BFA', icon: '♪',  label: 'Music',        sound: 'sounds/music.wav'        },
  siren:        { color: '#F72585', icon: '🚨', label: 'Siren',        sound: 'sounds/siren.wav'        },
  crowd:        { color: '#FFD93D', icon: '👥', label: 'Crowd',        sound: 'sounds/crowd.wav'        },
  children:     { color: '#FBBF24', icon: '🧒', label: 'Children',     sound: 'sounds/children.wav'     },
  wind:         { color: '#6BCB77', icon: '🌬', label: 'Wind',         sound: 'sounds/wind.wav'         },
  hvac:         { color: '#4D96FF', icon: '❄',  label: 'HVAC',         sound: 'sounds/hvac.wav'         },
  bird:         { color: '#0F9B58', icon: '🐦', label: 'Bird',         sound: 'sounds/bird.wav'         },
  birds:        { color: '#0F9B58', icon: '🐦', label: 'Birds',        sound: 'sounds/birds.wav'        },
  truck:        { color: '#F4845F', icon: '🚛', label: 'Truck',        sound: 'sounds/truck.wav'        },
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
