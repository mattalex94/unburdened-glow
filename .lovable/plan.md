

## Category-Based Rows for Event Indicators

### Current Behavior
Events are assigned to slots arbitrarily (slot 1, 2, 3...) based on the order they appear on each day. This means the same event category can jump between rows on different days.

### New Behavior
Each category gets a **dedicated row** at the bottom of the chart. The rows are always in the same order (Conference, Exhibition, Concert, Sports, Cultural). A colored block appears in a category's row only on days when an event of that category is active. This ensures consecutive blocks of the same category form a continuous horizontal band.

### Changes to `src/components/dashboard/EventCalendarOverview.tsx`

**Data preparation:**
- Replace the slot-based approach (`eventSlot1`..`eventSlot4`, `slotCategories`) with category-based keys.
- For each day, compute `catConference`, `catExhibition`, `catConcert`, `catSports`, `catCultural` -- each set to `slotHeight` if an event of that category is active, 0 otherwise.
- The number of Bar components changes from `MAX_SLOTS` (4) to `CATEGORIES.length` (5), one per category.

**Chart rendering:**
- Replace the `SLOT_KEYS` loop with a loop over `CATEGORIES`.
- Each `Bar` uses `dataKey={`cat${category}`}`, `stackId="indicators"`, and a fixed `fill` of `CATEGORY_COLORS[category]` -- no need for per-Cell coloring since the entire bar is one category.
- Remove `Cell` children since color is constant per bar.

**Filtering:**
- When a category filter is applied, only that category's bar appears (the others will be 0 on all days).
- The `filteredEvents` logic already handles this; the category keys will naturally be 0 for filtered-out categories.

**Click handling:**
- On click of a category bar on a given day, find the matching event from `activeEvents` for that category.

This is a straightforward refactor of the data mapping and bar rendering -- no new dependencies or structural changes needed.
