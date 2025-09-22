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
  CheckCircle,
  FileText,
  Upload,
  MessageCircle,
  LogOut,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const managerMenuItems = [
  { title: "Dashboard", url: "/manager/dashboard", icon: Home },
  { title: "Upload Documents", url: "/upload", icon: Upload },
  { title: "Document Assistant", url: "/chatbot", icon: MessageCircle },
  { title: "Reports", url: "/manager/reports", icon: BarChart3 },
];

export function ManagerSidebar() {
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
              <CheckCircle className="w-8 h-8 text-primary" />
              <div>
                <h2 className="font-bold text-lg">Manager Panel</h2>
                <p className="text-xs text-muted-foreground">Engineering Dept.</p>
              </div>
            </div>
          ) : (
            <CheckCircle className="w-8 h-8 text-primary mx-auto" />
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managerMenuItems.map((item) => (
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