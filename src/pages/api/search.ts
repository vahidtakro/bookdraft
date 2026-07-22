import type { APIRoute } from 'astro';

const AIRLABS_API = 'https://airlabs.co/api/v9';

const CABIN_MULTIPLIER: Record<string, number> = {
  economy: 1,
  premium_economy: 1.6,
  business: 3.2,
  first: 5.5,
};

const AIRLINE_TIER: Record<string, number> = {
  'EK': 1.3, 'QR': 1.3, 'SQ': 1.4, 'EY': 1.3, 'CX': 1.3,
  'BA': 1.2, 'LH': 1.2, 'AF': 1.1, 'KL': 1.1, 'TK': 1.1,
  'QF': 1.3, 'NH': 1.2, 'KE': 1.1, 'AA': 1.1, 'UA': 1.0,
  'DL': 1.1, 'WN': 0.9, 'B6': 0.9, 'SK': 1.0, 'OS': 1.1,
};

const AIRPORT_COORDS: Record<string, { lat: number; lon: number; city: string; name: string }> = {
  JFK: { lat: 40.6413, lon: -73.7781, city: 'New York', name: 'John F. Kennedy Intl' },
  LAX: { lat: 33.9425, lon: -118.4081, city: 'Los Angeles', name: 'Los Angeles Intl' },
  LHR: { lat: 51.4700, lon: -0.4543, city: 'London', name: 'Heathrow' },
  CDG: { lat: 49.0097, lon: 2.5479, city: 'Paris', name: 'Charles de Gaulle' },
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
};

const AIRLINE_NAMES: Array<{ iata: string; name: string }> = [
  { iata: 'AA', name: 'American Airlines' },
  { iata: 'UA', name: 'United Airlines' },
  { iata: 'DL', name: 'Delta Air Lines' },
  { iata: 'BA', name: 'British Airways' },
  { iata: 'LH', name: 'Lufthansa' },
  { iata: 'AF', name: 'Air France' },
  { iata: 'EK', name: 'Emirates' },
  { iata: 'QR', name: 'Qatar Airways' },
  { iata: 'TK', name: 'Turkish Airlines' },
  { iata: 'SQ', name: 'Singapore Airlines' },
  { iata: 'EY', name: 'Etihad Airways' },
  { iata: 'QF', name: 'Qantas' },
  { iata: 'CX', name: 'Cathay Pacific' },
  { iata: 'NH', name: 'ANA' },
  { iata: 'KE', name: 'Korean Air' },
  { iata: 'KL', name: 'KLM' },
  { iata: 'WN', name: 'Southwest Airlines' },
  { iata: 'B6', name: 'JetBlue Airways' },
  { iata: 'SK', name: 'SAS' },
  { iata: 'OS', name: 'Austrian Airlines' },
];

