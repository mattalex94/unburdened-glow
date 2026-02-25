

## Event Statistics Summary Section

A new section below the Event Calendar Overview providing BTEA with distributional insights about the events calendar.

### Data Model Updates (`src/data/eventCalendarData.ts`)

Add two new fields to `CalendarEvent`:
- `area`: string (e.g. "Manama", "Muharraq", "Seef", "Riffa", "Bahrain Bay") -- derived from venue locations
- `isFree`: boolean

Update all 18 sample events with these fields, distributing areas across Bahrain locations and mixing free/paid.

### New Component (`src/components/dashboard/EventStatisticsSummary.tsx`)

A card-based section with the title "Event Statistics Summary" containing a responsive grid of 6 items:

1. **Total Events card** -- Large number (e.g. "18") with a simulated YoY change badge (e.g. "+12% vs last year"). Simple summary card using Card component.

2. **Events by Category** -- Horizontal bar chart (Recharts `BarChart` with `layout="vertical"`) showing count per category, colored by `CATEGORY_COLORS`.

3. **Average Events per Month** -- Vertical bar chart with Jan/Feb/Mar bars showing event count per month.

4. **Event Density by Area** -- Horizontal bar chart showing count per area (Manama, Muharraq, etc.).

5. **Free vs Paid Split** -- Donut chart (Recharts `PieChart` with inner radius) showing the ratio.

6. **Average Event Duration** -- Summary card showing the average duration in days across all events.

Layout: 3-column grid on desktop (`grid-cols-3`), 2 columns on tablet, 1 on mobile. Each chart ~200px tall inside its card.

### Page Integration (`src/pages/Index.tsx`)

Import and render `EventStatisticsSummary` below `EventCalendarOverview` in the main area.

### Technical Details

- All statistics are computed from `sampleEvents` using `useMemo`
- Duration calculated via `differenceInDays` from date-fns (endDate - startDate + 1)
- Month grouping via `getMonth` from date-fns
- No new dependencies needed -- uses existing Recharts and shadcn Card components
- Colors for charts reuse `CATEGORY_COLORS` where applicable, neutral colors for area/month charts

