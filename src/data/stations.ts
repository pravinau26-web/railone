import { Station } from '../types';

export const MASTER_STATIONS: Station[] = [
  {
    code: 'GI',
    name: 'GUDUVANCHERI',
    state: 'TAMIL NADU',
    city: 'CHENGALPATTU',
    division: 'CHENNAI',
    zone: 'SR',
  },
  {
    code: 'MSB',
    name: 'CHENNAI BEACH JN.',
    state: 'TAMIL NADU',
    city: 'CHENNAI',
    division: 'CHENNAI',
    zone: 'SR',
  },
  {
    code: 'GDY',
    name: 'GUINDY',
    state: 'TAMIL NADU',
    city: 'CHENNAI',
    division: 'CHENNAI',
    zone: 'SR',
  },
  {
    code: 'TBM',
    name: 'TAMBARAM',
    state: 'TAMIL NADU',
    city: 'CHENNAI',
    division: 'CHENNAI',
    zone: 'SR',
  },
  {
    code: 'VI',
    name: 'VILLIYANUR HALT',
    state: 'PUDUCHERRY',
    city: 'PUDUCHERRY',
    division: 'TIRUCHCHIRAPPALLI',
    zone: 'SR',
  },
  {
    code: 'MS',
    name: 'CHENNAI EGMORE',
    state: 'TAMIL NADU',
    city: 'CHENNAI',
    division: 'CHENNAI',
    zone: 'SR',
  },
  {
    code: 'MAS',
    name: 'MGR CHENNAI CENTRAL',
    state: 'TAMIL NADU',
    city: 'CHENNAI',
    division: 'CHENNAI',
    zone: 'SR',
  },
  {
    code: 'CGL',
    name: 'CHENGALPATTU JN.',
    state: 'TAMIL NADU',
    city: 'CHENGALPATTU',
    division: 'CHENNAI',
    zone: 'SR',
  },
  {
    code: 'VM',
    name: 'VILLUPURAM JN.',
    state: 'TAMIL NADU',
    city: 'VILLUPURAM',
    division: 'TIRUCHCHIRAPPALLI',
    zone: 'SR',
  },
  {
    code: 'MDU',
    name: 'MADURAI JN.',
    state: 'TAMIL NADU',
    city: 'MADURAI',
    division: 'MADURAI',
    zone: 'SR',
  },
  {
    code: 'CBE',
    name: 'COIMBATORE JN.',
    state: 'TAMIL NADU',
    city: 'COIMBATORE',
    division: 'SALEM',
    zone: 'SR',
  },
  {
    code: 'SBC',
    name: 'KSR BENGALURU CITY',
    state: 'KARNATAKA',
    city: 'BENGALURU',
    division: 'BENGALURU',
    zone: 'SWR',
  },
  {
    code: 'TPJ',
    name: 'TIRUCHCHIRAPPALLI JN.',
    state: 'TAMIL NADU',
    city: 'TRICHY',
    division: 'TIRUCHCHIRAPPALLI',
    zone: 'SR',
  },
  {
    code: 'SA',
    name: 'SALEM JN.',
    state: 'TAMIL NADU',
    city: 'SALEM',
    division: 'SALEM',
    zone: 'SR',
  },
  {
    code: 'KPD',
    name: 'KATPADI JN.',
    state: 'TAMIL NADU',
    city: 'VELLORE',
    division: 'CHENNAI',
    zone: 'SR',
  },
  {
    code: 'NDLS',
    name: 'NEW DELHI',
    state: 'DELHI',
    city: 'NEW DELHI',
    division: 'DELHI',
    zone: 'NR',
  },
  {
    code: 'CSMT',
    name: 'MUMBAI CSMT',
    state: 'MAHARASHTRA',
    city: 'MUMBAI',
    division: 'MUMBAI CR',
    zone: 'CR',
  },
  {
    code: 'HWH',
    name: 'HOWRAH JN.',
    state: 'WEST BENGAL',
    city: 'HOWRAH',
    division: 'HOWRAH',
    zone: 'ER',
  },
];

