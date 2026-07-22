import { useState } from 'react';
import type { FlightOffer, SearchParams } from '../lib/types';
import { FlightResults } from './FlightResults';

interface FlightSearchProps {
  onFlightSelect: (flight: FlightOffer) => void;
}

const AIRPORTS = [
  // North America
  { iata: 'JFK', name: 'John F. Kennedy Intl', city: 'New York' },
  { iata: 'LAX', name: 'Los Angeles Intl', city: 'Los Angeles' },
  { iata: 'ORD', name: "O'Hare Intl", city: 'Chicago' },
  { iata: 'ATL', name: 'Hartsfield-Jackson', city: 'Atlanta' },
  { iata: 'DFW', name: 'Dallas/Fort Worth', city: 'Dallas' },
  { iata: 'DEN', name: 'Denver Intl', city: 'Denver' },
  { iata: 'SFO', name: 'San Francisco Intl', city: 'San Francisco' },
  { iata: 'SEA', name: 'Seattle-Tacoma Intl', city: 'Seattle' },
  { iata: 'MIA', name: 'Miami Intl', city: 'Miami' },
  { iata: 'BOS', name: 'Logan Intl', city: 'Boston' },
  { iata: 'IAD', name: 'Washington Dulles', city: 'Washington' },
  { iata: 'DCA', name: 'Reagan National', city: 'Washington' },
  { iata: 'PHX', name: 'Sky Harbor', city: 'Phoenix' },
  { iata: 'IAH', name: 'George Bush Intercontinental', city: 'Houston' },
  { iata: 'MSP', name: 'Minneapolis-Saint Paul', city: 'Minneapolis' },
  { iata: 'DTW', name: 'Detroit Metro', city: 'Detroit' },
  { iata: 'PHL', name: 'Philadelphia Intl', city: 'Philadelphia' },
  { iata: 'CLT', name: 'Charlotte Douglas', city: 'Charlotte' },
  { iata: 'EWR', name: 'Newark Liberty', city: 'Newark' },
  { iata: 'SLC', name: 'Salt Lake City Intl', city: 'Salt Lake City' },
  { iata: 'SAN', name: 'San Diego Intl', city: 'San Diego' },
  { iata: 'BWI', name: 'Baltimore/Washington', city: 'Baltimore' },
  { iata: 'TPA', name: 'Tampa Intl', city: 'Tampa' },
  { iata: 'PDX', name: 'Portland Intl', city: 'Portland' },
  { iata: 'STL', name: 'St. Louis Lambert', city: 'St. Louis' },
  { iata: 'HNL', name: 'Daniel K. Inouye Intl', city: 'Honolulu' },
  { iata: 'YYZ', name: 'Toronto Pearson', city: 'Toronto' },
  { iata: 'YVR', name: 'Vancouver Intl', city: 'Vancouver' },
  { iata: 'YUL', name: 'Montréal-Trudeau', city: 'Montreal' },
  { iata: 'MEX', name: 'Mexico City Intl', city: 'Mexico City' },
  { iata: 'CUN', name: 'Cancún Intl', city: 'Cancún' },
  // Europe
  { iata: 'LHR', name: 'Heathrow', city: 'London' },
  { iata: 'LGW', name: 'Gatwick', city: 'London' },
  { iata: 'CDG', name: 'Charles de Gaulle', city: 'Paris' },
  { iata: 'ORY', name: 'Orly', city: 'Paris' },
  { iata: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt' },
  { iata: 'MUC', name: 'Munich Airport', city: 'Munich' },
  { iata: 'AMS', name: 'Schiphol', city: 'Amsterdam' },
  { iata: 'MAD', name: 'Barajas', city: 'Madrid' },
  { iata: 'BCN', name: 'El Prat', city: 'Barcelona' },
  { iata: 'FCO', name: 'Fiumicino', city: 'Rome' },
  { iata: 'MXP', name: 'Malpensa', city: 'Milan' },
  { iata: 'IST', name: 'Istanbul Airport', city: 'Istanbul' },
  { iata: 'SAW', name: 'Sabiha Gökçen', city: 'Istanbul' },
  { iata: 'ZRH', name: 'Zurich Airport', city: 'Zurich' },
  { iata: 'VIE', name: 'Vienna Intl', city: 'Vienna' },
  { iata: 'BRU', name: 'Brussels Airport', city: 'Brussels' },
  { iata: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen' },
  { iata: 'OSL', name: 'Oslo Gardermoen', city: 'Oslo' },
  { iata: 'ARN', name: 'Arlanda', city: 'Stockholm' },
  { iata: 'HEL', name: 'Helsinki-Vantaa', city: 'Helsinki' },
  { iata: 'DUB', name: 'Dublin Airport', city: 'Dublin' },
  { iata: 'LIS', name: 'Humberto Delgado', city: 'Lisbon' },
  { iata: 'OPO', name: 'Porto Airport', city: 'Porto' },
  { iata: 'ATH', name: 'Athens Intl', city: 'Athens' },
  { iata: 'WAW', name: 'Chopin', city: 'Warsaw' },
  { iata: 'PRG', name: 'Václav Havel', city: 'Prague' },
  { iata: 'BUD', name: 'Budapest Liszt', city: 'Budapest' },
  { iata: 'SVO', name: 'Sheremetyevo', city: 'Moscow' },
  { iata: 'LED', name: 'Pulkovo', city: 'St. Petersburg' },
  // Middle East
  { iata: 'DXB', name: 'Dubai Intl', city: 'Dubai' },
  { iata: 'DOH', name: 'Hamad Intl', city: 'Doha' },
  { iata: 'AUH', name: 'Abu Dhabi Intl', city: 'Abu Dhabi' },
  { iata: 'RUH', name: 'King Khalid Intl', city: 'Riyadh' },
  { iata: 'JED', name: 'King Abdulaziz Intl', city: 'Jeddah' },
  { iata: 'BAH', name: 'Bahrain Intl', city: 'Bahrain' },
  { iata: 'MCT', name: 'Muscat Intl', city: 'Muscat' },
  { iata: 'KWI', name: 'Kuwait Intl', city: 'Kuwait City' },
  { iata: 'AMM', name: 'Queen Alia Intl', city: 'Amman' },
  { iata: 'BEY', name: 'Rafic Hariri Intl', city: 'Beirut' },
  { iata: 'TLV', name: 'Ben Gurion', city: 'Tel Aviv' },
  // Asia
  { iata: 'SIN', name: 'Changi', city: 'Singapore' },
  { iata: 'HND', name: 'Haneda', city: 'Tokyo' },
  { iata: 'NRT', name: 'Narita Intl', city: 'Tokyo' },
  { iata: 'ICN', name: 'Incheon Intl', city: 'Seoul' },
  { iata: 'PEK', name: 'Beijing Capital', city: 'Beijing' },
  { iata: 'PKX', name: 'Beijing Daxing', city: 'Beijing' },
  { iata: 'PVG', name: 'Pudong', city: 'Shanghai' },
  { iata: 'HKG', name: 'Hong Kong Intl', city: 'Hong Kong' },
  { iata: 'TPE', name: 'Taoyuan Intl', city: 'Taipei' },
  { iata: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok' },
  { iata: 'KUL', name: 'Kuala Lumpur Intl', city: 'Kuala Lumpur' },
  { iata: 'CGK', name: 'Soekarno-Hatta', city: 'Jakarta' },
  { iata: 'MNL', name: 'Ninoy Aquino Intl', city: 'Manila' },
  { iata: 'DEL', name: 'Indira Gandhi Intl', city: 'Delhi' },
  { iata: 'BOM', name: 'Chhatrapati Shivaji', city: 'Mumbai' },
  { iata: 'BLR', name: 'Kempegowda Intl', city: 'Bangalore' },
  { iata: 'MAA', name: 'Chennai Intl', city: 'Chennai' },
  { iata: 'CCU', name: 'Netaji Subhas Chandra Bose', city: 'Kolkata' },
  { iata: 'HYD', name: 'Rajiv Gandhi Intl', city: 'Hyderabad' },
  { iata: 'CMB', name: 'Bandaranaike Intl', city: 'Colombo' },
  { iata: 'KTM', name: 'Tribhuvan Intl', city: 'Kathmandu' },
  { iata: 'DAC', name: 'Shahjalal Intl', city: 'Dhaka' },
  { iata: 'SGN', name: 'Tan Son Nhat', city: 'Ho Chi Minh City' },
  { iata: 'HAN', name: 'Noi Bai Intl', city: 'Hanoi' },
  // Africa
  { iata: 'JNB', name: 'O.R. Tambo Intl', city: 'Johannesburg' },
  { iata: 'CPT', name: 'Cape Town Intl', city: 'Cape Town' },
  { iata: 'CAI', name: 'Cairo Intl', city: 'Cairo' },
  { iata: 'CMN', name: 'Mohammed V Intl', city: 'Casablanca' },
  { iata: 'ADD', name: 'Bole Intl', city: 'Addis Ababa' },
  { iata: 'NBO', name: 'Jomo Kenyatta Intl', city: 'Nairobi' },
  { iata: 'DSS', name: 'Blaise Diagne Intl', city: 'Dakar' },
  { iata: 'LOS', name: 'Murtala Muhammed', city: 'Lagos' },
  { iata: 'ACC', name: 'Kotoka Intl', city: 'Accra' },
  { iata: 'TUN', name: 'Tunis-Carthage', city: 'Tunis' },
  // South America
  { iata: 'GRU', name: 'Guarulhos Intl', city: 'São Paulo' },
  { iata: 'GIG', name: 'Galeão Intl', city: 'Rio de Janeiro' },
  { iata: 'EZE', name: 'Ministro Pistarini', city: 'Buenos Aires' },
  { iata: 'SCL', name: 'Arturo Merino Benítez', city: 'Santiago' },
  { iata: 'BOG', name: 'El Dorado Intl', city: 'Bogotá' },
  { iata: 'LIM', name: 'Jorge Chávez Intl', city: 'Lima' },
  { iata: 'UIO', name: 'Mariscal Sucre Intl', city: 'Quito' },
  { iata: 'PTY', name: 'Tocumen Intl', city: 'Panama City' },
  { iata: 'MDE', name: 'José María Córdova', city: 'Medellín' },
  { iata: 'CCS', name: 'Simón Bolívar Intl', city: 'Caracas' },
  // Oceania
  { iata: 'SYD', name: 'Kingsford Smith', city: 'Sydney' },
  { iata: 'MEL', name: 'Melbourne Airport', city: 'Melbourne' },
  { iata: 'BNE', name: 'Brisbane Airport', city: 'Brisbane' },
  { iata: 'AKL', name: 'Auckland Airport', city: 'Auckland' },
  { iata: 'PER', name: 'Perth Airport', city: 'Perth' },
  { iata: 'WLG', name: 'Wellington Intl', city: 'Wellington' },
  // Pakistan / Central Asia
  { iata: 'KHI', name: 'Jinnah Intl', city: 'Karachi' },
  { iata: 'ISB', name: 'Islamabad Intl', city: 'Islamabad' },
  { iata: 'LHE', name: 'Allama Iqbal Intl', city: 'Lahore' },
  { iata: 'PEW', name: 'Bacha Khan Intl', city: 'Peshawar' },
  { iata: 'UET', name: 'Quetta Intl', city: 'Quetta' },
  { iata: 'MLE', name: 'Velana Intl', city: 'Malé' },
  { iata: 'TAS', name: 'Tashkent Intl', city: 'Tashkent' },
  { iata: 'ALA', name: 'Almaty Intl', city: 'Almaty' },
  { iata: 'GYD', name: 'Heydar Aliyev Intl', city: 'Baku' },
  { iata: 'TBS', name: 'Tbilisi Intl', city: 'Tbilisi' },
  { iata: 'EVN', name: 'Zvartnots Intl', city: 'Yerevan' },
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
    if (!search) return AIRPORTS.slice(0, 20);
    const s = search.toLowerCase();
    const matches = AIRPORTS.filter(
      a => a.iata.toLowerCase().includes(s) ||
           a.city.toLowerCase().includes(s) ||
           a.name.toLowerCase().includes(s)
    );
    // If typed exactly 3 letters that looks like an IATA code and no match, offer it as a custom option
    if (matches.length === 0 && /^[A-Za-z]{3}$/.test(search.trim())) {
      const code = search.trim().toUpperCase();
      return [{ iata: code, name: `${code} Airport`, city: code }];
    }
    return matches;
  };

  const handleSelectAirport = (
    airport: { iata: string; name: string; city: string },
    setSearch: (v: string) => void,
    setCode: (v: string) => void,
    setShow: (v: boolean) => void,
  ) => {
    setCode(airport.iata);
    setSearch(`${airport.city} (${airport.iata})`);
    setShow(false);
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

  const renderDropdown = (
    search: string,
    setSearch: (v: string) => void,
    code: string,
    setCode: (v: string) => void,
    show: boolean,
    setShow: (v: boolean) => void,
    label: string,
  ) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="text"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setShow(true);
          if (e.target.value.length === 0) setCode('');
        }}
        onFocus={() => setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 200)}
        placeholder="Type airport code or city name"
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
      />
      {show && (
        <div className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
          {filterAirports(search).map(a => (
            <button
              key={a.iata}
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => handleSelectAirport(a, setSearch, setCode, setShow)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3"
            >
              <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded shrink-0">{a.iata}</span>
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{a.city}</div>
                <div className="text-xs text-gray-500 truncate">{a.name}</div>
              </div>
            </button>
          ))}
          {filterAirports(search).length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">No airports found</div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="animate-fade-in">
      {!showResults ? (
        <>
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Search Real Flights
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Find real flight itineraries for your visa application or travel planning.
              All data comes from live airline sources.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {renderDropdown(originSearch, setOriginSearch, origin, setOrigin, showOriginDropdown, setShowOriginDropdown, 'From')}
                {renderDropdown(destSearch, setDestSearch, destination, setDestination, showDestDropdown, setShowDestDropdown, 'To')}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
