import type { APIRoute } from 'astro';

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

    const serpapiKey = import.meta.env.SERPAPI_KEY;

    if (!serpapiKey) {
      return new Response(JSON.stringify({ error: 'SerpApi key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const params = new URLSearchParams({
      engine: 'google_flights',
      departure_id: origin,
      arrival_id: destination,
      outbound_date: departureDate,
      passengers: String(passengers || 1),
      travel_class: cabinClass || 'economy',
      currency: 'USD',
      hl: 'en',
      gl: 'us',
      api_key: serpapiKey,
    });

    const serpRes = await fetch(`https://serpapi.com/search.json?${params.toString()}`);

    if (!serpRes.ok) {
      const errText = await serpRes.text();
      console.error('SerpApi error:', errText);
      return new Response(JSON.stringify({ error: `Flight search failed: ${serpRes.status}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await serpRes.json();

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const allFlights = [...(data.best_flights || []), ...(data.other_flights || [])];

    const offers = allFlights.map((flight: any, index: number) => {
      const firstLeg = flight.flights?.[0];
      const lastLeg = flight.flights?.[flight.flights.length - 1];
      const totalDuration = flight.flights?.reduce((sum: number, f: any) => sum + (f.duration || 0), 0) || 0;
      const stops = Math.max(0, (flight.flights?.length || 1) - 1);

      const airline = firstLeg?.airline || 'Unknown Airline';
      const airlineLogo = firstLeg?.airline_logo || '';

      const formatDuration = (mins: number) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return `${h}h ${m}m`;
      };

      const formatTime = (timeStr: string) => {
        if (!timeStr) return '';
        const match = timeStr.match(/(\d{4}-\d{2}-\d{2}\s+)?(\d{2}:\d{2})/);
        return match ? match[2] : timeStr;
      };

      return {
        id: `serpapi-${index}-${Date.now()}`,
        origin: firstLeg?.departure_airport?.id || origin,
        destination: lastLeg?.arrival_airport?.id || destination,
        originName: firstLeg?.departure_airport?.name || origin,
        destinationName: lastLeg?.arrival_airport?.name || destination,
        departureTime: firstLeg?.departure_airport?.time || '',
        arrivalTime: lastLeg?.arrival_airport?.time || '',
        airline: airline,
        airlineIata: extractIataCode(firstLeg) || airline.substring(0, 2).toUpperCase(),
        airlineLogo: airlineLogo,
        flightNumber: firstLeg?.flight_number || '',
        duration: formatDuration(totalDuration),
        stops: stops,
        price: flight.price || 0,
        currency: data.search_parameters?.currency || 'USD',
        cabinClass: firstLeg?.travel_class || cabinClass || 'economy',
        departureToken: flight.departure_token || '',
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

function extractIataCode(flight: any): string {
  const airline = flight?.airline || '';
  const number = flight?.flight_number || '';
  const match = number.match(/^([A-Z0-9]{2})\s?\d/);
  if (match) return match[1];
  return airline.substring(0, 2).toUpperCase();
}
