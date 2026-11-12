import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Ticket as TicketIcon, Eye, PlusCircle, Pencil } from 'lucide-react';
import { Booking } from '../types';

interface MyBookingsScreenProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onBookAgain: (booking: Booking) => void;
  onDeleteBooking: (bookingId: string) => void;
  onBackToHome: () => void;
  onRefresh: () => void;
  onEditBooking?: (booking: Booking) => void;
}

export const MyBookingsScreen: React.FC<MyBookingsScreenProps> = ({
  bookings,
  onSelectBooking,
  onBookAgain,
  onDeleteBooking,
  onBackToHome,
  onRefresh,
  onEditBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed' | 'Cancelled' | 'All'>('Upcoming');

  const upcomingBookings = bookings.filter((b) => b.status === 'ACTIVE');
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');
  const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED');

  const currentList = (() => {
    switch (activeTab) {
      case 'Upcoming':
        return upcomingBookings;
      case 'Completed':
        return completedBookings;
      case 'Cancelled':
        return cancelledBookings;
      case 'All':
      default:
        return bookings;
    }
  })();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col max-w-md mx-auto shadow-2xl pb-20 select-none">
      {/* Top Blue Header */}
      <div className="bg-[#1264df] text-white px-4 py-3.5 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToHome}
            className="p-1 hover:bg-blue-700 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold leading-tight">My Bookings</h1>
            <p className="text-[11px] text-blue-100 font-medium">
              Tickets from last 45 days are displayed
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="p-1.5 hover:bg-blue-700 rounded-full text-blue-100 hover:text-white transition-colors cursor-pointer"
          title="Refresh Bookings"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs matching video */}
      <div className="bg-white border-b border-slate-200 px-2 py-1.5 grid grid-cols-4 gap-1 text-center sticky top-0 z-30 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('Upcoming')}
          className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'Upcoming'
              ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50/50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Upcoming ({upcomingBookings.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('Completed')}
          className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'Completed'
              ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50/50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Completed ({completedBookings.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('Cancelled')}
          className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'Cancelled'
              ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50/50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Cancelled ({cancelledBookings.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('All')}
          className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'All'
              ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50/50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          All ({bookings.length})
        </button>
      </div>

      {/* Bookings List */}
      <div className="flex-1 p-3.5 space-y-3 overflow-y-auto">
        {currentList.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-200/70 text-slate-400 mx-auto flex items-center justify-center">
              <TicketIcon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">No Tickets Found</p>
              <p className="text-xs text-slate-400 mt-1">
                {activeTab === 'Upcoming'
                  ? 'You have no active journeys. Book a new ticket to see it here.'
                  : `No ${activeTab.toLowerCase()} tickets available.`}
              </p>
            </div>
            {activeTab === 'Upcoming' && (
              <button
                type="button"
                onClick={onBackToHome}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Book Journey</span>
              </button>
            )}
          </div>
        ) : (
          currentList.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all hover:shadow-md"
            >
              <div className="p-4 space-y-3">
                {/* Header Row: Badge, UTS, and Edit trigger */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    {booking.bookingType}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 font-mono">
                      UTS: <span className="font-extrabold text-slate-900">{booking.utsNumber}</span>
                    </span>
                    {onEditBooking && (
                      <button
                        type="button"
                        onClick={() => onEditBooking(booking)}
                        className="p-1 text-slate-400 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Edit Stations, Amount, Via, etc."
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-row: Ticket Type & Booking Date */}
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium border-b border-slate-100 pb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Ticket Type</span>
                    <span className="font-bold text-slate-800">{booking.ticketType}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Booking Date</span>
                    <span className="font-bold text-slate-800">{booking.bookingDate}</span>
                  </div>
                </div>

                {/* Route visualization */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex-1 pr-2">
                    <p className="text-sm font-extrabold text-slate-900 truncate">
                      {booking.sourceStation.name}
                    </p>
                    <p className="text-xs font-bold text-blue-600">{booking.sourceStation.code}</p>
                  </div>

                  <div className="flex flex-col items-center px-2 shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 mb-0.5">
                      {booking.distanceKm} km
                    </span>
                    <div className="w-16 h-0.5 bg-blue-300 relative flex items-center justify-end">
                      <span className="w-1.5 h-1.5 border-t border-r border-blue-600 rotate-45"></span>
                    </div>
                  </div>

                  <div className="flex-1 pl-2 text-right">
                    <p className="text-sm font-extrabold text-slate-900 truncate">
                      {booking.destinationStation.name}
                    </p>
                    <p className="text-xs font-bold text-blue-600">{booking.destinationStation.code}</p>
                  </div>
                </div>

                {/* Status & Fare Info */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="font-medium text-slate-500">
                    {booking.adultCount} Adult{booking.childCount > 0 ? `, ${booking.childCount} Child` : ''} • {booking.classType} • Via: {booking.viaStation || 'DIRECT'}
                  </span>
                  <span className="font-black text-slate-900 text-sm">
                    ₹ {booking.totalFare.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="grid grid-cols-2 border-t border-slate-100 divide-x divide-slate-100 bg-slate-50/60">
                <button
                  type="button"
                  onClick={() => onBookAgain(booking)}
                  className="py-3 px-4 text-xs font-bold text-blue-700 hover:bg-blue-50/70 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Book Again</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectBooking(booking)}
                  className="py-3 px-4 text-xs font-bold text-blue-700 hover:bg-blue-50/70 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
