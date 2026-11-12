import React, { useState } from 'react';
import { User, Wallet, RefreshCw, Plus, KeyRound, UserCheck, Fingerprint, ArrowRightLeft, Receipt, CreditCard, CheckCircle2, X } from 'lucide-react';
import { UserProfile } from '../types';

interface UserProfileScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onAddMoney: (amount: number) => void;
  onBackToHome: () => void;
}

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  userProfile,
  onUpdateProfile,
  onAddMoney,
  onBackToHome,
}) => {
  const [showAddMoneyModal, setShowAddMoneyModal] = useState<boolean>(false);
  const [addAmount, setAddAmount] = useState<string>('200');
  const [showEditNameModal, setShowEditNameModal] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(userProfile.name);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showAadharModal, setShowAadharModal] = useState<boolean>(false);
  const [showTransactionsModal, setShowTransactionsModal] = useState<boolean>(false);

  const quickAmounts = [500, 1000, 1500, 2000];

  const handleAddMoneySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(addAmount);
    if (!isNaN(val) && val > 0) {
      onAddMoney(val);
      setShowAddMoneyModal(false);
      setAddAmount('200');
    }
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim()) {
      onUpdateProfile({ name: editName.trim() });
      setShowEditNameModal(false);
    }
  };

  const toggleBiometric = () => {
    onUpdateProfile({ biometricEnabled: !userProfile.biometricEnabled });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col max-w-md mx-auto shadow-2xl pb-24">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <h1 className="text-base font-bold text-slate-900">User Profile</h1>
        <button
          type="button"
          onClick={onBackToHome}
          className="text-xs font-bold text-blue-700 hover:text-blue-800 cursor-pointer"
        >
          Done
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-blue-100 border-2 border-blue-600 text-blue-700 flex items-center justify-center font-bold text-2xl shadow-inner">
              <User className="w-10 h-10" />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div>
            <h2 className="text-base font-extrabold text-slate-900">{userProfile.name}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">+91 {userProfile.mobile}</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-blue-700">
            <button
              type="button"
              onClick={() => alert(`Profile Details:\nName: ${userProfile.name}\nMobile: ${userProfile.mobile}\nEmail: ${userProfile.email}\nAadhar: Linked`)}
              className="hover:underline cursor-pointer"
            >
              👁 View Details
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() => {
                setEditName(userProfile.name);
                setShowEditNameModal(true);
              }}
              className="hover:underline cursor-pointer"
            >
              ✎ Edit Details
            </button>
          </div>
        </div>

        {/* R-Wallet Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                R-Wallet Balance
              </span>
              <p className="text-lg font-extrabold text-slate-900">
                ₹ {userProfile.walletBalance.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert('Wallet balance synchronized with Indian Railways.')}
              className="p-2 text-slate-400 hover:text-blue-700 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              title="Sync Balance"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowAddMoneyModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              Add Money
            </button>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700">Profile Complete</span>
            <span className="text-emerald-700">100%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-full"></div>
          </div>
        </div>

        {/* Saved Passengers Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-900">Saved Passengers</p>
            <p className="text-[11px] text-slate-500 font-medium">Add/Edit Passenger info</p>
          </div>
          <button
            type="button"
            onClick={() => alert('Passenger master list ready for fast booking.')}
            className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Grid of 6 Action Tiles */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Change Password */}
          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className="p-4 bg-white hover:bg-blue-50/50 rounded-2xl border border-slate-200 text-left transition-all shadow-2xs hover:shadow-xs cursor-pointer space-y-2"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <p className="text-xs font-extrabold text-slate-900">Change Password</p>
          </button>

          {/* My Account */}
          <button
            type="button"
            onClick={() => alert(`Account ID: IR-9245464648\nStatus: Verified User`)}
            className="p-4 bg-white hover:bg-blue-50/50 rounded-2xl border border-slate-200 text-left transition-all shadow-2xs hover:shadow-xs cursor-pointer space-y-2"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <p className="text-xs font-extrabold text-slate-900">My Account</p>
          </button>

          {/* Biometric */}
          <button
            type="button"
            onClick={toggleBiometric}
            className="p-4 bg-white hover:bg-blue-50/50 rounded-2xl border border-slate-200 text-left transition-all shadow-2xs hover:shadow-xs cursor-pointer space-y-2 relative"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Fingerprint className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  userProfile.biometricEnabled
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {userProfile.biometricEnabled ? 'ON' : 'OFF'}
              </span>
            </div>
            <p className="text-xs font-extrabold text-slate-900">Biometric</p>
          </button>

          {/* Transfer Ticket */}
          <button
            type="button"
            onClick={() => alert('Transfer Ticket facility is available at the PRS counter 24 hours prior to train departure as per IR rules.')}
            className="p-4 bg-white hover:bg-blue-50/50 rounded-2xl border border-slate-200 text-left transition-all shadow-2xs hover:shadow-xs cursor-pointer space-y-2"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <p className="text-xs font-extrabold text-slate-900">Transfer Ticket</p>
          </button>

          {/* My Transaction */}
          <button
            type="button"
            onClick={() => setShowTransactionsModal(true)}
            className="p-4 bg-white hover:bg-blue-50/50 rounded-2xl border border-slate-200 text-left transition-all shadow-2xs hover:shadow-xs cursor-pointer space-y-2"
          >
            <div className="w-9 h-9 rounded-xl bg-yellow-50 text-yellow-700 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <p className="text-xs font-extrabold text-slate-900">My Transaction</p>
          </button>

          {/* Link Your Aadhar */}
          <button
            type="button"
            onClick={() => setShowAadharModal(true)}
            className="p-4 bg-white hover:bg-blue-50/50 rounded-2xl border border-slate-200 text-left transition-all shadow-2xs hover:shadow-xs cursor-pointer space-y-2"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <p className="text-xs font-extrabold text-slate-900">Link Your Aadhar</p>
          </button>
        </div>
      </div>

      {/* Add Money Modal Bottom Sheet */}
      {showAddMoneyModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-xs flex items-end justify-center p-0">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Add Money</h3>
              <button
                type="button"
                onClick={() => setShowAddMoneyModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMoneySubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Enter Amount (₹)</label>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 outline-none"
                  placeholder="Enter amount"
                />
              </div>

              {/* Quick suggestions */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAddAmount(amt.toString())}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 text-xs font-bold text-slate-700 hover:text-blue-700 transition-colors"
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>

              <p className="text-[10px] text-slate-400 font-medium">
                ⓘ R-Wallet balance cannot be transferred or withdrawn.
              </p>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Proceed to add ₹ {addAmount || '0'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Name Modal */}
      {showEditNameModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 space-y-4 animate-in slide-in-from-bottom duration-200">
            <h3 className="text-base font-bold text-slate-900">Edit User Details</h3>
            <form onSubmit={handleSaveName} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-600"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditNameModal(false)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Aadhar modal */}
      {showAadharModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 space-y-3 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Aadhar Verification Status</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your Aadhar is verified and linked to your RailOne profile (UIDAI Token: XXXX-XXXX-4819). You are eligible for up to 24 ticket bookings per month as per Indian Railways guidelines.
            </p>
            <button
              type="button"
              onClick={() => setShowAadharModal(false)}
              className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Transactions modal */}
      {showTransactionsModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-xs flex items-end justify-center p-0">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 space-y-3 max-h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
              <button
                type="button"
                onClick={() => setShowTransactionsModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 overflow-y-auto flex-1 divide-y divide-slate-100">
              <div className="py-2 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Ticket Booking - GUDUVANCHERI</p>
                  <p className="text-[10px] text-slate-400">10 Nov 2026, 07:45 AM • R-Wallet</p>
                </div>
                <span className="text-xs font-extrabold text-red-600">- ₹20.00</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Wallet Top-up</p>
                  <p className="text-[10px] text-slate-400">09 Nov 2026, 18:20 PM • UPI</p>
                </div>
                <span className="text-xs font-extrabold text-emerald-600">+ ₹200.00</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Ticket Booking - VILLIYANUR</p>
                  <p className="text-[10px] text-slate-400">22 Jun 2026, 16:00 PM • R-Wallet</p>
                </div>
                <span className="text-xs font-extrabold text-red-600">- ₹70.00</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 space-y-3 animate-in slide-in-from-bottom duration-200">
            <h3 className="text-base font-bold text-slate-900">Change Password</h3>
            <input
              type="password"
              placeholder="Current Password"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
            />
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-2 text-xs font-bold bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Password updated successfully.');
                  setShowPasswordModal(false);
                }}
                className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
