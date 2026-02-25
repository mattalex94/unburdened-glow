import TopNav from "@/components/dashboard/TopNav";
import FilterBar from "@/components/dashboard/FilterBar";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      <TopNav />
      <FilterBar />
      <main className="flex-1" />
    </div>
  );
};

export default Index;
