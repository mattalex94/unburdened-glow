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
}

export const sampleEvents: CalendarEvent[] = [
  { id: "e1", name: "Gulf Industry Fair", category: "Exhibition", startDate: "2026-01-05", endDate: "2026-01-08", venue: "BIECC Hall A" },
  { id: "e2", name: "Bahrain FinTech Summit", category: "Conference", startDate: "2026-01-12", endDate: "2026-01-13", venue: "Four Seasons" },
  { id: "e3", name: "Desert Rock Festival", category: "Concert", startDate: "2026-01-17", endDate: "2026-01-18", venue: "Bahrain Bay" },
  { id: "e4", name: "GCC Athletics Championship", category: "Sports", startDate: "2026-01-22", endDate: "2026-01-25", venue: "National Stadium" },
  { id: "e5", name: "Pearl Heritage Week", category: "Cultural", startDate: "2026-01-28", endDate: "2026-02-01", venue: "Muharraq" },
  { id: "e6", name: "Arab Health Expo", category: "Exhibition", startDate: "2026-02-03", endDate: "2026-02-06", venue: "BIECC Hall B" },
  { id: "e7", name: "StartUp Bahrain Forum", category: "Conference", startDate: "2026-02-09", endDate: "2026-02-10", venue: "Ritz-Carlton" },
  { id: "e8", name: "Bahrain Grand Prix Weekend", category: "Sports", startDate: "2026-02-13", endDate: "2026-02-15", venue: "BIC Circuit" },
  { id: "e9", name: "Spring of Culture", category: "Cultural", startDate: "2026-02-18", endDate: "2026-02-22", venue: "National Theatre" },
  { id: "e10", name: "Jazz Night Series", category: "Concert", startDate: "2026-02-25", endDate: "2026-02-26", venue: "La Fontaine" },
  { id: "e11", name: "Oil & Gas Conference", category: "Conference", startDate: "2026-03-02", endDate: "2026-03-04", venue: "Gulf Hotel" },
  { id: "e12", name: "Food & Hospitality Expo", category: "Exhibition", startDate: "2026-03-08", endDate: "2026-03-11", venue: "BIECC Hall A" },
  { id: "e13", name: "International Marathon", category: "Sports", startDate: "2026-03-14", endDate: "2026-03-14", venue: "Manama Corniche" },
  { id: "e14", name: "Electronica Festival", category: "Concert", startDate: "2026-03-19", endDate: "2026-03-20", venue: "Bahrain Bay" },
  { id: "e15", name: "Bahrain Art Week", category: "Cultural", startDate: "2026-03-24", endDate: "2026-03-28", venue: "National Museum" },
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
