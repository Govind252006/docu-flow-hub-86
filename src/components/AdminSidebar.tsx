import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Users,
  Shield,
  FileText,
  Settings,
  Upload,
  Search,
  Activity,
  LogOut,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";

const adminMenuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: Home },
  { title: "User Management", url: "/admin/users", icon: Users },
  { title: "Department Manager", url: "/admin/departments", icon: Shield },
  { title: "Document Upload", url: "/admin/upload", icon: Upload },
  { title: "Reports & Analytics", url: "/admin/reports", icon: BarChart3 },
  { title: "Audit Logs", url: "/admin/audit", icon: Activity },
  { title: "Document Search", url: "/admin/search", icon: Search },
  { title: "System Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path);

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
      : "hover:bg-accent hover:text-accent-foreground";

  const handleLogout = () => {
    navigate('/');
  };

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-card">
        {/* Logo/Header */}
        <div className="p-4 border-b">
          {!isCollapsed ? (
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h2 className="font-bold text-lg">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">Enterprise Dashboard</p>
              </div>
            </div>
          ) : (
            <Shield className="w-8 h-8 text-primary mx-auto" />
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => getNavClass({ isActive })}
                    >
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Button at Bottom */}
        <div className="mt-auto p-4 border-t">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start"
            size={isCollapsed ? "icon" : "default"}
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}