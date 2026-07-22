import { useState } from 'react';
import type { FlightOffer, SearchParams } from '../lib/types';

interface FlightSearchProps {
  onFlightSelect: (flight: FlightOffer) => void;
}

const POPULAR_AIRPORTS = [
  { iata: 'JFK', name: 'John F. Kennedy Intl', city: 'New York' },
  { iata: 'LAX', name: 'Los Angeles Intl', city: 'Los Angeles' },
  { iata: 'LHR', name: 'Heathrow', city: 'London' },
  { iata: 'CDG', name: 'Charles de Gaulle', city: 'Paris' },
  { iata: 'DXB', name: 'Dubai Intl', city: 'Dubai' },
  { iata: 'SIN', name: 'Changi', city: 'Singapore' },
  { iata: 'HND', name: 'Haneda', city: 'Tokyo' },
  { iata: 'IST', name: 'Istanbul', city: 'Istanbul' },
  { iata: 'FRA', name: 'Frankfurt', city: 'Frankfurt' },
  { iata: 'AMS', name: 'Schiphol', city: 'Amsterdam' },
  { iata: 'DOH', name: 'Hamad Intl', city: 'Doha' },
  { iata: 'AUH', name: 'Abu Dhabi Intl', city: 'Abu Dhabi' },
  { iata: 'MIA', name: 'Miami Intl', city: 'Miami' },
  { iata: 'SFO', name: 'San Francisco Intl', city: 'San Francisco' },
  { iata: 'DEL', name: 'Indira Gandhi Intl', city: 'Delhi' },
  { iata: 'BOM', name: 'Chhatrapati Shivaji', city: 'Mumbai' },
  { iata: 'CAI', name: 'Cairo Intl', city: 'Cairo' },
  { iata: 'JED', name: 'King Abdulaziz Intl', city: 'Jeddah' },
  { iata: 'RUH', name: 'King Khalid Intl', city: 'Riyadh' },
  { iata: 'KHI', name: 'Jinnah Intl', city: 'Karachi' },
  { iata: 'ISB', name: 'Islamabad Intl', city: 'Islamabad' },
  { iata: 'MLE', name: 'Velana Intl', city: 'Malé' },
  { iata: 'IAD', name: 'Washington Dulles', city: 'Washington' },
  { iata: 'ORD', name: "O'Hare", city: 'Chicago' },
];

export function FlightSearch({ onFlightSelect }: FlightSearchProps) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('economy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<FlightOffer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [originSearch, setOriginSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const filterAirports = (search: string) => {
    if (!search) return POPULAR_AIRPORTS;
    const s = search.toLowerCase();
    return POPULAR_AIRPORTS.filter(
      a => a.iata.toLowerCase().includes(s) ||
           a.city.toLowerCase().includes(s) ||
           a.name.toLowerCase().includes(s)
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !departureDate) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, departureDate, passengers, cabinClass }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to search flights');
      }

      setResults(data.offers || []);
      setShowResults(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {!showResults ? (
        <>
          {/* Hero */}
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Search Real Flights
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Find real flight itineraries for your visa application or travel planning.
              All data comes from live airline sources.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Origin */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                    <input
                      type="text"
                      value={originSearch}
                      onChange={e => {
                        setOriginSearch(e.target.value);
                        setShowOriginDropdown(true);
                        if (e.target.value.length === 0) setOrigin('');
                      }}
                      onFocus={() => setShowOriginDropdown(true)}
                      onBlur={() => setTimeout(() => setShowOriginDropdown(false), 200)}
                      placeholder="City or airport code"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
                    />
                  </div>
                  {showOriginDropdown && (
                    <div className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                      {filterAirports(originSearch).map(airport => (
                        <button
                          key={airport.iata}
                          type="button"
                          onClick={() => {
                            setOrigin(airport.iata);
                            setOriginSearch(`${airport.city} (${airport.iata})`);
                            setShowOriginDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3"
                        >
                          <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{airport.iata}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{airport.city}</div>
                            <div className="text-xs text-gray-500">{airport.name}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Destination */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <input
                      type="text"
                      value={destSearch}
                      onChange={e => {
                        setDestSearch(e.target.value);
                        setShowDestDropdown(true);
                        if (e.target.value.length === 0) setDestination('');
                      }}
                      onFocus={() => setShowDestDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDestDropdown(false), 200)}
                      placeholder="City or airport code"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
                    />
                  </div>
                  {showDestDropdown && (
                    <div className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                      {filterAirports(destSearch).map(airport => (
                        <button
                          key={airport.iata}
                          type="button"
                          onClick={() => {
                            setDestination(airport.iata);
                            setDestSearch(`${airport.city} (${airport.iata})`);
                            setShowDestDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3"
                        >
                          <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{airport.iata}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{airport.city}</div>
                            <div className="text-xs text-gray-500">{airport.name}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Departure Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={e => setDepartureDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
                  />
                </div>

                {/* Passengers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
                  <select
                    value={passengers}
                    onChange={e => setPassengers(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
                    ))}
                  </select>
                </div>

                {/* Cabin Class */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cabin Class</label>
                  <select
                    value={cabinClass}
                    onChange={e => setCabinClass(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                  >
                    <option value="economy">Economy</option>
                    <option value="premium_economy">Premium Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !origin || !destination || !departureDate}
                className="w-full gradient-accent text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Searching flights...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search Flights
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Real flight data
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Instant results
              </span>
            </div>
          </div>
        </>
      ) : (
        <FlightResults
          results={results}
          onSelect={onFlightSelect}
          onBack={() => setShowResults(false)}
          searchParams={{ origin, destination, departureDate, passengers, cabinClass }}
        />
      )}
    </div>
  );
}
