/**
 * IATA carrier code to airline name mapping (subset from reference frontend).
 */
const AIRLINES = {
  AA: 'American Airlines',
  DL: 'Delta Air Lines',
  UA: 'United Airlines',
  WN: 'Southwest Airlines',
  B6: 'JetBlue Airways',
  BA: 'British Airways',
  LH: 'Lufthansa',
  AF: 'Air France',
  KL: 'KLM Royal Dutch Airlines',
  EK: 'Emirates',
  QR: 'Qatar Airways',
  SQ: 'Singapore Airlines',
  NH: 'All Nippon Airways',
  JL: 'Japan Airlines',
  AC: 'Air Canada',
  QF: 'Qantas',
  NZ: 'Air New Zealand',
  TK: 'Turkish Airlines',
  EI: 'Aer Lingus',
  FR: 'Ryanair',
  U2: 'easyJet',
};

export function getAirlineName(code) {
  return AIRLINES[code] || `${code} Airlines`;
}

export function formatDuration(isoDuration) {
  if (!isoDuration) return '';
  const str = isoDuration.replace('PT', '');
  const hoursMatch = str.match(/(\d+)H/);
  const minsMatch = str.match(/(\d+)M/);
  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}
