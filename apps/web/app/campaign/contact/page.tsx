'use client';

import React from 'react';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Phone, Mail, ArrowUpRight, MessageSquare, Globe } from "lucide-react";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function ContactUsPage() {
  const campaign = useSelector((state: RootState) => state.createCampaign);

  const contactMethods = [];

  if (campaign.contactPhoneNumber) {
    contactMethods.push({
      icon: Phone,
      title: 'Call Us',
      contact: campaign.contactPhoneNumber,
      link: `tel:${campaign.contactPhoneNumber.replace(/\D/g, '')}`,
      color: 'bg-blue-50 text-[#2D3DFF]'
    });
  }

  if (campaign.contactEmail) {
    contactMethods.push({
      icon: Mail,
      title: 'Email Us',
      contact: campaign.contactEmail,
      link: `mailto:${campaign.contactEmail}`,
      color: 'bg-purple-50 text-purple-600'
    });
  }

  // Adding a fallback/mock web link if customDomain is set
  if (campaign.customDomain) {
    contactMethods.push({
      icon: Globe,
      title: 'Visit Website',
      contact: campaign.customDomain,
      link: `https://${campaign.customDomain}`,
      color: 'bg-green-50 text-green-600'
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl text-[#2D3DFF] mb-4">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            {campaign.contactTitle || 'Get in Touch'}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {campaign.contactText || 'Have questions about rewards or points? We are here to help you make the most of your loyalty experience.'}
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid gap-6">
          {contactMethods.length > 0 ? (
            contactMethods.map((method, index) => (
              <a href={method.link} key={index} className="block group">
                <Card className="overflow-hidden bg-white border-2 border-transparent hover:border-[#2D3DFF]/20 shadow-md hover:shadow-2xl transition-all duration-500 rounded-3xl">
                  <CardContent className="p-8 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className={`${method.color} p-5 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                        <method.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-900 mb-1">{method.title}</CardTitle>
                        <p className="text-lg text-gray-500 font-medium">{method.contact}</p>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#2D3DFF] group-hover:text-white transition-all duration-500">
                      <ArrowUpRight className="h-6 w-6" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <Mail className="w-16 h-16 mx-auto mb-4 text-gray-200" />
              <p className="text-xl font-bold text-gray-900">No contact info set</p>
              <p className="text-gray-500 mt-2">The campaign organizer hasn't provided contact details yet.</p>
            </div>
          )}
        </div>

        {/* FAQ / Help Center Placeholder */}
        <div className="mt-12 p-8 bg-white rounded-3xl shadow-sm border border-gray-100 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Need immediate assistance?</h3>
          <p className="text-gray-500 mb-6">Check our frequently asked questions for quick answers.</p>
          <button className="text-[#2D3DFF] font-bold hover:underline">
            View Help Center
          </button>
        </div>
      </div>
    </div>
  );
}
