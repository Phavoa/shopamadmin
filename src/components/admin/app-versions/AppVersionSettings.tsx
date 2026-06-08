"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { format } from "date-fns";
import { Check, Clock, AlertTriangle, Play, RotateCcw } from "lucide-react";

import {
  useGetAppVersionPoliciesQuery,
  useDeployAppVersionPolicyMutation,
  useRollbackAppVersionPolicyMutation,
  useToggleMaintenanceModeMutation,
  AppVersionPolicy,
} from "@/api/appVersionsApi";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AppVersionSettingsProps {
  platform: "ios" | "android";
}

interface PolicyFormValues {
  latestBuildNumber: number;
  softUpdateBuildNumber: number;
  minimumSupportedBuildNumber: number;
  forceMessage: string;
  softMessage: string;
  storeUrl: string;
  bannerColor: string;
}

export function AppVersionSettings({ platform }: AppVersionSettingsProps) {
  const { data, isLoading, isFetching } = useGetAppVersionPoliciesQuery(platform);
  const [deployPolicy, { isLoading: isDeploying }] = useDeployAppVersionPolicyMutation();
  const [rollbackPolicy, { isLoading: isRollingBack }] = useRollbackAppVersionPolicyMutation();
  const [toggleMaintenance, { isLoading: isTogglingMaintenance }] = useToggleMaintenanceModeMutation();

  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [rollbackId, setRollbackId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PolicyFormValues>({
    defaultValues: {
      latestBuildNumber: 1,
      softUpdateBuildNumber: 1,
      minimumSupportedBuildNumber: 1,
      forceMessage: "This version of the app is no longer supported. Please update to continue.",
      softMessage: "A new version of ShopAm is available!",
      storeUrl: platform === "ios" ? "https://apps.apple.com/" : "https://play.google.com/",
      bannerColor: "#FF6B35",
    }
  });

  const rawData = data as any;
  const policies: AppVersionPolicy[] = Array.isArray(rawData) ? rawData : (rawData?.data || []);
  const activePolicy = policies.find(p => p.isActive);
  const isMaintenanceMode = activePolicy?.isMaintenanceMode || false;
  // If your backend returns a maintenance message inside uxMetadata or similar, you can extract it here.
  const currentMaintenanceMessage = "";

  React.useEffect(() => {
    if (currentMaintenanceMessage) {
      setMaintenanceMessage(currentMaintenanceMessage);
    }
  }, [currentMaintenanceMessage]);

  React.useEffect(() => {
    if (activePolicy) {
      reset({
        latestBuildNumber: activePolicy.latestBuildNumber,
        softUpdateBuildNumber: activePolicy.softUpdateBuildNumber,
        minimumSupportedBuildNumber: activePolicy.minimumSupportedBuildNumber,
        forceMessage: activePolicy.forceMessage,
        softMessage: activePolicy.softMessage,
        storeUrl: activePolicy.storeUrl,
        bannerColor: activePolicy.uxMetadata?.bannerColor || "#FF6B35",
      });
    }
  }, [activePolicy, reset]);

  const handleToggleMaintenance = async (checked: boolean) => {
    try {
      await toggleMaintenance({
        platform,
        isMaintenanceMode: checked,
        message: checked ? maintenanceMessage : undefined,
      }).unwrap();
      toast.success(`Maintenance mode turned ${checked ? "ON" : "OFF"}`);
    } catch (error) {
      toast.error("Failed to toggle maintenance mode");
    }
  };

  const onSubmitPolicy = async (values: PolicyFormValues) => {
    try {
      const payload = {
        platform,
        latestBuildNumber: Number(values.latestBuildNumber),
        softUpdateBuildNumber: Number(values.softUpdateBuildNumber),
        minimumSupportedBuildNumber: Number(values.minimumSupportedBuildNumber),
        forceMessage: values.forceMessage,
        softMessage: values.softMessage,
        storeUrl: values.storeUrl,
        uxMetadata: { bannerColor: values.bannerColor },
      };
      await deployPolicy(payload).unwrap();
      toast.success("New version policy deployed successfully");
    } catch (error) {
      toast.error("Failed to deploy policy");
    }
  };

  const handleRollback = async () => {
    if (!rollbackId) return;
    try {
      await rollbackPolicy(rollbackId).unwrap();
      toast.success("Successfully rolled back policy");
      setRollbackId(null);
    } catch (error) {
      toast.error("Failed to rollback policy");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading policies...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Maintenance Mode Card */}
      <Card className={`border-2 ${isMaintenanceMode ? "border-red-500" : "border-border"}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className={isMaintenanceMode ? "text-red-500" : "text-muted-foreground"} />
            Maintenance Mode ({platform.toUpperCase()})
          </CardTitle>
          <CardDescription>
            When active, all mobile users on this platform will be blocked and shown the maintenance screen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Maintenance Mode</Label>
              <div className="text-sm text-muted-foreground">
                Instantly lock out {platform} mobile clients.
              </div>
            </div>
            <Switch
              checked={isMaintenanceMode}
              onCheckedChange={handleToggleMaintenance}
              disabled={isTogglingMaintenance}
            />
          </div>
          <div className="space-y-2 pt-4">
            <Label htmlFor="maintenanceMessage">Custom Downtime Message</Label>
            <Input
              id="maintenanceMessage"
              placeholder="The app is currently under maintenance. Please try again later."
              value={maintenanceMessage}
              onChange={(e) => setMaintenanceMessage(e.target.value)}
              disabled={isTogglingMaintenance}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Deploy New Policy Form */}
        <div className="xl:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Deploy New Policy</CardTitle>
              <CardDescription>Set the minimum required versions to force updates.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmitPolicy)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Latest Build Number (Int)</Label>
                  <Input type="number" {...register("latestBuildNumber", { required: true })} />
                </div>
                <div className="space-y-2">
                  <Label>Soft Update Build Number (Int)</Label>
                  <Input type="number" {...register("softUpdateBuildNumber", { required: true })} />
                  <p className="text-xs text-muted-foreground">Builds below this see a dismissible banner.</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-red-600">Minimum Supported Build Number (Int)</Label>
                  <Input type="number" {...register("minimumSupportedBuildNumber", { required: true })} />
                  <p className="text-xs text-muted-foreground">Builds below this are LOCKED OUT.</p>
                </div>
                <div className="space-y-2">
                  <Label>Store URL</Label>
                  <Input {...register("storeUrl", { required: true })} />
                </div>
                <div className="space-y-2">
                  <Label>Soft Update Message</Label>
                  <Input {...register("softMessage", { required: true })} />
                </div>
                <div className="space-y-2">
                  <Label>Force Update Message</Label>
                  <Input {...register("forceMessage", { required: true })} />
                </div>
                <div className="space-y-2">
                  <Label>Banner Color (Hex)</Label>
                  <Input {...register("bannerColor")} />
                </div>
                <Button type="submit" className="w-full" disabled={isDeploying}>
                  {isDeploying ? "Deploying..." : "Deploy Policy"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Audit History Ledger */}
        <div className="xl:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Audit History Ledger
              </CardTitle>
              <CardDescription>
                Policies are append-only. You can roll back to any previous configuration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border opacity-90">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Latest</TableHead>
                      <TableHead>Min Supported</TableHead>
                      <TableHead>Deployed At</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {policies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                          No policies found. Deploy one above.
                        </TableCell>
                      </TableRow>
                    ) : (
                      policies.map((policy) => (
                        <TableRow key={policy.id} className={policy.isActive ? "bg-primary/5" : ""}>
                          <TableCell>
                            {policy.isActive ? (
                              <Badge className="bg-green-500 hover:bg-green-600 gap-1">
                                <Play className="w-3 h-3" /> Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground gap-1">
                                <Check className="w-3 h-3" /> Inactive
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="font-mono">{policy.latestBuildNumber}</TableCell>
                          <TableCell className="font-mono text-red-600">{policy.minimumSupportedBuildNumber}</TableCell>
                          <TableCell>{format(new Date(policy.createdAt), "MMM d, yyyy HH:mm")}</TableCell>
                          <TableCell className="text-right">
                            {!policy.isActive && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setRollbackId(policy.id)}
                                disabled={isRollingBack}
                                className="h-8 text-xs"
                              >
                                <RotateCcw className="w-3 h-3 mr-1" /> Rollback
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!rollbackId} onOpenChange={(open) => !open && setRollbackId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Rollback</DialogTitle>
            <DialogDescription>
              Are you sure you want to rollback to this previous version policy? This will instantly change the version gating requirements for all active mobile users.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRollbackId(null)} disabled={isRollingBack}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRollback} disabled={isRollingBack}>
              {isRollingBack ? "Rolling back..." : "Confirm Rollback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
