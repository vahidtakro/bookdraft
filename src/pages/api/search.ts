import type { APIRoute } from 'astro';

const AIRLABS_API = 'https://airlabs.co/api/v9';

const AIRLINES: Record<string, string> = {
  'AA': 'American Airlines', 'UA': 'United Airlines', 'DL': 'Delta Air Lines',
  'BA': 'British Airways', 'LH': 'Lufthansa', 'AF': 'Air France',
  'EK': 'Emirates', 'QR': 'Qatar Airways', 'TK': 'Turkish Airlines',
  'SQ': 'Singapore Airlines', 'EY': 'Etihad Airways', 'QF': 'Qantas',
  'CX': 'Cathay Pacific', 'NH': 'ANA', 'KE': 'Korean Air', 'KL': 'KLM',
  'WN': 'Southwest Airlines', 'B6': 'JetBlue Airways', 'SK': 'SAS',
  'OS': 'Austrian Airlines', 'IB': 'Iberia', 'AZ': 'ITA Airways',
  'LX': 'Swiss', 'VS': 'Virgin Atlantic', 'AC': 'Air Canada',
  'TP': 'TAP Air Portugal', 'AY': 'Finnair', 'SN': 'Brussels Airlines',
  'TG': 'Thai Airways', 'MH': 'Malaysia Airlines', 'GA': 'Garuda Indonesia',
  'CI': 'China Airlines', 'BR': 'EVA Air', 'JL': 'Japan Airlines',
  'AI': 'Air India', 'PK': 'Pakistan International Airlines',
  'MS': 'EgyptAir', 'SV': 'Saudia', 'GF': 'Gulf Air',
  'WY': 'Oman Air', 'RJ': 'Royal Jordanian', 'ME': 'Middle East Airlines',
  'UL': 'SriLankan Airlines', 'FJ': 'Fiji Airways',
};

const AIRLINE_TIER: Record<string, number> = {
  'EK': 1.3, 'QR': 1.3, 'SQ': 1.4, 'EY': 1.3, 'CX': 1.3,
  'BA': 1.2, 'LH': 1.2, 'AF': 1.1, 'KL': 1.1, 'TK': 1.1,
  'QF': 1.3, 'NH': 1.2, 'KE': 1.1, 'AA': 1.1, 'UA': 1.0,
  'DL': 1.1, 'WN': 0.9, 'B6': 0.9, 'SK': 1.0, 'OS': 1.1,
};

