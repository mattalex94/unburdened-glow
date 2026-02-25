import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format, parseISO, eachDayOfInterval, addDays, subDays } from "date-fns";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import {
  sampleEvents,
  dailyKpiData,
  baselineKpiData,
  CATEGORY_COLORS,
  KPI_LABELS,
  type KpiMetric,
} from "@/data/eventCalendarData";

const BUFFER_DAYS = 7;

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedKpi, setSelectedKpi] = useState<KpiMetric>("occupancy");

  const event = sampleEvents.find((e) => e.id === id);

  const computedData = useMemo(() => {
    if (!event) return null;

    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    const windowStart = subDays(eventStart, BUFFER_DAYS);
    const windowEnd = addDays(eventEnd, BUFFER_DAYS);

    const preDays = eachDayOfInterval({ start: windowStart, end: subDays(eventStart, 1) });
    const duringDays = eachDayOfInterval({ start: eventStart, end: eventEnd });
    const postDays = eachDayOfInterval({ start: addDays(eventEnd, 1), end: windowEnd });
    const allDays = eachDayOfInterval({ start: windowStart, end: windowEnd });

    const avg = (days: Date[], source: Record<string, any>, metric: KpiMetric) => {
      const vals = days.map((d) => source[format(d, "yyyy-MM-dd")]?.[metric]).filter(Boolean);
      return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    };

    const kpis: KpiMetric[] = ["occupancy", "adr", "revpar", "fnb_covers"];

    const kpiTable = kpis.map((metric) => {
      const pre = avg(preDays, dailyKpiData, metric);
      const during = avg(duringDays, dailyKpiData, metric);
      const post = avg(postDays, dailyKpiData, metric);
      const baseline = avg(duringDays, baselineKpiData, metric);
      const diff = (val: number) => baseline ? ((val - baseline) / baseline * 100).toFixed(1) : "0.0";
      return { metric, pre, during, post, baseline, diffPre: diff(pre), diffDuring: diff(during), diffPost: diff(post) };
    });

    const chartData = allDays.map((day) => {
      const key = format(day, "yyyy-MM-dd");
      return {
        date: key,
        dateLabel: format(day, "dd MMM"),
        actual: dailyKpiData[key]?.[selectedKpi] ?? 0,
        baseline: baselineKpiData[key]?.[selectedKpi] ?? 0,
      };
    });

    // Overlap detection
    const overlapping = sampleEvents.filter((e) => {
      if (e.id === event.id) return false;
      const s = parseISO(e.startDate);
      const eEnd = parseISO(e.endDate);
      return s <= eventEnd && eEnd >= eventStart;
    });

    return { kpiTable, chartData, overlapping, eventStart: event.startDate, eventEnd: event.endDate };
  }, [event, selectedKpi]);

  if (!event || !computedData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Event not found.</p>
          <Link to="/" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </Card>
      </div>
    );
  }

  const DiffBadge = ({ value }: { value: string }) => {
    const num = parseFloat(value);
    return (
      <span className={`ml-1 text-xs font-medium ${num >= 0 ? "text-emerald-600" : "text-red-500"}`}>
        {num >= 0 ? "+" : ""}{value}%
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6 max-w-5xl mx-auto">
      {/* Back link */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      {/* A. Event Info Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">{event.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Dates: </span>
            <span className="font-medium">{format(parseISO(event.startDate), "dd MMM yyyy")} – {format(parseISO(event.endDate), "dd MMM yyyy")}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Venue: </span>
            <span className="font-medium">{event.venue}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Area: </span>
            <span className="font-medium">{event.area}</span>
          </div>
          <Badge style={{ backgroundColor: CATEGORY_COLORS[event.category], color: "white" }}>
            {event.category}
          </Badge>
          <Badge variant={event.isFree ? "secondary" : "outline"}>
            {event.isFree ? "Free" : "Paid"}
          </Badge>
        </CardContent>
      </Card>

      {/* B. KPI Comparison Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">KPI Impact Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>KPI</TableHead>
                <TableHead className="text-center">Pre-Event</TableHead>
                <TableHead className="text-center">During Event</TableHead>
                <TableHead className="text-center">Post-Event</TableHead>
                <TableHead className="text-center">Baseline</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {computedData.kpiTable.map((row) => (
                <TableRow key={row.metric}>
                  <TableCell className="font-medium">{KPI_LABELS[row.metric]}</TableCell>
                  <TableCell className="text-center">
                    {row.pre} <DiffBadge value={row.diffPre} />
                  </TableCell>
                  <TableCell className="text-center">
                    {row.during} <DiffBadge value={row.diffDuring} />
                  </TableCell>
                  <TableCell className="text-center">
                    {row.post} <DiffBadge value={row.diffPost} />
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">{row.baseline}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* C. Trend Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Daily KPI Trend</CardTitle>
          <Select value={selectedKpi} onValueChange={(v) => setSelectedKpi(v as KpiMetric)}>
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(KPI_LABELS) as KpiMetric[]).map((key) => (
                <SelectItem key={key} value={key}>{KPI_LABELS[key]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={computedData.chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
                <XAxis dataKey="dateLabel" tick={{ fontSize: 10 }} className="fill-muted-foreground" tickLine={false} axisLine={false} interval={2} />
                <YAxis tick={{ fontSize: 10 }} className="fill-muted-foreground" tickLine={false} axisLine={false} width={45} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload;
                    return (
                      <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
                        <p className="font-medium text-foreground">{d?.dateLabel}</p>
                        <p className="text-muted-foreground">Actual: <span className="font-medium text-foreground">{d?.actual}</span></p>
                        <p className="text-muted-foreground">Baseline: <span className="font-medium text-foreground">{d?.baseline}</span></p>
                      </div>
                    );
                  }}
                />
                <ReferenceArea
                  x1={format(parseISO(computedData.eventStart), "dd MMM")}
                  x2={format(parseISO(computedData.eventEnd), "dd MMM")}
                  fill="hsl(var(--primary))"
                  fillOpacity={0.08}
                />
                <Line type="monotone" dataKey="actual" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} activeDot={{ r: 3 }} />
                <Line type="monotone" dataKey="baseline" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 pt-2 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-0.5 w-4 rounded-full bg-primary" />
              <span className="text-muted-foreground">Actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-0.5 w-4 rounded-full bg-muted-foreground" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 3px, hsl(var(--muted-foreground)) 3px, hsl(var(--muted-foreground)) 6px)" }} />
              <span className="text-muted-foreground">Baseline</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* D. Overlap Indicator */}
      {computedData.overlapping.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Overlapping Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {computedData.overlapping.map((evt) => (
              <div key={evt.id} className="flex items-center gap-2 text-sm">
                <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[evt.category] }} />
                <span className="font-medium">{evt.name}</span>
                <span className="text-muted-foreground">({format(parseISO(evt.startDate), "dd MMM")} – {format(parseISO(evt.endDate), "dd MMM")})</span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground italic pt-1">Results may reflect combined effects of overlapping events.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventDetail;
