import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { BookingData } from '../lib/types';

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' },
  ],
});

interface ItineraryPDFProps {
  booking: BookingData;
  watermark: boolean;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1e293b',
    lineHeight: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#1e40af',
  },
  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'Helvetica-Bold',
  },
  logoSubtext: {
    fontSize: 8,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  refArea: {
    alignItems: 'flex-end',
  },
  refLabel: {
    fontSize: 8,
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  refValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e40af',
    fontFamily: 'Helvetica-Bold',
  },
  refDate: {
    fontSize: 8,
    color: '#475569',
    marginTop: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'Helvetica-Bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e40af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    fontFamily: 'Helvetica-Bold',
  },
  flightCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  flightRoute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  airport: {
    alignItems: 'center',
    width: 120,
  },
  airportCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'Helvetica-Bold',
  },
  airportCity: {
    fontSize: 10,
    color: '#475569',
    fontWeight: 'bold',
    marginTop: 2,
  },
  airportName: {
    fontSize: 7,
    color: '#94a3b8',
    marginTop: 1,
  },
  flightMiddle: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  flightDuration: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 4,
  },
  flightLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#94a3b8',
    marginBottom: 4,
  },
  flightStops: {
    fontSize: 8,
    color: '#64748b',
  },
  flightDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
    marginTop: 5,
  },
  flightDetailItem: {
    alignItems: 'center',
    flex: 1,
  },
  flightDetailLabel: {
    fontSize: 7,
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  flightDetailValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1e293b',
    fontFamily: 'Helvetica-Bold',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eff6ff',
    borderRadius: 4,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  dateItem: {
    alignItems: 'center',
    flex: 1,
  },
  dateLabel: {
    fontSize: 7,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e40af',
    fontFamily: 'Helvetica-Bold',
  },
  passengerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  passengerField: {
    width: '45%',
    marginBottom: 8,
  },
  passengerLabel: {
    fontSize: 7,
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  passengerValue: {
    fontSize: 10,
    color: '#1e293b',
    fontWeight: 'bold',
  },
  fareBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: '#86efac',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fareLabel: {
    fontSize: 10,
    color: '#166534',
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
  },
  fareValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#166534',
    fontFamily: 'Helvetica-Bold',
  },
  disclaimer: {
    backgroundColor: '#fefce8',
    borderRadius: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fde047',
    marginTop: 15,
  },
  disclaimerTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#854d0e',
    marginBottom: 4,
    fontFamily: 'Helvetica-Bold',
  },
  disclaimerText: {
    fontSize: 7,
    color: '#a16207',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 7,
    color: '#94a3b8',
  },
  watermark: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    transform: 'rotate(-25deg)',
    fontSize: 50,
    fontWeight: 'bold',
    color: 'rgba(239, 68, 68, 0.07)',
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
});

function formatTime(iso: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' });
  } catch { return iso; }
}

function formatDateFull(iso: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  } catch { return iso; }
}

function formatDateShort(iso: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  } catch { return iso; }
}

function formatDateGenerated(iso: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
  } catch { return iso; }
}

