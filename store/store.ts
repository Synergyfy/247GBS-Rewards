import { configureStore } from '@reduxjs/toolkit';
import businessGeneral from './features/businessGeneral';
import businessContact from './features/businessContact';
import businessSocials from './features/businessSocials';
import businessLinks from './features/businessLink';
import campaing from './features/campaign';

export const store = configureStore({
  reducer: {
    businessGeneral,
    businessContact,
    businessSocials,
    businessLinks,
    campaing,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
