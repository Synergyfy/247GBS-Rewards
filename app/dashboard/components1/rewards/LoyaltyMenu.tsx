import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import GeneralMenu from './GeneralMenu';
import DateRange from './DateRange';
import Description from './description';

const LoyaltyMenu = () => {
  return (
    <div>
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="date-range">Date Range</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <GeneralMenu />
        </TabsContent>
        <TabsContent value="date-range">
          <DateRange />
        </TabsContent>
        <TabsContent value="description">
          <Description />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoyaltyMenu;
