import { Booking, Station, UserProfile, RecentSearch } from '../types';
import { INITIAL_BOOKINGS } from '../data/mockBookings';
import { MASTER_STATIONS, getStationByCode, saveCustomStation, searchStations } from '../data/stations';

const STORAGE_KEYS = {
  BOOKINGS: 'railone_bookings_v2',
  RECENT_SEARCHES: 'railone_recent_searches_v2',
  USER_PROFILE: 'railone_user_profile_v2',
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Pravinkumar s Asaithambi',
  mobile: '9245464648',
  email: 'pravinau26@gmail.com',
  walletBalance: 27.55,
  aadharLinked: true,
  biometricEnabled: false,
};

const DEFAULT_RECENT_SEARCHES: RecentSearch[] = [
  {
    from: getStationByCode('VI')!,
    to: getStationByCode('GI')!,
    timestamp: Date.now() - 3600000 * 24,
  },
  {
    from: getStationByCode('GI')!,
    to: getStationByCode('MSB')!,
    timestamp: Date.now() - 3600000 * 48,
  },
  {
    from: getStationByCode('GI')!,
    to: getStationByCode('GDY')!,
    timestamp: Date.now() - 3600000 * 72,
  },
  {
    from: getStationByCode('TBM')!,
    to: getStationByCode('MSB')!,
    timestamp: Date.now() - 3600000 * 96,
  },
];

// Helper to get from local storage
function getLocal<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage`, err);
    return defaultValue;
  }
}

// Helper to set local storage
function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage`, err);
  }
}

export const bookingService = {
  // Get all bookings (with fallback to backend if accessible)
  async getBookings(): Promise<Booking[]> {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setLocal(STORAGE_KEYS.BOOKINGS, data);
          return data;
        }
      }
    } catch {
      // Backend offline or running purely on frontend, use local cache
    }
    return getLocal<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  },

  // Get single booking
  async getBookingById(id: string): Promise<Booking | undefined> {
    const bookings = await this.getBookings();
    return bookings.find((b) => b.id === id || b.utsNumber === id);
  },

  // Create booking
  async createBooking(booking: Omit<Booking, 'id' | 'utsNumber' | 'referenceNumber'>): Promise<Booking> {
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newId = 'b-' + Date.now();
    const newUts = 'XAB3EH' + randomChars;
    const newRef = 'R' + Math.floor(10000 + Math.random() * 90000);

    const fullBooking: Booking = {
      ...booking,
      id: newId,
      utsNumber: newUts,
      referenceNumber: newRef,
      irCode: 'IR:33AAAGM0289C1ZQ',
    };

    // Save to backend if available
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullBooking),
      });
    } catch {
      // Backend fallback
    }

    // Save locally
    const existing = getLocal<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    // Add new booking to front
    const updated = [fullBooking, ...existing];
    setLocal(STORAGE_KEYS.BOOKINGS, updated);

    // If paid by R-Wallet, deduct balance
    if (fullBooking.paymentMethod === 'R-Wallet') {
      this.deductWalletMoney(fullBooking.totalFare);
    }

    return fullBooking;
  },

  // Update booking
  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null> {
    const existing = getLocal<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const index = existing.findIndex((b) => b.id === id || b.utsNumber === id);
    if (index === -1) return null;

    const updatedBooking = { ...existing[index], ...updates };
    existing[index] = updatedBooking;
    setLocal(STORAGE_KEYS.BOOKINGS, existing);

    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBooking),
      });
    } catch {
      // fallback
    }

    return updatedBooking;
  },

  // Delete booking
  async deleteBooking(id: string): Promise<boolean> {
    const existing = getLocal<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const filtered = existing.filter((b) => b.id !== id && b.utsNumber !== id);
    setLocal(STORAGE_KEYS.BOOKINGS, filtered);

    try {
      await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    } catch {
      // fallback
    }

    return true;
  },

  // Get most recent active or upcoming booking
  async getLatestBooking(): Promise<Booking | undefined> {
    const bookings = await this.getBookings();
    const active = bookings.find((b) => b.status === 'ACTIVE');
    return active || bookings[0];
  },

  // Recent searches
  getRecentSearches(): RecentSearch[] {
    return getLocal<RecentSearch[]>(STORAGE_KEYS.RECENT_SEARCHES, DEFAULT_RECENT_SEARCHES);
  },

  saveRecentSearch(from: Station, to: Station): void {
    if (from.code === to.code) return;
    const existing = this.getRecentSearches();
    const filtered = existing.filter(
      (s) => !(s.from.code === from.code && s.to.code === to.code)
    );
    const updated = [{ from, to, timestamp: Date.now() }, ...filtered].slice(0, 6);
    setLocal(STORAGE_KEYS.RECENT_SEARCHES, updated);
  },

  // User Profile
  getUserProfile(): UserProfile {
    return getLocal<UserProfile>(STORAGE_KEYS.USER_PROFILE, DEFAULT_PROFILE);
  },

  updateUserProfile(profile: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile();
    const updated = { ...current, ...profile };
    setLocal(STORAGE_KEYS.USER_PROFILE, updated);
    return updated;
  },

  addWalletMoney(amount: number): UserProfile {
    const current = this.getUserProfile();
    const updated = { ...current, walletBalance: +(current.walletBalance + amount).toFixed(2) };
    setLocal(STORAGE_KEYS.USER_PROFILE, updated);
    return updated;
  },

  deductWalletMoney(amount: number): UserProfile {
    const current = this.getUserProfile();
    const newBal = Math.max(0, +(current.walletBalance - amount).toFixed(2));
    const updated = { ...current, walletBalance: newBal };
    setLocal(STORAGE_KEYS.USER_PROFILE, updated);
    return updated;
  },

  // Search trains from backend / RailKit API
  async getTrains(from: string, to: string): Promise<any[]> {
    try {
      const res = await fetch(`/api/trains?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (err) {
      console.warn('Train fetch fallback:', err);
    }
    return [];
  },

  // Stations Management
  addCustomStation(station: Station): Station {
    return saveCustomStation(station);
  },

  getStations(query?: string): Station[] {
    return searchStations(query || '');
  },

  // Reset demo data
  resetDemoData(): void {
    setLocal(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    setLocal(STORAGE_KEYS.RECENT_SEARCHES, DEFAULT_RECENT_SEARCHES);
    setLocal(STORAGE_KEYS.USER_PROFILE, DEFAULT_PROFILE);
  },
};
