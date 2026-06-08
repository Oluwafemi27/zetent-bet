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
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const BonusRulesPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [minStake, setMinStake] = useState("");
  const [multiplier, setMultiplier] = useState("");
  const { toast } = useToast();

  const handleCreate = () => {
    if (!name.trim() || !minStake.trim() || !multiplier.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Bonus rule created successfully",
    });
    setName("");
    setMinStake("");
    setMultiplier("");
    setIsOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Bonus Rules</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Create Rule</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Bonus Rule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Rule Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Rollover Requirement"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="minStake">Minimum Stake (₦)</Label>
                <Input
                  id="minStake"
                  type="number"
                  placeholder="Enter minimum stake"
                  value={minStake}
                  onChange={(e) => setMinStake(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="multiplier">Multiplier</Label>
                <Input
                  id="multiplier"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 3.0"
                  value={multiplier}
                  onChange={(e) => setMultiplier(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bonus Rules</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center text-muted-foreground">
          <p>No bonus rules configured yet.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BonusRulesPage;
