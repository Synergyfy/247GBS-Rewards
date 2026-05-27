import { configureStore } from '@reduxjs/toolkit';
import businessGeneral from './features/businessGeneral';
import businessContact from './features/businessContact';
import businessSocials from './features/businessSocials';
import businessLinks from './features/businessLink';
import createCampaign from './features/campaign';

export const store = configureStore({
  reducer: {
    businessGeneral,
    businessContact,
    businessSocials,
    businessLinks,
    createCampaign,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
