import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Users, Plus, Search, Filter, Edit, Trash2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UserManagement = () => {
  const { toast } = useToast();
  
  const [users, setUsers] = useState([
    { id: 1, name: "John Smith", email: "john.manager@company.com", department: "Engineering", role: "Manager", status: "Active" },
    { id: 2, name: "Sarah Wilson", email: "sarah.admin@company.com", department: "HR", role: "Admin", status: "Active" },
    { id: 3, name: "Mike Johnson", email: "mike.ops@company.com", department: "Operations", role: "Manager", status: "Active" },
    { id: 4, name: "Emily Brown", email: "emily.proc@company.com", department: "Procurement", role: "User", status: "Inactive" },
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    role: "User"
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const departments = ["Engineering", "Operations", "HR", "Procurement", "Safety", "Compliance"];
  const roles = ["Admin", "Manager", "User"];

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = {
      id: users.length + 1,
      ...newUser,
      status: "Active"
    };
    
    setUsers([...users, user]);
    setNewUser({ name: "", email: "", password: "", department: "", role: "User" });
    setIsDialogOpen(false);
    
    toast({
      title: "User created successfully",
      description: `${user.name} has been added to the system.`,
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || user.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

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
                  <h1 className="text-2xl font-semibold flex items-center">
                    <Users className="w-6 h-6 mr-2" />
                    User Management
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Manage user accounts and permissions
                  </p>
                </div>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="hero">
                      <Plus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                      <DialogDescription>
                        Add a new user to the system with appropriate permissions.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleCreateUser}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            required
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            required
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            required
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="department">Department</Label>
                          <Select
                            value={newUser.department}
                            onValueChange={(value) => setNewUser({ ...newUser, department: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept} value={dept}>
                                  {dept}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="role">Role</Label>
                          <Select
                            value={newUser.role}
                            onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" variant="hero">
                          Create User
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Search and Filter */}
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="w-full sm:w-48">
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger>
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Users Table */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium">User</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Department</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Role</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/30">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-foreground">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="secondary">{user.department}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1">
                            {user.role === 'Admin' && <Shield className="w-3 h-3 text-destructive" />}
                            <Badge 
                              variant={
                                user.role === 'Admin' ? 'destructive' : 
                                user.role === 'Manager' ? 'default' : 'outline'
                              }
                            >
                              {user.role}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            variant={user.status === 'Active' ? 'default' : 'secondary'}
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default UserManagement;