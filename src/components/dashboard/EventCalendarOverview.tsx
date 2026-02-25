import { useState, useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  sampleEvents,
  dailyKpiData,
  CATEGORY_COLORS,
  KPI_LABELS,
  type EventCategory,
  type KpiMetric,
  type CalendarEvent,
} from "@/data/eventCalendarData";
import { format, parseISO, eachDayOfInterval, isWithinInterval } from "date-fns";

type ViewGranularity = "month" | "quarter" | "year";

const CATEGORIES: EventCategory[] = ["Conference", "Exhibition", "Concert", "Sports", "Cultural"];

function getDateRange(granularity: ViewGranularity): { start: Date; end: Date } {
  switch (granularity) {
    case "month":
      return { start: new Date(2026, 0, 1), end: new Date(2026, 0, 31) };
    case "quarter":
      return { start: new Date(2026, 0, 1), end: new Date(2026, 2, 31) };
    case "year":
      return { start: new Date(2026, 0, 1), end: new Date(2026, 2, 31) }; // only Q1 data available
  }
}

interface ChartDataPoint {
  date: string;
  dateLabel: string;
  kpiValue: number;
  events: CalendarEvent[];
  [key: string]: unknown;
}

const EventCalendarOverview = () => {
  const [kpiMetric, setKpiMetric] = useState<KpiMetric>("occupancy");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [viewGranularity, setViewGranularity] = useState<ViewGranularity>("quarter");

  const { chartData, yMax } = useMemo(() => {
    const { start, end } = getDateRange(viewGranularity);
    const days = eachDayOfInterval({ start, end });

    const filteredEvents =
      categoryFilter === "all"
        ? sampleEvents
        : sampleEvents.filter((e) => e.category === categoryFilter);

    let maxKpi = 0;
    days.forEach((day) => {
      const kpi = dailyKpiData[format(day, "yyyy-MM-dd")];
      if (kpi) {
        const v = kpi[kpiMetric];
        if (v > maxKpi) maxKpi = v;
      }
    });
    const yMax = Math.ceil(maxKpi * 1.15);
    const slotHeight = yMax * 0.035;

    const data = days.map((day): ChartDataPoint => {
      const dateStr = format(day, "yyyy-MM-dd");
      const dateLabel = format(day, "dd MMM");

      const kpi = dailyKpiData[dateStr];
      const kpiValue = kpi ? kpi[kpiMetric] : 0;

      const activeEvents = filteredEvents.filter((evt) =>
        isWithinInterval(day, {
          start: parseISO(evt.startDate),
          end: parseISO(evt.endDate),
        })
      );

      const eventBackground = activeEvents.length > 0 ? yMax : 0;

      // Category-based keys
      const catValues: Record<string, number> = {};
      CATEGORIES.forEach((cat) => {
        catValues[`cat${cat}`] = activeEvents.some((e) => e.category === cat) ? slotHeight : 0;
      });

      return {
        date: dateStr,
        dateLabel,
        kpiValue,
        events: activeEvents,
        eventBackground,
        ...catValues,
      };
    });

    return { chartData: data, yMax };
  }, [kpiMetric, categoryFilter, viewGranularity]);

  const handleEventClick = (event: CalendarEvent) => {
    console.log("Event clicked — ready for detail view:", event);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    const dataPoint = payload[0]?.payload as ChartDataPoint;
    const kpiEntry = payload.find((p: any) => p.dataKey === "kpiValue");

    return (
      <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
        <p className="mb-1 font-medium text-foreground">
          {format(parseISO(dataPoint.date), "EEE, dd MMM yyyy")}
        </p>
        {kpiEntry && (
          <p className="mb-1 text-muted-foreground">
            {KPI_LABELS[kpiMetric]}: <span className="font-medium text-foreground">{kpiEntry.value}</span>
          </p>
        )}
        {dataPoint.events.length > 0 && (
          <div className="mt-1 space-y-0.5 border-t border-border/50 pt-1">
            {dataPoint.events.map((evt) => (
              <div key={evt.id} className="flex items-center gap-1.5">
                <div
                  className="h-2 w-2 shrink-0 rounded-sm"
                  style={{ backgroundColor: CATEGORY_COLORS[evt.category] }}
                />
                <span className="text-foreground">{evt.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderLegend = () => (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs">
      {CATEGORIES.map((cat) => (
        <div key={cat} className="flex items-center gap-1.5">
          <div
            className="h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: CATEGORY_COLORS[cat] }}
          />
          <span className="text-muted-foreground">{cat}</span>
        </div>
      ))}
      <div className="flex items-center gap-1.5">
        <div className="h-0.5 w-4 rounded-full bg-primary" />
        <span className="text-muted-foreground">{KPI_LABELS[kpiMetric]}</span>
      </div>
    </div>
  );

  // Calculate tick interval based on granularity
  const tickInterval = viewGranularity === "month" ? 1 : viewGranularity === "quarter" ? 6 : 14;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold">Event Calendar Overview</CardTitle>
        <div className="flex items-center gap-3">
          <ToggleGroup
            type="single"
            value={viewGranularity}
            onValueChange={(v) => v && setViewGranularity(v as ViewGranularity)}
            size="sm"
            variant="outline"
          >
            <ToggleGroupItem value="month" className="text-xs px-2.5">Month</ToggleGroupItem>
            <ToggleGroupItem value="quarter" className="text-xs px-2.5">Quarter</ToggleGroupItem>
            <ToggleGroupItem value="year" className="text-xs px-2.5">Year</ToggleGroupItem>
          </ToggleGroup>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={kpiMetric} onValueChange={(v) => setKpiMetric(v as KpiMetric)}>
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(KPI_LABELS) as KpiMetric[]).map((key) => (
                <SelectItem key={key} value={key}>{KPI_LABELS[key]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }} barCategoryGap={0} barGap="-100%">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
              <XAxis
                dataKey="dateLabel"
                tick={{ fontSize: 10 }}
                className="fill-muted-foreground"
                interval={tickInterval}
                tickLine={false}
                axisLine={false}
                padding={{ left: 0, right: 0 }}
              />
              <YAxis
                yAxisId="kpi"
                orientation="right"
                tick={{ fontSize: 10 }}
                className="fill-muted-foreground"
                tickLine={false}
                axisLine={false}
                width={45}
                domain={[0, yMax]}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Stacked category indicator rows at the bottom */}
              {CATEGORIES.map((cat) => (
                <Bar
                  key={cat}
                  dataKey={`cat${cat}`}
                  yAxisId="kpi"
                  stackId="indicators"
                  fill={CATEGORY_COLORS[cat]}
                  radius={0}
                  isAnimationActive={false}
                  maxBarSize={999}
                  cursor="pointer"
                  onClick={(_data: any, _index: number) => {
                    const point = chartData[_index];
                    const evt = point?.events.find((e: CalendarEvent) => e.category === cat);
                    if (evt) handleEventClick(evt);
                  }}
                />
              ))}

              <Line
                yAxisId="kpi"
                type="monotone"
                dataKey="kpiValue"
                className="stroke-primary"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, className: "fill-primary" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        {renderLegend()}
      </CardContent>
    </Card>
  );
};

export default EventCalendarOverview;
