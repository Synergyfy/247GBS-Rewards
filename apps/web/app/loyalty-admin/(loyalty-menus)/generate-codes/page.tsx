'use client';

import React, { useState, useEffect } from 'react';
import { useGenerateBulkPoints, useGetCodes } from '@/services/hooks/reward/hook';
import { useGetCampaigns } from '@/services/hooks/campaign/hook';
import { toast } from 'sonner';
import { Loader2, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const GenerateCodesPage = () => {
  const [formData, setFormData] = useState({
    campaignId: '',
    points: 0,
    quantity: 1,
    expires: 'day',
    type: '1' // Defaulting to '1' as per previous context
  });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: campaigns, isLoading: isLoadingCampaigns } = useGetCampaigns();
  
  // Fetch codes for the selected campaign with pagination
  const { data: generatedCodesData, isLoading: isLoadingCodes, refetch: refetchCodes } = useGetCodes(formData.campaignId, page, limit);

  const generateMutation = useGenerateBulkPoints();

  // Reset page when campaign changes
  useEffect(() => {
    setPage(1);
  }, [formData.campaignId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.campaignId) {
      toast.error('Please select a campaign');
      return;
    }

    generateMutation.mutate(
      {
        ...formData,
        points: Number(formData.points),
        quantity: Number(formData.quantity)
      },
      {
        onSuccess: () => {
          toast.success('Codes generated successfully!');
          setFormData(prev => ({ ...prev, quantity: 1, points: 0 }));
          refetchCodes(); // Refresh the list
        },
        onError: (error: any) => {
           toast.error(error?.response?.data?.message || 'Failed to generate codes');
        }
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  // Helper to access data safely whether it's paginated or not (during transition)
  const codesList = generatedCodesData?.data || [];
  const totalPages = generatedCodesData?.totalPages || 1;

  return (
    <div className="p-6 max-w-6xl mx-auto mt-10 space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Generate Bulk Point Codes</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Campaign</label>
            <select
              name="campaignId"
              value={formData.campaignId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              disabled={isLoadingCampaigns}
            >
              <option value="">Select a Campaign</option>
              {campaigns?.map((campaign: any) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.title || campaign.name}
                </option>
              ))}
            </select>
            {isLoadingCampaigns && <p className="text-xs text-gray-500 mt-1">Loading campaigns...</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Points per Code</label>
              <input
                type="number"
                name="points"
                value={formData.points}
                onChange={handleChange}
                min="1"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiration</label>
            <select
              name="expires"
              value={formData.expires}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="hour">Hour</option>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={generateMutation.isPending}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Codes'
              )}
            </button>
          </div>
        </form>
      </div>

      {formData.campaignId && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Generated Codes</h2>
            <div className="flex items-center gap-4">
                <select 
                    value={limit} 
                    onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                    }}
                    className="p-1 border border-gray-300 rounded text-sm"
                >
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                </select>
                <button 
                    onClick={() => refetchCodes()}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    Refresh List
                </button>
            </div>
          </div>
          
          {isLoadingCodes ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : !codesList || codesList.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              No active codes found for this campaign.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="p-4 font-semibold text-gray-600">Code</th>
                    <th className="p-4 font-semibold text-gray-600">Points</th>
                    <th className="p-4 font-semibold text-gray-600">Expiry</th>
                    <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {codesList.map((item: any, index: number) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="p-4 font-mono font-medium text-gray-800">{item.code}</td>
                      <td className="p-4 text-gray-600">{item.points}</td>
                      <td className="p-4 text-gray-600">
                        {item.expiry ? format(new Date(item.expiry), 'PP p') : 'N/A'}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => copyToClipboard(item.code)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                          title="Copy Code"
                        >
                          {copiedCode === item.code ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination Controls */}
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing page <span className="font-medium">{page}</span> of{' '}
                        <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        
                        {/* Simplified Page Numbers */}
                         {[...Array(totalPages)].map((_, i) => {
                             // Show only a few pages around current page to avoid crowding
                             if (totalPages > 7 && (i + 1 !== 1 && i + 1 !== totalPages && Math.abs((i + 1) - page) > 1)) {
                                 if (i + 1 === 2 || i + 1 === totalPages - 1) return <span key={i} className="px-2 py-2 text-gray-400">...</span>
                                 return null;
                             }
                             
                             return (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    aria-current={page === i + 1 ? 'page' : undefined}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                        page === i + 1
                                            ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                             )
                         })}

                        <button
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GenerateCodesPage;
