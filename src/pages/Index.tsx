import TopNav from "@/components/dashboard/TopNav";
import FilterBar from "@/components/dashboard/FilterBar";
import EventCalendarOverview from "@/components/dashboard/EventCalendarOverview";
import EventStatisticsSummary from "@/components/dashboard/EventStatisticsSummary";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      <TopNav />
      <FilterBar />
      <main className="flex-1 p-6 space-y-6">
        <EventCalendarOverview />
        <EventStatisticsSummary />
      </main>
    </div>
  );
};

export default Index;
