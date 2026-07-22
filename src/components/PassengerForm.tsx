import { useState } from 'react';
import type { FlightOffer, PassengerInfo } from '../lib/types';

interface PassengerFormProps {
  flight: FlightOffer;
  onSubmit: (passenger: PassengerInfo) => void;
  onBack: () => void;
}

export function PassengerForm({ flight, onSubmit, onBack }: PassengerFormProps) {
  const [form, setForm] = useState<PassengerInfo>({
    firstName: '',
    lastName: '',
    passportNumber: '',
    email: '',
    phone: '',
    nationality: '',
    dateOfBirth: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getAirlineLogo = (iata: string) =>
    `https://www.gstatic.com/flights/airline_logos/70px/${iata}.png`;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (!form.passportNumber.trim()) errs.passportNumber = 'Passport number is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    if (!form.nationality.trim()) errs.nationality = 'Nationality is required';
    if (!form.dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const update = (field: keyof PassengerInfo, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-6">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to results
      </button>

      {/* Flight Summary */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Selected Flight</h3>
        <div className="flex items-center gap-4">
          <img
            src={getAirlineLogo(flight.airlineIata)}
            alt={flight.airline}
            className="w-10 h-10 object-contain rounded-lg bg-gray-50 p-1"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="%23e2e8f0"/><text x="20" y="25" font-family="system-ui" font-size="12" font-weight="bold" fill="%2364748b" text-anchor="middle">${flight.airlineIata}</text></svg>`;
            }}
          />
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{flight.airline} &bull; {flight.flightNumber}</p>
            <p className="text-sm text-gray-500">{flight.origin} &rarr; {flight.destination} &bull; {flight.duration}</p>
          </div>
          <p className="text-xl font-bold text-blue-600">${flight.price.toLocaleString()}</p>
        </div>
      </div>

      {/* Passenger Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Passenger Details</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="First Name" value={form.firstName} onChange={v => update('firstName', v)} error={errors.firstName} placeholder="As shown on passport" />
            <Field label="Last Name" value={form.lastName} onChange={v => update('lastName', v)} error={errors.lastName} placeholder="As shown on passport" />
          </div>

          <Field label="Passport Number" value={form.passportNumber} onChange={v => update('passportNumber', v)} error={errors.passportNumber} placeholder="e.g. A12345678" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Email Address" type="email" value={form.email} onChange={v => update('email', v)} error={errors.email} placeholder="you@example.com" />
            <Field label="Phone Number" type="tel" value={form.phone} onChange={v => update('phone', v)} error={errors.phone} placeholder="+1 234 567 890" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Nationality" value={form.nationality} onChange={v => update('nationality', v)} error={errors.nationality} placeholder="e.g. American" />
            <Field label="Date of Birth" type="date" value={form.dateOfBirth} onChange={v => update('dateOfBirth', v)} error={errors.dateOfBirth} />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
            <p className="font-medium mb-1">Important Notice</p>
            <p className="text-amber-600">
              This form generates a flight itinerary draft for visa and planning purposes. It is NOT a confirmed airline booking.
              All flight details are based on real airline data.
            </p>
          </div>

          <button
            type="submit"
            className="w-full gradient-accent text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all"
          >
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, type = 'text', value, onChange, error, placeholder }: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-200'
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
