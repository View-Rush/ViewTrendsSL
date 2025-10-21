import { LayoutDashboard, PlayCircle, Video, TrendingUp, BarChart3 } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
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
  { title: "Predictions", url: "/predictions", icon: TrendingUp },
  { title: "Video Library", url: "/videos", icon: Video },
  { title: "Channels", url: "/channels", icon: PlayCircle },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

export function AppSidebar() {
  return (
      <Sidebar className="border-r border-sidebar-border">
        <SidebarContent>
          {/* === Header / App Title === */}
          <div className="px-6 py-5">
            <Link to="/" className="block">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-chart-5 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
                ViewTrendsSL
              </h1>
            </Link>
          </div>

          {/* === Menu Section === */}
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
                                `flex items-center gap-4 px-6 py-3 text-[1.05rem] transition-colors rounded-md ${
                                    isActive
                                        ? "bg-sidebar-accent text-sidebar-primary font-semibold"
                                        : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                                }`
                            }
                        >
                          <item.icon className="h-[1.3rem] w-[1.3rem]" />
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
