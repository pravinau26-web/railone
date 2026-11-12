import React, { useState } from 'react';
import { X, ArrowUpDown, TrainFront, MapPin, ChevronDown, Check, ShieldCheck } from 'lucide-react';
import { Station, QuotaType, TicketClass } from '../types';

interface ReservedPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromStation: Station;
  toStation: Station;
  onOpenStationSearch: (mode: 'source' | 'destination') => void;
  onSwapStations: () => void;
  onSearchTrains: (params: {
    fromStation: Station;
    toStation: Station;
    journeyDate: string;
    classType: string;
    quota: QuotaType;
  }) => void;
}

export const ReservedPlannerModal: React.FC<ReservedPlannerModalProps> = ({
  isOpen,
  onClose,
  fromStation,
  toStation,
  onOpenStationSearch,
  onSwapStations,
  onSearchTrains,
}) => {
  const [journeyDate, setJourneyDate] = useState('Tue, 10 Nov 26');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [quota, setQuota] = useState<QuotaType>('General');
  const [otherOption, setOtherOption] = useState<string>('');
  const [showQuotaModal, setShowQuotaModal] = useState<boolean>(false);
  const [showOtherOptionsModal, setShowOtherOptionsModal] = useState<boolean>(false);

  if (!isOpen) return null;

  const dateOptions = [
    { label: 'Tue, 10 Nov', value: 'Tue, 10 Nov 26' },
    { label: '11 Nov', value: 'Wed, 11 Nov 26' },
    { label: '12 Nov', value: 'Thu, 12 Nov 26' },
    { label: '13 Nov', value: 'Fri, 13 Nov 26' },
  ];

  const classOptions = ['All', '2S', 'VS', 'SL', 'CC', 'VC', '3A', '2A', '1A'];

  const quotaOptions: QuotaType[] = [
    'General',
    'Ladies',
    'Lower Berth/Sr. Citizen',
    'Person with Disability',
    'Duty Pass',
    'Tatkal',
    'Premium Tatkal',
  ];

  const otherOptionsList = [
    'Connecting Journey',
    'Pass Concession (Railway)',
    'Pass Concession (Others)',
    'Person with Disability Concession',
  ];

  const handleSearch = () => {
    onSearchTrains({
      fromStation,
      toStation,
      journeyDate,
      classType: selectedClass,
      quota,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Reserved Ticket</h2>
            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              Powered by IRCTC
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {/* Saved preferences prompt */}
          <button
            type="button"
            className="w-full p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-700 text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
          >
            Search Using Saved Preferences
          </button>

          <div className="flex items-center justify-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-2">
              • OR •
            </span>
          </div>

          {/* Station selector with swap button */}
          <div className="relative bg-slate-50 p-3 rounded-2xl border border-slate-200">
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
              className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
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

          {/* Departure Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block">Departure Date</label>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {dateOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setJourneyDate(opt.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    journeyDate === opt.value
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Class Options */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block">Class</label>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {classOptions.map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setSelectedClass(cls)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedClass === cls
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          {/* Quota dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block">Quota</label>
            <button
              type="button"
              onClick={() => setShowQuotaModal(true)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-bold text-slate-900 cursor-pointer"
            >
              <span>{quota}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Other Options dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block">Other Options</label>
            <button
              type="button"
              onClick={() => setShowOtherOptionsModal(true)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-medium text-slate-500 cursor-pointer"
            >
              <span className={otherOption ? 'font-bold text-slate-900' : ''}>
                {otherOption || 'Please Select'}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Search Button */}
          <button
            type="button"
            onClick={handleSearch}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md active:scale-[0.99] cursor-pointer"
          >
            Search
          </button>

          {/* Check Last Transaction */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
            >
              Check Last Transaction
            </button>
          </div>
        </div>
      </div>

      {/* Quota Bottom Sheet */}
      {showQuotaModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-xs flex items-end justify-center p-0">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 space-y-2 animate-in slide-in-from-bottom duration-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Quota</h3>
            {quotaOptions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setQuota(q);
                  setShowQuotaModal(false);
                }}
                className={`w-full p-3 text-left font-bold text-xs rounded-xl border flex items-center justify-between cursor-pointer ${
                  quota === q
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-blue-50'
                }`}
              >
                <span>{q}</span>
                {quota === q && <Check className="w-4 h-4 text-white" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Other Options Bottom Sheet */}
      {showOtherOptionsModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-xs flex items-end justify-center p-0">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 space-y-2 animate-in slide-in-from-bottom duration-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Other Options</h3>
            {otherOptionsList.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setOtherOption(opt);
                  setShowOtherOptionsModal(false);
                }}
                className={`w-full p-3 text-left font-bold text-xs rounded-xl border flex items-center justify-between cursor-pointer ${
                  otherOption === opt
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-blue-50'
                }`}
              >
                <span>{opt}</span>
                {otherOption === opt && <Check className="w-4 h-4 text-white" />}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setOtherOption('');
                setShowOtherOptionsModal(false);
              }}
              className="w-full p-2.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
