/**
 * reset-km.js — Read and optionally reset dailySummaries km values in Firebase
 * 
 * Usage:
 *   node reset-km.js read       → Shows current km values for G1-G10
 *   node reset-km.js reset      → Overwrites km with real GPX values
 * 
 * Requires: firebase-admin (uses service account or Firebase REST API with custom token)
 * Since we don't have a service account, we use the REST API with the Web API key
 * and sign in with a custom approach.
 */

const https = require('https');

const DB_URL = 'https://viaggio-europa-2026-default-rtdb.europe-west1.firebasedatabase.app';
const FAMILY_ID = 'viaggio-europa-2026';
const API_KEY = 'AIzaSyCuUYGu_5PlIlDbxwYsFYL5y4OmoGehzzg';

// Real GPX km values for G1-G10 (road only, no ferry)
const REAL_KM = {
  '2025-06-25': 427,  // G1
  '2025-06-26': 189,  // G2
  '2025-06-27': 701,  // G3
  '2025-06-28': 686,  // G4
  '2025-06-29': 164,  // G5
  '2025-06-30': 260,  // G6
  '2025-07-01': 18,   // G7
  '2025-07-02': 302,  // G8
  '2025-07-03': 116,  // G9
  '2025-07-04': 214,  // G10
};

// Trip started 2026, not 2025 - fix dates
const REAL_KM_2026 = {
  '2026-06-25': 427,  // G1
  '2026-06-26': 189,  // G2
  '2026-06-27': 701,  // G3
  '2026-06-28': 686,  // G4
  '2026-06-29': 164,  // G5
  '2026-06-30': 260,  // G6
  '2026-07-01': 18,   // G7
  '2026-07-02': 302,  // G8
  '2026-07-03': 116,  // G9
  '2026-07-04': 214,  // G10
};

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error(`Parse error: ${data.slice(0,200)}`)); }
      });
    }).on('error', reject);
  });
}

async function readSummaries() {
  const url = `${DB_URL}/trips/${FAMILY_ID}/dailySummaries.json`;
  console.log('Fetching:', url);
  const data = await fetchJSON(url);
  
  if (data && data.error) {
    console.log('Error:', data.error);
    console.log('\nThe database requires authentication. You need to run this from the Firebase console or with a service account.');
    console.log('\nAlternative: Use the Firebase Console directly:');
    console.log(`  1. Go to https://console.firebase.google.com/project/viaggio-europa-2026/database`);
    console.log(`  2. Navigate to trips > viaggio-europa-2026 > dailySummaries`);
    console.log(`  3. For each date (2026-06-25 through 2026-07-04), update the "km" field`);
    console.log('\nOr use this Firebase CLI command after authenticating:');
    
    Object.entries(REAL_KM_2026).forEach(([date, km]) => {
      console.log(`  firebase database:update /trips/viaggio-europa-2026/dailySummaries/${date} '{"km":${km}}' --project viaggio-europa-2026 --instance viaggio-europa-2026-default-rtdb`);
    });
    return;
  }
  
  console.log('\n=== Current dailySummaries km values ===\n');
  const sortedKeys = Object.keys(data).sort();
  let total = 0;
  sortedKeys.forEach(date => {
    const s = data[date];
    const km = s.odometerKm != null ? s.odometerKm : (s.km || 0);
    const realKm = REAL_KM_2026[date];
    const diff = realKm ? ` (GPX real: ${realKm}, diff: ${(km - realKm).toFixed(1)})` : '';
    console.log(`  ${date}: ${km.toFixed(1)} km${diff}`);
    total += km;
  });
  console.log(`\n  TOTAL: ${total.toFixed(1)} km`);
  console.log(`  REAL GPX TOTAL (G1-G10): 3077 km`);
  console.log(`  DIFFERENCE: ${(total - 3077).toFixed(1)} km inflation`);
}

readSummaries().catch(console.error);
