import { useMemo } from "react";
import { differenceInDays, getMonth, parse } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sampleEvents, CATEGORY_COLORS, type EventCategory } from "@/data/eventCalendarData";
import { TrendingUp, Clock } from "lucide-react";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const AREA_COLOR = "hsl(var(--primary))";
const MONTH_COLOR = "hsl(var(--primary))";
const FREE_COLOR = "hsl(160, 55%, 45%)";
const PAID_COLOR = "hsl(35, 80%, 55%)";

const EventStatisticsSummary = () => {
  const stats = useMemo(() => {
    const total = sampleEvents.length;

    // By category
    const byCat: Record<string, number> = {};
    sampleEvents.forEach((e) => {
      byCat[e.category] = (byCat[e.category] || 0) + 1;
    });
    const categoryData = Object.entries(byCat).map(([name, count]) => ({
      name,
      count,
      fill: CATEGORY_COLORS[name as EventCategory],
    }));

    // By month
    const byMonth: Record<number, number> = {};
    sampleEvents.forEach((e) => {
      const m = getMonth(parse(e.startDate, "yyyy-MM-dd", new Date()));
      byMonth[m] = (byMonth[m] || 0) + 1;
    });
    const monthData = Object.entries(byMonth)
      .map(([m, count]) => ({ name: MONTH_NAMES[+m], count }))
      .sort((a, b) => MONTH_NAMES.indexOf(a.name) - MONTH_NAMES.indexOf(b.name));

    // By area
    const byArea: Record<string, number> = {};
    sampleEvents.forEach((e) => {
      byArea[e.area] = (byArea[e.area] || 0) + 1;
    });
    const areaData = Object.entries(byArea)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Free vs Paid
    const freeCount = sampleEvents.filter((e) => e.isFree).length;
    const paidCount = total - freeCount;
    const freeVsPaid = [
      { name: "Free", value: freeCount, fill: FREE_COLOR },
      { name: "Paid", value: paidCount, fill: PAID_COLOR },
    ];

    // Avg duration
    const totalDays = sampleEvents.reduce((sum, e) => {
      const s = parse(e.startDate, "yyyy-MM-dd", new Date());
      const ed = parse(e.endDate, "yyyy-MM-dd", new Date());
      return sum + differenceInDays(ed, s) + 1;
    }, 0);
    const avgDuration = (totalDays / total).toFixed(1);

    return { total, categoryData, monthData, areaData, freeVsPaid, avgDuration };
  }, []);

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Event Statistics Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Events & Avg Duration */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Events</p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-foreground">{stats.total}</span>
                <Badge variant="secondary" className="gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% vs last year
                </Badge>
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-xs text-muted-foreground mb-1">Avg. Event Duration</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-foreground">{stats.avgDuration}</span>
                <span className="text-muted-foreground text-sm">days</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-muted-foreground text-xs">
                <Clock className="h-3.5 w-3.5" />
                Across all {stats.total} events
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events by Category */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Events by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats.categoryData} layout="vertical" margin={{ left: 0, right: 12, top: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {stats.categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Events per Month */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Events per Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats.monthData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="count" fill={MONTH_COLOR} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Event Density by Area */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Event Density by Area</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats.areaData} layout="vertical" margin={{ left: 0, right: 12, top: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill={AREA_COLOR} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Free vs Paid */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Free vs Paid Split</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={stats.freeVsPaid}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                >
                  {stats.freeVsPaid.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm" style={{ background: FREE_COLOR }} />
                <span className="text-muted-foreground">Free ({stats.freeVsPaid[0].value})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm" style={{ background: PAID_COLOR }} />
                <span className="text-muted-foreground">Paid ({stats.freeVsPaid[1].value})</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </section>
  );
};

export default EventStatisticsSummary;
