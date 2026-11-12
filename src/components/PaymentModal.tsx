import React, { useState, useEffect } from 'react';
import { ArrowLeft, Wallet, QrCode, CreditCard, ChevronRight, CheckCircle2, ShieldCheck, ChevronDown, Bell, Pencil, Check } from 'lucide-react';
import { Station, Booking } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromStation: Station;
  toStation: Station;
  amount: number;
  walletBalance: number;
  onPaymentSuccess: (method: 'R-Wallet' | 'UPI' | 'Card', finalAmount?: number) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  fromStation,
  toStation,
  amount,
  walletBalance,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'R-Wallet' | 'UPI' | 'Card'>('R-Wallet');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingSeconds, setProcessingSeconds] = useState<number>(210); // 3:30
  const [showNotification, setShowNotification] = useState<boolean>(false);

  // Editable Amount State
  const [currentAmount, setCurrentAmount] = useState<number>(amount);
  const [isEditingAmount, setIsEditingAmount] = useState<boolean>(false);

  useEffect(() => {
    setCurrentAmount(amount);
    setIsEditingAmount(false);
  }, [amount, isOpen]);

  useEffect(() => {
    let timer: any;
    if (isProcessing) {
      timer = setInterval(() => {
        setProcessingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      // Auto-succeed in 2.2 seconds for fluid demo UX
      const completeTimer = setTimeout(() => {
        setShowNotification(true);
        setTimeout(() => {
          setIsProcessing(false);
          onPaymentSuccess(selectedMethod, currentAmount);
        }, 1200);
      }, 2200);

      return () => {
        clearInterval(timer);
        clearTimeout(completeTimer);
      };
    }
  }, [isProcessing, onPaymentSuccess, selectedMethod, currentAmount]);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
  };

  const minutes = Math.floor(processingSeconds / 60);
  const seconds = processingSeconds % 60;
  const formattedProcessingTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl h-[90vh] sm:h-[80vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Top Header */}
        <div className="bg-blue-600 text-white px-4 py-3.5 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            {!isProcessing && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 hover:bg-blue-700 rounded-full transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-base font-bold leading-tight">Make Payment</h2>
              <p className="text-[11px] text-blue-100 font-medium">
                {fromStation.code} ➔ {toStation.code}
              </p>
            </div>
          </div>
          <div className="text-right">
            {isEditingAmount ? (
              <div className="flex items-center gap-1 bg-white/20 p-1 rounded-lg">
                <span className="text-xs font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(parseFloat(e.target.value) || 0)}
                  className="w-16 bg-white text-slate-900 font-black text-xs px-1.5 py-0.5 rounded outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsEditingAmount(false)}
                  className="p-0.5 bg-blue-700 text-white rounded hover:bg-blue-800"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingAmount(true)}
                className="text-right hover:opacity-90 cursor-pointer group"
                title="Click to edit fare"
              >
                <p className="text-base font-extrabold flex items-center justify-end gap-1">
                  <span>Pay ₹ {currentAmount.toFixed(2)}</span>
                  <Pencil className="w-3.5 h-3.5 text-blue-200 group-hover:text-white" />
                </p>
                <div className="flex items-center justify-end text-[10px] text-blue-200">
                  <span className="underline">Click to edit amount</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        {isProcessing ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 relative">
            {/* Simulated Notification Banner */}
            {showNotification && (
              <div className="absolute top-4 left-4 right-4 bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in slide-in-from-top duration-300 z-30">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold text-white">RailOne • Now</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-100 mt-0.5">
                    Your ticket has been booked successfully.
                  </p>
                  <p className="text-[10px] text-emerald-400 mt-0.5 font-mono">
                    ₹{amount.toFixed(2)} debited from R-Wallet.
                  </p>
                </div>
              </div>
            )}

            {/* Spinner */}
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Processing Payment</h3>
              <p className="text-2xl font-mono font-bold text-blue-700 mt-2">
                {formattedProcessingTime}
              </p>
              <p className="text-xs text-slate-400 mt-1">Minutes remaining</p>
            </div>

            <p className="text-xs font-medium text-slate-500 max-w-xs">
              Please do not close this window or press the back button while your transaction is being confirmed with Indian Railways.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Payment Options
            </span>

            {/* R-Wallet */}
            <div
              onClick={() => setSelectedMethod('R-Wallet')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedMethod === 'R-Wallet'
                  ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-900">R-Wallet</p>
                  <p className="text-xs font-bold text-emerald-700 mt-0.5">
                    ₹ {walletBalance.toFixed(2)} Available
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>

            {/* UPI */}
            <div
              onClick={() => setSelectedMethod('UPI')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedMethod === 'UPI'
                  ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                  UPI
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-900">UPI</p>
                  <p className="text-xs text-slate-500 font-medium">Google Pay, PhonePe, Paytm</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>

            {/* Other Payment Methods */}
            <div
              onClick={() => setSelectedMethod('Card')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedMethod === 'Card'
                  ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-900">Other Payment Methods</p>
                  <p className="text-xs text-slate-500 font-medium">Debit Card, Credit Card, Net Banking</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        {!isProcessing && (
          <div className="p-4 border-t border-slate-200 bg-white shrink-0">
            <button
              type="button"
              onClick={handlePay}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Pay Using {selectedMethod}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
