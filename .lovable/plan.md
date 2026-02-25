

## Redesign Event Bars: Neutral Background + Stacked Category Indicators

### Concept
Replace the current full-height colored bars with:
1. A **light grey full-height bar** for any day that has events (neutral background indicating "event activity")
2. **Small colored boxes stacked at the bottom** of the chart, one per active event, colored by category

This cleanly handles overlapping events -- if a day has 3 events, there are 3 small colored boxes stacked at the bottom, each showing its category color.

### Changes to `src/components/dashboard/EventCalendarOverview.tsx`

**Data preparation:**
- Instead of setting per-category values to `yMax`, compute two things per day:
  - `eventBackground`: set to `yMax` if any events are active, 0 otherwise (for the grey background bar)
  - `eventSlot1`, `eventSlot2`, `eventSlot3` (etc.): stacked bar values. Each slot gets a fixed small height (e.g. `yMax * 0.04`). The number of slots equals the max concurrent events across all days. Each slot stores the category name for coloring via `Cell`.
  - Store a parallel array `eventSlotCategories` mapping slot index to the category for that day's events.

**Chart rendering:**
- One `Bar` for `eventBackground` -- light grey (`#e5e5e5`), `fillOpacity={0.25}`, full-height, rendered first behind everything.
- Multiple stacked `Bar`s for event slots (`eventSlot1`, `eventSlot2`, etc.) with `stackId="events"`, small fixed height, positioned at the bottom. Each bar uses `Cell` components to dynamically set the fill color based on the category stored in the data.
- The KPI `Line` renders last, on top.

**Stacking at the bottom:**
- Add a second hidden Y-axis (`yAxisId="slots"`) with domain `[0, maxSlots]` where each slot = 1 unit.
- The slot bars use this axis so they naturally stack from the bottom with small fixed heights.
- Alternatively, keep the `kpi` axis and set slot values to small fractions of `yMax` so they appear as thin bands at the chart bottom.

**Color assignment per cell:**
- For each slot `Bar`, iterate over `chartData` and render `Cell` components with `fill` set to the category color of the event in that slot, or transparent if no event occupies that slot.

**Legend:**
- Keep existing legend (category color dots + KPI line indicator). Add a grey indicator for "Event period" if desired.

### Technical Details

The `ChartDataPoint` interface changes to:

```text
{
  date, dateLabel, kpiValue, events,
  eventBackground: number,        // yMax or 0
  eventSlot1: number,             // small fixed value or 0
  eventSlot2: number,             // small fixed value or 0
  eventSlot3: number,             // small fixed value or 0
  slotCategories: EventCategory[] // categories for coloring
}
```

Max concurrent events in the sample data is 2 (some days have overlapping events). We'll support up to 3-4 slots for safety.

Each slot `Bar` renders `Cell` children dynamically:
```text
<Bar dataKey="eventSlot1" stackId="indicators" yAxisId="kpi" ...>
  {chartData.map((entry, i) => (
    <Cell key={i} fill={entry.slotCategories[0] ? CATEGORY_COLORS[...] : 'transparent'} />
  ))}
</Bar>
```

The slot height value will be approximately `yMax * 0.035` per slot, so 3 stacked events take about 10% of chart height -- visible but unobtrusive.