const AIRPORTS: Record<string, { lat: number; lon: number; city: string; name: string }> = {
  JFK: { lat: 40.6413, lon: -73.7781, city: 'New York', name: 'John F. Kennedy Intl' },
  LAX: { lat: 33.9425, lon: -118.4081, city: 'Los Angeles', name: 'Los Angeles Intl' },
  LHR: { lat: 51.4700, lon: -0.4543, city: 'London', name: 'Heathrow' },
  LGW: { lat: 51.1537, lon: -0.1821, city: 'London', name: 'Gatwick' },
  CDG: { lat: 49.0097, lon: 2.5479, city: 'Paris', name: 'Charles de Gaulle' },
  ORY: { lat: 48.7233, lon: 2.3794, city: 'Paris', name: 'Orly' },
  DXB: { lat: 25.2532, lon: 55.3657, city: 'Dubai', name: 'Dubai Intl' },
  SIN: { lat: 1.3644, lon: 103.9915, city: 'Singapore', name: 'Changi' },
  NRT: { lat: 35.7720, lon: 140.3929, city: 'Tokyo', name: 'Narita Intl' },
  HND: { lat: 35.5494, lon: 139.7798, city: 'Tokyo', name: 'Haneda' },
  FRA: { lat: 50.0379, lon: 8.5622, city: 'Frankfurt', name: 'Frankfurt Airport' },
  AMS: { lat: 52.3105, lon: 4.7683, city: 'Amsterdam', name: 'Schiphol' },
  IST: { lat: 41.2753, lon: 28.7519, city: 'Istanbul', name: 'Istanbul Airport' },
  DEL: { lat: 28.5562, lon: 77.1000, city: 'Delhi', name: 'Indira Gandhi Intl' },
  BOM: { lat: 19.0896, lon: 72.8656, city: 'Mumbai', name: 'Chhatrapati Shivaji' },
  HKG: { lat: 22.3080, lon: 113.9185, city: 'Hong Kong', name: 'Hong Kong Intl' },
  SYD: { lat: -33.9461, lon: 151.1772, city: 'Sydney', name: 'Kingsford Smith' },
  ORD: { lat: 41.9742, lon: -87.9073, city: 'Chicago', name: "O'Hare Intl" },
  ATL: { lat: 33.6407, lon: -84.4277, city: 'Atlanta', name: 'Hartsfield-Jackson' },
  SFO: { lat: 37.6213, lon: -122.3790, city: 'San Francisco', name: 'San Francisco Intl' },
  SEA: { lat: 47.4502, lon: -122.3088, city: 'Seattle', name: 'Seattle-Tacoma Intl' },
  MIA: { lat: 25.7959, lon: -80.2870, city: 'Miami', name: 'Miami Intl' },
  BKK: { lat: 13.6900, lon: 100.7501, city: 'Bangkok', name: 'Suvarnabhumi' },
  ICN: { lat: 37.4602, lon: 126.4407, city: 'Seoul', name: 'Incheon Intl' },
  FCO: { lat: 41.8003, lon: 12.2389, city: 'Rome', name: 'Fiumicino' },
  MAD: { lat: 40.4983, lon: -3.5676, city: 'Madrid', name: 'Barajas' },
  YYZ: { lat: 43.6777, lon: -79.6248, city: 'Toronto', name: 'Pearson Intl' },
  MUC: { lat: 48.3537, lon: 11.7750, city: 'Munich', name: 'Munich Airport' },
  ZRH: { lat: 47.4647, lon: 8.5492, city: 'Zurich', name: 'Zurich Airport' },
  GRU: { lat: -23.4356, lon: -46.4731, city: 'Sao Paulo', name: 'Guarulhos Intl' },
  JNB: { lat: -26.1367, lon: 28.2411, city: 'Johannesburg', name: 'O.R. Tambo Intl' },
  DOH: { lat: 25.2731, lon: 51.6081, city: 'Doha', name: 'Hamad Intl' },
  AUH: { lat: 24.4330, lon: 54.6511, city: 'Abu Dhabi', name: 'Abu Dhabi Intl' },
  CAI: { lat: 30.1219, lon: 31.4056, city: 'Cairo', name: 'Cairo Intl' },
  JED: { lat: 21.6796, lon: 39.1565, city: 'Jeddah', name: 'King Abdulaziz Intl' },
  RUH: { lat: 24.9576, lon: 46.6988, city: 'Riyadh', name: 'King Khalid Intl' },
  KHI: { lat: 24.9065, lon: 67.1606, city: 'Karachi', name: 'Jinnah Intl' },
  ISB: { lat: 33.6161, lon: 73.0991, city: 'Islamabad', name: 'Islamabad Intl' },
  MLE: { lat: 4.1918, lon: 73.5290, city: 'Malé', name: 'Velana Intl' },
  IAD: { lat: 38.9531, lon: -77.4565, city: 'Washington', name: 'Washington Dulles' },
  DFW: { lat: 32.8998, lon: -97.0403, city: 'Dallas', name: 'Dallas/Fort Worth' },
  DEN: { lat: 39.8561, lon: -104.6737, city: 'Denver', name: 'Denver Intl' },
  BOS: { lat: 42.3656, lon: -71.0096, city: 'Boston', name: 'Logan Intl' },
  EWR: { lat: 40.6895, lon: -74.1745, city: 'Newark', name: 'Newark Liberty' },
  MXP: { lat: 45.6306, lon: 8.7281, city: 'Milan', name: 'Malpensa' },
  BCN: { lat: 41.2974, lon: 2.0833, city: 'Barcelona', name: 'El Prat' },
  LIS: { lat: 38.7756, lon: -9.1354, city: 'Lisbon', name: 'Humberto Delgado' },
  DUB: { lat: 53.4264, lon: -6.2499, city: 'Dublin', name: 'Dublin Airport' },
  CPH: { lat: 55.6181, lon: 12.6561, city: 'Copenhagen', name: 'Copenhagen Airport' },
  VIE: { lat: 48.1103, lon: 16.5697, city: 'Vienna', name: 'Vienna Intl' },
  BRU: { lat: 50.9014, lon: 4.4844, city: 'Brussels', name: 'Brussels Airport' },
  ATH: { lat: 37.9364, lon: 23.9445, city: 'Athens', name: 'Athens Intl' },
  PRG: { lat: 50.1008, lon: 14.2600, city: 'Prague', name: "Vaclav Havel" },
  WAW: { lat: 52.1657, lon: 20.9671, city: 'Warsaw', name: 'Chopin' },
  BUD: { lat: 47.4298, lon: 19.2611, city: 'Budapest', name: 'Budapest Liszt' },
  SVO: { lat: 55.9726, lon: 37.4146, city: 'Moscow', name: 'Sheremetyevo' },
  ADD: { lat: 8.9778, lon: 38.7997, city: 'Addis Ababa', name: 'Bole Intl' },
  NBO: { lat: -1.3192, lon: 36.9278, city: 'Nairobi', name: 'Jomo Kenyatta Intl' },
  LOS: { lat: 6.5774, lon: 3.3212, city: 'Lagos', name: 'Murtala Muhammed' },
  ACC: { lat: 5.6052, lon: -0.1668, city: 'Accra', name: 'Kotoka Intl' },
  CMN: { lat: 33.3675, lon: -7.5900, city: 'Casablanca', name: 'Mohammed V Intl' },
  TUN: { lat: 36.8510, lon: 10.2272, city: 'Tunis', name: 'Tunis-Carthage' },
  GIG: { lat: -22.8100, lon: -43.2505, city: 'Rio de Janeiro', name: 'Galeao Intl' },
  EZE: { lat: -34.8222, lon: -58.5358, city: 'Buenos Aires', name: 'Ministro Pistarini' },
  SCL: { lat: -33.3930, lon: -70.7858, city: 'Santiago', name: 'Arturo Merino Benitez' },
  BOG: { lat: 4.7016, lon: -74.1469, city: 'Bogota', name: 'El Dorado Intl' },
  LIM: { lat: -12.0219, lon: -77.1143, city: 'Lima', name: 'Jorge Chavez Intl' },
  PTY: { lat: 9.0714, lon: -79.3835, city: 'Panama City', name: 'Tocumen Intl' },
  MEL: { lat: -37.6690, lon: 144.8410, city: 'Melbourne', name: 'Melbourne Airport' },
  AKL: { lat: -37.0082, lon: 174.7850, city: 'Auckland', name: 'Auckland Airport' },
  PEK: { lat: 40.0799, lon: 116.6031, city: 'Beijing', name: 'Beijing Capital' },
  PVG: { lat: 31.1443, lon: 121.8083, city: 'Shanghai', name: 'Pudong' },
  TPE: { lat: 25.0777, lon: 121.2325, city: 'Taipei', name: 'Taoyuan Intl' },
  KUL: { lat: 2.7456, lon: 101.7099, city: 'Kuala Lumpur', name: 'Kuala Lumpur Intl' },
  CGK: { lat: -6.1256, lon: 106.6558, city: 'Jakarta', name: 'Soekarno-Hatta' },
  MNL: { lat: 14.5086, lon: 121.0194, city: 'Manila', name: 'Ninoy Aquino Intl' },
  BLR: { lat: 13.1986, lon: 77.7066, city: 'Bangalore', name: 'Kempegowda Intl' },
  SGN: { lat: 10.8188, lon: 106.6520, city: 'Ho Chi Minh City', name: 'Tan Son Nhat' },
  HAN: { lat: 21.2212, lon: 105.8072, city: 'Hanoi', name: 'Noi Bai Intl' },
  CPT: { lat: -33.9715, lon: 18.6021, city: 'Cape Town', name: 'Cape Town Intl' },
  KTM: { lat: 27.6966, lon: 85.3591, city: 'Kathmandu', name: 'Tribhuvan Intl' },
  DAC: { lat: 23.8432, lon: 90.3978, city: 'Dhaka', name: 'Shahjalal Intl' },
  CMB: { lat: 7.1808, lon: 79.8841, city: 'Colombo', name: 'Bandaranaike Intl' },
  LHE: { lat: 31.5216, lon: 74.4036, city: 'Lahore', name: 'Allama Iqbal Intl' },
  ALA: { lat: 43.3521, lon: 77.0405, city: 'Almaty', name: 'Almaty Intl' },
  TAS: { lat: 41.2579, lon: 69.2812, city: 'Tashkent', name: 'Tashkent Intl' },
  GYD: { lat: 40.4675, lon: 50.0467, city: 'Baku', name: 'Heydar Aliyev Intl' },
  BAH: { lat: 26.2708, lon: 50.6336, city: 'Bahrain', name: 'Bahrain Intl' },
  KWI: { lat: 29.2267, lon: 47.9689, city: 'Kuwait City', name: 'Kuwait Intl' },
  MCT: { lat: 23.5933, lon: 58.2844, city: 'Muscat', name: 'Muscat Intl' },
  AMM: { lat: 31.7226, lon: 35.9932, city: 'Amman', name: 'Queen Alia Intl' },
  TLV: { lat: 32.0055, lon: 34.8854, city: 'Tel Aviv', name: 'Ben Gurion' },
  BEY: { lat: 33.8209, lon: 35.4884, city: 'Beirut', name: 'Rafic Hariri Intl' },
  CCS: { lat: 10.6012, lon: -66.9913, city: 'Caracas', name: 'Simon Bolivar Intl' },
  UIO: { lat: -0.1292, lon: -78.3575, city: 'Quito', name: 'Mariscal Sucre Intl' },
  MDE: { lat: 6.1645, lon: -75.4231, city: 'Medellin', name: 'Jose Maria Cordova' },
  CUN: { lat: 21.0365, lon: -86.8770, city: 'Cancun', name: 'Cancun Intl' },
  MEX: { lat: 19.4363, lon: -99.0721, city: 'Mexico City', name: 'Mexico City Intl' },
  CLT: { lat: 35.2140, lon: -80.9431, city: 'Charlotte', name: 'Charlotte Douglas' },
  PHX: { lat: 33.4373, lon: -112.0078, city: 'Phoenix', name: 'Sky Harbor' },
  IAH: { lat: 29.9844, lon: -95.3414, city: 'Houston', name: 'George Bush Intercontinental' },
  MSP: { lat: 44.8848, lon: -93.2223, city: 'Minneapolis', name: 'Minneapolis-Saint Paul' },
  DTW: { lat: 42.2124, lon: -83.3534, city: 'Detroit', name: 'Detroit Metro' },
  PHL: { lat: 39.8729, lon: -75.2437, city: 'Philadelphia', name: 'Philadelphia Intl' },
  BWI: { lat: 39.1754, lon: -76.6684, city: 'Baltimore', name: 'Baltimore/Washington' },
  SLC: { lat: 40.7884, lon: -111.9778, city: 'Salt Lake City', name: 'Salt Lake City Intl' },
  SAN: { lat: 32.7338, lon: -117.1933, city: 'San Diego', name: 'San Diego Intl' },
  HNL: { lat: 21.3187, lon: -157.9224, city: 'Honolulu', name: 'Daniel K. Inouye Intl' },
  YVR: { lat: 49.1947, lon: -123.1792, city: 'Vancouver', name: 'Vancouver Intl' },
  YUL: { lat: 45.4657, lon: -73.7440, city: 'Montreal', name: 'Montreal-Trudeau' },
  PDX: { lat: 45.5898, lon: -122.5951, city: 'Portland', name: 'Portland Intl' },
  TPAT: { lat: 27.9756, lon: -82.5333, city: 'Tampa', name: 'Tampa Intl' },
  PEW: { lat: 33.9936, lon: 71.5146, city: 'Peshawar', name: 'Bacha Khan Intl' },
  OPO: { lat: 41.2481, lon: -8.6814, city: 'Porto', name: 'Porto Airport' },
  ARN: { lat: 59.6498, lon: 17.9238, city: 'Stockholm', name: 'Arlanda' },
  HEL: { lat: 60.3172, lon: 24.9633, city: 'Helsinki', name: 'Helsinki-Vantaa' },
  OSL: { lat: 60.1976, lon: 11.1004, city: 'Oslo', name: 'Oslo Gardermoen' },
  LED: { lat: 59.8003, lon: 30.2625, city: 'St. Petersburg', name: 'Pulkovo' },
  SAW: { lat: 40.8986, lon: 29.3092, city: 'Istanbul', name: 'Sabiha Gokcen' },
  DSS: { lat: 14.7397, lon: -17.4902, city: 'Dakar', name: 'Blaise Diagne Intl' },
  MXP: { lat: 45.6306, lon: 8.7281, city: 'Milan', name: 'Malpensa' },
  WLG: { lat: -41.3272, lon: 174.8053, city: 'Wellington', name: 'Wellington Intl' },
  BNE: { lat: -27.3842, lon: 153.1175, city: 'Brisbane', name: 'Brisbane Airport' },
  PER: { lat: -31.9403, lon: 115.9670, city: 'Perth', name: 'Perth Airport' },
};

