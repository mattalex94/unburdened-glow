

## Make Event Bars Full-Height Semi-Transparent Overlays

Change the event category bars from small stacked bars at the bottom to full-height semi-transparent colored rectangles that overlay the entire chart area, so the category colors visually intersect with the KPI trend line.

### Changes to `src/components/dashboard/EventCalendarOverview.tsx`

**Data preparation:**
- Instead of setting category values to `1` when active, set them to the maximum value of the KPI Y-axis domain (computed dynamically from the data, e.g. max kpiValue + padding)
- This makes the bars extend to the full chart height

**Bar rendering:**
- Move bars from the hidden `events` Y-axis to the `kpi` Y-axis so they share the same scale
- Add `fillOpacity={0.15}` (or similar low value) to make them semi-transparent
- Remove `stackId` so overlapping categories layer independently with transparency
- Remove the hidden `events` Y-axis entirely since it's no longer needed
- Set `radius={0}` for clean rectangular bands

**Rendering order:**
- Render the `Bar` elements first, then the `Line` on top, so the KPI line draws over the translucent bands

The result: colored translucent vertical bands appear wherever events are active, and the KPI line is clearly visible through/on top of them.

