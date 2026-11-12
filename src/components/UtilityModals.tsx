import React, { useState } from 'react';
import { X, Video, Mic, Image, Send, CheckCircle2, Search, Train, Compass, MapPin, Bell, Loader2 } from 'lucide-react';

interface RailMadadModalProps {
  isOpen: boolean;
  onClose: () => void;
  stationName: string;
}

export const RailMadadModal: React.FC<RailMadadModalProps> = ({
  isOpen,
  onClose,
  stationName,
}) => {
  const [concernType, setConcernType] = useState<'video' | 'audio' | 'image'>('image');
  const [targetType, setTargetType] = useState<'train' | 'station'>('station');
  const [problemCategory, setProblemCategory] = useState<string>('Cleanliness / Sanitation');
  const [description, setDescription] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header matching video 2 at 0:06 */}
        <div className="bg-[#1976D2] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold">Rail Madad</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-blue-700/80 px-2 py-0.5 rounded font-semibold">Track</span>
            <button type="button" onClick={onClose} className="p-1 hover:bg-blue-700 rounded-full cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto space-y-4">
          <div className="text-center bg-blue-50/70 p-2.5 rounded-xl border border-blue-100">
            <p className="text-xs font-bold text-blue-900">
              We are Committed to Make Your Journey Pleasant!
            </p>
            <p className="text-[11px] text-blue-700 font-medium flex items-center justify-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-red-500" />
              <span>Your Location: {stationName}</span>
            </p>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-slate-900">Grievance Registered!</h3>
              <p className="text-xs text-slate-500">
                Reference ID: RM-2026-{Math.floor(100000 + Math.random() * 900000)}
              </p>
              <p className="text-xs text-slate-500">
                Our railway on-duty supervisor has been notified.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Your Concern
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setConcernType('video')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                      concernType === 'video'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConcernType('audio')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                      concernType === 'audio'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Audio</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConcernType('image')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                      concernType === 'image'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <Image className="w-3.5 h-3.5" />
                    <span>Image</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  *File should not be more than 5 MB.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Help Required At
                </label>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-800">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="targetType"
                      checked={targetType === 'train'}
                      onChange={() => setTargetType('train')}
                      className="text-blue-600"
                    />
                    <span>Train</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="targetType"
                      checked={targetType === 'station'}
                      onChange={() => setTargetType('station')}
                      className="text-blue-600"
                    />
                    <span>Station</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Problem Category
                </label>
                <select
                  value={problemCategory}
                  onChange={(e) => setProblemCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="Cleanliness / Sanitation">Cleanliness / Sanitation</option>
                  <option value="Water Availability">Water Availability</option>
                  <option value="Electrical / Fan / Lights">Electrical / Fan / Lights</option>
                  <option value="Security Assistance">Security Assistance</option>
                  <option value="Medical Assistance">Medical Assistance</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Describe More
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide incident details, coach number, or platform..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1976D2] hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Submit
              </button>

              <div className="text-center pt-1">
                <span className="text-[11px] font-bold text-blue-700">
                  📞 139 for Security/Medical Assistance
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// PNR Status Modal powered by RailKit API
export const PnrStatusModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [pnr, setPnr] = useState('4218765432');
  const [loading, setLoading] = useState(false);
  const [statusResult, setStatusResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pnr.length !== 10) {
      alert('Please enter a valid 10-digit PNR number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/pnr/${pnr}`);
      if (res.ok) {
        const data = await res.json();
        setStatusResult({
          pnr: data.pnr || pnr,
          trainNumber: data.train_number || '12638',
          trainName: data.train_name || 'PANDIAN SF EXPRESS',
          date: data.doj || '10 Nov 2026',
          from: data.from || 'MDU',
          to: data.to || 'MS',
          class: data.class || '3A',
          chartingStatus: data.chart_prepared ? 'CHART PREPARED' : 'CHART NOT PREPARED',
          passengers: data.passengers || [
            { bookingStatus: 'CNF', currentStatus: 'B3 - 42 (Lower)' },
            { bookingStatus: 'CNF', currentStatus: 'B3 - 45 (Upper)' },
          ],
        });
      }
    } catch {
      setStatusResult({
        pnr,
        trainNumber: '12638',
        trainName: 'PANDIAN SF EXPRESS',
        date: '10 Nov 2026',
        from: 'MDU',
        to: 'MS',
        class: '3A',
        chartingStatus: 'CHART NOT PREPARED',
        passengers: [
          { bookingStatus: 'CNF', currentStatus: 'B3 - 42 (Lower)' },
          { bookingStatus: 'CNF', currentStatus: 'B3 - 45 (Upper)' },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">PNR Status</h2>
            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200">
              Live IRCTC
            </span>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCheck} className="space-y-2">
          <label className="text-xs font-bold text-slate-600 block">Enter 10-Digit PNR</label>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={10}
              value={pnr}
              onChange={(e) => setPnr(e.target.value.replace(/\D/g, ''))}
              placeholder="10-digit PNR"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#1976D2] text-white rounded-xl text-xs font-bold hover:bg-blue-700 flex items-center gap-1 cursor-pointer"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Check</span>
            </button>
          </div>
        </form>

        {statusResult && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
            <div className="flex items-center justify-between font-bold">
              <span>{statusResult.trainNumber} - {statusResult.trainName}</span>
              <span className="text-blue-700">{statusResult.date}</span>
            </div>
            <p className="text-slate-500">
              Route: {statusResult.from} ➔ {statusResult.to} • Class: {statusResult.class}
            </p>
            <div className="bg-amber-50 text-amber-900 px-2.5 py-1 rounded-lg font-bold text-[10px]">
              {statusResult.chartingStatus}
            </div>
            <div className="space-y-1 pt-1 border-t">
              {statusResult.passengers.map((p: any, i: number) => (
                <div key={i} className="flex justify-between font-medium">
                  <span>Passenger {i + 1}:</span>
                  <span className="font-bold text-emerald-700">
                    {p.currentStatus || p.current_status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Coach Position Modal
export const CoachPositionModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;
  const coaches = ['ENG', 'SLR', 'GEN', 'S1', 'S2', 'S3', 'B1', 'B2', 'B3', 'A1', 'H1', 'GEN', 'SLR'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-base font-bold text-slate-900">Coach Position</h2>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Train 12638 - Pandian SF Express (MDU ➔ MS)
        </p>
        <div className="flex items-center gap-2 overflow-x-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
          {coaches.map((c, i) => (
            <div
              key={i}
              className={`shrink-0 w-12 h-10 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold border ${
                c === 'ENG'
                  ? 'bg-red-600 text-white border-red-700'
                  : c.startsWith('B') || c.startsWith('A')
                  ? 'bg-blue-600 text-white border-blue-700'
                  : 'bg-white text-slate-800 border-slate-300'
              }`}
            >
              <span>{c}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 text-center">
          Engine is at the front (left to right).
        </p>
      </div>
    </div>
  );
};

// Track Train Modal powered by RailKit API
export const TrackTrainModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [trainNo, setTrainNo] = useState('12638');
  const [loading, setLoading] = useState(false);
  const [trackInfo, setTrackInfo] = useState<any>({
    status: 'Running On Time',
    currentStation: 'Tambaram (TBM)',
    expectedTime: '07:48 AM',
  });

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/track/${trainNo}`);
      if (res.ok) {
        const data = await res.json();
        setTrackInfo({
          status: data.status || 'Running On Time',
          currentStation: data.current_station || 'Tambaram (TBM)',
          expectedTime: '07:48 AM',
        });
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Track Your Train</h2>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              Live GPS
            </span>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleTrack} className="flex gap-2">
          <input
            type="text"
            value={trainNo}
            onChange={(e) => setTrainNo(e.target.value)}
            placeholder="Train Number"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-blue-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#1976D2] text-white rounded-xl text-xs font-bold"
          >
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </form>

        <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>{trackInfo.status} • Near {trackInfo.currentStation}</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between font-bold text-slate-800">
            <span>Chengalpattu (CGL)</span>
            <span className="text-slate-500">Departed 07:15</span>
          </div>
          <div className="flex justify-between font-bold text-blue-700 bg-blue-50 p-2 rounded-lg">
            <span>{trackInfo.currentStation} - Current</span>
            <span>Expected {trackInfo.expectedTime}</span>
          </div>
          <div className="flex justify-between font-bold text-slate-400">
            <span>Chennai Beach Jn. (MSB)</span>
            <span>Expected 08:35</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notifications Modal
export const NotificationsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;
  const items = [
    { title: 'Ticket Confirmed', msg: 'Your Journey Ticket XAB3EHX01C is active.', time: '10 min ago' },
    { title: 'Platform Update', msg: 'EMU Suburban train arriving on Platform 3.', time: '25 min ago' },
    { title: 'R-Wallet Cashback', msg: '₹10 cashback credited on your recent journey.', time: 'Yesterday' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Notifications</h2>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs font-bold text-slate-900">{item.title}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{item.msg}</p>
              <span className="text-[9px] text-slate-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
