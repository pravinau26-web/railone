import React, { useState } from 'react';
import { X, ArrowUpDown, TrainFront, MapPin, Info } from 'lucide-react';
import { Station, RecentSearch } from '../types';

interface UnreservedPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromStation: Station;
  toStation: Station;
  recentSearches: RecentSearch[];
  onOpenStationSearch: (mode: 'source' | 'destination') => void;
  onSwapStations: () => void;
  onSelectRecentSearch: (search: RecentSearch) => void;
  onProceedToBook: () => void;
  onCheckUpcomingTrains: () => void;
}

export const UnreservedPlannerModal: React.FC<UnreservedPlannerModalProps> = ({
  isOpen,
  onClose,
  fromStation,
  toStation,
  recentSearches,
  onOpenStationSearch,
  onSwapStations,
  onSelectRecentSearch,
  onProceedToBook,
  onCheckUpcomingTrains,
}) => {
  const [ticketCategory, setTicketCategory] = useState<'Normal' | 'Season'>('Normal');
  const [stationLocation, setStationLocation] = useState<'Outside' | 'At'>('Outside');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Unreserved E-Ticket</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {/* Category Tabs: Normal / Season */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setTicketCategory('Normal')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                ticketCategory === 'Normal'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Normal
            </button>
            <button
              type="button"
              onClick={() => setTicketCategory('Season')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                ticketCategory === 'Season'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Season
            </button>
          </div>

          {/* Location Mode Pills */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setStationLocation('Outside')}
              className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                stationLocation === 'Outside'
                  ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-xs ring-1 ring-blue-500'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <span>Outside Station</span>
              <Info className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              type="button"
              onClick={() => setStationLocation('At')}
              className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                stationLocation === 'At'
                  ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-xs ring-1 ring-blue-500'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <span>At Station</span>
              <Info className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>

          {/* Station Selection Box with Swap Button */}
          <div className="relative bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80">
            {/* From Station */}
            <div
              onClick={() => onOpenStationSearch('source')}
              className="p-3 bg-white border border-slate-200 hover:border-blue-400 rounded-xl cursor-pointer transition-all shadow-xs"
            >
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">From</span>
              <div className="flex items-center gap-2.5 mt-1">
                <TrainFront className="w-4 h-4 text-blue-700 shrink-0" />
                <div className="truncate">
                  <p className="text-sm font-bold text-slate-900 leading-snug">
                    {fromStation.code} - {fromStation.name}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {fromStation.city || fromStation.state}
                  </p>
                </div>
              </div>
            </div>

            {/* Swap Button Floating */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSwapStations();
              }}
              title="Swap From and To Stations"
              className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowUpDown className="w-4 h-4 stroke-[2.4]" />
            </button>

            {/* To Station */}
            <div
              onClick={() => onOpenStationSearch('destination')}
              className="p-3 bg-white border border-slate-200 hover:border-blue-400 rounded-xl cursor-pointer transition-all shadow-xs mt-2"
            >
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">To</span>
              <div className="flex items-center gap-2.5 mt-1">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="truncate">
                  <p className="text-sm font-bold text-slate-900 leading-snug">
                    {toStation.code} - {toStation.name}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {toStation.city || toStation.state}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={onProceedToBook}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center"
            >
              Proceed To Book
            </button>

            <button
              type="button"
              onClick={onCheckUpcomingTrains}
              className="w-full bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 font-semibold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer"
            >
              Check Upcoming Trains
            </button>
          </div>

          {/* Recent Searches */}
          <div className="pt-2">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Recent Searches
            </p>
            <div className="grid grid-cols-2 gap-2">
              {recentSearches.slice(0, 4).map((search, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectRecentSearch(search)}
                  className="p-2.5 bg-blue-50/60 hover:bg-blue-100/70 border border-blue-200/80 rounded-xl text-left transition-colors cursor-pointer"
                >
                  <p className="text-[11px] font-bold text-slate-800 truncate">
                    {search.from.name}, {search.from.code}
                  </p>
                  <div className="flex items-center text-blue-700 my-0.5">
                    <ArrowUpDown className="w-3 h-3 rotate-90" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-800 truncate">
                    {search.to.name}, {search.to.code}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