function estimatePrice(distanceKm: number, airlineIata: string, cabinClass: string): number {
  const baseFarePerKm = 0.04;
  let base = distanceKm * baseFarePerKm;
  base = Math.max(base, 45);
  const tierMultiplier = AIRLINE_TIER[airlineIata] || 1.0;
  const cabinMultiplier = CABIN_MULTIPLIER[cabinClass] || 1;
  const estimated = base * tierMultiplier * cabinMultiplier;
  const jitter = 1 + (Math.random() * 0.18 - 0.09);
  return Math.round(estimated * jitter);
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getDistance(origin: string, destination: string): number {
  const o = AIRPORT_COORDS[origin];
  const d = AIRPORT_COORDS[destination];
  if (o && d) return haversineDistance(o.lat, o.lon, d.lat, d.lon);
  return 5000;
}

function formatTime(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const h = String(d.getUTCHours()).padStart(2, '0');
  const m = String(d.getUTCMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

function getAirlineLogo(iata: string): string {
  return `https://www.google.com/s2/favicons?domain=${iata.toLowerCase()}.com&sz=64`;
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

    const distance = getDistance(origin, destination);
    let offers: any[] = [];

    // Step 1: If API key exists, try to get real fares from AirLabs
    let realPrices: Record<string, number> = {};
    if (apiKey) {
      try {
        const faresRes = await fetch(
          `${AIRLABS_API}/fares?api_key=${apiKey}&dep_iata=${origin}&arr_iata=${destination}`
        );
        if (faresRes.ok) {
          const faresData = await faresRes.json();
          if (faresData.response) {
            for (const fare of faresData.response) {
              if (fare.airline_iata && fare.price) {
                realPrices[fare.airline_iata] = fare.price;
              }
            }
          }
        }
      } catch (e) {
        console.error('AirLabs fares error:', e);
      }

      // Step 2: Get real flight schedules from AirLabs
      try {
        const flightsRes = await fetch(
          `${AIRLABS_API}/flights?api_key=${apiKey}&dep_iata=${origin}&arr_iata=${destination}&limit=20`
        );
        if (flightsRes.ok) {
          const flightsData = await flightsRes.json();
          if (flightsData.response && flightsData.response.length > 0) {
            offers = flightsData.response.map((f: any, index: number) => {
              const airlineIata = f.airline_iata || '';
              const airlineName = f.airline_name || 'Unknown Airline';
              const depTime = f.departure_time || '';
              const arrTime = f.arrival_time || '';

              const durationMins = depTime && arrTime
                ? Math.round((new Date(arrTime).getTime() - new Date(depTime).getTime()) / 60000)
                : 180;

              const price = realPrices[airlineIata]
                || estimatePrice(distance, airlineIata, cabinClass || 'economy');

              return {
                id: `airlabs-${f.flight_iata || index}-${Date.now()}`,
                origin: f.dep_iata || origin,
                destination: f.arr_iata || destination,
                originName: f.dep_city || origin,
                destinationName: f.arr_city || destination,
                departureTime: formatTime(depTime),
                arrivalTime: formatTime(arrTime),
                airline: airlineName,
                airlineIata: airlineIata,
                airlineLogo: getAirlineLogo(airlineIata),
                flightNumber: f.flight_iata || `${airlineIata}${Math.floor(1000 + Math.random() * 9000)}`,
                duration: formatDuration(durationMins),
                stops: f.stops || 0,
                price,
                currency: 'USD',
                cabinClass: cabinClass || 'economy',
              };
            });
          }
        }
      } catch (e) {
        console.error('AirLabs flights error:', e);
      }
    }

    // Step 3: If no results from API, generate fallback flights
    if (offers.length === 0) {
      offers = generateFallbackFlights(origin, destination, distance, cabinClass || 'economy', realPrices);
    }

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
  realPrices: Record<string, number> = {}
): any[] {
  const originInfo = AIRPORT_COORDS[origin] || { city: origin, name: origin };
  const destInfo = AIRPORT_COORDS[destination] || { city: destination, name: destination };

  const shuffled = [...AIRLINE_NAMES].sort(() => Math.random() - 0.5);
  const selectedAirlines = shuffled.slice(0, 4 + Math.floor(Math.random() * 3));

  const flightMins = Math.round((distance / 850) * 60);

  return selectedAirlines.map((airline, index) => {
    const depHour = 6 + Math.floor(Math.random() * 16);
    const depMin = Math.floor(Math.random() * 60);

    const isOneStop = distance > 4000 && Math.random() < 0.3;
    const totalMins = isOneStop ? flightMins + 60 + Math.floor(Math.random() * 60) : flightMins;

    const arrTotalMins = depHour * 60 + depMin + totalMins;
    const arrHour = Math.floor(arrTotalMins / 60) % 24;
    const arrMin = arrTotalMins % 60;

    const price = realPrices[airline.iata] || estimatePrice(distance, airline.iata, cabinClass);

    return {
      id: `fallback-${airline.iata}-${index}-${Date.now()}`,
      origin,
      destination,
      originName: originInfo.name,
      destinationName: destInfo.name,
      departureTime: `${String(depHour).padStart(2, '0')}:${String(depMin).padStart(2, '0')}`,
      arrivalTime: `${String(arrHour).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`,
      airline: airline.name,
      airlineIata: airline.iata,
      airlineLogo: getAirlineLogo(airline.iata),
      flightNumber: `${airline.iata}${100 + Math.floor(Math.random() * 9900)}`,
      duration: formatDuration(totalMins),
      stops: isOneStop ? 1 : 0,
      price,
      currency: 'USD',
      cabinClass,
    };
  });
}
