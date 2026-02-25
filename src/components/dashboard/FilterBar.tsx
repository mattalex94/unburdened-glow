import { Building2, CalendarDays, GitCompare, FileSpreadsheet, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const FilterBar = () => {
  return (
    <div className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
      <div className="flex items-center gap-3">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px] h-9 text-sm">
            <Building2 size={14} className="mr-2 text-muted-foreground" />
            <SelectValue placeholder="All Properties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="range">
          <SelectTrigger className="w-[240px] h-9 text-sm">
            <CalendarDays size={14} className="mr-2 text-muted-foreground" />
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="range">2026-01-26 - 2026-02-25</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="2025">
          <SelectTrigger className="w-[140px] h-9 text-sm">
            <GitCompare size={14} className="mr-2 text-muted-foreground" />
            <SelectValue placeholder="Comparison" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">vs 2025</SelectItem>
            <SelectItem value="2024">vs 2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-9 text-sm gap-2">
          <FileSpreadsheet size={14} />
          Export XLSX
        </Button>
        <Button variant="outline" size="sm" className="h-9 text-sm gap-2">
          <FileDown size={14} />
          Export PDF
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
