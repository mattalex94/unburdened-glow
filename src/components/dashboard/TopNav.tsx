import { LayoutDashboard, TrendingUp, BarChart3, FileText, Mail, Shield, Bot, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Performance", icon: TrendingUp },
  { label: "Analysis", icon: BarChart3 },
  { label: "Reports", icon: FileText },
  { label: "Email Alerts", icon: Mail },
  { label: "Admin", icon: Shield },
  { label: "AI Assistant", icon: Bot },
];

const TopNav = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 h-14">
      <nav className="flex items-center gap-1">
        {navItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActiveTab(label)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              activeTab === label
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
          <span className="font-medium">John Smith</span>
          <ChevronDown size={14} className="text-muted-foreground" />
        </div>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs bg-primary text-primary-foreground">JS</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default TopNav;
