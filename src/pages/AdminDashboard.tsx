import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Shield, 
  FileText, 
  Bell, 
  BarChart3, 
  Settings,
  Upload,
  Search,
  Filter,
  Plus
} from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";

const AdminDashboard = () => {
  const [alerts] = useState([
    { id: 1, type: "pending", message: "5 documents pending approval", count: 5 },
    { id: 2, type: "processing", message: "3 tasks in progress", count: 3 },
    { id: 3, type: "completed", message: "12 tasks completed today", count: 12 },
  ]);

  const [recentActivity] = useState([
    { id: 1, user: "John Manager", action: "uploaded document", time: "2 hours ago", department: "Engineering" },
    { id: 2, user: "Sarah Admin", action: "created new user", time: "3 hours ago", department: "HR" },
    { id: 3, user: "Mike Operations", action: "completed task", time: "5 hours ago", department: "Operations" },
  ]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <AdminSidebar />
        
        <main className="flex-1 overflow-hidden">
          {/* Header */}
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-6">
              <SidebarTrigger className="mr-4" />
              <div className="flex items-center justify-between w-full">
                <div>
                  <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome back, Admin
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4 mr-2" />
                    Alerts
                    <Badge variant="destructive" className="ml-2">
                      {alerts.reduce((sum, alert) => sum + alert.count, 0)}
                    </Badge>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-3xl font-bold">24</p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Managers</p>
                    <p className="text-3xl font-bold">6</p>
                  </div>
                  <Shield className="w-8 h-8 text-success" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Documents</p>
                    <p className="text-3xl font-bold">142</p>
                  </div>
                  <FileText className="w-8 h-8 text-warning" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tasks Today</p>
                    <p className="text-3xl font-bold">15</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-accent" />
                </div>
              </Card>
            </div>

            {/* Alerts Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  System Alerts
                </h3>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={
                          alert.type === 'pending' ? 'destructive' : 
                          alert.type === 'processing' ? 'secondary' : 'default'
                        }
                      >
                        {alert.type}
                      </Badge>
                      <span className="font-medium">{alert.message}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div>
                        <p className="font-medium">{activity.user}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.action} • {activity.department}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center space-y-4">
                  <Plus className="w-12 h-12 text-primary mx-auto" />
                  <div>
                    <h4 className="font-semibold">Create User</h4>
                    <p className="text-sm text-muted-foreground">
                      Add new team member
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center space-y-4">
                  <Upload className="w-12 h-12 text-success mx-auto" />
                  <div>
                    <h4 className="font-semibold">Upload Document</h4>
                    <p className="text-sm text-muted-foreground">
                      Add new files to system
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center space-y-4">
                  <Settings className="w-12 h-12 text-warning mx-auto" />
                  <div>
                    <h4 className="font-semibold">System Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      Configure permissions
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;