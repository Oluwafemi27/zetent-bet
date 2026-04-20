import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Setup = () => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const setupAdmin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("setup-admin");
      if (error) throw error;
      
      toast({
        title: "Admin user created!",
        description: `User: oluwafemiod7@gmail.com\nPassword: Sijuade27#`,
      });
      setDone(true);
    } catch (err: any) {
      toast({
        title: "Setup failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Setup</CardTitle>
          <CardDescription>Initialize the admin user account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {done ? (
            <div className="rounded-lg bg-green-100 p-4 text-green-800">
              <p className="font-medium">✓ Setup completed successfully!</p>
              <p className="text-sm mt-2">You can now log in with:</p>
              <p className="text-xs font-mono mt-1">Email: oluwafemiod7@gmail.com</p>
              <p className="text-xs font-mono">Password: Sijuade27#</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                This will create an admin user account with the following credentials:
              </p>
              <div className="rounded-lg bg-secondary p-3 space-y-1 text-xs">
                <p><strong>Email:</strong> oluwafemiod7@gmail.com</p>
                <p><strong>Password:</strong> Sijuade27#</p>
              </div>
              <Button onClick={setupAdmin} disabled={loading} className="w-full">
                {loading ? "Setting up..." : "Create Admin User"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Setup;
