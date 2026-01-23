'use client';

import React, { useState } from 'react';
import { useRedeemVoucher } from '@/services/hooks/useVouchers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Gift, Download, Key, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const RedeemPage = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<any>(null);
  
  const redeemMutation = useRedeemVoucher();

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    
    setResult(null);

    try {
      const data = await redeemMutation.mutateAsync(code);
      setResult(data);
      toast.success(data.message || "Redemption successful!");
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to redeem voucher. It may be invalid or expired.';
      toast.error(msg);
    }
  };

  const renderRewardContent = () => {
    if (!result) return null;

    if (result.type === 'LINK' && result.reward.url) {
        return (
            <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg bg-blue-50/50">
                <Download className="h-12 w-12 text-blue-600" />
                <div className="text-center">
                    <h4 className="font-semibold">Digital Download</h4>
                    <p className="text-sm text-gray-500">Your software is ready.</p>
                </div>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <a href={result.reward.url} target="_blank" rel="noopener noreferrer">
                        Download Now
                    </a>
                </Button>
            </div>
        );
    }

    if (result.type === 'CREDENTIALS') {
        return (
            <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
                <div className="flex items-center space-x-2 text-slate-700">
                    <Key className="h-5 w-5" />
                    <h4 className="font-semibold">Access Credentials</h4>
                </div>
                <div className="grid gap-3 text-sm">
                    <div className="flex justify-between items-center bg-white p-2 rounded border">
                        <span className="text-gray-500">Site:</span>
                        <a href={result.reward.site} target="_blank" className="text-blue-600 underline font-medium truncate max-w-[200px]">{result.reward.site}</a>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 rounded border">
                        <span className="text-gray-500">Username:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded font-mono">{result.reward.username}</code>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 rounded border">
                        <span className="text-gray-500">Password:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded font-mono">{result.reward.password}</code>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-50 rounded-lg border font-mono text-xs overflow-auto max-h-40">
            <pre>{JSON.stringify(result.reward, null, 2)}</pre>
        </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-blue-600">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit mb-2">
            <Gift className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Redeem Voucher</CardTitle>
          <CardDescription>
            Enter your code to unlock rewards, software, or access keys.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRedeem} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Voucher Code</Label>
              <Input 
                id="code"
                placeholder="PROV-XXXX-XXXX"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-center font-mono uppercase tracking-widest text-lg h-12"
                required
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base" disabled={redeemMutation.isPending || !code}>
              {redeemMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                </>
              ) : (
                'Redeem Code'
              )}
            </Button>
          </form>

          {result && (
            <div className="mt-8 animate-fade-text space-y-4">
                <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Code Validated!</span>
                </div>
                
                <Card className="border-dashed shadow-sm">
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase">Reward</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 px-4 pb-4">
                        {renderRewardContent()}
                    </CardContent>
                </Card>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-center border-t py-4 bg-gray-50/50 rounded-b-lg">
            <p className="text-xs text-gray-400">
                Having trouble? Contact support.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RedeemPage;
