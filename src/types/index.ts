/**
 * RailOne Railway Booking App - Type Definitions
 */

export interface Station {
  code: string;
  name: string;
  state: string;
  city?: string;
  division?: string;
  zone?: string;
}

export type TicketClass = '2S' | 'SL' | '3A' | '2A' | '1A' | 'CC' | 'EC' | 'SECOND' | 'FIRST';

export type QuotaType =
  | 'General'
  | 'Ladies'
  | 'Lower Berth/Sr. Citizen'
  | 'Person with Disability'
  | 'Duty Pass'
  | 'Tatkal'
  | 'Premium Tatkal';

export type TrainType = 'ORDINARY' | 'MAIL/EXP' | 'SUPERFAST' | 'VANDE BHARAT' | 'AC EMU';

export type TicketType = 'JOURNEY' | 'RETURN' | 'SEASON' | 'PLATFORM';

export type BookingStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';

export interface ClassAvailability {
  classCode: TicketClass;
  className: string;
  fare: number;
  status: 'AVAILABLE' | 'RAC' | 'WL';
  availableCount: number;
}

export interface Train {
  number: string;
  name: string;
  type: TrainType;
  sourceStation: string;
  destinationStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runningDays: string[];
  classes: ClassAvailability[];
  distanceKm: number;
}

export interface Passenger {
  id: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'TRANSGENDER';
  berthPreference?: 'LOWER' | 'MIDDLE' | 'UPPER' | 'SIDE LOWER' | 'SIDE UPPER' | 'NO PREFERENCE';
  foodPreference?: 'VEG' | 'NON-VEG' | 'NONE';
  concession?: string;
}

export interface Booking {
  id: string;
  utsNumber: string;
  referenceNumber: string;
  bookingType: 'UNRESERVED' | 'RESERVED' | 'PLATFORM';
  status: BookingStatus;
  bookingDate: string;
  bookingTime: string;
  journeyDate: string;
  sourceStation: Station;
  destinationStation: Station;
  viaStation?: string;
  distanceKm: number;
  trainNumber?: string;
  trainName?: string;
  trainType: TrainType;
  ticketType: TicketType;
  classType: TicketClass;
  quota?: QuotaType;
  adultCount: number;
  childCount: number;
  passengers?: Passenger[];
  fare: number;
  gst: number;
  totalFare: number;
  paymentMethod: 'R-Wallet' | 'UPI' | 'Card' | 'NetBanking';
  irCode: string;
  isReturn?: boolean;
  returnDate?: string;
  bookedBy: string;
  mobileNumber: string;
}

export interface RecentSearch {
  from: Station;
  to: Station;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  mobile: string;
  email: string;
  walletBalance: number;
  aadharLinked: boolean;
  biometricEnabled: boolean;
}
