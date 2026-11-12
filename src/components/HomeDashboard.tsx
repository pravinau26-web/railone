import React, { useState } from 'react';
import {
  Search,
  FileText,
  Boxes,
  Compass,
  UtensilsCrossed,
  RotateCcw,
  HandHeart,
  Calendar,
  Package,
  Calculator,
  Pencil,
} from 'lucide-react';
import { Booking } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { getAssetUrl } from '../utils/assets';

interface HomeDashboardProps {
  latestBooking?: Booking;
  onOpenReserved: () => void;
  onOpenUnreserved: () => void;
  onOpenPlatform: () => void;
  onOpenPnr: () => void;
  onOpenCoach: () => void;
  onOpenTrack: () => void;
  onOpenRailMadad: () => void;
  onOpenOrderFood: () => void;
  onOpenFileRefund: () => void;
  onViewBookingDetails: (booking: Booking) => void;
  onBookAgain: (booking: Booking) => void;
  onEditBooking?: (booking: Booking) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  latestBooking,
  onOpenReserved,
  onOpenUnreserved,
  onOpenPlatform,
  onOpenPnr,
  onOpenCoach,
  onOpenTrack,
  onOpenRailMadad,
  onOpenOrderFood,
  onOpenFileRefund,
  onViewBookingDetails,
  onBookAgain,
  onEditBooking,
}) => {
  const [hideShipment, setHideShipment] = useState(false);

  return (
    <div className="space-y-4 pb-24 bg-white min-h-screen">
      {/* PWA Install Banner */}
      <div className="px-4 pt-2">
        <PWAInstallButton variant="banner" />
      </div>

      {/* 1. Journey Planner Section */}
      <section className="px-4 pt-1">
        <h2 className="text-base font-extrabold text-[#11244a] tracking-tight mb-2">
          Journey Planner
        </h2>
        <div className="grid grid-cols-3 gap-2.5">
          {/* 1. Reserved Card */}
          <button
            type="button"
            onClick={onOpenReserved}
            className="group flex flex-col items-center cursor-pointer focus:outline-none"
          >
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xs border border-slate-200/80 bg-slate-100 group-hover:shadow-md transition-all">
              <img
                src={getAssetUrl('extracted_assets/reserved_final.png')}
                alt="Reserved Train Booking"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&auto=format&fit=crop&q=80';
                }}
              />
            </div>
            <span className="text-xs font-bold text-[#1a2d52] mt-1.5 tracking-tight">
              Reserved
            </span>
          </button>

          {/* 2. Unreserved Card */}
          <button
            type="button"
            onClick={onOpenUnreserved}
            className="group flex flex-col items-center cursor-pointer focus:outline-none"
          >
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xs border border-slate-200/80 bg-slate-100 group-hover:shadow-md transition-all">
              <img
                src={getAssetUrl('extracted_assets/unreserved_final.png')}
                alt="Unreserved E-Ticket"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=300&auto=format&fit=crop&q=80';
                }}
              />
            </div>
            <span className="text-xs font-bold text-[#1a2d52] mt-1.5 tracking-tight">
              Unreserved
            </span>
          </button>

          {/* 3. Platform Card */}
          <button
            type="button"
            onClick={onOpenPlatform}
            className="group flex flex-col items-center cursor-pointer focus:outline-none"
          >
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xs border border-slate-200/80 bg-slate-100 group-hover:shadow-md transition-all">
              <img
                src={getAssetUrl('extracted_assets/platform_final.png')}
                alt="Platform Ticket"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=300&auto=format&fit=crop&q=80';
                }}
              />
            </div>
            <span className="text-xs font-bold text-[#1a2d52] mt-1.5 tracking-tight">
              Platform
            </span>
          </button>
        </div>
      </section>

      {/* 2. More Offerings Grid */}
      <section className="px-4">
        <h2 className="text-sm font-extrabold text-[#1e293b] tracking-tight mb-2.5">
          More Offerings
        </h2>
        <div className="grid grid-cols-4 gap-2.5">
          {/* Search Trains */}
          <button
            type="button"
            onClick={onOpenReserved}
            className="flex flex-col items-center p-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-100 shadow-2xs transition-all active:scale-95 cursor-pointer text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#fdf2f8] text-[#db2777] flex items-center justify-center mb-1 shadow-2xs">
              <Search className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-[11px] font-semibold text-[#1e293b] leading-tight">
              Search Trains
            </span>
          </button>

          {/* PNR Status */}
          <button
            type="button"
            onClick={onOpenPnr}
            className="flex flex-col items-center p-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-100 shadow-2xs transition-all active:scale-95 cursor-pointer text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center mb-1 shadow-2xs">
              <FileText className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-[11px] font-semibold text-[#1e293b] leading-tight">
              PNR Status
            </span>
          </button>

          {/* Coach Position */}
          <button
            type="button"
            onClick={onOpenCoach}
            className="flex flex-col items-center p-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-100 shadow-2xs transition-all active:scale-95 cursor-pointer text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#eff6ff] text-[#2563eb] flex items-center justify-center mb-1 shadow-2xs">
              <Boxes className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-[11px] font-semibold text-[#1e293b] leading-tight">
              Coach Position
            </span>
          </button>

          {/* Track Your Train */}
          <button
            type="button"
            onClick={onOpenTrack}
            className="flex flex-col items-center p-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-100 shadow-2xs transition-all active:scale-95 cursor-pointer text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#fefce8] text-[#ca8a04] flex items-center justify-center mb-1 shadow-2xs">
              <Compass className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-[11px] font-semibold text-[#1e293b] leading-tight">
              Track Your Train
            </span>
          </button>

          {/* Order Food */}
          <button
            type="button"
            onClick={onOpenOrderFood}
            className="flex flex-col items-center p-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-100 shadow-2xs transition-all active:scale-95 cursor-pointer text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center mb-1 shadow-2xs">
              <UtensilsCrossed className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-[11px] font-semibold text-[#1e293b] leading-tight">
              Order Food
            </span>
          </button>

          {/* File Refund */}
          <button
            type="button"
            onClick={onOpenFileRefund}
            className="flex flex-col items-center p-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-100 shadow-2xs transition-all active:scale-95 cursor-pointer text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#f5f3ff] text-[#7c3aed] flex items-center justify-center mb-1 shadow-2xs">
              <RotateCcw className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-[11px] font-semibold text-[#1e293b] leading-tight">
              File Refund
            </span>
          </button>

          {/* Rail Madad */}
          <button
            type="button"
            onClick={onOpenRailMadad}
            className="flex flex-col items-center p-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-100 shadow-2xs transition-all active:scale-95 cursor-pointer text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#fff1f2] text-[#e11d48] flex items-center justify-center mb-1 shadow-2xs">
              <HandHeart className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-[11px] font-semibold text-[#1e293b] leading-tight">
              Rail Madad
            </span>
          </button>

          {/* Go To WAVES */}
          <button
            type="button"
            onClick={() => alert('WAVES: Indian Railways In-Train Content on Demand & Wi-Fi Portal.')}
            className="flex flex-col items-center p-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-100 shadow-2xs transition-all active:scale-95 cursor-pointer text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center font-black text-sm mb-1 shadow-2xs">
              W
            </div>
            <span className="text-[11px] font-semibold text-[#1e293b] leading-tight">
              Go To WAVES
            </span>
          </button>
        </div>
      </section>

      {/* 3. Upcoming Journey Widget */}
      {latestBooking && (
        <section className="px-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-extrabold text-[#1e293b] tracking-tight">
              Upcoming Journey
            </h2>
            {onEditBooking && (
              <button
                type="button"
                onClick={() => onEditBooking(latestBooking)}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
              >
                <Pencil className="w-3 h-3" />
                <span>Edit Stations / Fare</span>
              </button>
            )}
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#4338ca] via-[#3b82f6] to-[#6366f1] text-white p-4 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-blue-100 font-semibold mb-2">
              <span className="flex items-center gap-1.5 font-bold">
                <Calendar className="w-3.5 h-3.5" />
                {latestBooking.journeyDate}
              </span>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider">
                {latestBooking.bookingType}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-black tracking-tight">
                  {latestBooking.sourceStation.name}
                </p>
                <p className="text-[11px] text-blue-200 font-bold">
                  {latestBooking.sourceStation.code}
                </p>
              </div>

              <div className="flex flex-col items-center px-3">
                <span className="text-[10px] text-blue-200 font-bold">
                  {latestBooking.distanceKm} km
                </span>
                <div className="w-16 h-0.5 bg-blue-300 relative flex items-center justify-end">
                  <span className="w-1.5 h-1.5 border-t border-r border-white rotate-45"></span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-black tracking-tight">
                  {latestBooking.destinationStation.name}
                </p>
                <p className="text-[11px] text-blue-200 font-bold">
                  {latestBooking.destinationStation.code}
                </p>
              </div>
            </div>

            {/* Actions matching video */}
            <div className="flex gap-2.5 mt-3 pt-2.5 border-t border-white/20">
              <button
                type="button"
                onClick={() => onBookAgain(latestBooking)}
                className="flex-1 py-2.5 px-3 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center text-white"
              >
                Book Again
              </button>
              <button
                type="button"
                onClick={() => onViewBookingDetails(latestBooking)}
                className="flex-1 py-2.5 px-3 bg-white text-[#1e3a8a] hover:bg-blue-50 rounded-xl text-xs font-black shadow-sm transition-all active:scale-98 cursor-pointer text-center"
              >
                View Details
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 4. Large Shipment Section */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-extrabold text-[#1e293b] tracking-tight">
            Large Shipment
          </h2>
          <label className="flex items-center gap-1.5 text-xs text-slate-500 font-medium cursor-pointer">
            <span className="text-[11px]">Hide</span>
            <input
              type="checkbox"
              checked={hideShipment}
              onChange={(e) => setHideShipment(e.target.checked)}
              className="w-3.5 h-3.5 text-blue-600 rounded"
            />
          </label>
        </div>

        {!hideShipment && (
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => alert('Plan Freight: Book Parcel Van, Container, or Goods Wagon.')}
              className="p-3 bg-[#e0f2fe]/60 border border-[#bae6fd] rounded-2xl text-center flex flex-col items-center justify-center space-y-1 hover:bg-[#e0f2fe] transition-colors cursor-pointer"
            >
              <Package className="w-5 h-5 text-[#0369a1]" />
              <span className="text-[11px] font-bold text-[#0c4a6e] leading-tight">
                Plan Shipment
              </span>
            </button>

            <button
              type="button"
              onClick={() => alert('Track Shipment: Real-time FBD & FOIS wagon tracking.')}
              className="p-3 bg-[#e0f2fe]/60 border border-[#bae6fd] rounded-2xl text-center flex flex-col items-center justify-center space-y-1 hover:bg-[#e0f2fe] transition-colors cursor-pointer"
            >
              <Compass className="w-5 h-5 text-[#0369a1]" />
              <span className="text-[11px] font-bold text-[#0c4a6e] leading-tight">
                Track Shipment
              </span>
            </button>

            <button
              type="button"
              onClick={() => alert('Freight Calculator: Estimate parcel and bulk commodity rates.')}
              className="p-3 bg-[#e0f2fe]/60 border border-[#bae6fd] rounded-2xl text-center flex flex-col items-center justify-center space-y-1 hover:bg-[#e0f2fe] transition-colors cursor-pointer"
            >
              <Calculator className="w-5 h-5 text-[#0369a1]" />
              <span className="text-[11px] font-bold text-[#0c4a6e] leading-tight">
                Freight Calculator
              </span>
            </button>
          </div>
        )}
      </section>

      {/* 5. "Do You know?" Trivia Cards */}
      <section className="px-4">
        <h2 className="text-sm font-extrabold text-[#11244a] tracking-tight mb-2">
          Do You know?
        </h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {/* Card 1: Bori Bandar Steam Train */}
          <div className="w-64 shrink-0 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="h-32 bg-slate-100 overflow-hidden">
              <img
                src={getAssetUrl('extracted_assets/doyouknow_boribandar.png')}
                alt="First train between Bori Bandar to Thane"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3">
              <p className="text-xs font-medium text-slate-700 leading-snug">
                First ever passenger train was run between Bori Bandar to Thane on April 16, 1853.
              </p>
            </div>
          </div>

          {/* Card 2: Chenab Railway Bridge */}
          <div className="w-64 shrink-0 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="h-32 bg-slate-100 overflow-hidden">
              <img
                src={getAssetUrl('extracted_assets/doyouknow_chenab.png')}
                alt="Chenab Railway Bridge"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3">
              <p className="text-xs font-medium text-slate-700 leading-snug">
                Chenab Railway Bridge in Dharot, Jammu & Kashmir is the World's highest Railway Bridge.
              </p>
            </div>
          </div>

          {/* Card 3: Noney Bridge */}
          <div className="w-64 shrink-0 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="h-32 bg-slate-100 overflow-hidden">
              <img
                src={getAssetUrl('extracted_assets/doyouknow_chenab.png')}
                alt="Noney Bridge"
                className="w-full h-full object-cover filter hue-rotate-60"
              />
            </div>
            <div className="p-3">
              <p className="text-xs font-medium text-slate-700 leading-snug">
                Noney Bridge in Manipur is the world's tallest railway bridge pier at 141 metres.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Follow Us On Social Media Platforms */}
      <section className="px-4 pt-1">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
          Follow Us On Social Media Platforms
        </h2>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => alert('RailOne Official X (Twitter): @RailMinIndia')}
            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shadow-xs hover:scale-105 transition-transform cursor-pointer"
          >
            𝕏
          </button>
          <button
            type="button"
            onClick={() => alert('RailOne Official Facebook: Ministry of Railways')}
            className="w-10 h-10 rounded-full bg-[#1877f2] text-white flex items-center justify-center font-bold text-base shadow-xs hover:scale-105 transition-transform cursor-pointer"
          >
            f
          </button>
          <button
            type="button"
            onClick={() => alert('RailOne Official Instagram: @railminindia')}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f59e0b] via-[#e11d48] to-[#9333ea] text-white flex items-center justify-center font-bold text-sm shadow-xs hover:scale-105 transition-transform cursor-pointer"
          >
            📷
          </button>
          <button
            type="button"
            onClick={() => alert('RailOne Official YouTube: Ministry of Railways Official')}
            className="w-10 h-10 rounded-full bg-[#ff0000] text-white flex items-center justify-center font-bold text-sm shadow-xs hover:scale-105 transition-transform cursor-pointer"
          >
            ▶
          </button>
        </div>
      </section>
    </div>
  );
};
