import { CreateBusinessSocial } from '@/app/interfaces/business.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CreateBusinessSocial = {
  facebook: '',
  instagram: '',
  twitter: '',
  whatsapp: '',
};

const businessSocialSlice = createSlice({
  name: 'businessSocialSlice',
  initialState,
  reducers: {
    addSocial: (state, action: PayloadAction<{ [x: string]: string }>) => {
      return { ...state, ...action.payload };
    },
    resetSocial: () => initialState,
  },
});

export const { addSocial, resetSocial } = businessSocialSlice.actions;
export default businessSocialSlice.reducer;
