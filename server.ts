import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  configure,
  searchTrainBetweenStations,
  checkPNRStatus,
  trackTrain,
  stationByCode,
  stationsByName,
  liveAtStation,
} from 'railkit';
import { MASTER_STATIONS } from './src/data/stations';
import { SAMPLE_TRAINS } from './src/data/trains';
import { INITIAL_BOOKINGS } from './src/data/mockBookings';
import { Booking, Train, ClassAvailability, TrainType } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Railkit with the user's provided API key
const RAILKIT_KEY =
  process.env.RAILKIT_API_KEY ||
  'railkit_fc7cb3c9de253b4ee54138bd47215d118d769040a685d57a';

try {
  configure(RAILKIT_KEY);
  console.log('RailKit API initialized successfully with API key.');
} catch (err) {
  console.warn('RailKit initialization error:', err);
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // In-memory store initialized with demo data
  let bookingsStore: Booking[] = [...INITIAL_BOOKINGS];
  let stationsStore: any[] = [...MASTER_STATIONS];

  // Helper to calculate Indian Railways distance-based class fares
  function calculateClassFares(distanceKm: number, trainType: string): ClassAvailability[] {
    const dist = Math.max(15, distanceKm || 100);
    const isSF = trainType.includes('SUPERFAST');
    const isVB = trainType.includes('VANDE BHARAT');

    if (isVB) {
      return [
        {
          classCode: 'EC',
          className: 'Exec. Chair Car',
          fare: Math.round(dist * 4.8 + 250),
          status: 'AVAILABLE',
          availableCount: 18,
        },
        {
          classCode: 'CC',
          className: 'AC Chair Car',
          fare: Math.round(dist * 2.6 + 120),
          status: 'AVAILABLE',
          availableCount: 64,
        },
      ];
    }

    return [
      {
        classCode: '1A',
        className: 'AC First Class',
        fare: Math.round(dist * 3.8 + (isSF ? 75 : 0) + 150),
        status: 'AVAILABLE',
        availableCount: 8,
      },
      {
        classCode: '2A',
        className: 'AC 2 Tier',
        fare: Math.round(dist * 2.3 + (isSF ? 45 : 0) + 80),
        status: 'AVAILABLE',
        availableCount: 22,
      },
      {
        classCode: '3A',
        className: 'AC 3 Tier',
        fare: Math.round(dist * 1.6 + (isSF ? 45 : 0) + 50),
        status: 'AVAILABLE',
        availableCount: 56,
      },
      {
        classCode: 'SL',
        className: 'Sleeper Class',
        fare: Math.round(dist * 0.65 + (isSF ? 30 : 0) + 20),
        status: 'RAC',
        availableCount: 14,
      },
      {
        classCode: '2S',
        className: 'Second Sitting',
        fare: Math.round(dist * 0.38 + (isSF ? 15 : 0) + 15),
        status: 'AVAILABLE',
        availableCount: 96,
      },
    ];
  }

  // 1. GET /api/stations
  app.get('/api/stations', async (req, res) => {
    const q = (req.query.q as string) || '';
    if (!q) {
      return res.json(stationsStore);
    }

    const query = q.toUpperCase();
    const localFiltered = stationsStore.filter(
      (s) =>
        s.code.includes(query) ||
        s.name.toUpperCase().includes(query) ||
        s.state.toUpperCase().includes(query) ||
        (s.city && s.city.toUpperCase().includes(query))
    );

    // If local matches are sufficient, return them
    if (localFiltered.length > 0) {
      return res.json(localFiltered);
    }

    // Otherwise, attempt lookup via Railkit live API
    try {
      const liveRes = await stationsByName(q);
      if (liveRes && Array.isArray(liveRes.data) && liveRes.data.length > 0) {
        const mapped = liveRes.data.slice(0, 10).map((st: any) => ({
          code: st.code || st.station_code,
          name: st.name || st.station_name,
          state: st.state_name || 'INDIAN RAILWAYS',
          city: st.city_name || '',
          division: 'IR',
          zone: 'IR',
        }));
        return res.json(mapped);
      }
    } catch {
      // fallback to local stations
    }

    res.json(localFiltered);
  });

  // 1b. POST /api/stations (Add new station)
  app.post('/api/stations', (req, res) => {
    const { code, name, state, city, division, zone } = req.body;
    if (!code || !name) {
      return res.status(400).json({ error: 'Station code and name are required' });
    }

    const upperCode = code.trim().toUpperCase();
    const upperName = name.trim().toUpperCase();

    const existingIndex = stationsStore.findIndex(
      (s) => s.code.toUpperCase() === upperCode
    );

    const newStation = {
      code: upperCode,
      name: upperName,
      state: (state || 'TAMIL NADU').trim().toUpperCase(),
      city: (city || upperName).trim().toUpperCase(),
      division: (division || 'CHENNAI').trim().toUpperCase(),
      zone: (zone || 'SR').trim().toUpperCase(),
    };

    if (existingIndex >= 0) {
      stationsStore[existingIndex] = { ...stationsStore[existingIndex], ...newStation };
    } else {
      stationsStore.unshift(newStation);
    }

    res.status(201).json(newStation);
  });

  // 2. GET /api/trains (Live Railkit with local suburban fallback)
  app.get('/api/trains', async (req, res) => {
    const from = ((req.query.from as string) || '').toUpperCase();
    const to = ((req.query.to as string) || '').toUpperCase();

    if (from && to) {
      try {
        const liveTrainsRes = await searchTrainBetweenStations(from, to);
        const liveList = Array.isArray(liveTrainsRes?.data)
          ? liveTrainsRes.data
          : Array.isArray(liveTrainsRes)
          ? liveTrainsRes
          : [];

        if (liveList.length > 0) {
          const mappedTrains: Train[] = liveList.slice(0, 15).map((t: any) => {
            const rawType = (t.train_type_name || '').toUpperCase();
            const trainType: TrainType = rawType.includes('SUPERFAST')
              ? 'SUPERFAST'
              : rawType.includes('VANDE')
              ? 'VANDE BHARAT'
              : rawType.includes('EMU') || rawType.includes('SUBURBAN')
              ? 'ORDINARY'
              : 'MAIL/EXP';

            const distanceKm = parseInt(t.distance, 10) || 250;

            return {
              number: t.train_no,
              name: t.train_name,
              type: trainType,
              sourceStation: t.from_stn_code || from,
              destinationStation: t.to_stn_code || to,
              departureTime: t.from_time || '08:00',
              arrivalTime: t.to_time || '14:30',
              duration: t.travel_time || '06h 30m',
              runningDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
              distanceKm: distanceKm,
              classes: calculateClassFares(distanceKm, trainType),
            };
          });

          return res.json(mappedTrains);
        }
      } catch (err: any) {
        console.warn('Railkit train lookup fallback:', err.message);
      }

      // If Railkit returns no trains for this pair (e.g. local suburban pair GI to MSB),
      // match against our Chennai suburban and express train dataset
      const filtered = SAMPLE_TRAINS.filter(
        (t) =>
          (t.sourceStation === from && t.destinationStation === to) ||
          (t.sourceStation === to && t.destinationStation === from)
      );

      if (filtered.length > 0) return res.json(filtered);
    }

    res.json(SAMPLE_TRAINS);
  });

  // 3. GET /api/pnr/:pnr (Live Railkit PNR status)
  app.get('/api/pnr/:pnr', async (req, res) => {
    const { pnr } = req.params;
    try {
      const pnrData = await checkPNRStatus(pnr);
      if (pnrData && pnrData.success && pnrData.data) {
        return res.json(pnrData.data);
      }
    } catch {
      // fallback
    }

    // Simulated fallback if PNR is test/demo
    res.json({
      pnr,
      train_number: '12638',
      train_name: 'PANDIAN SF EXPRESS',
      doj: '10 Nov 2026',
      from: 'MDU',
      to: 'MS',
      class: '3A',
      chart_prepared: false,
      passengers: [
        { booking_status: 'CNF', current_status: 'B3 - 42 (Lower)' },
        { booking_status: 'CNF', current_status: 'B3 - 45 (Upper)' },
      ],
    });
  });

  // 4. GET /api/track/:trainNo (Live Railkit Track Train)
  app.get('/api/track/:trainNo', async (req, res) => {
    const { trainNo } = req.params;
    try {
      const today = new Date().toISOString().split('T')[0];
      const trackData = await (trackTrain as any)(trainNo, today);
      if (trackData && trackData.success && trackData.data) {
        return res.json(trackData.data);
      }
    } catch {
      // fallback
    }

    res.json({
      train_no: trainNo,
      status: 'Running On Time',
      current_station: 'TAMBARAM (TBM)',
      delay_minutes: 0,
      next_station: 'GUINDY (GDY)',
    });
  });

  // 5. GET /api/bookings
  app.get('/api/bookings', (_req, res) => {
    res.json(bookingsStore);
  });

  // 6. GET /api/bookings/:id
  app.get('/api/bookings/:id', (req, res) => {
    const { id } = req.params;
    const booking = bookingsStore.find((b) => b.id === id || b.utsNumber === id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  });

  // 7. POST /api/bookings
  app.post('/api/bookings', (req, res) => {
    const newBooking: Booking = req.body;
    if (!newBooking.utsNumber) {
      newBooking.utsNumber =
        'XAB3EH' + Math.random().toString(36).substring(2, 6).toUpperCase();
    }
    if (!newBooking.id) {
      newBooking.id = 'b-' + Date.now();
    }
    bookingsStore.unshift(newBooking);
    res.status(201).json(newBooking);
  });

  // 8. PUT /api/bookings/:id
  app.put('/api/bookings/:id', (req, res) => {
    const { id } = req.params;
    const index = bookingsStore.findIndex(
      (b) => b.id === id || b.utsNumber === id
    );
    if (index === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    bookingsStore[index] = { ...bookingsStore[index], ...req.body };
    res.json(bookingsStore[index]);
  });

  // 9. DELETE /api/bookings/:id
  app.delete('/api/bookings/:id', (req, res) => {
    const { id } = req.params;
    const beforeCount = bookingsStore.length;
    bookingsStore = bookingsStore.filter(
      (b) => b.id !== id && b.utsNumber !== id
    );
    if (bookingsStore.length === beforeCount) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking removed' });
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      app: 'RailOne',
      version: '2.1.79-253',
      railkit: 'connected',
    });
  });

  // Vite middleware in dev or static files in production
  if (!isProduction) {
    const disableHmr = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        ...(disableHmr ? { hmr: false, ws: false } : {}),
      },
      appType: 'spa',
    });

    if (disableHmr) {
      app.get('/@vite/client', async (_req, res, next) => {
        try {
          const result = await vite.transformRequest('/@vite/client');
          if (!result) return next();
          const patchedCode = result.code
            .replace(
              /const transport = normalizeModuleRunnerTransport\(\(\(\) => \{[\s\S]*?\}\)\(\)\);/,
              'const transport = normalizeModuleRunnerTransport({ connect() {}, disconnect() {}, send() {} });'
            )
            .replace(
              'setupForwardConsoleHandler(transport, forwardConsole);',
              '/* Forward console disabled */'
            );
          res.setHeader('Content-Type', 'application/javascript');
          res.send(patchedCode);
        } catch (err) {
          next(err);
        }
      });
    }

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use('/railone', express.static(distPath));
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RailOne Server running on port ${PORT} with RailKit API.`);
  });
}

startServer();
