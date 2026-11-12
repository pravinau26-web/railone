import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  Download,
  Printer,
  Pencil,
  AlertTriangle,
  GitBranch,
  Check,
  X,
} from 'lucide-react';
import { Booking } from '../types';
import { EditBookingModal } from './EditBookingModal';
import QRCode from 'qrcode';

interface TicketDetailsScreenProps {
  booking: Booking;
  onBack: () => void;
  onBookConnecting?: () => void;
  onBookAnother?: () => void;
  onUpdateBooking?: (updated: Booking) => void;
}

export const TicketDetailsScreen: React.FC<TicketDetailsScreenProps> = ({
  booking,
  onBack,
  onBookConnecting,
  onBookAnother,
  onUpdateBooking,
}) => {
  // Timer starts from 300 seconds (05:00)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Manual Quick Fare Edit State
  const [isEditingQuickFare, setIsEditingQuickFare] = useState<boolean>(false);
  const [quickFareInput, setQuickFareInput] = useState<string>(String(booking.totalFare));

  useEffect(() => {
    setQuickFareInput(String(booking.totalFare));
  }, [booking.totalFare]);

  // Dynamically generate a 100% straight, perfectly upright UTS Indian Railways QR Code
  useEffect(() => {
    const payload = `IR_UTS:${booking.utsNumber || 'X424WJN816'},SRC:${booking.sourceStation.code},DST:${booking.destinationStation.code},VIA:${booking.viaStation || 'TBM'},FARE:${booking.totalFare.toFixed(2)},PAX:${booking.adultCount}A${booking.childCount}C,DATE:${booking.bookingDate},IR:${booking.irCode}`;

    QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 360,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch(() => {
        setQrDataUrl('/extracted_assets/ticket_straight_qr.png');
      });
  }, [booking]);

  useEffect(() => {
    let intervalId: any;

    if (!isExpired && secondsRemaining > 0) {
      intervalId = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            setIsExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isExpired, secondsRemaining]);

  const handleRestartTimer = () => {
    setSecondsRemaining(300);
    setIsExpired(false);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedCountdown = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const textContent = `INDIAN RAILWAYS / भारतीय रेल
========================================
UTSONMOBILE DEMO TICKET
Booking Date & Time: ${booking.bookingDate}, ${booking.bookingTime}
UTS Number: ${booking.utsNumber}
Reference No: ${booking.referenceNumber}
Status: ${booking.status}

Source: ${booking.sourceStation.name} (${booking.sourceStation.code})
Destination: ${booking.destinationStation.name} (${booking.destinationStation.code})
Via: ${booking.viaStation || 'TBM'}
Distance: ${booking.distanceKm} km
Passengers: ${booking.adultCount} Adult, ${booking.childCount} Child
Ticket Type: ${booking.ticketType}
Train Types: ${booking.trainType}
Class: ${booking.classType}
Total Fare: ₹ ${booking.totalFare.toFixed(2)}
Booked By: ${booking.bookedBy}
Mobile: ${booking.mobileNumber}
IR Verification: ${booking.irCode}
========================================
* Valid for start of journey within 1 hour or until departure of the first train.
* For enquiry and integrated railway helpline, please dial 139.`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RailOne_Ticket_${booking.utsNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveEdit = (updated: Booking) => {
    if (onUpdateBooking) {
      onUpdateBooking(updated);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col max-w-md mx-auto shadow-2xl relative select-none pb-12">
      {/* 1. Top Blue Header matching Video 1 */}
      <div className="bg-[#1264df] text-white px-4 pt-3 pb-2.5 shrink-0 shadow-sm no-print">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5 text-white stroke-[2.2]" />
            </button>
            <div>
              <h1 className="text-base font-bold leading-tight">Booking Details</h1>
              <p className="text-[11px] text-blue-100 font-medium">
                Mobile: {booking.mobileNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Edit details button requested by user */}
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              title="Edit Stations, Amount, Via, etc."
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 hover:bg-white/15 rounded-lg text-white transition-colors cursor-pointer"
              title="Print Ticket"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="p-1.5 hover:bg-white/15 rounded-lg text-white transition-colors cursor-pointer"
              title="Download Ticket"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Subheader Greeting text */}
      <div className="bg-white px-4 py-2 text-left border-b border-slate-100 shadow-2xs">
        <p className="text-[11px] text-slate-700 font-semibold tracking-tight">
          Thank You {booking.bookedBy}, Happy Journey !
        </p>
      </div>

      {/* 3. Main Ticket Card Container */}
      <div className="p-3.5 space-y-3 overflow-y-auto print-area flex-1">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
          {/* Top Mint Decorative Stripe */}
          <div className="h-1.5 w-full bg-[#34d399]"></div>

          {/* Black Digital Countdown Preview Section */}
          <div className="bg-[#111111] text-white px-5 py-3 relative border-b border-zinc-800">
            {/* Left Vertical Ribbon */}
            <div className="absolute left-2.5 top-0 bottom-0 flex items-center justify-center pointer-events-none select-none">
              <span className="text-[9px] font-black tracking-widest text-[#94a3b8] uppercase [writing-mode:vertical-lr] rotate-180 border-l border-dashed border-zinc-700 pl-1">
                INDIAN RAILWAYS
              </span>
            </div>

            {/* Right Vertical Ribbon */}
            <div className="absolute right-2.5 top-0 bottom-0 flex items-center justify-center pointer-events-none select-none">
              <span className="text-[9px] font-black tracking-widest text-[#94a3b8] [writing-mode:vertical-lr] border-r border-dashed border-zinc-700 pr-1">
                भारतीय रेल
              </span>
            </div>

            {/* Center Content */}
            <div className="text-center px-4">
              <p className="text-[11px] font-bold tracking-wide text-zinc-300">
                Dynamic preview will close in
              </p>

              {/* Digital Countdown Timer */}
              {isExpired ? (
                <div className="my-1.5 py-1 px-3 bg-red-950 border border-red-700 rounded-lg inline-block">
                  <span className="text-red-500 font-black text-xl tracking-wider font-mono-digital">
                    PREVIEW EXPIRED
                  </span>
                </div>
              ) : (
                <div className="my-0.5">
                  <span
                    className={`text-4xl font-black font-mono-digital tracking-widest drop-shadow-[0_0_12px_rgba(239,68,68,0.4)] ${
                      secondsRemaining <= 60
                        ? 'text-red-500 animate-pulse'
                        : 'text-[#ef4444]'
                    }`}
                  >
                    {formattedCountdown}
                  </span>
                </div>
              )}

              {/* Booking Date & Time Label */}
              <div className="text-[10px] text-zinc-400 font-medium tracking-wide">
                Ticket Booking Date & Time
              </div>
              <div className="text-sm font-extrabold text-[#f59e0b] tracking-wide mt-0.5">
                {booking.bookingDate}, {booking.bookingTime}
              </div>

              {/* Reference and non-transferable */}
              <div className="flex items-center justify-between text-[10px] text-zinc-400 font-medium pt-1.5 mt-1 border-t border-zinc-800">
                <span className="font-mono text-zinc-300 font-bold">{booking.referenceNumber}</span>
                <span className="text-zinc-400">Ticket is Non-Transferable</span>
              </div>
            </div>
          </div>

          {/* Main Ticket Information Body */}
          <div className="p-4 space-y-3 bg-white relative">
            {/* UTS and Status */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Journey Ticket
                </span>
                <span className="text-sm font-black font-mono text-[#0f172a] tracking-tight">
                  {booking.utsNumber}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                ACTIVE
              </span>
            </div>

            {/* Source and Destination (with Edit Trigger) */}
            <div className="grid grid-cols-2 gap-3 relative">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                  Source
                </span>
                <p className="text-sm font-black text-slate-900 uppercase leading-snug">
                  {booking.sourceStation.name}
                </p>
                <p className="text-[11px] font-bold text-blue-600">
                  {booking.sourceStation.code}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                  Destination
                </span>
                <p className="text-sm font-black text-slate-900 uppercase leading-snug">
                  {booking.destinationStation.name}
                </p>
                <p className="text-[11px] font-bold text-blue-600">
                  {booking.destinationStation.code}
                </p>
              </div>
            </div>

            {/* Distance & Passenger */}
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                  Distance
                </span>
                <p className="text-xs font-black text-slate-900">
                  {booking.distanceKm} km
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                  Passenger
                </span>
                <p className="text-xs font-black text-slate-900">
                  {booking.adultCount} Adult, {booking.childCount} Child
                </p>
              </div>
            </div>

            {/* Ticket Type & Train Types */}
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                  Ticket Type
                </span>
                <p className="text-xs font-black text-slate-900">
                  {booking.ticketType}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                  Train Types
                </span>
                <p className="text-xs font-black text-slate-900">
                  {booking.trainType}
                </p>
              </div>
            </div>

            {/* Class & Fare (Directly Editable by User) */}
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100 items-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                  Class
                </span>
                <p className="text-xs font-black text-slate-900">
                  {booking.classType}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center justify-end gap-1">
                  <span>Fare</span>
                  <button
                    type="button"
                    onClick={() => setIsEditingQuickFare(!isEditingQuickFare)}
                    className="text-blue-600 hover:text-blue-800 p-0.5 rounded cursor-pointer"
                    title="Manual Fare Edit"
                  >
                    <Pencil className="w-2.5 h-2.5" />
                  </button>
                </span>

                {isEditingQuickFare ? (
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <span className="text-xs font-bold text-slate-700">₹</span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={quickFareInput}
                      onChange={(e) => setQuickFareInput(e.target.value)}
                      className="w-16 bg-blue-50 border border-blue-400 rounded px-1.5 py-0.5 text-xs font-black text-slate-900 outline-none text-right"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const parsed = parseFloat(quickFareInput);
                        if (!isNaN(parsed) && parsed >= 0) {
                          if (onUpdateBooking) {
                            onUpdateBooking({ ...booking, fare: parsed, totalFare: parsed });
                          }
                        }
                        setIsEditingQuickFare(false);
                      }}
                      className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                      title="Save Fare"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQuickFareInput(String(booking.totalFare));
                        setIsEditingQuickFare(false);
                      }}
                      className="p-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 cursor-pointer"
                      title="Cancel"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingQuickFare(true)}
                    className="text-base font-black text-slate-900 tracking-tight hover:text-blue-600 transition-colors flex items-center justify-end gap-1 ml-auto cursor-pointer group"
                    title="Click to manually edit Fare"
                  >
                    <span>₹{booking.totalFare.toFixed(2)}</span>
                    <Pencil className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Fare Presets when editing */}
            {isEditingQuickFare && (
              <div className="bg-blue-50/80 p-2 rounded-xl border border-blue-200 animate-in fade-in space-y-1">
                <div className="flex items-center justify-between text-[10px] text-blue-900 font-bold">
                  <span>Quick Presets:</span>
                  <span className="text-[9px] text-slate-500 font-normal">Tap to set fare</span>
                </div>
                <div className="flex gap-1 overflow-x-auto no-scrollbar">
                  {[5, 10, 15, 20, 25, 30, 40, 50, 75, 100].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setQuickFareInput(String(amt));
                        if (onUpdateBooking) {
                          onUpdateBooking({ ...booking, fare: amt, totalFare: amt });
                        }
                        setIsEditingQuickFare(false);
                      }}
                      className="px-2 py-0.5 text-[10px] font-bold rounded bg-white text-blue-800 border border-blue-200 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer shrink-0"
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Via Route & IR Code */}
            <div className="pt-1.5 border-t border-slate-100 text-[11px] font-medium flex items-center justify-between text-slate-700">
              <span className="flex items-center gap-1 font-bold">
                <GitBranch className="w-3.5 h-3.5 text-slate-500" />
                <span>Via: {booking.viaStation || 'TBM'}</span>
              </span>
              <span className="font-mono text-[10px] text-slate-500 font-semibold">
                {booking.irCode}
              </span>
            </div>

            {/* Mint Green Validity Notice */}
            <div className="p-2 bg-[#d1fae5]/80 border-y border-[#a7f3d0] text-center rounded-lg">
              <p className="text-[10px] font-medium text-[#065f46]">
                *Valid for start of journey within 1 hour or until departure of the first train.
              </p>
            </div>

            {/* Red Non-Refundable Notice Box */}
            <div className="p-2.5 bg-[#fee2e2]/80 border border-[#fecaca] rounded-xl text-left">
              <p className="text-[10.5px] font-medium text-[#b91c1c] leading-relaxed">
                <span className="font-bold text-[#991b1b]">Note:</span> This ticket is non refundable. Ticket is stored locally on the device. Please do not change your handset or perform factory reset.
              </p>
            </div>

            {/* Book Connecting Journey Button matching video */}
            <div className="pt-1">
              <button
                type="button"
                onClick={onBookConnecting}
                className="w-full py-2.5 px-4 bg-white hover:bg-blue-50 text-[#1d4ed8] border border-[#93c5fd] rounded-xl text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
              >
                Book Connecting Journey
              </button>
            </div>

            {/* Perfectly Straight High-Density UTS Indian Railways QR Code */}
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <img
                  src={qrDataUrl || '/extracted_assets/ticket_straight_qr.png'}
                  alt="UTS Indian Railways Ticket QR Code"
                  className="w-44 h-44 object-contain block mx-auto"
                />
              </div>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                Scan for UTS Ticket Verification
              </p>
            </div>

            {/* Footer Statues & Railway Help Text */}
            <div className="space-y-1.5 pt-2 text-[10px] text-slate-500 leading-relaxed text-center">
              <p className="font-bold text-slate-800">
                Do you know? <span className="font-normal text-slate-600">IR recovers only 57% of cost of travel on an average</span>
              </p>
              <p className="text-[9.5px] text-slate-400">
                This ticket is booked on a personal user ID. It's sale/purchase is an offence u/s 143 of the Railways Act, 1989.
              </p>
              <p className="font-bold text-[#1d4ed8]">
                For enquiry and integrated railway helpline, please dial 139
              </p>
            </div>
          </div>
        </div>

        {/* Expired Countdown Warning Card */}
        {isExpired && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl shadow-xs text-center space-y-2.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-center gap-1.5 text-amber-900 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Dynamic preview has expired.</span>
            </div>
            <p className="text-[11px] text-amber-700">
              Click below to restart the interactive 05:00 countdown timer.
            </p>
            <button
              type="button"
              onClick={handleRestartTimer}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Refresh Demo Preview</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1 no-print">
          <button
            type="button"
            onClick={onBack}
            className="w-full py-3 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer text-center"
          >
            Back to Bookings
          </button>
          <button
            type="button"
            onClick={onBookAnother}
            className="w-full py-3 px-3 bg-[#1264df] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer text-center"
          >
            Book Another Journey
          </button>
        </div>
      </div>

      {/* Edit Booking Modal */}
      <EditBookingModal
        isOpen={showEditModal}
        booking={booking}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
      />
    </div>
  );
};
