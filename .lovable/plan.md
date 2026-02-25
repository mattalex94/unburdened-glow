

## Event Detail / Impact View

A new page at `/event/:id` that lets BTEA drill into a specific event and see its KPI impact with pre/during/post comparison.

### 1. New Page: `src/pages/EventDetail.tsx`

The main page component that:
- Reads the event ID from the URL via `useParams`
- Looks up the event from `sampleEvents`
- Defines a 7-day buffer for pre-event and post-event periods
- Computes all KPI data for the full window
- Renders four sections described below

### 2. Four Sections

**A. Event Info Card**
A Card at the top showing: event name, date range (formatted), venue, area, category (with colored badge), and ticket status (Free/Paid badge). Clean horizontal layout.

**B. KPI Comparison Table**
A table with 4 KPI rows (Occupancy, ADR, RevPAR, F&B Covers) and 4 columns:
- **Pre-Event** (7 days before start) -- average of daily values
- **During Event** -- average of daily values during the event
- **Post-Event** (7 days after end) -- average of daily values
- **Baseline** (simulated prior-year values, derived by removing the event boost from the data)

Each cell shows the value and a percentage difference from baseline, colored green (positive) or red (negative).

**C. Trend Chart**
A Recharts `ComposedChart` showing:
- X-axis: full date range (pre + during + post)
- Solid line for actual KPI values
- Dashed line for baseline values
- A `ReferenceArea` shading the event period with a light background band
- KPI selector dropdown to switch metrics

**D. Overlap Indicator**
A section listing any other events from `sampleEvents` that overlap with the selected event's date range. Each shown with its category color dot and name, plus a note: "Results may reflect combined effects of overlapping events."

### 3. Routing (`src/App.tsx`)

Add a new route: `<Route path="/event/:id" element={<EventDetail />} />`

### 4. Navigation Integration (`src/components/dashboard/EventCalendarOverview.tsx`)

Update `handleEventClick` to navigate to `/event/${event.id}` using `useNavigate` from react-router-dom, instead of just logging.

### 5. Baseline Data (`src/data/eventCalendarData.ts`)

Export a `baselineKpiData` object generated the same way as `dailyKpiData` but without the event boost step. This provides the "prior year" comparison values.

### Technical Details

- Buffer period: 7 days before start, 7 days after end
- Baseline: generated from the same random seed logic but skipping the event-boost loop -- exported as a separate constant
- All averages computed with `useMemo`
- Percentage diff: `((actual - baseline) / baseline * 100).toFixed(1)`
- Overlap detection: filter `sampleEvents` for any event (not the current one) whose date range intersects the current event's range
- Uses existing components: Card, Badge, Table, Recharts, date-fns
- No new dependencies needed
- Back navigation link at the top of the page to return to the dashboard