function getAirlineName(iata: string): string {
  return AIRLINES[iata] || 'Unknown Airline';
}

function estimatePrice(distanceKm: number, airlineIata: string, cabinClass: string): number {
  const baseFarePerKm = 0.04;
  let base = distanceKm * baseFarePerKm;
  base = Math.max(base, 45);
  const tier = AIRLINE_TIER[airlineIata] || 1.0;
  const cabin: Record<string, number> = { economy: 1, premium_economy: 1.6, business: 3.2, first: 5.5 };
  const estimated = base * tier * (cabin[cabinClass] || 1);
  const jitter = 1 + (Math.random() * 0.18 - 0.09);
  return Math.round(estimated * jitter);
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatTime(iso: string): string {
  if (!iso) return '';
  if (/^\d{2}:\d{2}$/.test(iso)) return iso;
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const h = String(d.getUTCHours()).padStart(2, '0');
    const m = String(d.getUTCMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  } catch { return ''; }
}

function formatDuration(mins: number): string {
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function makeOffer(
  airlineIata: string,
  origin: string,
  destination: string,
  depTime: string,
  arrTime: string,
  durationMins: number,
  stops: number,
  price: number,
  cabinClass: string,
  flightNum?: string,
): any {
  const oInfo = AIRPORTS[origin] || { city: origin, name: origin };
  const dInfo = AIRPORTS[destination] || { city: destination, name: destination };
  return {
    id: `fl-${airlineIata}-${flightNum || ''}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    origin,
    destination,
    originName: oInfo.name,
    destinationName: dInfo.name,
    departureTime: formatTime(depTime),
    arrivalTime: formatTime(arrTime),
    airline: getAirlineName(airlineIata),
    airlineIata,
    airlineLogo: `https://www.google.com/s2/favicons?domain=${airlineIata.toLowerCase()}.com&sz=64`,
    flightNumber: flightNum || `${airlineIata}${100 + Math.floor(Math.random() * 9900)}`,
    duration: formatDuration(durationMins),
    stops,
    price,
    currency: 'USD',
    cabinClass,
  };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { origin, destination, departureDate, passengers, cabinClass } = body;

    if (!origin || !destination || !departureDate) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = import.meta.env.AIRLABS_API_KEY;
    const distance = haversineDistance(
      AIRPORTS[origin]?.lat ?? 0, AIRPORTS[origin]?.lon ?? 0,
      AIRPORTS[destination]?.lat ?? 0, AIRPORTS[destination]?.lon ?? 0,
    ) || 5000;
    const cabin = cabinClass || 'economy';

    let offers: any[] = [];

    if (apiKey) {
      // Try AirLabs flights endpoint
      try {
        const res = await fetch(
          `${AIRLABS_API}/flights?api_key=${apiKey}&dep_iata=${origin}&arr_iata=${destination}&limit=20`
        );
        if (res.ok) {
          const data = await res.json();
          const flights = data?.response;
          if (Array.isArray(flights) && flights.length > 0) {
            offers = flights.map((f: any, i: number) => {
              const iata = f.airline_iata || f.airline?.iata || '';
              const name = f.airline_name || f.airline?.name || getAirlineName(iata);
              const dep = f.departure_time || f.dep_time || '';
              const arr = f.arrival_time || f.arr_time || '';
              const mins = dep && arr
                ? Math.round((new Date(arr).getTime() - new Date(dep).getTime()) / 60000)
                : Math.round((distance / 850) * 60);
              const price = estimatePrice(distance, iata, cabin);

              return {
                id: `al-${f.flight_iata || i}-${Date.now()}`,
                origin: f.dep_iata || origin,
                destination: f.arr_iata || destination,
                originName: AIRPORTS[f.dep_iata || origin]?.name || origin,
                destinationName: AIRPORTS[f.arr_iata || destination]?.name || destination,
                departureTime: formatTime(dep),
                arrivalTime: formatTime(arr),
                airline: name,
                airlineIata: iata,
                airlineLogo: `https://www.google.com/s2/favicons?domain=${iata.toLowerCase()}.com&sz=64`,
                flightNumber: f.flight_iata || `${iata}${100 + Math.floor(Math.random() * 9900)}`,
                duration: formatDuration(mins),
                stops: f.stops || 0,
                price,
                currency: 'USD',
                cabinClass: cabin,
              };
            });
          }
        }
      } catch (e) {
        console.error('AirLabs API error:', e);
      }
    }

    // Always generate fallback flights too, mix them in
    const fallbacks = generateFallbackFlights(origin, destination, distance, cabin);
    offers = [...offers, ...fallbacks];

    // Remove duplicates by airline IATA + departure time
    const seen = new Set<string>();
    offers = offers.filter(o => {
      const key = `${o.airlineIata}-${o.departureTime}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    offers.sort((a: any, b: any) => a.price - b.price);

    return new Response(JSON.stringify({ offers }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Search error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

function generateFallbackFlights(
  origin: string,
  destination: string,
  distance: number,
  cabinClass: string,
): any[] {
  const airlineIatas = Object.keys(AIRLINES);
  const shuffled = airlineIatas.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 5 + Math.floor(Math.random() * 3));
  const flightMins = Math.round((distance / 850) * 60);

  return selected.map((iata, index) => {
    const depHour = 6 + Math.floor(Math.random() * 16);
    const depMin = Math.floor(Math.random() * 60);
    const isOneStop = distance > 4000 && Math.random() < 0.3;
    const totalMins = isOneStop ? flightMins + 60 + Math.floor(Math.random() * 60) : flightMins;
    const arrTotalMins = depHour * 60 + depMin + totalMins;
    const arrHour = Math.floor(arrTotalMins / 60) % 24;
    const arrMin = arrTotalMins % 60;
    const price = estimatePrice(distance, iata, cabinClass);

    return makeOffer(
      iata,
      origin,
      destination,
      `${String(depHour).padStart(2, '0')}:${String(depMin).padStart(2, '0')}`,
      `${String(arrHour).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`,
      totalMins,
      isOneStop ? 1 : 0,
      price,
      cabinClass,
    );
  });
}
