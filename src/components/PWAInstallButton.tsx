import React, { useState } from 'react';
import { Smartphone, X, Share, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { getAssetUrl } from '../utils/assets';

export const PWAInstallButton: React.FC<{ variant?: 'header' | 'banner' | 'card' }> = ({
  variant = 'header',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissedBanner, setDismissedBanner] = useState(false);

  // If already running as installed standalone app, hide the prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Fallback for browsers without direct prompt event
      alert('To install RailOne App:\n\n1. Tap the three dots menu (⋮) in your browser.\n2. Tap "Install App" or "Add to Home screen".');
    }
  };

  // Header button variant
  if (variant === 'header') {
    return (
      <>
        <button
          type="button"
          onClick={handleInstallClick}
          className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-full text-[11px] font-extrabold flex items-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer animate-pulse"
          title="Install RailOne as Mobile App"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>

        {/* iOS Guide Modal */}
        {showIOSGuide && (
          <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl relative text-left">
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm shrink-0 bg-[#0c6aff]">
                  <img
                    src={getAssetUrl('assets/aistudio/railonelogo_72328bf0.jpg')}
                    alt="RailOne App Icon"
                    className="w-full h-full object-cover scale-105"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Install RailOne App</h3>
                  <p className="text-[11px] text-slate-500">iPhone & iPad Safari Guide</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <p>
                    Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline mx-0.5 text-blue-600" /> at the bottom of your Safari screen.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <p>
                    Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-blue-600" />.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                  <p>
                    Tap <strong>"Add"</strong> in the top right corner. RailOne will appear as an app icon!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Mobile Banner Variant
  if (variant === 'banner' && !dismissedBanner) {
    return (
      <div className="bg-gradient-to-r from-[#0a5be0] via-[#0c6aff] to-[#1245b8] text-white px-3.5 py-2.5 rounded-2xl shadow-md border border-blue-400/30 flex items-center justify-between gap-3 animate-in fade-in">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm ring-1 ring-white/30 shrink-0 bg-[#0c6aff]">
            <img
              src={getAssetUrl('assets/aistudio/railonelogo_72328bf0.jpg')}
              alt="RailOne App Icon"
              className="w-full h-full object-cover scale-105"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold leading-tight truncate">Install RailOne App</p>
            <p className="text-[10px] text-blue-100 truncate">Book tickets offline & faster on mobile</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl text-xs font-extrabold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            Install
          </button>
          <button
            type="button"
            onClick={() => setDismissedBanner(true)}
            className="p-1 text-blue-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};
