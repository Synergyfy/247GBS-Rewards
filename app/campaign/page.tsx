'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronLeft, ChevronRight, Calendar, Users, Zap } from 'lucide-react';
import { useGetCampaigns } from '@/services/hooks/campaign/hook';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingSpinner from '@/components/ui/Loading';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [sort, setSort] = useState<string>('DESC');
  const [page, setPage] = useState(1);
  const limit = 9;

  // Simple debounce
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch Campaigns - using local hook
  const { data: campaigns, isLoading } = useGetCampaigns(filterType === 'ALL' ? undefined : filterType);

  // Filter and Sort logic (since local hook might not support all on backend)
  const processedCampaigns = useMemo(() => {
    if (!campaigns) return [];

    let filtered = campaigns.filter(campaign =>
      campaign.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      campaign.business?.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return sort === 'DESC' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [campaigns, debouncedSearch, sort]);

  const totalPages = Math.ceil(processedCampaigns.length / limit);
  const paginatedCampaigns = processedCampaigns.slice((page - 1) * limit, page * limit);

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen pt-32">
        <div className="container mx-auto pt-10 pb-20 px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-4">
              Explore <span className="text-[#2D3DFF]">Campaigns</span>
            </h1>
            <p className="mt-4 text-xl text-gray-600 font-medium max-w-2xl mx-auto">
              Discover exclusive rewards and loyalty programs from the businesses you love.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-12 max-w-5xl mx-auto space-y-6">
            {/* Search Bar */}
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by campaign or business name..."
                className="w-full pl-12 pr-4 py-4 h-14 rounded-2xl bg-white shadow-sm border-gray-200 focus:ring-2 focus:ring-[#2D3DFF] focus:border-transparent transition-all text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Type Filter */}
              <Select onValueChange={setFilterType} value={filterType}>
                <SelectTrigger className="w-full bg-white h-14 rounded-2xl border-gray-200 shadow-sm text-gray-700 font-medium">
                  <SelectValue placeholder="Campaign Type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                  <SelectItem value="ALL">All Campaigns</SelectItem>
                  <SelectItem value="SEASONAL">Seasonal</SelectItem>
                  <SelectItem value="CO_BRANDED">Co-Branded</SelectItem>
                  <SelectItem value="PRESET">Preset</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Filter */}
              <Select onValueChange={setSort} value={sort}>
                <SelectTrigger className="w-full bg-white h-14 rounded-2xl border-gray-200 shadow-sm text-gray-700 font-medium">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                  <SelectItem value="DESC">Newest First</SelectItem>
                  <SelectItem value="ASC">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Campaign Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <LoadingSpinner />
              <p className="mt-4 text-gray-500 font-medium">Loading amazing campaigns...</p>
            </div>
          ) : (
            <>
              {paginatedCampaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedCampaigns.map((campaign) => (
                    <Card
                      key={campaign.id}
                      className="group overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] border border-gray-100 bg-white flex flex-col h-full ring-1 ring-gray-100/50"
                    >
                      {/* Banner Image */}
                      <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                        <Image
                          src={campaign.bannerUrl || campaign.headerImg || 'https://placehold.co/800x400?text=Campaign+Banner'}
                          alt={campaign.name || 'Campaign'}
                          layout="fill"
                          objectFit="cover"
                          className="group-hover:scale-110 transition-transform duration-700 brightness-[0.95]"
                          unoptimized
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Type Tag */}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#2D3DFF] text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm z-10 tracking-widest uppercase mb-2">
                          {campaign.type || 'Campaign'}
                        </div>
                      </div>

                      <CardContent className="p-8 flex flex-col flex-grow relative">
                        {/* Business Logo Circle Overlay */}
                        <div className="absolute -top-10 left-8">
                          <div className="relative h-16 w-16 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white transition-transform group-hover:-translate-y-1 duration-500">
                            {campaign.business?.profileImage ? (
                              <Image
                                src={campaign.business.profileImage}
                                alt={campaign.business.name || 'Business'}
                                layout="fill"
                                objectFit="cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-blue-50 text-[#2D3DFF] font-black text-xl">
                                {campaign.business?.name?.charAt(0).toUpperCase() || 'B'}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-8 mb-4">
                          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest block mb-1">
                            {campaign.business?.name || 'Partner Business'}
                          </span>
                          <h2 className="text-2xl font-black text-gray-900 group-hover:text-[#2D3DFF] transition-colors duration-300 leading-tight line-clamp-1">
                            {campaign.name}
                          </h2>
                        </div>

                        <div className="flex-grow">
                          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6 font-medium">
                            {campaign.campaignMessage || 'Unlock rewards and earn points today with this exclusive loyalty program.'}
                          </p>
                        </div>

                        {/* Info Row */}
                        <div className="flex items-center gap-4 mb-6 py-4 border-t border-gray-50">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                            <Zap className="w-4 h-4 text-amber-500" />
                            <span>{campaign.signupPoints || 0} Signup Bonus</span>
                          </div>
                          <div className="h-4 w-px bg-gray-200" />
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="capitalize">{campaign.audienceType || 'Public'}</span>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <Link href={`/campaign/${campaign.uniqueCode || campaign.id}`} className="mt-auto">
                          <Button className="w-full bg-gray-900 hover:bg-[#2D3DFF] text-white rounded-2xl py-7 text-base font-bold transition-all duration-300 shadow-xl shadow-gray-200 hover:shadow-[#2D3DFF]/20 transform active:scale-95 group-hover:-translate-y-1">
                            View Details
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-inner">
                  <Zap className="w-20 h-20 mx-auto mb-6 text-gray-200 animate-pulse" />
                  <h3 className="text-2xl font-black text-gray-900 mb-2">No campaigns found</h3>
                  <p className="text-gray-500 font-medium">Try adjusting your search or category filters to find more.</p>
                  <Button
                    onClick={() => { setSearchTerm(''); setFilterType('ALL'); }}
                    variant="link"
                    className="mt-4 text-[#2D3DFF] font-bold underline"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 mt-16 scale-110">
                  <Button
                    variant="outline"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="rounded-2xl h-12 w-12 p-0 border-gray-200 hover:bg-[#2D3DFF] hover:text-white transition-all shadow-sm"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 font-black text-lg">
                      {page}
                    </span>
                    <span className="text-gray-400 font-bold">
                      / {totalPages}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="rounded-2xl h-12 w-12 p-0 border-gray-200 hover:bg-[#2D3DFF] hover:text-white transition-all shadow-sm"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
