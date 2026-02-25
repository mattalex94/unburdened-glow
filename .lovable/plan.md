

## Event Calendar Overview Chart

A timeline chart component added to the dashboard's main content area, showing event bars color-coded by category with an overlaid KPI trend line.

### What Gets Built

**New file: `src/components/dashboard/EventCalendarOverview.tsx`**

A card containing:
- **Header row**: Title "Event Calendar Overview" on the left; on the right, a KPI metric dropdown (Occupancy, ADR, RevPAR, F&B Covers) and a category filter dropdown (All, Conference, Exhibition, Concert, Sports, Cultural)
- **Chart area**: Built with Recharts (`ComposedChart`) using the existing chart primitives
  - X-axis: dates (scrollable via date range controls -- month/quarter/year toggle buttons)
  - Event bars rendered as stacked/grouped `Bar` elements, color-coded by category
  - KPI trend rendered as a `Line` overlay on the same axis
  - Custom tooltip showing event name, category, and KPI value
- **Interactions**: Clicking an event bar logs/prepares for an Event Detail view (placeholder for now, since view 6.3 doesn't exist yet)

**Sample data**: A mock dataset of ~15 events across Jan-Mar 2026 with categories and daily KPI values, defined in a `src/data/eventCalendarData.ts` file.

**Edit: `src/pages/Index.tsx`**
- Import and render `EventCalendarOverview` inside the `<main>` area with padding

### Design Details
- Uses the existing `Card` component for the container
- Uses existing `Select` dropdowns for KPI and category filters
- `ToggleGroup` for month/quarter/year view switching
- Color palette for categories: 5-6 distinct muted colors defined as CSS variables
- Matches the clean, minimal style of the existing dashboard shell
- Chart uses `ChartContainer` and `ChartTooltip` from the existing chart.tsx primitives

### Technical Approach
- Recharts `ComposedChart` with `Bar` + `Line` on shared x-axis
- State managed locally: selected KPI metric, selected category filter, date view granularity
- Data filtered client-side based on dropdown selections
- Event click handler receives event data (ready for future detail view)

