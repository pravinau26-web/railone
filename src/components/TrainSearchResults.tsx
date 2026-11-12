import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Station, Train, ClassAvailability, QuotaType } from '../types';
import { SAMPLE_TRAINS } from '../data/trains';
import { bookingService } from '../services/bookingService';

interface TrainSearchResultsProps {
  fromStation: Station;
  toStation: Station;
  journeyDate: string;
  selectedClass: string;
  quota: QuotaType;
  onBack: () => void;
  onSelectTrain: (train: Train, selectedClass: ClassAvailability) => void;
}

export const TrainSearchResults: React.FC<TrainSearchResultsProps> = ({
  fromStation,
  toStation,
  journeyDate,
  quota,
  onBack,
  onSelectTrain,
}) => {
  const [trains, setTrains] = useState<Train[]>(SAMPLE_TRAINS);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTrainId, setSelectedTrainId] = useState<string | null>(null);
  const [selectedClassMap, setSelectedClassMap] = useState<Record<string, ClassAvailability>>({});

  useEffect(() => {
    async function fetchLiveTrains() {
      setLoading(true);
      try {
        const live = await bookingService.getTrains(fromStation.code, toStation.code);
        if (live && live.length > 0) {
          setTrains(live);
        } else {
          setTrains(SAMPLE_TRAINS);
        }
      } catch {
        setTrains(SAMPLE_TRAINS);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveTrains();
  }, [fromStation.code, toStation.code]);

  const handleClassSelect = (trainId: string, cls: ClassAvailability) => {
    setSelectedTrainId(trainId);
    setSelectedClassMap((prev) => ({ ...prev, [trainId]: cls }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
      {/* Header matching RailOne style */}
      <div className="bg-[#1976D2] text-white px-4 py-3 flex items-center gap-3 shadow-md shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="p-1 hover:bg-blue-700/60 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight">{fromStation.code}</span>
            <span className="text-xs text-blue-200">➔</span>
            <span className="font-extrabold text-sm tracking-tight">{toStation.code}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-blue-100 mt-0.5 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {journeyDate}
            </span>
            <span>• Quota: {quota}</span>
          </div>
        </div>
      </div>

      {/* Train list */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
          <span>{loading ? 'Searching Indian Railways...' : `${trains.length} Trains Available`}</span>
          <span className="text-[#1976D2]">Sort by Departure</span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 text-slate-400">
            <Loader2 className="w-8 h-8 text-[#1976D2] animate-spin" />
            <p className="text-xs font-semibold text-slate-600">
              Fetching real-time trains & fares from Indian Railways...
            </p>
          </div>
        ) : (
          trains.map((train) => {
            const currentClass = selectedClassMap[train.number];

            return (
              <div
                key={train.number}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3"
              >
                {/* Train Name and Number */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                      {train.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-extrabold text-[#1976D2]">{train.number}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">
                        {train.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-[10px] font-bold text-slate-400">
                    {train.runningDays.map((d, i) => (
                      <span key={i} className="text-emerald-700 font-extrabold">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Timing row */}
                <div className="flex items-center justify-between py-1 bg-slate-50 px-3 rounded-xl">
                  <div>
                    <p className="text-base font-extrabold text-slate-900">{train.departureTime}</p>
                    <p className="text-[11px] font-bold text-slate-500">{train.sourceStation || fromStation.code}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {train.duration}
                    </span>
                    <div className="w-16 h-0.5 bg-slate-300 relative flex items-center justify-center my-1">
                      <span className="w-1.5 h-1.5 bg-[#1976D2] rounded-full"></span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-extrabold text-slate-900">{train.arrivalTime}</p>
                    <p className="text-[11px] font-bold text-slate-500">{train.destinationStation || toStation.code}</p>
                  </div>
                </div>

                {/* Class chips and availability */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    Available Classes
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {train.classes.map((cls) => {
                      const isSelected = currentClass?.classCode === cls.classCode;
                      return (
                        <button
                          key={cls.classCode}
                          type="button"
                          onClick={() => handleClassSelect(train.number, cls)}
                          className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#1976D2] bg-blue-50/80 ring-1 ring-blue-500'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-900">{cls.classCode}</span>
                            <span className="text-xs font-bold text-slate-800">₹{cls.fare}</span>
                          </div>
                          <div className="mt-1">
                            {cls.status === 'AVAILABLE' && (
                              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">
                                AVL {cls.availableCount}
                              </span>
                            )}
                            {cls.status === 'RAC' && (
                              <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-1 py-0.5 rounded">
                                RAC {cls.availableCount}
                              </span>
                            )}
                            {cls.status === 'WL' && (
                              <span className="text-[10px] font-extrabold text-red-700 bg-red-50 px-1 py-0.5 rounded">
                                WL {cls.availableCount}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Book button if class selected */}
                {currentClass && selectedTrainId === train.number && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => onSelectTrain(train, currentClass)}
                      className="w-full bg-[#1976D2] hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <span>Proceed to Book ({currentClass.classCode} • ₹{currentClass.fare})</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
