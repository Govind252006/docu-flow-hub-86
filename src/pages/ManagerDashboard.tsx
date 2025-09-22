import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  BarChart3,
  Upload,
  Users,
  TrendingUp
} from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ManagerSidebar } from "@/components/ManagerSidebar";

const ManagerDashboard = () => {
  const [tasks] = useState([
    { id: 1, title: "Review Safety Report", status: "pending", priority: "high", dueDate: "Today", department: "Safety" },
    { id: 2, title: "Approve Vendor Invoice", status: "in-progress", priority: "medium", dueDate: "Tomorrow", department: "Procurement" },
    { id: 3, title: "Update Job Cards", status: "completed", priority: "low", dueDate: "Yesterday", department: "Engineering" },
    { id: 4, title: "HR Policy Review", status: "pending", priority: "medium", dueDate: "2 days", department: "HR" },
  ]);

  const [documents] = useState([
    { id: 1, name: "Maintenance_Report_Q4.pdf", uploadedBy: "John Engineer", date: "2 hours ago", status: "approved" },
    { id: 2, name: "Safety_Incident_Report.docx", uploadedBy: "Safety Manager", date: "5 hours ago", status: "pending" },
    { id: 3, name: "Vendor_Contract_ABC.pdf", uploadedBy: "Procurement Lead", date: "1 day ago", status: "approved" },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'in-progress':
        return <Badge variant="default">In Progress</Badge>;
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'approved':
        return <Badge variant="default">Approved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <ManagerSidebar />
        
        <main className="flex-1 overflow-hidden">
          {/* Header */}
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-6">
              <SidebarTrigger className="mr-4" />
              <div className="flex items-center justify-between w-full">
                <div>
                  <h1 className="text-2xl font-semibold">Manager Dashboard</h1>
                  <p className="text-sm text-muted-foreground">
                    Engineering Department • Welcome back, John
                  </p>
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
                    <p className="text-sm font-medium text-muted-foreground">My Tasks</p>
                    <p className="text-3xl font-bold">8</p>
                    <p className="text-xs text-muted-foreground mt-1">3 pending</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Documents</p>
                    <p className="text-3xl font-bold">24</p>
                    <p className="text-xs text-muted-foreground mt-1">2 need review</p>
                  </div>
                  <FileText className="w-8 h-8 text-primary" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                    <p className="text-3xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground mt-1">All active</p>
                  </div>
                  <Users className="w-8 h-8 text-accent" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                    <p className="text-3xl font-bold">94%</p>
                    <p className="text-xs text-success mt-1">+5% from last week</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-success" />
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task Management */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    My Tasks
                  </h3>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-start justify-between p-4 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{task.title}</h4>
                          <AlertTriangle className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{task.department}</span>
                          <span>Due: {task.dueDate}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {getStatusBadge(task.status)}
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Weekly Progress</span>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </Card>

              {/* Recent Documents */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Recent Documents
                  </h3>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{doc.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            by {doc.uploadedBy} • {doc.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        {getStatusBadge(doc.status)}
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Performance Charts */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Department Performance
                </h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Last Week</Button>
                  <Button variant="outline" size="sm">Last Month</Button>
                </div>
              </div>
              
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Performance charts will be displayed here</p>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ManagerDashboard;