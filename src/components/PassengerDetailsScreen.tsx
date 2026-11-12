import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Trash2, ShieldCheck, Ticket } from 'lucide-react';
import { Train, ClassAvailability, Station, QuotaType, Passenger } from '../types';

interface PassengerDetailsScreenProps {
  train: Train;
  selectedClass: ClassAvailability;
  fromStation: Station;
  toStation: Station;
  journeyDate: string;
  quota: QuotaType;
  onBack: () => void;
  onProceedToSummary: (passengers: Passenger[], contactMobile: string) => void;
}

export const PassengerDetailsScreen: React.FC<PassengerDetailsScreenProps> = ({
  train,
  selectedClass,
  fromStation,
  toStation,
  journeyDate,
  quota,
  onBack,
  onProceedToSummary,
}) => {
  const [passengers, setPassengers] = useState<Passenger[]>([
    {
      id: 'p-1',
      name: 'Pravinkumar Asaithambi',
      age: 28,
      gender: 'MALE',
      berthPreference: 'LOWER',
      foodPreference: 'VEG',
    },
  ]);

  const [contactMobile, setContactMobile] = useState('9245464648');
  const [showAddModal, setShowAddModal] = useState(false);

  // New passenger form state
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newGender, setNewGender] = useState<'MALE' | 'FEMALE' | 'TRANSGENDER'>('MALE');
  const [newBerth, setNewBerth] = useState<'LOWER' | 'MIDDLE' | 'UPPER' | 'SIDE LOWER' | 'SIDE UPPER' | 'NO PREFERENCE'>('NO PREFERENCE');

  const handleAddPassenger = () => {
    if (!newName.trim() || !newAge) {
      alert('Please enter passenger name and age.');
      return;
    }
    const p: Passenger = {
      id: 'p-' + Date.now(),
      name: newName.trim(),
      age: parseInt(newAge, 10),
      gender: newGender,
      berthPreference: newBerth,
      foodPreference: 'VEG',
    };
    setPassengers([...passengers, p]);
    setNewName('');
    setNewAge('');
    setShowAddModal(false);
  };

  const handleRemovePassenger = (id: string) => {
    if (passengers.length === 1) {
      alert('At least one passenger is required.');
      return;
    }
    setPassengers(passengers.filter((p) => p.id !== id));
  };

  const totalFare = passengers.length * selectedClass.fare;

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center gap-3 shadow-md shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="p-1 hover:bg-blue-700 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-bold leading-tight">Passenger Details</h1>
          <p className="text-[11px] text-blue-100 font-medium">
            {train.number} - {train.name}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Journey overview card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span>{fromStation.name} ➔ {toStation.name}</span>
            <span className="text-blue-700">{journeyDate}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
              Class: {selectedClass.classCode}
            </span>
            <span>Quota: {quota}</span>
          </div>
        </div>

        {/* Passenger list */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Passengers ({passengers.length})
            </h2>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Passenger</span>
            </button>
          </div>

          {passengers.map((p, index) => (
            <div
              key={p.id}
              className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {index + 1}. {p.name}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {p.age} Yrs • {p.gender} • Berth: {p.berthPreference || 'No Preference'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemovePassenger(p.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Contact Details */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Contact Mobile Number
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-2.5 rounded-xl border border-slate-200">
              +91
            </span>
            <input
              type="tel"
              value={contactMobile}
              onChange={(e) => setContactMobile(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none"
              placeholder="Enter 10-digit mobile"
            />
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            Ticket details and SMS updates will be sent to this mobile number.
          </p>
        </div>

        {/* IRCTC Security Banner */}
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-900 font-medium">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Demo Booking: Authentic IRCTC passenger validation simulated.</span>
        </div>
      </div>

      {/* Bottom Sticky CTA */}
      <div className="bg-white border-t border-slate-200 p-4 shrink-0 shadow-lg flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 font-medium">Total Fare</span>
          <p className="text-xl font-extrabold text-slate-900">₹ {totalFare.toFixed(2)}</p>
        </div>
        <button
          type="button"
          onClick={() => onProceedToSummary(passengers, contactMobile)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Proceed to Summary
        </button>
      </div>

      {/* Add Passenger Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-xs flex items-end justify-center p-0">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 space-y-3.5 animate-in slide-in-from-bottom duration-200">
            <h3 className="text-base font-bold text-slate-900">Add Passenger</h3>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Full Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Name as in Govt ID"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Age</label>
                <input
                  type="number"
                  value={newAge}
                  onChange={(e) => setNewAge(e.target.value)}
                  placeholder="Age"
                  min="1"
                  max="120"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Gender</label>
                <select
                  value={newGender}
                  onChange={(e) => setNewGender(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-blue-600"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="TRANSGENDER">Transgender</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Berth Preference</label>
              <select
                value={newBerth}
                onChange={(e) => setNewBerth(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-blue-600"
              >
                <option value="NO PREFERENCE">No Preference</option>
                <option value="LOWER">Lower</option>
                <option value="MIDDLE">Middle</option>
                <option value="UPPER">Upper</option>
                <option value="SIDE LOWER">Side Lower</option>
                <option value="SIDE UPPER">Side Upper</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddPassenger}
                className="flex-1 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
