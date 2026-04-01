// This script processes the SONYC Data Viz JSON, bins lat/lon into a 7x5 grid,
// and re-keys each time slot by "row,col" bin instead of lat/lon.
// Multiple lat/lon coordinates that fall into the same bin are merged into one array.
// Each entry retains its original lat and lon values.
const fs = require('fs');

// Load the data
const data = require('./SONYC Data Viz final (1).json');

// Step 1: Extract all unique lat/lon pairs to compute grid bounds
const latlons = [];
for (const date of Object.values(data)) {
  for (const period of Object.values(date)) {
    for (const time of Object.values(period)) {
      for (const latlon of Object.keys(time)) {
        const [lat, lon] = latlon.split(',').map(Number);
        latlons.push({ lat, lon });
      }
    }
  }
}

// Step 2: Compute min/max for latitude and longitude
const lats = latlons.map(p => p.lat);
const lons = latlons.map(p => p.lon);
const minLat = Math.min(...lats);
const maxLat = Math.max(...lats);
const minLon = Math.min(...lons);
const maxLon = Math.max(...lons);

// Step 3: Calculate bin edges (7 cols = 0..6, 5 rows = 0..4)
const numRows = 5;
const numCols = 7;
const latStep = (maxLat - minLat) / numRows;
const lonStep = (maxLon - minLon) / numCols;

function getBin(lat, lon) {
  let row = Math.floor((lat - minLat) / latStep);
  let col = Math.floor((lon - minLon) / lonStep);
  if (row >= numRows) row = numRows - 1;
  if (col >= numCols) col = numCols - 1;
  return { row, col };
}

// Step 4: Re-key each time slot from "lat,lon" -> entries
//         to "row,col" -> entries (with lat/lon included in each entry)
function rebinTimeSlot(timeObj) {
  const binned = {};
  for (const latlon of Object.keys(timeObj)) {
    if (!/^-?\d+\.?\d*,-?\d+\.?\d*$/.test(latlon)) continue;
    const [lat, lon] = latlon.split(',').map(Number);
    const { row, col } = getBin(lat, lon);
    const binKey = `${row},${col}`;
    if (!binned[binKey]) binned[binKey] = [];
    for (const entry of timeObj[latlon]) {
      binned[binKey].push({ lat, lon, ...entry });
    }
  }
  return binned;
}

// Step 5: Walk the full structure and apply rebinning at the time level
const result = {};
for (const [date, periods] of Object.entries(data)) {
  result[date] = {};
  for (const [period, times] of Object.entries(periods)) {
    result[date][period] = {};
    for (const [time, timeObj] of Object.entries(times)) {
      result[date][period][time] = rebinTimeSlot(timeObj);
    }
  }
}

// Save to new file
fs.writeFileSync('SONYC_Data_Viz_binned.json', JSON.stringify(result, null, 2));
console.log(`Binned data saved to SONYC_Data_Viz_binned.json`);
console.log(`Grid bounds: lat [${minLat}, ${maxLat}], lon [${minLon}, ${maxLon}]`);
console.log(`Row step: ${latStep.toFixed(6)}, Col step: ${lonStep.toFixed(6)}`);
