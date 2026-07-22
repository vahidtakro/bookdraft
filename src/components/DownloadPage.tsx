import { useRef } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import type { BookingData } from '../lib/types';
import { ItineraryPDF } from './ItineraryPDF';

interface DownloadPageProps {
  booking: BookingData;
  onNewSearch: () => void;
}

export function DownloadPage({ booking, onNewSearch }: DownloadPageProps) {
  const getAirlineLogo = (iata: string) =>
    `https://www.gstatic.com/flights/airline_logos/70px/${iata}.png`;

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Verified!</h2>
        <p className="text-gray-500">Your watermark-free itinerary is ready for download.</p>
      </div>

      {/* Booking Summary */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-4">
          <img
            src={getAirlineLogo(booking.flight.airlineIata)}
            alt={booking.flight.airline}
            className="w-12 h-12 object-contain rounded-lg bg-gray-50 p-1"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="%23e2e8f0"/><text x="24" y="30" font-family="system-ui" font-size="14" font-weight="bold" fill="%2364748b" text-anchor="middle">${booking.flight.airlineIata}</text></svg>`;
            }}
          />
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-lg">{booking.flight.airline}</p>
            <p className="text-gray-500">{booking.flight.origin} &rarr; {booking.flight.destination}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{booking.bookingRef}</p>
          </div>
        </div>
      </div>

      {/* PDF Preview */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-700">PDF Preview</h3>
          <PDFDownloadLink
            document={<ItineraryPDF booking={booking} watermark={false} />}
            fileName={`BookDraft-${booking.bookingRef}.pdf`}
            className="gradient-accent text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all text-sm flex items-center gap-2"
          >
            {({ loading }) => loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </>
            )}
          </PDFDownloadLink>
        </div>
        <div className="h-[600px]">
          <PDFViewer width="100%" height="100%" showToolbar={false}>
            <ItineraryPDF booking={booking} watermark={false} />
          </PDFViewer>
        </div>
      </div>

      {/* New Search */}
      <div className="text-center">
        <button
          onClick={onNewSearch}
          className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
        >
          &larr; Search another flight
        </button>
      </div>
    </div>
  );
}
