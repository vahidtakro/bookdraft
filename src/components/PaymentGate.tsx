import { useState } from 'react';
import type { BookingData } from '../lib/types';

interface PaymentGateProps {
  booking: BookingData;
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export function PaymentGate({ booking, onPaymentSuccess, onBack }: PaymentGateProps) {
  const [txHash, setTxHash] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const walletAddress = import.meta.env.PUBLIC_WALLET_ADDRESS || '';
  const usdtAmount = '2';

  const handleVerify = async () => {
    if (!txHash.trim()) {
      setError('Please enter the transaction hash');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash: txHash.trim(), bookingRef: booking.bookingRef }),
      });

      const data = await res.json();

      if (data.verified) {
        onPaymentSuccess();
      } else {
        setError(data.reason || 'Payment could not be verified. Please check the transaction hash and try again.');
      }
    } catch (err: any) {
      setError('Error verifying payment. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ethereum:${walletAddress}@56?amount=${usdtAmount}&token=0x55d398326f99059fF775485246999027B3197955&label=BookDraft-${booking.bookingRef}`;

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-6">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to passenger details
      </button>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Remove Watermark</h2>
          <p className="text-gray-500">
            Pay <strong className="text-gray-900">{usdtAmount} USDT</strong> (BEP20) to download a clean PDF without the watermark.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Booking Reference</span>
            <span className="font-mono font-semibold text-gray-900">{booking.bookingRef}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">Route</span>
            <span className="font-semibold text-gray-900">{booking.flight.origin} &rarr; {booking.flight.destination}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">Passenger</span>
            <span className="font-semibold text-gray-900">{booking.passenger.firstName} {booking.passenger.lastName}</span>
          </div>
        </div>

        {/* QR Code */}
        <div className="text-center mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Scan QR code to pay</p>
          <div className="inline-block p-4 bg-white rounded-2xl border-2 border-gray-100 shadow-sm">
            <img src={qrUrl} alt="USDT Payment QR Code" className="w-48 h-48" />
          </div>
        </div>

        {/* Wallet Address */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Send exactly {usdtAmount} USDT (BEP20) to:</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono text-sm text-gray-700 break-all">
              {walletAddress}
            </div>
            <button
              onClick={copyAddress}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors shrink-0"
            >
              {copied ? (
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Network Warning */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm">
          <p className="font-medium text-red-700 mb-1">Important: Use BEP20 (BSC) Network Only</p>
          <p className="text-red-600">
            Make sure to send USDT on the <strong>BEP20 (BNB Smart Chain)</strong> network. Sending on any other network will result in loss of funds.
          </p>
        </div>

        {/* Transaction Hash Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Paste your transaction hash</label>
          <input
            type="text"
            value={txHash}
            onChange={e => { setTxHash(e.target.value); setError(''); }}
            placeholder="0x..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 font-mono text-sm placeholder-gray-400"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm border border-red-100 mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={verifying || !txHash.trim()}
          className="w-full gradient-accent text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {verifying ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Verifying payment...
            </>
          ) : (
            'Verify Payment & Download'
          )}
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Payment is verified automatically via BscScan. This may take a few seconds.
        </p>
      </div>
    </div>
  );
}
