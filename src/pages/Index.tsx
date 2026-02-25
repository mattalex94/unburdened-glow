import TopNav from "@/components/dashboard/TopNav";
import FilterBar from "@/components/dashboard/FilterBar";
import EventCalendarOverview from "@/components/dashboard/EventCalendarOverview";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      <TopNav />
      <FilterBar />
      <main className="flex-1 p-6">
        <EventCalendarOverview />
      </main>
    </div>
  );
};

export default Index;
