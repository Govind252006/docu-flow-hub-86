import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication logic
    if (credentials.email === "admin@company.com") {
      toast({
        title: "Login successful",
        description: "Welcome back, Admin!",
      });
      navigate('/admin/dashboard');
    } else if (credentials.email.includes("manager")) {
      toast({
        title: "Login successful",
        description: "Welcome back, Manager!",
      });
      navigate('/manager/dashboard');
    } else {
      toast({
        title: "Invalid credentials",
        description: "Please check your email and password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-xl">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="text-center">
              <User className="w-12 h-12 text-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Client Login
              </h1>
              <p className="text-muted-foreground">
                Access your secure dashboard
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-6" variant="hero">
              <Lock className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Demo Credentials:</p>
            <p>Admin: admin@company.com</p>
            <p>Manager: manager@company.com</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;