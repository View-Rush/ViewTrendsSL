import { LayoutDashboard, PlayCircle, Video, TrendingUp, BarChart3, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Channels", url: "/channels", icon: PlayCircle },
  { title: "Video Library", url: "/videos", icon: Video },
  { title: "Predictions", url: "/predictions", icon: TrendingUp },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  return (
      <Sidebar className="border-r border-sidebar-border">
        <SidebarContent>
          <div className="px-6 py-5">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-5 bg-clip-text text-transparent">
              ViewTrendsSL
            </h1>
          </div>

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                            to={item.url}
                            end={item.url === "/dashboard"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-6 py-3 transition-colors ${
                                    isActive
                                        ? "bg-sidebar-accent text-sidebar-primary font-medium"
                                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                                }`
                            }
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
  );
}
