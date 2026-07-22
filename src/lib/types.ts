export interface FlightOffer {
  id: string;
  origin: string;
  destination: string;
  originName: string;
  destinationName: string;
  departureTime: string;
  arrivalTime: string;
  airline: string;
  airlineIata: string;
  airlineLogo: string;
  flightNumber: string;
  duration: string;
  stops: number;
  price: number;
  currency: string;
  cabinClass: string;
}

export interface PassengerInfo {
  firstName: string;
  lastName: string;
  passportNumber: string;
  email: string;
  phone: string;
  nationality: string;
  dateOfBirth: string;
}

export interface BookingData {
  flight: FlightOffer;
  passenger: PassengerInfo;
  bookingRef: string;
  createdAt: string;
  paid: boolean;
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: string;
}

export interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
}
