import { useState, useCallback } from 'react';
import { FlightSearch } from './FlightSearch';
import { FlightResults } from './FlightResults';
import { PassengerForm } from './PassengerForm';
import { PaymentGate } from './PaymentGate';
import { DownloadPage } from './DownloadPage';
import type { FlightOffer, PassengerInfo, BookingData } from '../lib/types';

type Step = 'search' | 'results' | 'passenger' | 'payment' | 'download';

export default function App() {
  const [step, setStep] = useState<Step>('search');
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(null);
  const [passengerInfo, setPassengerInfo] = useState<PassengerInfo | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  const handleFlightSelect = useCallback((flight: FlightOffer) => {
    setSelectedFlight(flight);
    setStep('passenger');
  }, []);

  const handlePassengerSubmit = useCallback((passenger: PassengerInfo) => {
    setPassengerInfo(passenger);
    const booking: BookingData = {
      flight: selectedFlight!,
      passenger,
      bookingRef: generateBookingRef(),
      createdAt: new Date().toISOString(),
      paid: false,
    };
    setBookingData(booking);
    setStep('payment');
  }, [selectedFlight]);

  const handlePaymentSuccess = useCallback(() => {
    setBookingData(prev => prev ? { ...prev, paid: true } : null);
    setStep('download');
  }, []);

  const handleNewSearch = useCallback(() => {
    setStep('search');
    setSelectedFlight(null);
    setPassengerInfo(null);
    setBookingData(null);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="gradient-hero text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button onClick={handleNewSearch} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Book Draft</h1>
                <p className="text-xs text-blue-200">Flight Itinerary Generator</p>
              </div>
            </button>

            {/* Step indicator */}
            <div className="hidden sm:flex items-center gap-2">
              {(['search', 'results', 'passenger', 'payment', 'download'] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    step === s
                      ? 'bg-blue-500 text-white scale-110'
                      : getStepIndex(step) > i
                        ? 'bg-green-500 text-white'
                        : 'bg-white/10 text-white/50'
                  }`}>
                    {getStepIndex(step) > i ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < 4 && <div className={`w-8 h-0.5 ${getStepIndex(step) > i ? 'bg-green-500' : 'bg-white/10'}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {step === 'search' && (
          <FlightSearch onFlightSelect={handleFlightSelect} />
        )}
        {step === 'passenger' && selectedFlight && (
          <PassengerForm
            flight={selectedFlight}
            onSubmit={handlePassengerSubmit}
            onBack={() => setStep('search')}
          />
        )}
        {step === 'payment' && bookingData && (
          <PaymentGate
            booking={bookingData}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={() => setStep('passenger')}
          />
        )}
        {step === 'download' && bookingData && (
          <DownloadPage
            booking={bookingData}
            onNewSearch={handleNewSearch}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              <strong>Disclaimer:</strong> Book Draft is a flight itinerary / reservation draft generator for planning purposes only.
              Generated documents are NOT confirmed airline tickets or paid bookings.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Book Draft &copy; {new Date().getFullYear()} &mdash; For visa application and travel planning reference only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function generateBookingRef(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = 'BD-';
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

function getStepIndex(step: Step): number {
  const steps: Step[] = ['search', 'results', 'passenger', 'payment', 'download'];
  return steps.indexOf(step);
}