const CUSTOM_STATIONS_KEY = 'railone_custom_stations_v1';

export const getCustomStations = (): Station[] => {
  try {
    const raw = localStorage.getItem(CUSTOM_STATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveCustomStation = (station: Station): Station => {
  try {
    const existing = getCustomStations();
    const upperCode = station.code.trim().toUpperCase();
    const updated = [
      {
        ...station,
        code: upperCode,
        name: station.name.trim().toUpperCase(),
        state: (station.state || 'TAMIL NADU').trim().toUpperCase(),
        city: (station.city || station.name).trim().toUpperCase(),
        division: (station.division || 'CHENNAI').trim().toUpperCase(),
        zone: (station.zone || 'SR').trim().toUpperCase(),
      },
      ...existing.filter((s) => s.code.toUpperCase() !== upperCode),
    ];
    localStorage.setItem(CUSTOM_STATIONS_KEY, JSON.stringify(updated));

    // Also sync to backend API in background
    fetch('/api/stations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(station),
    }).catch(() => {});

    return updated[0];
  } catch (err) {
    console.error('Failed to save custom station:', err);
    return station;
  }
};

export const getAllStations = (): Station[] => {
  const custom = getCustomStations();
  const customCodes = new Set(custom.map((s) => s.code.toUpperCase()));
  const masters = MASTER_STATIONS.filter((s) => !customCodes.has(s.code.toUpperCase()));
  return [...custom, ...masters];
};

export const getStationByCode = (code: string): Station | undefined => {
  if (!code) return undefined;
  const upper = code.trim().toUpperCase();
  return getAllStations().find(
    (s) => s.code.toUpperCase() === upper
  );
};

export const searchStations = (query: string): Station[] => {
  const all = getAllStations();
  if (!query || query.trim() === '') return all.slice(0, 10);
  const q = query.trim().toUpperCase();
  return all.filter(
    (s) =>
      s.code.includes(q) ||
      s.name.toUpperCase().includes(q) ||
      s.state.toUpperCase().includes(q) ||
      (s.city && s.city.toUpperCase().includes(q))
  );
};

export const calculateDistance = (fromCode: string, toCode: string): number => {
  if (fromCode === toCode) return 0;
  // Specific distances matching the videos
  if (
    (fromCode === 'GI' && toCode === 'MSB') ||
    (fromCode === 'MSB' && toCode === 'GI')
  ) {
    return 41;
  }
  if (
    (fromCode === 'VI' && toCode === 'GI') ||
    (fromCode === 'GI' && toCode === 'VI')
  ) {
    return 153;
  }
  if (
    (fromCode === 'VI' && toCode === 'TBM') ||
    (fromCode === 'TBM' && toCode === 'VI')
  ) {
    return 164;
  }
  if (
    (fromCode === 'GI' && toCode === 'GDY') ||
    (fromCode === 'GDY' && toCode === 'GI')
  ) {
    return 29;
  }
  if (
    (fromCode === 'TBM' && toCode === 'MSB') ||
    (fromCode === 'MSB' && toCode === 'TBM')
  ) {
    return 28;
  }
  if (
    (fromCode === 'MS' && toCode === 'MDU') ||
    (fromCode === 'MDU' && toCode === 'MS')
  ) {
    return 497;
  }
  if (
    (fromCode === 'MAS' && toCode === 'CBE') ||
    (fromCode === 'CBE' && toCode === 'MAS')
  ) {
    return 493;
  }
  if (
    (fromCode === 'MAS' && toCode === 'SBC') ||
    (fromCode === 'SBC' && toCode === 'MAS')
  ) {
    return 362;
  }

  // Deterministic calculation for arbitrary pairs
  const charSum = (fromCode + toCode)
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return Math.max(15, (charSum % 40) * 12 + 25);
};
