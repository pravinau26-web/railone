import React, { useState } from 'react';
import { X, Check, ArrowRight, Save, TrainFront, MapPin, IndianRupee } from 'lucide-react';
import { Booking, Station, TrainType, TicketType, TicketClass } from '../types';
import { MASTER_STATIONS, getStationByCode } from '../data/stations';

interface EditBookingModalProps {
  isOpen: boolean;
  booking: Booking;
  onClose: () => void;
  onSave: (updatedBooking: Booking) => void;
}

export const EditBookingModal: React.FC<EditBookingModalProps> = ({
  isOpen,
  booking,
  onClose,
  onSave,
}) => {
  const [sourceCode, setSourceCode] = useState(booking.sourceStation.code);
  const [sourceName, setSourceName] = useState(booking.sourceStation.name);

  const [destCode, setDestCode] = useState(booking.destinationStation.code);
  const [destName, setDestName] = useState(booking.destinationStation.name);

  const [viaStation, setViaStation] = useState(booking.viaStation || 'TBM');
  const [distanceKm, setDistanceKm] = useState(booking.distanceKm.toString());
  const [fare, setFare] = useState(booking.totalFare.toFixed(2));

  const [trainType, setTrainType] = useState<TrainType>(booking.trainType);
  const [ticketType, setTicketType] = useState<TicketType>(booking.ticketType);
  const [classType, setClassType] = useState<TicketClass>(booking.classType);

  const [adultCount, setAdultCount] = useState(booking.adultCount.toString());
  const [childCount, setChildCount] = useState(booking.childCount.toString());

  const [bookingDate, setBookingDate] = useState(booking.bookingDate);
  const [bookingTime, setBookingTime] = useState(booking.bookingTime);

  const [utsNumber, setUtsNumber] = useState(booking.utsNumber);
  const [referenceNumber, setReferenceNumber] = useState(booking.referenceNumber);
  const [irCode, setIrCode] = useState(booking.irCode);

  const [bookedBy, setBookedBy] = useState(booking.bookedBy);
  const [mobileNumber, setMobileNumber] = useState(booking.mobileNumber);

  if (!isOpen) return null;

  const handleSourceStationPick = (code: string) => {
    const s = getStationByCode(code);
    if (s) {
      setSourceCode(s.code);
      setSourceName(s.name);
    }
  };

  const handleDestStationPick = (code: string) => {
    const s = getStationByCode(code);
    if (s) {
      setDestCode(s.code);
      setDestName(s.name);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedSource: Station = {
      code: sourceCode.trim().toUpperCase(),
      name: sourceName.trim().toUpperCase(),
      state: booking.sourceStation.state || 'TAMIL NADU',
      city: booking.sourceStation.city,
    };

    const updatedDest: Station = {
      code: destCode.trim().toUpperCase(),
      name: destName.trim().toUpperCase(),
      state: booking.destinationStation.state || 'TAMIL NADU',
      city: booking.destinationStation.city,
    };

    const parsedFare = parseFloat(fare) || 20.0;
    const parsedDist = parseInt(distanceKm, 10) || 41;
    const parsedAdult = parseInt(adultCount, 10) || 1;
    const parsedChild = parseInt(childCount, 10) || 0;

    const updated: Booking = {
      ...booking,
      sourceStation: updatedSource,
      destinationStation: updatedDest,
      viaStation: viaStation.trim().toUpperCase(),
      distanceKm: parsedDist,
      fare: parsedFare,
      totalFare: parsedFare,
      trainType,
      ticketType,
      classType,
      adultCount: parsedAdult,
      childCount: parsedChild,
      bookingDate,
      bookingTime,
      journeyDate: bookingDate,
      utsNumber: utsNumber.trim().toUpperCase(),
      referenceNumber: referenceNumber.trim().toUpperCase(),
      irCode: irCode.trim(),
      bookedBy: bookedBy.trim(),
      mobileNumber: mobileNumber.trim(),
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Top Header */}
        <div className="bg-blue-600 text-white px-4 py-3.5 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold">Edit Ticket & Journey Details</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-white hover:bg-blue-700 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSave} className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Quick Info Box */}
          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 font-medium">
            Edit any field below (Stations, Fare, Via, Distance, Passengers). Changes will reflect dynamically across the ticket, dashboard, and bookings.
          </div>

          {/* 1. Source Station */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <label className="font-extrabold text-slate-800 uppercase tracking-wide block">
              1. Source Station
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <span className="text-[10px] text-slate-500 font-bold block mb-0.5">Code</span>
                <input
                  type="text"
                  value={sourceCode}
                  onChange={(e) => setSourceCode(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-black uppercase text-slate-900 focus:border-blue-600"
                />
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-slate-500 font-bold block mb-0.5">Station Name</span>
                <input
                  type="text"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold uppercase text-slate-900 focus:border-blue-600"
                />
              </div>
            </div>
            {/* Quick Station Suggestions */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-1">
              {['GI', 'MSB', 'TBM', 'GDY', 'MS', 'MAS', 'CGL', 'VM'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleSourceStationPick(c)}
                  className="px-2 py-0.5 rounded bg-white hover:bg-blue-100 border border-slate-200 text-[10px] font-bold text-blue-700"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Destination Station */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <label className="font-extrabold text-slate-800 uppercase tracking-wide block">
              2. Destination Station
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <span className="text-[10px] text-slate-500 font-bold block mb-0.5">Code</span>
                <input
                  type="text"
                  value={destCode}
                  onChange={(e) => setDestCode(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-black uppercase text-slate-900 focus:border-blue-600"
                />
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-slate-500 font-bold block mb-0.5">Station Name</span>
                <input
                  type="text"
                  value={destName}
                  onChange={(e) => setDestName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold uppercase text-slate-900 focus:border-blue-600"
                />
              </div>
            </div>
            {/* Quick Destination Suggestions */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-1">
              {['MSB', 'GI', 'GDY', 'TBM', 'MS', 'MAS', 'CGL', 'VI'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleDestStationPick(c)}
                  className="px-2 py-0.5 rounded bg-white hover:bg-blue-100 border border-slate-200 text-[10px] font-bold text-blue-700"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Fare, Distance & Via */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <label className="font-extrabold text-slate-800 uppercase tracking-wide block">
              3. Fare, Distance & Via Route
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-0.5">Fare (₹)</span>
                <input
                  type="number"
                  step="0.5"
                  value={fare}
                  onChange={(e) => setFare(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-black text-slate-900 focus:border-blue-600"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-0.5">Distance (km)</span>
                <input
                  type="number"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-black text-slate-900 focus:border-blue-600"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-0.5">Via Station</span>
                <input
                  type="text"
                  value={viaStation}
                  onChange={(e) => setViaStation(e.target.value)}
                  placeholder="e.g. TBM"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold uppercase text-slate-900 focus:border-blue-600"
                />
              </div>
            </div>
            {/* Quick Fare Presets */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-slate-400">Quick Fare:</span>
              {[5, 10, 15, 20, 25, 30, 40, 50, 100].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFare(String(f))}
                  className="px-2 py-0.5 rounded bg-white hover:bg-blue-50 border border-slate-200 text-[10px] font-bold text-blue-700"
                >
                  ₹{f}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Train Type, Ticket Type & Class */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Train Type</label>
              <select
                value={trainType}
                onChange={(e) => setTrainType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 font-bold"
              >
                <option value="ORDINARY">ORDINARY</option>
                <option value="MAIL/EXP">MAIL/EXP</option>
                <option value="SUPERFAST">SUPERFAST</option>
                <option value="AC EMU">AC EMU</option>
                <option value="VANDE BHARAT">VANDE BHARAT</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Ticket Type</label>
              <select
                value={ticketType}
                onChange={(e) => setTicketType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 font-bold"
              >
                <option value="JOURNEY">JOURNEY</option>
                <option value="RETURN">RETURN</option>
                <option value="SEASON">SEASON</option>
                <option value="PLATFORM">PLATFORM</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Class</label>
              <select
                value={classType}
                onChange={(e) => setClassType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 font-bold"
              >
                <option value="SECOND">SECOND</option>
                <option value="FIRST">FIRST</option>
                <option value="2S">2S</option>
                <option value="SL">SL</option>
                <option value="3A">3A</option>
                <option value="2A">2A</option>
                <option value="1A">1A</option>
                <option value="CC">CC</option>
                <option value="EC">EC</option>
              </select>
            </div>
          </div>

          {/* 5. Passenger Counts */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Adult Count</label>
              <input
                type="number"
                min="1"
                max="6"
                value={adultCount}
                onChange={(e) => setAdultCount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Child Count</label>
              <input
                type="number"
                min="0"
                max="4"
                value={childCount}
                onChange={(e) => setChildCount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold"
              />
            </div>
          </div>

          {/* 6. Date & Time */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Booking Date</label>
              <input
                type="text"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                placeholder="e.g. 10 Nov 2026"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Booking Time</label>
              <input
                type="text"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                placeholder="e.g. 07:45"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-900"
              />
            </div>
          </div>

          {/* 7. UTS & Reference Number */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">UTS Number</label>
              <input
                type="text"
                value={utsNumber}
                onChange={(e) => setUtsNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono font-bold uppercase"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Reference Code</label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono font-bold uppercase"
              />
            </div>
          </div>

          {/* 8. Passenger Name & Mobile */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Booked By (Name)</label>
              <input
                type="text"
                value={bookedBy}
                onChange={(e) => setBookedBy(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Mobile Number</label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold"
              />
            </div>
          </div>

          {/* IR Code */}
          <div>
            <label className="text-[10px] font-bold text-slate-600 block mb-1">IR GST / Verification Code</label>
            <input
              type="text"
              value={irCode}
              onChange={(e) => setIrCode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono text-[11px]"
            />
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Ticket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
