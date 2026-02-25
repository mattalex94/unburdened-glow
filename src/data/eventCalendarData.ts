export type EventCategory = "Conference" | "Exhibition" | "Concert" | "Sports" | "Cultural";

export const CATEGORY_COLORS: Record<EventCategory, string> = {
  Conference: "hsl(210, 70%, 55%)",
  Exhibition: "hsl(160, 55%, 45%)",
  Concert: "hsl(340, 65%, 55%)",
  Sports: "hsl(35, 80%, 55%)",
  Cultural: "hsl(270, 50%, 55%)",
};

export interface CalendarEvent {
  id: string;
  name: string;
  category: EventCategory;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  venue: string;
  area: string;
  isFree: boolean;
}

export const sampleEvents: CalendarEvent[] = [
  // Jan: several overlapping clusters
  { id: "e1", name: "Gulf Industry Fair", category: "Exhibition", startDate: "2026-01-05", endDate: "2026-01-10", venue: "BIECC Hall A", area: "Manama", isFree: false },
  { id: "e2", name: "Bahrain FinTech Summit", category: "Conference", startDate: "2026-01-07", endDate: "2026-01-11", venue: "Four Seasons", area: "Bahrain Bay", isFree: false },
  { id: "e3", name: "Winter Jazz Series", category: "Concert", startDate: "2026-01-09", endDate: "2026-01-12", venue: "La Fontaine", area: "Manama", isFree: true },
  { id: "e4", name: "GCC Athletics Championship", category: "Sports", startDate: "2026-01-16", endDate: "2026-01-20", venue: "National Stadium", area: "Riffa", isFree: true },
  { id: "e5", name: "Pearl Heritage Week", category: "Cultural", startDate: "2026-01-18", endDate: "2026-01-24", venue: "Muharraq", area: "Muharraq", isFree: true },
  { id: "e6", name: "Desert Rock Festival", category: "Concert", startDate: "2026-01-22", endDate: "2026-01-25", venue: "Bahrain Bay", area: "Bahrain Bay", isFree: false },
  // Feb: dense overlapping period
  { id: "e7", name: "Arab Health Expo", category: "Exhibition", startDate: "2026-02-01", endDate: "2026-02-06", venue: "BIECC Hall B", area: "Manama", isFree: false },
  { id: "e8", name: "StartUp Bahrain Forum", category: "Conference", startDate: "2026-02-03", endDate: "2026-02-07", venue: "Ritz-Carlton", area: "Seef", isFree: false },
  { id: "e9", name: "Bahrain Grand Prix Weekend", category: "Sports", startDate: "2026-02-05", endDate: "2026-02-08", venue: "BIC Circuit", area: "Riffa", isFree: false },
  { id: "e10", name: "Spring of Culture", category: "Cultural", startDate: "2026-02-14", endDate: "2026-02-22", venue: "National Theatre", area: "Manama", isFree: true },
  { id: "e11", name: "Jazz Night Series", category: "Concert", startDate: "2026-02-18", endDate: "2026-02-21", venue: "La Fontaine", area: "Manama", isFree: true },
  { id: "e12", name: "Tech Innovation Expo", category: "Exhibition", startDate: "2026-02-20", endDate: "2026-02-24", venue: "BIECC Hall A", area: "Manama", isFree: false },
  // Mar: triple overlap
  { id: "e13", name: "Oil & Gas Conference", category: "Conference", startDate: "2026-03-02", endDate: "2026-03-06", venue: "Gulf Hotel", area: "Seef", isFree: false },
  { id: "e14", name: "Food & Hospitality Expo", category: "Exhibition", startDate: "2026-03-04", endDate: "2026-03-09", venue: "BIECC Hall A", area: "Manama", isFree: true },
  { id: "e15", name: "International Marathon", category: "Sports", startDate: "2026-03-05", endDate: "2026-03-07", venue: "Manama Corniche", area: "Manama", isFree: true },
  { id: "e16", name: "Electronica Festival", category: "Concert", startDate: "2026-03-15", endDate: "2026-03-18", venue: "Bahrain Bay", area: "Bahrain Bay", isFree: false },
  { id: "e17", name: "Bahrain Art Week", category: "Cultural", startDate: "2026-03-16", endDate: "2026-03-22", venue: "National Museum", area: "Muharraq", isFree: true },
  { id: "e18", name: "Startup Pitch Night", category: "Conference", startDate: "2026-03-17", endDate: "2026-03-19", venue: "Ritz-Carlton", area: "Seef", isFree: false },
];

export type KpiMetric = "occupancy" | "adr" | "revpar" | "fnb_covers";

export const KPI_LABELS: Record<KpiMetric, string> = {
  occupancy: "Occupancy %",
  adr: "ADR (BHD)",
  revpar: "RevPAR (BHD)",
  fnb_covers: "F&B Covers",
};

// Generate daily KPI data for Jan-Mar 2026
function generateDailyKpi() {
  const data: Record<string, { occupancy: number; adr: number; revpar: number; fnb_covers: number }> = {};
  const start = new Date(2026, 0, 1);
  const end = new Date(2026, 2, 31);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().split("T")[0];
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
    const base = isWeekend ? 78 : 62;
    const variance = () => Math.round((Math.random() - 0.5) * 16);

    const occupancy = Math.min(98, Math.max(40, base + variance()));
    const adr = Math.round(45 + occupancy * 0.6 + variance() * 0.5);
    const revpar = Math.round(adr * (occupancy / 100));
    const fnb_covers = Math.round(200 + occupancy * 4 + variance() * 10);

    data[key] = { occupancy, adr, revpar, fnb_covers };
  }

  // Boost KPIs during events
  sampleEvents.forEach((evt) => {
    const s = new Date(evt.startDate);
    const e = new Date(evt.endDate);
    for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split("T")[0];
      if (data[key]) {
        data[key].occupancy = Math.min(98, data[key].occupancy + 12);
        data[key].adr = Math.round(data[key].adr * 1.15);
        data[key].revpar = Math.round(data[key].adr * (data[key].occupancy / 100));
        data[key].fnb_covers = Math.round(data[key].fnb_covers * 1.2);
      }
    }
  });

  return data;
}

export const dailyKpiData = generateDailyKpi();
