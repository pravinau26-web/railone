import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNavigation, TabType } from './components/BottomNavigation';
import { HomeDashboard } from './components/HomeDashboard';
import { StationSearchModal } from './components/StationSearchModal';
import { UnreservedPlannerModal } from './components/UnreservedPlannerModal';
import { UnreservedJourneyScreen } from './components/UnreservedJourneyScreen';
import { ReservedPlannerModal } from './components/ReservedPlannerModal';
import { TrainSearchResults } from './components/TrainSearchResults';
import { PassengerDetailsScreen } from './components/PassengerDetailsScreen';
import { PlatformTicketModal } from './components/PlatformTicketModal';
import { PaymentModal } from './components/PaymentModal';
import { TicketDetailsScreen } from './components/TicketDetailsScreen';
import { MyBookingsScreen } from './components/MyBookingsScreen';
import { UserProfileScreen } from './components/UserProfileScreen';
import { SideMenuDrawer } from './components/SideMenuDrawer';
import { EditBookingModal } from './components/EditBookingModal';
import {
  RailMadadModal,
  PnrStatusModal,
  CoachPositionModal,
  TrackTrainModal,
  NotificationsModal,
} from './components/UtilityModals';

import {
  Station,
  Booking,
  UserProfile,
  RecentSearch,
  Train,
  ClassAvailability,
  QuotaType,
  TrainType,
  TicketType,
  TicketClass,
  Passenger,
} from './types';
import { MASTER_STATIONS, getStationByCode } from './data/stations';
import { bookingService } from './services/bookingService';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeScreen, setActiveScreen] = useState<
    'main' | 'unreserved-journey' | 'train-results' | 'passenger-details' | 'ticket-details'
  >('main');

  // Modals
  const [activeModal, setActiveModal] = useState<
    | null
    | 'station-search'
    | 'unreserved-planner'
    | 'reserved-planner'
    | 'platform-ticket'
    | 'payment'
    | 'rail-madad'
    | 'pnr'
    | 'coach'
    | 'track'
    | 'notifications'
    | 'menu-drawer'
  >(null);

  const [stationSearchMode, setStationSearchMode] = useState<'source' | 'destination'>('source');

  // Stations State (Default: GUDUVANCHERI to CHENNAI BEACH JN.)
  const [fromStation, setFromStation] = useState<Station>(
    () => getStationByCode('GI') || MASTER_STATIONS[0]
  );
  const [toStation, setToStation] = useState<Station>(
    () => getStationByCode('MSB') || MASTER_STATIONS[1]
  );

  // App Data State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => bookingService.getUserProfile());
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() =>
    bookingService.getRecentSearches()
  );

  // Flow State
  const [selectedBookingForView, setSelectedBookingForView] = useState<Booking | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [showEditBookingModal, setShowEditBookingModal] = useState<boolean>(false);

  // Reserved Flow State
  const [reservedSearchParams, setReservedSearchParams] = useState<{
    journeyDate: string;
    classType: string;
    quota: QuotaType;
  }>({
    journeyDate: 'Tue, 10 Nov 26',
    classType: 'All',
    quota: 'General',
  });

  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [selectedTrainClass, setSelectedTrainClass] = useState<ClassAvailability | null>(null);

  // Payment Pending State
  const [pendingBookingData, setPendingBookingData] = useState<{
    bookingType: 'UNRESERVED' | 'RESERVED' | 'PLATFORM';
    fromStation: Station;
    toStation: Station;
    viaStation?: string;
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
    distanceKm: number;
  } | null>(null);

  // Load Bookings on mount
  useEffect(() => {
    async function loadData() {
      const data = await bookingService.getBookings();
      setBookings(data);
    }
    loadData();
  }, []);

  // Most recent / active booking for the Home upcoming journey card
  const latestBooking = bookings.find((b) => b.status === 'ACTIVE') || bookings[0];

  // Station Swapping Handler
  const handleSwapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  // Station Selection Handler
  const handleSelectStation = (station: Station) => {
    if (stationSearchMode === 'source') {
      setFromStation(station);
    } else {
      setToStation(station);
    }
    bookingService.saveRecentSearch(
      stationSearchMode === 'source' ? station : fromStation,
      stationSearchMode === 'destination' ? station : toStation
    );
    setRecentSearches(bookingService.getRecentSearches());
  };

  // Open Station Search Modal
  const handleOpenStationSearch = (mode: 'source' | 'destination') => {
    setStationSearchMode(mode);
    setActiveModal('station-search');
  };

  // Select a Recent Search
  const handleSelectRecentSearch = (search: RecentSearch) => {
    setFromStation(search.from);
    setToStation(search.to);
  };

  // 1. Unreserved Flow: Planner -> Journey Config
  const handleUnreservedProceedToBook = () => {
    setActiveModal(null);
    setActiveScreen('unreserved-journey');
  };

  // 2. Unreserved Flow: Journey Config -> Payment
  const handleUnreservedProceedToPayment = (details: {
    fromStation: Station;
    toStation: Station;
    trainType: TrainType;
    ticketType: TicketType;
    classType: TicketClass;
    adultCount: number;
    childCount: number;
    fare: number;
    distanceKm: number;
  }) => {
    setPendingBookingData({
      bookingType: 'UNRESERVED',
      fromStation: details.fromStation,
      toStation: details.toStation,
      viaStation: 'TBM',
      trainType: details.trainType,
      ticketType: details.ticketType,
      classType: details.classType,
      adultCount: details.adultCount,
      childCount: details.childCount,
      fare: details.fare,
      distanceKm: details.distanceKm,
    });
    setActiveModal('payment');
  };

  // 3. Reserved Flow: Planner -> Search Results
  const handleReservedSearchTrains = (params: {
    fromStation: Station;
    toStation: Station;
    journeyDate: string;
    classType: string;
    quota: QuotaType;
  }) => {
    setReservedSearchParams({
      journeyDate: params.journeyDate,
      classType: params.classType,
      quota: params.quota,
    });
    setActiveModal(null);
    setActiveScreen('train-results');
  };

  // 4. Reserved Flow: Train Selected -> Passenger Details
  const handleSelectTrainAndClass = (train: Train, cls: ClassAvailability) => {
    setSelectedTrain(train);
    setSelectedTrainClass(cls);
    setActiveScreen('passenger-details');
  };

  // 5. Reserved Flow: Passenger Details -> Payment
  const handleReservedProceedToSummary = (passengers: Passenger[], contactMobile: string) => {
    if (!selectedTrain || !selectedTrainClass) return;
    const totalFare = passengers.length * selectedTrainClass.fare;

    setPendingBookingData({
      bookingType: 'RESERVED',
      fromStation,
      toStation,
      viaStation: 'DIRECT',
      trainNumber: selectedTrain.number,
      trainName: selectedTrain.name,
      trainType: selectedTrain.type,
      ticketType: 'JOURNEY',
      classType: selectedTrainClass.classCode,
      quota: reservedSearchParams.quota,
      adultCount: passengers.length,
      childCount: 0,
      passengers,
      fare: totalFare,
      distanceKm: selectedTrain.distanceKm,
    });
    setActiveModal('payment');
  };

  // 6. Platform Ticket Flow -> Payment
  const handlePlatformProceedToPayment = (station: Station, persons: number, fare: number) => {
    setPendingBookingData({
      bookingType: 'PLATFORM',
      fromStation: station,
      toStation: station,
      trainType: 'ORDINARY',
      ticketType: 'PLATFORM',
      classType: 'SECOND',
      adultCount: persons,
      childCount: 0,
      fare: fare,
      distanceKm: 0,
    });
    setActiveModal('payment');
  };

  // 7. Payment Success Handler -> Creates Booking and Opens Ticket View
  const handlePaymentSuccess = async (method: 'R-Wallet' | 'UPI' | 'Card', finalAmount?: number) => {
    if (!pendingBookingData) return;

    const actualFare = finalAmount !== undefined ? finalAmount : pendingBookingData.fare;

    const now = new Date();
    const formattedDate = 'Tue, 10 Nov 26';
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${mins}`;

    const newBooking = await bookingService.createBooking({
      bookingType: pendingBookingData.bookingType,
      status: 'ACTIVE',
      bookingDate: formattedDate,
      bookingTime: formattedTime,
      journeyDate: formattedDate,
      sourceStation: pendingBookingData.fromStation,
      destinationStation: pendingBookingData.toStation,
      viaStation: pendingBookingData.viaStation || 'TBM',
      distanceKm: pendingBookingData.distanceKm,
      trainNumber: pendingBookingData.trainNumber || '40701',
      trainName: pendingBookingData.trainName || 'SUBURBAN ORDINARY',
      trainType: pendingBookingData.trainType,
      ticketType: pendingBookingData.ticketType,
      classType: pendingBookingData.classType,
      quota: pendingBookingData.quota || 'General',
      adultCount: pendingBookingData.adultCount,
      childCount: pendingBookingData.childCount,
      passengers: pendingBookingData.passengers,
      fare: actualFare,
      gst: 0.0,
      totalFare: actualFare,
      paymentMethod: method === 'R-Wallet' ? 'R-Wallet' : method === 'UPI' ? 'UPI' : 'Card',
      bookedBy: userProfile.name,
      mobileNumber: userProfile.mobile,
      irCode: 'IR:33AAAGM0289C1ZQ',
    });

    // Refresh state
    const allBookings = await bookingService.getBookings();
    setBookings(allBookings);
    setUserProfile(bookingService.getUserProfile());

    // Transition to Ticket Details screen
    setSelectedBookingForView(newBooking);
    setActiveModal(null);
    setActiveScreen('ticket-details');
    setPendingBookingData(null);
  };

  // View Ticket Details
  const handleViewTicketDetails = (booking: Booking) => {
    setSelectedBookingForView(booking);
    setActiveScreen('ticket-details');
  };

  // Book Again
  const handleBookAgain = (booking: Booking) => {
    setFromStation(booking.sourceStation);
    setToStation(booking.destinationStation);
    if (booking.bookingType === 'RESERVED') {
      setActiveModal('reserved-planner');
    } else {
      setActiveModal('unreserved-planner');
    }
  };

  // Delete Booking
  const handleDeleteBooking = async (id: string) => {
    await bookingService.deleteBooking(id);
    const updated = await bookingService.getBookings();
    setBookings(updated);
  };

  // Update Booking (stations, fare, via, etc.)
  const handleUpdateBooking = async (updated: Booking) => {
    await bookingService.updateBooking(updated.id, updated);
    const all = await bookingService.getBookings();
    setBookings(all);
    if (selectedBookingForView?.id === updated.id) {
      setSelectedBookingForView(updated);
    }
  };

  // Trigger edit modal
  const handleOpenEditBooking = (bookingToEdit: Booking) => {
    setEditingBooking(bookingToEdit);
    setShowEditBookingModal(true);
  };

  // Wallet Top-up
  const handleAddWalletMoney = (amount: number) => {
    const updated = bookingService.addWalletMoney(amount);
    setUserProfile(updated);
  };

  // Tab switching
  const handleTabChange = (tab: TabType) => {
    if (tab === 'menu') {
      setActiveModal('menu-drawer');
      return;
    }
    setActiveTab(tab);
    setActiveScreen('main');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Header (Only on main screen) */}
      {activeScreen === 'main' && (
        <Header
          userProfile={userProfile}
          onOpenNotifications={() => setActiveModal('notifications')}
          onOpenProfile={() => setActiveTab('you')}
        />
      )}

      {/* Screen Routing */}
      <main className="flex-1 max-w-md mx-auto w-full">
        {activeScreen === 'ticket-details' && selectedBookingForView ? (
          <TicketDetailsScreen
            booking={selectedBookingForView}
            onBack={() => {
              setActiveScreen('main');
              setActiveTab('bookings');
            }}
            onBookConnecting={() => {
              // Pre-fill destination as source for connecting journey
              setFromStation(selectedBookingForView.destinationStation);
              setActiveModal('unreserved-planner');
              setActiveScreen('main');
            }}
            onBookAnother={() => {
              setActiveScreen('main');
              setActiveModal('unreserved-planner');
            }}
            onUpdateBooking={handleUpdateBooking}
          />
        ) : activeScreen === 'unreserved-journey' ? (
          <UnreservedJourneyScreen
            fromStation={fromStation}
            toStation={toStation}
            onBack={() => setActiveScreen('main')}
            onProceedToPayment={handleUnreservedProceedToPayment}
          />
        ) : activeScreen === 'train-results' ? (
          <TrainSearchResults
            fromStation={fromStation}
            toStation={toStation}
            journeyDate={reservedSearchParams.journeyDate}
            selectedClass={reservedSearchParams.classType}
            quota={reservedSearchParams.quota}
            onBack={() => setActiveScreen('main')}
            onSelectTrain={handleSelectTrainAndClass}
          />
        ) : activeScreen === 'passenger-details' && selectedTrain && selectedTrainClass ? (
          <PassengerDetailsScreen
            train={selectedTrain}
            selectedClass={selectedTrainClass}
            fromStation={fromStation}
            toStation={toStation}
            journeyDate={reservedSearchParams.journeyDate}
            quota={reservedSearchParams.quota}
            onBack={() => setActiveScreen('train-results')}
            onProceedToSummary={handleReservedProceedToSummary}
          />
        ) : (
          /* Main Screen Tab Views */
          <div>
            {activeTab === 'home' && (
              <HomeDashboard
                latestBooking={latestBooking}
                onOpenReserved={() => setActiveModal('reserved-planner')}
                onOpenUnreserved={() => setActiveModal('unreserved-planner')}
                onOpenPlatform={() => setActiveModal('platform-ticket')}
                onOpenPnr={() => setActiveModal('pnr')}
                onOpenCoach={() => setActiveModal('coach')}
                onOpenTrack={() => setActiveModal('track')}
                onOpenRailMadad={() => setActiveModal('rail-madad')}
                onOpenOrderFood={() =>
                  alert('IRCTC eCatering: Food on Track delivery is available at major junctions.')
                }
                onOpenFileRefund={() =>
                  alert('File TDR: Indian Railways online refund portal for cancelled/delayed trains.')
                }
                onViewBookingDetails={handleViewTicketDetails}
                onBookAgain={handleBookAgain}
                onEditBooking={handleOpenEditBooking}
              />
            )}

            {activeTab === 'bookings' && (
              <MyBookingsScreen
                bookings={bookings}
                onSelectBooking={handleViewTicketDetails}
                onBookAgain={handleBookAgain}
                onDeleteBooking={handleDeleteBooking}
                onBackToHome={() => setActiveTab('home')}
                onRefresh={async () => {
                  const data = await bookingService.getBookings();
                  setBookings(data);
                }}
                onEditBooking={handleOpenEditBooking}
              />
            )}

            {activeTab === 'you' && (
              <UserProfileScreen
                userProfile={userProfile}
                onUpdateProfile={(updates) => {
                  const updated = bookingService.updateUserProfile(updates);
                  setUserProfile(updated);
                }}
                onAddMoney={handleAddWalletMoney}
                onBackToHome={() => setActiveTab('home')}
              />
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation (Only visible on main screen) */}
      {activeScreen === 'main' && (
        <BottomNavigation
          activeTab={activeTab}
          onChangeTab={handleTabChange}
          bookingCount={bookings.filter((b) => b.status === 'ACTIVE').length}
        />
      )}

      {/* Modals */}
      {/* 1. Station Search Modal */}
      <StationSearchModal
        isOpen={activeModal === 'station-search'}
        mode={stationSearchMode}
        currentSelected={stationSearchMode === 'source' ? fromStation : toStation}
        disabledStationCode={stationSearchMode === 'source' ? toStation.code : fromStation.code}
        onSelectStation={handleSelectStation}
        onClose={() => setActiveModal(null)}
      />

      {/* 2. Unreserved Planner Modal */}
      <UnreservedPlannerModal
        isOpen={activeModal === 'unreserved-planner'}
        onClose={() => setActiveModal(null)}
        fromStation={fromStation}
        toStation={toStation}
        recentSearches={recentSearches}
        onOpenStationSearch={handleOpenStationSearch}
        onSwapStations={handleSwapStations}
        onSelectRecentSearch={handleSelectRecentSearch}
        onProceedToBook={handleUnreservedProceedToBook}
        onCheckUpcomingTrains={() => {
          setActiveModal(null);
          setActiveScreen('train-results');
        }}
      />

      {/* 3. Reserved Planner Modal */}
      <ReservedPlannerModal
        isOpen={activeModal === 'reserved-planner'}
        onClose={() => setActiveModal(null)}
        fromStation={fromStation}
        toStation={toStation}
        onOpenStationSearch={handleOpenStationSearch}
        onSwapStations={handleSwapStations}
        onSearchTrains={handleReservedSearchTrains}
      />

      {/* 4. Platform Ticket Modal */}
      <PlatformTicketModal
        isOpen={activeModal === 'platform-ticket'}
        onClose={() => setActiveModal(null)}
        currentStation={fromStation}
        onOpenStationSearch={() => handleOpenStationSearch('source')}
        onProceedToPayment={handlePlatformProceedToPayment}
      />

      {/* 5. Payment Modal */}
      {pendingBookingData && (
        <PaymentModal
          isOpen={activeModal === 'payment'}
          onClose={() => setActiveModal(null)}
          fromStation={pendingBookingData.fromStation}
          toStation={pendingBookingData.toStation}
          amount={pendingBookingData.fare}
          walletBalance={userProfile.walletBalance}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* 6. Side Menu Drawer */}
      <SideMenuDrawer
        isOpen={activeModal === 'menu-drawer'}
        onClose={() => setActiveModal(null)}
        userProfile={userProfile}
        onAddMoney={() => {
          setActiveTab('you');
          setActiveModal(null);
        }}
      />

      {/* 7. Utility Modals */}
      <RailMadadModal
        isOpen={activeModal === 'rail-madad'}
        onClose={() => setActiveModal(null)}
        stationName={`${fromStation.name} - ${fromStation.code}`}
      />

      <PnrStatusModal
        isOpen={activeModal === 'pnr'}
        onClose={() => setActiveModal(null)}
      />

      <CoachPositionModal
        isOpen={activeModal === 'coach'}
        onClose={() => setActiveModal(null)}
      />

      <TrackTrainModal
        isOpen={activeModal === 'track'}
        onClose={() => setActiveModal(null)}
      />

      <NotificationsModal
        isOpen={activeModal === 'notifications'}
        onClose={() => setActiveModal(null)}
      />

      {/* 8. Live Ticket / Booking Editor Modal */}
      {editingBooking && (
        <EditBookingModal
          isOpen={showEditBookingModal}
          booking={editingBooking}
          onClose={() => {
            setShowEditBookingModal(false);
            setEditingBooking(null);
          }}
          onSave={handleUpdateBooking}
        />
      )}
    </div>
  );
}
