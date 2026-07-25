import { CreateBusinessGeneral } from '@/app/interfaces/business.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CreateBusinessGeneral = {
  name: '',
  industry: '',
};

const businessGeneralSlice = createSlice({
  name: 'businessGeneralSlice',
  initialState,
  reducers: {
    addGeneral: (state, action: PayloadAction<{ [x: string]: string }>) => {
      return { ...state, ...action.payload };
    },

    resetGeneral: () => initialState,
  },
});

export const { addGeneral, resetGeneral } = businessGeneralSlice.actions;
export default businessGeneralSlice.reducer;
