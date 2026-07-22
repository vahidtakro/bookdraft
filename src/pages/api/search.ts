import type { APIRoute } from 'astro';

const AIRLINES: Record<string, string> = {
  'AA': 'American Airlines', 'UA': 'United Airlines', 'DL': 'Delta Air Lines',
  'B6': 'JetBlue Airways', 'WN': 'Southwest Airlines', 'AS': 'Alaska Airlines',
  'BA': 'British Airways', 'LH': 'Lufthansa', 'AF': 'Air France',
  'EK': 'Emirates', 'QR': 'Qatar Airways', 'TK': 'Turkish Airlines',
  'SQ': 'Singapore Airlines', 'EY': 'Etihad Airways', 'QF': 'Qantas',
  'CX': 'Cathay Pacific', 'NH': 'ANA', 'JL': 'Japan Airlines',
  'KE': 'Korean Air', 'KL': 'KLM', 'SK': 'SAS', 'OS': 'Austrian Airlines',
  'IB': 'Iberia', 'LX': 'Swiss', 'VS': 'Virgin Atlantic', 'AC': 'Air Canada',
  'TP': 'TAP Air Portugal', 'AY': 'Finnair', 'TG': 'Thai Airways',
  'MH': 'Malaysia Airlines', 'AI': 'Air India', 'PK': 'PIA',
  'SV': 'Saudia', 'GF': 'Gulf Air', 'WY': 'Oman Air',
  'UL': 'SriLankan Airlines', 'FJ': 'Fiji Airways',
};

const AIRPORT_CITIES: Record<string, string> = {
  'JFK': 'New York', 'LAX': 'Los Angeles', 'ORD': 'Chicago', 'ATL': 'Atlanta',
  'DFW': 'Dallas', 'DEN': 'Denver', 'SFO': 'San Francisco', 'SEA': 'Seattle',
  'MIA': 'Miami', 'BOS': 'Boston', 'IAD': 'Washington', 'DCA': 'Washington',
  'PHX': 'Phoenix', 'IAH': 'Houston', 'MSP': 'Minneapolis', 'DTW': 'Detroit',
  'PHL': 'Philadelphia', 'CLT': 'Charlotte', 'EWR': 'Newark', 'SLC': 'Salt Lake City',
  'SAN': 'San Diego', 'BWI': 'Baltimore', 'TPA': 'Tampa', 'PDX': 'Portland',
  'STL': 'St. Louis', 'HNL': 'Honolulu', 'YYZ': 'Toronto', 'YVR': 'Vancouver',
  'YUL': 'Montreal', 'MEX': 'Mexico City', 'CUN': 'Cancún',
  'LHR': 'London', 'LGW': 'London', 'CDG': 'Paris', 'ORY': 'Paris',
  'FRA': 'Frankfurt', 'MUC': 'Munich', 'AMS': 'Amsterdam', 'MAD': 'Madrid',
  'BCN': 'Barcelona', 'FCO': 'Rome', 'MXP': 'Milan', 'IST': 'Istanbul',
  'SAW': 'Istanbul', 'ZRH': 'Zurich', 'VIE': 'Vienna', 'BRU': 'Brussels',
  'CPH': 'Copenhagen', 'OSL': 'Oslo', 'ARN': 'Stockholm', 'HEL': 'Helsinki',
  'DUB': 'Dublin', 'LIS': 'Lisbon', 'OPO': 'Porto', 'ATH': 'Athens',
  'WAW': 'Warsaw', 'PRG': 'Prague', 'BUD': 'Budapest',
  'DXB': 'Dubai', 'DOH': 'Doha', 'AUH': 'Abu Dhabi', 'RUH': 'Riyadh',
  'JED': 'Jeddah', 'BAH': 'Bahrain', 'MCT': 'Muscat', 'KWI': 'Kuwait City',
  'AMM': 'Amman', 'BEY': 'Beirut', 'TLV': 'Tel Aviv',
  'SIN': 'Singapore', 'HND': 'Tokyo', 'NRT': 'Tokyo', 'ICN': 'Seoul',
  'PEK': 'Beijing', 'PKX': 'Beijing', 'PVG': 'Shanghai', 'HKG': 'Hong Kong',
  'TPE': 'Taipei', 'BKK': 'Bangkok', 'KUL': 'Kuala Lumpur', 'CGK': 'Jakarta',
  'MNL': 'Manila', 'DEL': 'Delhi', 'BOM': 'Mumbai',
};

function formatTime(iso: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' });
  } catch { return ''; }
}

function formatDate(iso: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  } catch { return ''; }
}

function formatDuration(mins: number): string {
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
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

    const apiKey = import.meta.env.SCRAPPA_API_KEY;

    if (!apiKey || apiKey === 'your_scrappa_api_key_here') {
      return new Response(JSON.stringify({
        error: 'API key not configured. Please sign up at scrappa.co and add your key to .env'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const params = new URLSearchParams({
      origin,
      destination,
      departure_date: departureDate,
      adults: String(passengers || 1),
      cabin_class: cabinClass || 'economy',
      currency: 'USD',
      gl: 'us',
      hl: 'en',
    });

    const res = await fetch(`https://scrappa.co/api/flights/one-way?${params}`, {
      headers: { 'x-api-key': apiKey },
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error('Scrappa error:', res.status, errBody);
      return new Response(JSON.stringify({
        error: `Flight search failed (${res.status}). ${res.status === 402 ? 'Out of credits.' : 'Please try again.'}`
      }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();
    const flights = data?.flights;

    if (!Array.isArray(flights) || flights.length === 0) {
      return new Response(JSON.stringify({
        error: 'No flights found for this route and date.'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const offers = flights.map((f: any, index: number) => {
      const leg = f.legs?.[0] || {};
      const airlineIata = leg.airline || '';
      const airlineName = f.airline_name || AIRLINES[airlineIata] || airlineIata;
      const flightNumber = leg.flight_number || '';
      const depTime = leg.departure_time || '';
      const arrTime = leg.arrival_time || '';
      const durationMins = f.total_duration_minutes || leg.duration_minutes || 0;
      const stops = f.stops ?? Math.max(0, (f.legs?.length || 1) - 1);
      const price = f.price || 0;

      return {
        id: `sc-${airlineIata}-${flightNumber}-${index}`,
        origin: leg.departure_airport || origin,
        destination: leg.arrival_airport || destination,
        originCity: AIRPORT_CITIES[leg.departure_airport || origin] || '',
        destinationCity: AIRPORT_CITIES[leg.arrival_airport || destination] || '',
        originName: '',
        destinationName: '',
        departureDate: depTime ? depTime.split('T')[0] : departureDate,
        departureTime: formatTime(depTime),
        arrivalTime: formatTime(arrTime),
        arrivalDate: arrTime ? arrTime.split('T')[0] : departureDate,
        airline: airlineName,
        airlineIata,
        airlineLogo: `https://www.google.com/s2/favicons?domain=${airlineIata.toLowerCase()}.com&sz=64`,
        flightNumber: `${airlineIata}${flightNumber}`,
        duration: formatDuration(durationMins),
        stops,
        price,
        currency: f.currency || 'USD',
        cabinClass: cabinClass || 'economy',
      };
    });

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
