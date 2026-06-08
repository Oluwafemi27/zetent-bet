import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Integration {
  name: string;
  description: string;
  fields: Array<{ label: string; placeholder: string }>;
}

const integrations: Record<string, Integration> = {
  payment: {
    name: "Payment Gateways",
    description: "Manage payment gateway integrations",
    fields: [
      { label: "API Key", placeholder: "Enter API key" },
      { label: "Secret Key", placeholder: "Enter secret key" },
      { label: "Merchant ID", placeholder: "Enter merchant ID" },
    ],
  },
  sms: {
    name: "SMS Provider",
    description: "Configure SMS notifications",
    fields: [
      { label: "API Key", placeholder: "Enter API key" },
      { label: "Sender ID", placeholder: "Enter sender ID" },
    ],
  },
  email: {
    name: "Email Service",
    description: "Setup email notifications",
    fields: [
      { label: "SMTP Host", placeholder: "smtp.example.com" },
      { label: "SMTP Port", placeholder: "587" },
      { label: "Username", placeholder: "username" },
      { label: "Password", placeholder: "password" },
    ],
  },
  analytics: {
    name: "Analytics",
    description: "Connect analytics services",
    fields: [
      { label: "Tracking ID", placeholder: "Enter tracking ID" },
      { label: "API Key", placeholder: "Enter API key" },
    ],
  },
};

const IntegrationsSettings = () => {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const openDialog = (key: string) => {
    setSelectedIntegration(key);
    setValues({});
    setIsOpen(true);
  };

  const handleSave = () => {
    toast({
      title: "Success",
      description: "Integration configured successfully",
    });
    setIsOpen(false);
    setSelectedIntegration(null);
  };

  const integration = selectedIntegration ? integrations[selectedIntegration] : null;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Integrations</h2>

      <div className="space-y-4">
        {Object.entries(integrations).map(([key, config]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="text-lg">{config.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{config.description}</p>
              <Button variant="outline" onClick={() => openDialog(key)}>
                Configure
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure {integration?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {integration?.fields.map((field, idx) => (
              <div key={idx}>
                <Label>{field.label}</Label>
                <Input
                  placeholder={field.placeholder}
                  type={field.label.toLowerCase().includes("password") ? "password" : "text"}
                  value={values[field.label] || ""}
                  onChange={(e) =>
                    setValues({ ...values, [field.label]: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
            ))}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Configuration</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntegrationsSettings;