export function ItineraryPDF({ booking, watermark }: ItineraryPDFProps) {
  const { flight, passenger } = booking;

  const depDateFull = flight.departureDate ? formatDateFull(flight.departureDate) : '';
  const arrDateFull = flight.arrivalDate ? formatDateFull(flight.arrivalDate) : depDateFull;
  const depDateShort = flight.departureDate ? formatDateShort(flight.departureDate) : '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {watermark && <Text style={styles.watermark}>SAMPLE</Text>}

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoArea}>
            <View style={styles.logoIcon}>
              <Text style={{ fontSize: 16, color: '#ffffff', fontFamily: 'Helvetica-Bold' }}>BD</Text>
            </View>
            <View>
              <Text style={styles.logoText}>BOOK DRAFT</Text>
              <Text style={styles.logoSubtext}>Flight Itinerary</Text>
            </View>
          </View>
          <View style={styles.refArea}>
            <Text style={styles.refLabel}>Booking Reference</Text>
            <Text style={styles.refValue}>{booking.bookingRef}</Text>
            <Text style={styles.refDate}>Generated: {formatDateGenerated(booking.createdAt)}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Flight Itinerary / Reservation</Text>

        {/* Flight Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flight Details</Text>
          <View style={styles.flightCard}>
            <View style={styles.flightRoute}>
              <View style={styles.airport}>
                <Text style={styles.airportCode}>{flight.origin}</Text>
                <Text style={styles.airportCity}>{flight.originCity || flight.origin}</Text>
                <Text style={styles.airportName}>{flight.originName || ''}</Text>
              </View>
              <View style={styles.flightMiddle}>
                <Text style={styles.flightDuration}>{flight.duration}</Text>
                <View style={styles.flightLine} />
                <Text style={styles.flightStops}>
                  {flight.stops === 0 ? 'Direct Flight' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                </Text>
              </View>
              <View style={styles.airport}>
                <Text style={styles.airportCode}>{flight.destination}</Text>
                <Text style={styles.airportCity}>{flight.destinationCity || flight.destination}</Text>
                <Text style={styles.airportName}>{flight.destinationName || ''}</Text>
              </View>
            </View>

            {/* Departure / Arrival Times */}
            <View style={styles.flightDetailsGrid}>
              <View style={styles.flightDetailItem}>
                <Text style={styles.flightDetailLabel}>Departure</Text>
                <Text style={styles.flightDetailValue}>{formatTime(flight.departureTime)}</Text>
              </View>
              <View style={styles.flightDetailItem}>
                <Text style={styles.flightDetailLabel}>Arrival</Text>
                <Text style={styles.flightDetailValue}>{formatTime(flight.arrivalTime)}</Text>
              </View>
              <View style={styles.flightDetailItem}>
                <Text style={styles.flightDetailLabel}>Airline</Text>
                <Text style={styles.flightDetailValue}>{flight.airline}</Text>
              </View>
              <View style={styles.flightDetailItem}>
                <Text style={styles.flightDetailLabel}>Flight No.</Text>
                <Text style={styles.flightDetailValue}>{flight.flightNumber}</Text>
              </View>
              <View style={styles.flightDetailItem}>
                <Text style={styles.flightDetailLabel}>Cabin Class</Text>
                <Text style={styles.flightDetailValue}>{flight.cabinClass.charAt(0).toUpperCase() + flight.cabinClass.slice(1)}</Text>
              </View>
            </View>

            {/* Date Row */}
            <View style={styles.dateRow}>
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>Departure Date</Text>
                <Text style={styles.dateValue}>{depDateFull}</Text>
              </View>
              {flight.arrivalDate && flight.arrivalDate !== flight.departureDate && (
                <View style={styles.dateItem}>
                  <Text style={styles.dateLabel}>Arrival Date</Text>
                  <Text style={styles.dateValue}>{arrDateFull}</Text>
                </View>
              )}
            </View>

            {/* Fare */}
            <View style={styles.fareBox}>
              <Text style={styles.fareLabel}>Ticket Price</Text>
              <Text style={styles.fareValue}>{flight.currency} ${flight.price.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Passenger Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Passenger Information</Text>
          <View style={styles.passengerGrid}>
            <Field label="Full Name" value={`${passenger.firstName} ${passenger.lastName}`} />
            <Field label="Passport Number" value={passenger.passportNumber} />
            <Field label="Date of Birth" value={passenger.dateOfBirth} />
            <Field label="Nationality" value={passenger.nationality} />
            <Field label="Email" value={passenger.email} />
            <Field label="Phone" value={passenger.phone} />
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>IMPORTANT NOTICE</Text>
          <Text style={styles.disclaimerText}>
            This document is a flight itinerary / reservation draft for visa application and travel planning purposes only. 
            It is NOT a confirmed airline ticket, paid booking, or proof of purchase. 
            Flight schedules, availability, and fares are subject to change. 
            Please contact the airline directly to confirm your booking before travel.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Book Draft - Flight Itinerary Generator</Text>
          <Text style={styles.footerText}>For planning purposes only</Text>
        </View>
      </Page>
    </Document>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ width: '45%', marginBottom: 8 }}>
      <Text style={styles.passengerLabel}>{label}</Text>
      <Text style={styles.passengerValue}>{value}</Text>
    </View>
  );
}
