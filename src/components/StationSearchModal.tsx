import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Mic, ArrowUpRight, History, X, Plus, Check, MapPin, Building, Sparkles } from 'lucide-react';
import { Station } from '../types';
import { searchStations, saveCustomStation, getCustomStations } from '../data/stations';

interface StationSearchModalProps {
  isOpen: boolean;
  mode: 'source' | 'destination';
  currentSelected?: Station;
  disabledStationCode?: string;
  onSelectStation: (station: Station) => void;
  onClose: () => void;
}

export const StationSearchModal: React.FC<StationSearchModalProps> = ({
  isOpen,
  mode,
  currentSelected,
  disabledStationCode,
  onSelectStation,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'search' | 'add'>('search');
  const [refreshKey, setRefreshKey] = useState(0);

  // Add station form states
  const [newStationName, setNewStationName] = useState('');
  const [newStationCode, setNewStationCode] = useState('');
  const [newStationCity, setNewStationCity] = useState('');
  const [newStationState, setNewStationState] = useState('TAMIL NADU');
  const [newStationDivision, setNewStationDivision] = useState('CHENNAI');
  const [newStationZone, setNewStationZone] = useState('SR');
  const [formError, setFormError] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setViewMode('search');
      setAddSuccess(false);
      setFormError('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // When switching to add mode, focus name input
  useEffect(() => {
    if (viewMode === 'add') {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [viewMode]);

  // Auto-generate a station code when name is typed if code is not manually customized
  const handleNameChange = (val: string) => {
    setNewStationName(val);
    setFormError('');

    // Generate 3-4 letter code suggestion from words
    const words = val.trim().split(/\s+/).filter(Boolean);
    if (words.length === 1 && words[0].length >= 2) {
      const suggested = words[0].substring(0, 4).toUpperCase();
      setNewStationCode(suggested);
    } else if (words.length > 1) {
      const suggested = words.map((w) => w[0]).join('').substring(0, 4).toUpperCase();
      setNewStationCode(suggested);
    }
  };

  const filteredStations = useMemo(() => {
    // refreshKey triggers re-filtering when new station is saved
    return searchStations(query);
  }, [query, refreshKey]);

  const customStationCodes = useMemo(() => {
    const customList = getCustomStations();
    return new Set(customList.map((s) => s.code.toUpperCase()));
  }, [refreshKey]);

  if (!isOpen) return null;

  const handleSelect = (station: Station) => {
    if (station.code === disabledStationCode) {
      alert(`Source and Destination stations cannot be the same (${station.name}). Please select another station.`);
      return;
    }
    onSelectStation(station);
    onClose();
  };

  const handleSaveNewStation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = newStationName.trim().toUpperCase();
    const cleanCode = newStationCode.trim().toUpperCase();

    if (!cleanName) {
      setFormError('Please enter a station name.');
      return;
    }
    if (!cleanCode) {
      setFormError('Please enter a station code (2-5 letters).');
      return;
    }
    if (cleanCode === disabledStationCode) {
      setFormError(`Station code cannot match the opposite station (${disabledStationCode}).`);
      return;
    }

    const createdStation: Station = {
      name: cleanName,
      code: cleanCode,
      city: (newStationCity.trim() || cleanName).toUpperCase(),
      state: (newStationState.trim() || 'TAMIL NADU').toUpperCase(),
      division: (newStationDivision.trim() || 'CHENNAI').toUpperCase(),
      zone: (newStationZone.trim() || 'SR').toUpperCase(),
    };

    saveCustomStation(createdStation);
    setRefreshKey((prev) => prev + 1);
    setAddSuccess(true);

    // Auto select the newly added station and return
    setTimeout(() => {
      onSelectStation(createdStation);
      onClose();
    }, 450);
  };

  const openAddWithCurrentQuery = () => {
    setNewStationName(query.trim().toUpperCase());
    handleNameChange(query.trim().toUpperCase());
    setNewStationCity('CHENNAI');
    setNewStationState('TAMIL NADU');
    setNewStationDivision('CHENNAI');
    setNewStationZone('SR');
    setFormError('');
    setViewMode('add');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl h-[92vh] sm:h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Top Header */}
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={viewMode === 'add' ? () => setViewMode('search') : onClose}
              className="p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-blue-700" />
            </button>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {viewMode === 'add' ? 'Add New Station' : 'Search Station'}
              </h2>
              <p className="text-[10.5px] font-medium text-slate-500">
                {mode === 'source' ? 'Select Source Station' : 'Select Destination Station'}
              </p>
            </div>
          </div>

          {/* Action button in header */}
          {viewMode === 'search' ? (
            <button
              type="button"
              onClick={() => {
                setNewStationName('');
                setNewStationCode('');
                setNewStationCity('');
                setFormError('');
                setViewMode('add');
              }}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-full text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Station</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setViewMode('search')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2 py-1"
            >
              Cancel
            </button>
          )}
        </div>

        {/* VIEW 1: SEARCH & SELECT STATIONS */}
        {viewMode === 'search' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search input container */}
            <div className="px-4 pt-3 pb-2 shrink-0">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search station name or code (e.g. MAS, TBM, GI)"
                  className="w-full bg-slate-50 border border-slate-200 hover:border-blue-400 focus:border-blue-600 rounded-xl pl-10 pr-16 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-inner"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-9 p-1 text-slate-400 hover:text-slate-600"
                    title="Clear"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : null}
                <button
                  type="button"
                  className="absolute right-3 p-1.5 text-slate-400 hover:text-blue-600 rounded-full"
                  title="Voice Search Demo"
                  onClick={() => {
                    const sample = mode === 'source' ? 'GUDUVANCHERI' : 'CHENNAI BEACH JN.';
                    setQuery(sample);
                  }}
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Add Banner when searching */}
            <div className="px-4 py-1.5 shrink-0">
              <div className="flex items-center justify-between bg-blue-50/70 border border-blue-100 rounded-xl px-3 py-2 text-xs">
                <span className="text-blue-900 font-medium truncate pr-2">
                  {query.trim()
                    ? `Can't find "${query.trim()}"?`
                    : 'Want to add a custom station?'}
                </span>
                <button
                  type="button"
                  onClick={openAddWithCurrentQuery}
                  className="shrink-0 text-blue-700 hover:text-blue-800 font-bold bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Now</span>
                </button>
              </div>
            </div>

            {/* Section title */}
            <div className="px-4 py-2 flex items-center justify-between text-xs font-semibold text-blue-800 bg-blue-50/40 shrink-0">
              <div className="flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                <span>{query ? 'Search Results' : 'Railway Stations (Tap to Select)'}</span>
              </div>
              <span className="text-[11px] text-slate-500 font-normal">
                {filteredStations.length} stations
              </span>
            </div>

            {/* Station list */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 px-2 py-1">
              {filteredStations.length === 0 ? (
                <div className="p-8 text-center text-slate-500 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">No stations found for "{query}"</p>
                    <p className="text-xs mt-1 text-slate-400">
                      You can add this station to the RailOne station database right now!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openAddWithCurrentQuery}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add "{query || 'New Station'}" to RailOne</span>
                  </button>
                </div>
              ) : (
                filteredStations.map((station) => {
                  const isDisabled = station.code === disabledStationCode;
                  const isSelected = currentSelected?.code === station.code;
                  const isCustom = customStationCodes.has(station.code.toUpperCase());

                  return (
                    <button
                      key={station.code}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => handleSelect(station)}
                      className={`w-full text-left px-3.5 py-3 flex items-center justify-between hover:bg-blue-50/70 transition-colors rounded-xl my-0.5 cursor-pointer ${
                        isDisabled ? 'opacity-40 cursor-not-allowed bg-slate-50' : ''
                      } ${isSelected ? 'bg-blue-50/90 border border-blue-200' : ''}`}
                    >
                      <div className="flex-1 pr-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-slate-900 tracking-tight">
                            {station.name} - {station.code}
                          </span>
                          {isCustom && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5" />
                              Custom
                            </span>
                          )}
                          {isSelected && (
                            <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                          {station.city ? `${station.city}, ` : ''}{station.state}
                          {station.division ? ` • ${station.division} Div` : ''}
                        </p>
                      </div>
                      <div className="text-slate-400 hover:text-blue-700 shrink-0">
                        <ArrowUpRight className="w-4 h-4 stroke-[2.2]" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: ADD NEW STATION FORM */}
        {viewMode === 'add' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 flex items-start gap-3">
              <div className="p-2 bg-blue-600 text-white rounded-xl shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-blue-900">Add Custom Station to Database</h3>
                <p className="text-[11px] text-blue-700 mt-0.5 leading-relaxed">
                  Enter station details below. Once added, it will be immediately available across From/To search, Journey Planners, and Tickets.
                </p>
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl animate-in fade-in">
                {formError}
              </div>
            )}

            {addSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Station added successfully! Selecting station...</span>
              </div>
            )}

            <form onSubmit={handleSaveNewStation} className="space-y-3.5">
              {/* Station Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                  Station Name *
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  value={newStationName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. KODAMBAKKAM, AVADI, AMBUR"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 outline-none uppercase placeholder:normal-case placeholder:font-normal placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Station Code */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                  Station Code (2 - 5 Letters) *
                </label>
                <input
                  type="text"
                  value={newStationCode}
                  maxLength={5}
                  onChange={(e) => {
                    setNewStationCode(e.target.value.toUpperCase());
                    setFormError('');
                  }}
                  placeholder="e.g. MKK, AVD, AB"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-sm font-bold font-mono text-slate-900 outline-none uppercase placeholder:normal-case placeholder:font-normal placeholder:text-slate-400"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Unique railway station code (e.g., MAS, TBM, MSB)
                </p>
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                    City / District
                  </label>
                  <input
                    type="text"
                    value={newStationCity}
                    onChange={(e) => setNewStationCity(e.target.value)}
                    placeholder="e.g. CHENNAI"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none uppercase placeholder:normal-case placeholder:font-normal placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                    State
                  </label>
                  <select
                    value={newStationState}
                    onChange={(e) => setNewStationState(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none"
                  >
                    <option value="TAMIL NADU">TAMIL NADU</option>
                    <option value="PUDUCHERRY">PUDUCHERRY</option>
                    <option value="KARNATAKA">KARNATAKA</option>
                    <option value="KERALA">KERALA</option>
                    <option value="ANDHRA PRADESH">ANDHRA PRADESH</option>
                    <option value="TELANGANA">TELANGANA</option>
                    <option value="MAHARASHTRA">MAHARASHTRA</option>
                    <option value="DELHI">DELHI</option>
                    <option value="WEST BENGAL">WEST BENGAL</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>
              </div>

              {/* Division & Zone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                    Railway Division
                  </label>
                  <input
                    type="text"
                    value={newStationDivision}
                    onChange={(e) => setNewStationDivision(e.target.value)}
                    placeholder="e.g. CHENNAI"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                    Railway Zone
                  </label>
                  <input
                    type="text"
                    value={newStationZone}
                    onChange={(e) => setNewStationZone(e.target.value)}
                    placeholder="e.g. SR"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none uppercase"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setViewMode('search')}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addSuccess}
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>Save & Select Station</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
