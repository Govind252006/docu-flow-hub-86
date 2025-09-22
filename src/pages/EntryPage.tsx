import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Shield, FileText } from "lucide-react";

const EntryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-xl bg-card/95 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="mb-6">
              <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Enterprise Dashboard
              </h1>
              <p className="text-muted-foreground">
                Secure document management and workflow system
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              variant="hero"
              className="w-full h-12"
              onClick={() => navigate('/login')}
            >
              <Shield className="w-5 h-5 mr-2" />
              Client Login
            </Button>

            <Button
              variant="outline"
              className="w-full h-12"
              onClick={() => navigate('/request-deployment')}
            >
              <FileText className="w-5 h-5 mr-2" />
              Request Deployment
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Secure • Compliant • Enterprise-Ready
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EntryPage;