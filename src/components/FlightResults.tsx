import type { FlightOffer, SearchParams } from '../lib/types';

interface FlightResultsProps {
  results: FlightOffer[];
  onSelect: (flight: FlightOffer) => void;
  onBack: () => void;
  searchParams: SearchParams;
}

export function FlightResults({ results, onSelect, onBack, searchParams }: FlightResultsProps) {
  const getAirlineLogo = (offer: FlightOffer) => {
    if (offer.airlineLogo) return offer.airlineLogo;
    return `https://www.gstatic.com/flights/airline_logos/70px/${offer.airlineIata}.png`;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {searchParams.origin} &rarr; {searchParams.destination}
          </h2>
          <p className="text-sm text-gray-500">
            {formatDate(searchParams.departureDate)} &bull; {searchParams.passengers} {searchParams.passengers === 1 ? 'passenger' : 'passengers'} &bull; {searchParams.cabinClass}
          </p>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No flights found</h3>
          <p className="text-gray-500">Try different dates or routes</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 mb-4">{results.length} flights found</p>
          {results.map((offer, index) => (
            <div
              key={offer.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:border-blue-200 transition-all animate-slide-up cursor-pointer"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => onSelect(offer)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Airline */}
                <div className="flex items-center gap-3 sm:w-48">
                  <img
                    src={getAirlineLogo(offer)}
                    alt={offer.airline}
                    className="w-10 h-10 object-contain rounded-lg bg-gray-50 p-1"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="%23e2e8f0"/><text x="20" y="25" font-family="system-ui" font-size="12" font-weight="bold" fill="%2364748b" text-anchor="middle">${offer.airlineIata}</text></svg>`;
                    }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{offer.airline}</p>
                    <p className="text-xs text-gray-500">{offer.flightNumber}</p>
                  </div>
                </div>

                {/* Route */}
                <div className="flex-1 flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">{formatTime(offer.departureTime)}</p>
                    <p className="text-sm text-gray-900 font-medium">{offer.origin}</p>
                    <p className="text-xs text-gray-500">{offer.originCity}</p>
                  </div>

                  <div className="flex-1 flex flex-col items-center gap-1">
                    <p className="text-xs text-gray-400">{offer.duration}</p>
                    <div className="w-full flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                      <div className="flex-1 h-px bg-gray-300 relative">
                        {offer.stops > 0 && Array.from({ length: offer.stops }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-400"
                            style={{ left: `${((i + 1) / (offer.stops + 1)) * 100}%` }}
                          />
                        ))}
                      </div>
                      <svg className="w-4 h-4 text-gray-400 -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">
                      {offer.stops === 0 ? 'Direct' : `${offer.stops} stop${offer.stops > 1 ? 's' : ''}`}
                    </p>
                  </div>

                  <div>
                    <p className="text-xl font-bold text-gray-900">{formatTime(offer.arrivalTime)}</p>
                    <p className="text-sm text-gray-900 font-medium">{offer.destination}</p>
                    <p className="text-xs text-gray-500">{offer.destinationCity}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="sm:text-right sm:w-36">
                  <p className="text-2xl font-bold text-blue-600">${offer.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{offer.currency} per person</p>
                </div>

                {/* Select button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(offer);
                  }}
                  className="sm:w-auto gradient-accent text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all whitespace-nowrap"
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTime(time: string): string {
  if (!time) return '';
  // Already "HH:MM" format
  if (/^\d{2}:\d{2}$/.test(time)) return time;
  try {
    const d = new Date(time);
    if (isNaN(d.getTime())) return time;
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' });
  } catch {
    return time;
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}
