
Goal
- Remove all visible white gaps so event color overlays appear as continuous, full-width rectangles across active date ranges.

What is causing the gaps now
- The chart renders one `Bar` per category (5 bars per day). Recharts allocates horizontal slots for each bar series, so even with `barCategoryGap={0}`, zero-value categories still reserve width, creating visible spacing.
- Vertical grid lines can visually read as “gaps” between bands.
- Small chart right margin also leaves a light strip at the edge.

Implementation plan

1) Update bar layout to overlap categories in the same full-width slot
- In `src/components/dashboard/EventCalendarOverview.tsx`:
  - Keep multiple category `Bar`s (so category colors are preserved).
  - Change `ComposedChart` gap behavior to overlap bars instead of grouping:
    - keep `barCategoryGap={0}`
    - set `barGap="-100%"`
  - Keep bars on `yAxisId="kpi"` with current full-height values (`yMax`) and `radius={0}`.
  - Keep `maxBarSize={999}` (or replace with explicit `barSize`) so the band occupies the entire date bucket width.

2) Remove visual separators that look like white spaces
- Adjust `CartesianGrid` to disable vertical lines:
  - `vertical={false}`
  - keep horizontal lines only (optional lighter stroke).
- This ensures no thin vertical separators appear between date buckets.

3) Tighten edge spacing so overlays reach chart boundaries
- Reduce/remove extra horizontal chart margin where possible:
  - set chart margin right to minimal needed for y-axis labels (or 0 if labels remain readable).
- Add `XAxis` padding control:
  - `padding={{ left: 0, right: 0 }}` to avoid extra side gaps.

4) Preserve interaction behavior
- Keep click handling on bars to continue opening/preparing event detail context.
- Keep KPI line rendered after bars so line stays visible above overlays.

5) Validate behavior across all views
- Verify Month/Quarter/Year all render continuous, no-gap overlays.
- Verify category filter still works and active ranges remain full-height.
- Confirm KPI line contrast remains readable after overlap change.

Technical notes
- If tiny seams still appear on some pixel widths, fallback refinement:
  - switch from per-day bars to event-range `ReferenceArea` overlays (`x1`/`x2`) for truly continuous blocks per event interval.
  - This is a second-step fallback only if overlap + grid changes are insufficient.
