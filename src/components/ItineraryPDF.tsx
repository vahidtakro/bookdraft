import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
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
    borderBottomColor: '#3b82f6',
  },
  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  logoSubtext: {
    fontSize: 8,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
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
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3b82f6',
    fontFamily: 'Helvetica-Bold',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3b82f6',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  flightCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  flightRoute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  airport: {
    alignItems: 'center',
  },
  airportCode: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'Helvetica-Bold',
  },
  airportName: {
    fontSize: 8,
    color: '#64748b',
  },
  flightMiddle: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  flightDuration: {
    fontSize: 9,
    color: '#64748b',
  },
  flightLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#cbd5e1',
    marginVertical: 4,
  },
  flightStops: {
    fontSize: 8,
    color: '#94a3b8',
  },
  flightDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
    marginTop: 5,
  },
  flightDetailItem: {
    alignItems: 'center',
  },
  flightDetailLabel: {
    fontSize: 7,
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  flightDetailValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#334155',
    fontFamily: 'Helvetica-Bold',
  },
  passengerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  passengerField: {
    width: '45%',
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
  disclaimer: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fbbf24',
    marginTop: 15,
  },
  disclaimerTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 4,
    fontFamily: 'Helvetica-Bold',
  },
  disclaimerText: {
    fontSize: 8,
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
    top: '40%',
    left: '10%',
    right: '10%',
    transform: 'rotate(-30deg)',
    fontSize: 60,
    fontWeight: 'bold',
    color: 'rgba(239, 68, 68, 0.08)',
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  priceTag: {
    backgroundColor: '#eff6ff',
    borderRadius: 6,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  priceLabel: {
    fontSize: 9,
    color: '#1e40af',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    fontFamily: 'Helvetica-Bold',
  },
});

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch { return iso; }
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

export function ItineraryPDF({ booking, watermark }: ItineraryPDFProps) {
  const { flight, passenger } = booking;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {watermark && <Text style={styles.watermark}>BOOK DRAFT - SAMPLE</Text>}

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoArea}>
            <View style={styles.logoIcon}>
              <Text style={{ fontSize: 14, color: '#ffffff', fontFamily: 'Helvetica-Bold' }}>BD</Text>
            </View>
            <View>
              <Text style={styles.logoText}>BOOK DRAFT</Text>
              <Text style={styles.logoSubtext}>Flight Itinerary Generator</Text>
            </View>
          </View>
          <View style={styles.refArea}>
            <Text style={styles.refLabel}>Reference</Text>
            <Text style={styles.refValue}>{booking.bookingRef}</Text>
            <Text style={{ ...styles.refLabel, marginTop: 4 }}>Generated</Text>
            <Text style={{ fontSize: 8, color: '#475569' }}>{formatDate(booking.createdAt)}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Flight Itinerary</Text>

        {/* Flight Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flight Details</Text>
          <View style={styles.flightCard}>
            <View style={styles.flightRoute}>
              <View style={styles.airport}>
                <Text style={styles.airportCode}>{flight.origin}</Text>
                <Text style={styles.airportName}>{flight.originName || flight.origin}</Text>
              </View>
              <View style={styles.flightMiddle}>
                <Text style={styles.flightDuration}>{flight.duration}</Text>
                <View style={styles.flightLine} />
                <Text style={styles.flightStops}>
                  {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                </Text>
              </View>
              <View style={styles.airport}>
                <Text style={styles.airportCode}>{flight.destination}</Text>
                <Text style={styles.airportName}>{flight.destinationName || flight.destination}</Text>
              </View>
            </View>

            <View style={styles.flightDetails}>
              <View style={styles.flightDetailItem}>
                <Text style={styles.flightDetailLabel}>Airline</Text>
                <Text style={styles.flightDetailValue}>{flight.airline}</Text>
              </View>
              <View style={styles.flightDetailItem}>
                <Text style={styles.flightDetailLabel}>Flight No.</Text>
                <Text style={styles.flightDetailValue}>{flight.flightNumber}</Text>
              </View>
              <View style={styles.flightDetailItem}>
                <Text style={styles.flightDetailLabel}>Departure</Text>
                <Text style={styles.flightDetailValue}>{formatTime(flight.departureTime)}</Text>
              </View>
              <View style={styles.flightDetailItem}>
                <Text style={styles.flightDetailLabel}>Arrival</Text>
                <Text style={styles.flightDetailValue}>{formatTime(flight.arrivalTime)}</Text>
              </View>
              <View style={styles.flightDetailItem}>
                <Text style={styles.flightDetailLabel}>Cabin</Text>
                <Text style={styles.flightDetailValue}>{flight.cabinClass}</Text>
              </View>
            </View>

            <View style={styles.priceTag}>
              <Text style={styles.priceLabel}>Estimated Fare</Text>
              <Text style={styles.priceValue}>{flight.currency} ${flight.price.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Passenger Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Passenger Information</Text>
          <View style={styles.passengerGrid}>
            <Field label="Full Name" value={`${passenger.firstName} ${passenger.lastName}`} />
            <Field label="Passport Number" value={passenger.passportNumber} />
            <Field label="Email" value={passenger.email} />
            <Field label="Phone" value={passenger.phone} />
            <Field label="Nationality" value={passenger.nationality} />
            <Field label="Date of Birth" value={passenger.dateOfBirth} />
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>IMPORTANT DISCLAIMER</Text>
          <Text style={styles.disclaimerText}>
            This document represents a proposed itinerary / unconfirmed reservation draft generated for planning purposes only. 
            This is NOT a paid airline ticket, confirmed booking, or proof of purchase. 
            This itinerary is intended solely for use in visa applications and travel planning reference.
            Actual flight availability, schedules, and prices may vary and are subject to change without notice.
            Book Draft assumes no liability for decisions made based on this document.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Book Draft - Flight Itinerary / Reservation Draft Generator</Text>
          <Text style={styles.footerText}>www.bookdraft.app &bull; For planning purposes only</Text>
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
