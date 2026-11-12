import React, { useState } from 'react';
import { X, Minus, Plus, Info, TrainFront, Ticket as TicketIcon } from 'lucide-react';
import { Station } from '../types';

interface PlatformTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStation: Station;
  onOpenStationSearch: () => void;
  onProceedToPayment: (station: Station, persons: number, fare: number) => void;
}

export const PlatformTicketModal: React.FC<PlatformTicketModalProps> = ({
  isOpen,
  onClose,
  currentStation,
  onOpenStationSearch,
  onProceedToPayment,
}) => {
  const [stationLocation, setStationLocation] = useState<'Outside' | 'At'>('Outside');
  const [persons, setPersons] = useState<number>(1);

  if (!isOpen) return null;

  const farePerPerson = 10;
  const totalFare = persons * farePerPerson;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Platform E-Ticket</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Outside / At station pills */}
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

          {/* Station Selector */}
          <div
            onClick={onOpenStationSearch}
            className="p-3.5 bg-slate-50 border border-slate-200 hover:border-blue-400 rounded-2xl cursor-pointer transition-all shadow-xs"
          >
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
              Station
            </span>
            <div className="flex items-center gap-2.5 mt-1">
              <TrainFront className="w-4 h-4 text-blue-700 shrink-0" />
              <div>
                <p className="text-sm font-bold text-slate-900 leading-snug">
                  {currentStation.code} - {currentStation.name}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {currentStation.city || currentStation.state}
                </p>
              </div>
            </div>
          </div>

          {/* Persons Count */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Number of Person(s)</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPersons(Math.max(1, persons - 1))}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-blue-700 hover:bg-blue-50 flex items-center justify-center font-bold transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4 stroke-[2.5]" />
              </button>
              <span className="w-6 text-center text-sm font-extrabold text-slate-900">{persons}</span>
              <button
                type="button"
                onClick={() => setPersons(Math.min(4, persons + 1))}
                className="w-8 h-8 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Total Fare Card */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-800 font-bold text-xs">
              <TicketIcon className="w-4 h-4 text-blue-700" />
              <span>Total Fare</span>
            </div>
            <span className="text-base font-extrabold text-blue-900">₹ {totalFare.toFixed(1)}</span>
          </div>

          {/* Pay Button */}
          <button
            type="button"
            onClick={() => onProceedToPayment(currentStation, persons, totalFare)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Pay ₹ {totalFare.toFixed(1)}
          </button>
        </div>
      </div>
    </div>
  );
};
