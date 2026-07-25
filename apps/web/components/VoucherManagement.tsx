'use client';

import React, { useState } from 'react';
import { VoucherType } from '@/services/voucher.service';
import { useLoyaltyTiers, useMallTiers } from '@/services/hooks/useTiers';
import { useVouchers, useGenerateVouchers } from '@/services/hooks/useVouchers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner"; 

const VoucherManagement = () => {
  // Data Hooks
  const { 
      data: loyaltyTiers = [], 
      isLoading: loadingLoyalty,
      refetch: refetchLoyalty 
  } = useLoyaltyTiers();

  const { 
      data: mallTiers = [], 
      isLoading: loadingMall,
      refetch: refetchMall 
  } = useMallTiers();

  const {
      data: vouchers = [],
      isLoading: loadingVouchers,
      refetch: refetchVouchers
  } = useVouchers();

  const generateVoucherMutation = useGenerateVouchers();

  // Form State
  const [type, setType] = useState<VoucherType>(VoucherType.MCOM_LOYALTY_TIER);
  const [count, setCount] = useState(10);
  const [validityDays, setValidityDays] = useState(30);
  
  // Dynamic Config State
  const [selectedTierId, setSelectedTierId] = useState("");
  const [durationDays, setDurationDays] = useState(30);
  const [url, setUrl] = useState("");
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build the specific config object based on type
    let config: any = {};

    if (type === VoucherType.MCOM_LOYALTY_TIER || type === VoucherType.MCOM_MALL_TIER) {
        if (!selectedTierId) {
            toast.error("Please select a tier");
            return;
        }
        config = { tierId: selectedTierId, durationDays: Number(durationDays) };
    } 
    else if (type === VoucherType.LINK) {
        if (!url) {
            toast.error("Please enter a URL");
            return;
        }
        config = { url };
    }
    else if (type === VoucherType.CREDENTIALS) {
        config = { site, username, password };
    }
    else if (type === VoucherType.MCOM_BUNDLE) {
        config = { 
            loyalty: { tierId: selectedTierId, durationDays }, 
            mall: { tierId: selectedTierId, durationDays } 
        };
    }

    try {
      await generateVoucherMutation.mutateAsync({
        type,
        count: Number(count),
        validityDays: Number(validityDays),
        config
      });
      toast.success("Vouchers generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate vouchers");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Code copied!");
  };

  const formatVoucherType = (t: string) => {
    return t.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()).replace('Mcom', 'MCom');
  };

  // Render Helpers
  const renderTierSelect = (source: 'loyalty' | 'mall') => {
      const tiers = source === 'loyalty' ? loyaltyTiers : mallTiers;
      const loading = source === 'loyalty' ? loadingLoyalty : loadingMall;
      const label = source === 'loyalty' ? 'Loyalty Tier' : 'Mall Tier';

      return (
          <div className="space-y-2">
              <Label>{label}</Label>
              <Select value={selectedTierId} onValueChange={setSelectedTierId}>
                  <SelectTrigger>
                      <SelectValue placeholder={loading ? "Loading..." : `Select ${label}`} />
                  </SelectTrigger>
                  <SelectContent>
                      {tiers.length === 0 && !loading && (
                          <div className="p-2 text-xs text-red-500 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" /> No tiers found
                          </div>
                      )}
                      {tiers.map((t: any) => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
              {tiers.length === 0 && !loading && (
                  <Button type="button" variant="link" size="sm" onClick={() => source === 'loyalty' ? refetchLoyalty() : refetchMall()} className="h-auto p-0 text-xs">
                      Retry Fetching
                  </Button>
              )}
          </div>
      );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-500">Voucher Management</CardTitle>
        <CardDescription>Generate and manage redemption codes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border rounded-lg bg-gray-50/50">
          
          {/* 1. Common Fields */}
          <div className="space-y-2">
            <Label>Voucher Type</Label>
            <Select value={type} onValueChange={(val) => {
                setType(val as VoucherType);
                setSelectedTierId(""); // Reset tier selection on type change
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(VoucherType).map(t => (
                  <SelectItem key={t} value={t}>{formatVoucherType(t)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" min={1} value={count} onChange={(e) => setCount(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
                <Label>Validity (Days)</Label>
                <Input type="number" min={1} value={validityDays} onChange={(e) => setValidityDays(Number(e.target.value))} />
            </div>
          </div>

          {/* 2. Dynamic Fields based on Type */}
          <div className="md:col-span-2 border-t pt-4 mt-2">
              <h4 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider">Reward Configuration</h4>
              
              {/* Scenario A: Loyalty Tier */}
              {type === VoucherType.MCOM_LOYALTY_TIER && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderTierSelect('loyalty')}
                      <div className="space-y-2">
                          <Label>Duration (Days)</Label>
                          <Input type="number" value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))} />
                      </div>
                  </div>
              )}

              {/* Scenario B: Mall Tier */}
              {type === VoucherType.MCOM_MALL_TIER && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderTierSelect('mall')}
                      <div className="space-y-2">
                          <Label>Duration (Days)</Label>
                          <Input type="number" value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))} />
                      </div>
                  </div>
              )}

              {/* Scenario C: Bundle (Simplistic) */}
              {type === VoucherType.MCOM_BUNDLE && (
                  <div className="space-y-4">
                      <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded border border-blue-200">
                          <strong>Note:</strong> This bundle uses the <em>same</em> Tier ID for both platforms. Ensure matching Tiers exist or update logic.
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {renderTierSelect('loyalty')} 
                          <div className="space-y-2">
                              <Label>Duration (Days)</Label>
                              <Input type="number" value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))} />
                          </div>
                      </div>
                  </div>
              )}

              {/* Scenario D: Link */}
              {type === VoucherType.LINK && (
                  <div className="space-y-2">
                      <Label>Download / Access URL</Label>
                      <Input placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
                  </div>
              )}

              {/* Scenario E: Credentials */}
              {type === VoucherType.CREDENTIALS && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                          <Label>Site URL</Label>
                          <Input placeholder="https://..." value={site} onChange={(e) => setSite(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                          <Label>Username</Label>
                          <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                          <Label>Password</Label>
                          <Input value={password} onChange={(e) => setPassword(e.target.value)} />
                      </div>
                  </div>
              )}
          </div>

          <div className="md:col-span-2 flex justify-end mt-4">
            <Button type="submit" disabled={generateVoucherMutation.isPending} className="w-full md:w-auto">
              {generateVoucherMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {generateVoucherMutation.isPending ? 'Generating...' : 'Generate Batch'}
            </Button>
          </div>
        </form>

        {/* List Table */}
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-500">Generated Vouchers</h3>
                <Button variant="outline" size="sm" onClick={() => refetchVouchers()} disabled={loadingVouchers}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${loadingVouchers ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Expires</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loadingVouchers && vouchers.length === 0 && <TableRow><TableCell colSpan={5} className="h-24 text-center">Loading...</TableCell></TableRow>}
                        {!loadingVouchers && vouchers.length === 0 && <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No vouchers found.</TableCell></TableRow>}
                        {vouchers.map((v: any) => (
                            <TableRow key={v.id}>
                                <TableCell className="font-mono font-medium">{v.code}</TableCell>
                                <TableCell>{formatVoucherType(v.type)}</TableCell>
                                <TableCell>
                                    <Badge variant={v.isRedeemed ? "destructive" : "default"} className={!v.isRedeemed ? "bg-green-600 hover:bg-green-700" : ""}>{v.isRedeemed ? 'Redeemed' : 'Active'}</Badge>
                                </TableCell>
                                <TableCell>{new Date(v.expiresAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(v.code)}><Copy className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoucherManagement;
