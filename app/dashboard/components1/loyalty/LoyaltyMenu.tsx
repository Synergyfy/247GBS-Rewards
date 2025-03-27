import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import GeneralMenu from './GeneralMenu';
import ContentMenu from './ContentMenu';
import Rewards from './rewards';
import SettingsMenu from './SettingsMenu';

const LoyaltyMenu = () => {
  const TabMenu = ['general', 'rewards', 'settings', 'content', 'colors'];
  return (
    <Tabs defaultValue="general">
      <TabsList>
        {TabMenu.map((menu, i) => (
          <TabsTrigger value={menu} key={i}>
            <p className="text-black font-normal">{menu.toUpperCase()}</p>
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="general">
        <GeneralMenu />
      </TabsContent>
      <TabsContent value="settings">
        <SettingsMenu />
      </TabsContent>
      <TabsContent value="content">
        <ContentMenu />
      </TabsContent>
      <TabsContent value="rewards">
        <Rewards />
      </TabsContent>
    </Tabs>
  );
};

export default LoyaltyMenu;
