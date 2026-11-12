import React, { useState } from 'react';
import { ArrowLeft, Minus, Plus, ChevronDown, Ticket as TicketIcon, Check, Pencil, RotateCcw } from 'lucide-react';
import { Station, TrainType, TicketType, TicketClass } from '../types';
import { calculateDistance } from '../data/stations';

interface UnreservedJourneyScreenProps {
  fromStation: Station;
  toStation: Station;
  onBack: () => void;
  onProceedToPayment: (bookingDetails: {
    fromStation: Station;
    toStation: Station;
    trainType: TrainType;
    ticketType: TicketType;
    classType: TicketClass;
    adultCount: number;
    childCount: number;
    fare: number;
    distanceKm: number;
    concession?: string;
  }) => void;
}

export const UnreservedJourneyScreen: React.FC<UnreservedJourneyScreenProps> = ({
  fromStation,
  toStation,
  onBack,
  onProceedToPayment,
}) => {
  const [trainType, setTrainType] = useState<TrainType>('ORDINARY');
  const [ticketType, setTicketType] = useState<TicketType>('JOURNEY');
  const [classType, setClassType] = useState<TicketClass>('SECOND');
  const [adultCount, setAdultCount] = useState<number>(2);
  const [childCount, setChildCount] = useState<number>(0);
  const [availConcession, setAvailConcession] = useState<boolean>(false);
  const [showConcessionModal, setShowConcessionModal] = useState<boolean>(false);
  const [concessionType, setConcessionType] = useState<string>('');
  const [showOthersTrainModal, setShowOthersTrainModal] = useState<boolean>(false);

  // Manual Fare Edit State
  const [manualFare, setManualFare] = useState<number | null>(null);
  const [isEditingBottomFare, setIsEditingBottomFare] = useState<boolean>(false);

  const distanceKm = calculateDistance(fromStation.code, toStation.code);

  // Fare calculation matching UTS / Indian Railways slab
  const baseRatePerPerson = (() => {
    let rate = 10;
    if (distanceKm > 30) rate = 15;
    if (distanceKm > 70) rate = 25;
    if (distanceKm > 120) rate = 35;
    if (distanceKm > 200) rate = 60;

    if (trainType === 'MAIL/EXP' || trainType === 'SUPERFAST') {
      rate = Math.max(30, rate + 15);
    } else if (trainType === 'AC EMU') {
      rate = Math.max(50, rate * 3.5);
    }

    if (classType === 'FIRST') {
      rate = Math.max(70, rate * 4.5);
    }

    return rate;
  })();

  const perChildRate = Math.ceil(baseRatePerPerson / 2);
  const totalSingleFare = adultCount * baseRatePerPerson + childCount * perChildRate;
  const autoCalculatedFare = ticketType === 'RETURN' ? totalSingleFare * 2 : totalSingleFare;

  // If manualFare is set, use it; otherwise use autoCalculatedFare
  const effectiveFare = manualFare !== null ? manualFare : autoCalculatedFare;

  const handleBookNow = () => {
    onProceedToPayment({
      fromStation,
      toStation,
      trainType,
      ticketType,
      classType,
      adultCount,
      childCount,
      fare: effectiveFare,
      distanceKm,
      concession: availConcession ? concessionType : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
      {/* Blue App Bar */}
      <div className="bg-blue-600 text-white px-4 py-3.5 flex items-center gap-3 shadow-md shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="p-1 hover:bg-blue-700 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-bold leading-tight">Unreserved Journey</h1>
          <p className="text-[11px] text-blue-100 font-medium">E-Ticket</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Route Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-sm font-extrabold text-slate-900 leading-tight">
              {fromStation.name}
            </p>
            <p className="text-xs font-bold text-blue-600 mt-0.5">{fromStation.code}</p>
          </div>
          <div className="flex flex-col items-center px-2">
            <span className="text-[10px] font-bold text-slate-400 mb-0.5">{distanceKm} km</span>
            <div className="w-12 h-0.5 bg-blue-500 relative flex items-center justify-end">
              <span className="w-1.5 h-1.5 border-t-2 border-r-2 border-blue-500 rotate-45"></span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-extrabold text-slate-900 leading-tight">
              {toStation.name}
            </p>
            <p className="text-xs font-bold text-blue-600 mt-0.5">{toStation.code}</p>
          </div>
        </div>

        {/* Train Type Selector */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Train Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setTrainType('ORDINARY')}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                trainType === 'ORDINARY'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ORDINARY
            </button>
            <button
              type="button"
              onClick={() => setTrainType('MAIL/EXP')}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                trainType === 'MAIL/EXP'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              MAIL/EXP
            </button>
            <button
              type="button"
              onClick={() => setShowOthersTrainModal(true)}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                trainType === 'SUPERFAST' || trainType === 'AC EMU'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{trainType === 'SUPERFAST' ? 'SUPERFAST' : trainType === 'AC EMU' ? 'AC EMU' : 'OTHERS'}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ticket Type Selector */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Ticket Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTicketType('JOURNEY')}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                ticketType === 'JOURNEY'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              JOURNEY
            </button>
            <button
              type="button"
              onClick={() => setTicketType('RETURN')}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                ticketType === 'RETURN'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              RETURN
            </button>
          </div>
        </div>

        {/* Passenger Counts */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          {/* Adult */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800">Adult</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center font-bold transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4 stroke-[2.5]" />
              </button>
              <span className="w-6 text-center text-sm font-extrabold text-slate-900">{adultCount}</span>
              <button
                type="button"
                onClick={() => setAdultCount(Math.min(4, adultCount + 1))}
                className="w-8 h-8 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-100"></div>

          {/* Child */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-slate-800">Child</span>
              <p className="text-[10px] text-slate-400 font-medium">Aged between 5 and 12 years</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setChildCount(Math.max(0, childCount - 1))}
                className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center font-bold transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4 stroke-[2.5]" />
              </button>
              <span className="w-6 text-center text-sm font-extrabold text-slate-900">{childCount}</span>
              <button
                type="button"
                onClick={() => setChildCount(Math.min(4, childCount + 1))}
                className="w-8 h-8 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Class Selection */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Class
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setClassType('SECOND')}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                classType === 'SECOND'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              SECOND
            </button>
            <button
              type="button"
              onClick={() => setClassType('FIRST')}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                classType === 'FIRST'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              FIRST
            </button>
          </div>
        </div>

        {/* Avail Concession Checkbox */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={availConcession}
              onChange={(e) => {
                setAvailConcession(e.target.checked);
                if (e.target.checked) setShowConcessionModal(true);
              }}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-800">Avail Concession</span>
          </label>
          {availConcession && concessionType && (
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              {concessionType}
            </span>
          )}
        </div>

        {/* 6. Manual Fare Override Card (Requested by User) */}
        <div className="bg-white p-4 rounded-2xl border border-blue-200/90 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Pencil className="w-3.5 h-3.5 text-blue-600" />
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Manual Fare (₹)
              </label>
            </div>
            {manualFare !== null && (
              <button
                type="button"
                onClick={() => setManualFare(null)}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md flex items-center gap-1 cursor-pointer"
                title="Reset to calculated rate"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Auto</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-extrabold text-slate-500">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="1"
                value={manualFare !== null ? manualFare : autoCalculatedFare}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setManualFare(isNaN(val) ? 0 : val);
                }}
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white rounded-xl pl-8 pr-3 py-2 text-base font-black text-slate-900 outline-none transition-colors"
                placeholder="Enter custom fare"
              />
            </div>
            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${
              manualFare !== null ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {manualFare !== null ? 'Manual' : 'Auto'}
            </span>
          </div>

          {/* Quick preset fare buttons */}
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 shrink-0">Presets:</span>
            {[5, 10, 15, 20, 25, 30, 40, 50].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setManualFare(amt)}
                className={`px-2 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                  effectiveFare === amt
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Fare & Book Now Bar */}
      <div className="bg-white border-t border-slate-200 px-4 py-3 shrink-0 shadow-xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <TicketIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-slate-500 uppercase leading-none">Fare</p>
                {manualFare !== null && (
                  <span className="text-[9px] font-extrabold bg-amber-100 text-amber-800 px-1 rounded">
                    Manual
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-extrabold text-slate-900">₹ {effectiveFare.toFixed(2)}</span>
                <button
                  type="button"
                  onClick={() => {
                    const promptVal = prompt('Enter custom fare amount (₹):', String(effectiveFare));
                    if (promptVal !== null) {
                      const parsed = parseFloat(promptVal);
                      if (!isNaN(parsed) && parsed >= 0) {
                        setManualFare(parsed);
                      }
                    }
                  }}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer flex items-center gap-0.5"
                >
                  <Pencil className="w-2.5 h-2.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBookNow}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Book Now
          </button>
        </div>
        <p className="text-[10px] text-slate-400 text-center font-medium">
          By proceeding further you agree to our <span className="text-blue-600 underline">Terms & Conditions</span>
        </p>
      </div>

      {/* Others Train Modal */}
      {showOthersTrainModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-xs flex items-end justify-center p-0">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 space-y-3 animate-in slide-in-from-bottom duration-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Select Train Type</h3>
            <button
              type="button"
              onClick={() => {
                setTrainType('SUPERFAST');
                setShowOthersTrainModal(false);
              }}
              className="w-full p-3 text-left font-bold text-xs bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-200 flex items-center justify-between"
            >
              <span>SUPERFAST</span>
              {trainType === 'SUPERFAST' && <Check className="w-4 h-4 text-blue-600" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setTrainType('AC EMU');
                setShowOthersTrainModal(false);
              }}
              className="w-full p-3 text-left font-bold text-xs bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-200 flex items-center justify-between"
            >
              <span>AC EMU TRAIN</span>
              {trainType === 'AC EMU' && <Check className="w-4 h-4 text-blue-600" />}
            </button>
            <button
              type="button"
              onClick={() => setShowOthersTrainModal(false)}
              className="w-full p-2.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Concession Selection Sheet */}
      {showConcessionModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-xs flex items-end justify-center p-0">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 space-y-3 animate-in slide-in-from-bottom duration-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Select Concession Type</h3>
            <button
              type="button"
              onClick={() => {
                setConcessionType('Divyangjan Concession');
                setShowConcessionModal(false);
              }}
              className="w-full p-3 text-left font-bold text-xs bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-200 flex items-center justify-between"
            >
              <span>Divyangjan Concession</span>
              {concessionType === 'Divyangjan Concession' && <Check className="w-4 h-4 text-blue-600" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setConcessionType('Railway Pass Concession');
                setShowConcessionModal(false);
              }}
              className="w-full p-3 text-left font-bold text-xs bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-200 flex items-center justify-between"
            >
              <span>Railway Pass Concession</span>
              {concessionType === 'Railway Pass Concession' && <Check className="w-4 h-4 text-blue-600" />}
            </button>
            <button
              type="button"
              onClick={() => setShowConcessionModal(false)}
              className="w-full p-2.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
