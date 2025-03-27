import { CreateBusinessContact } from '@/app/interfaces/business.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CreateBusinessContact = {
  email: '',
  phoneNumber: '',
  city: '',
  postalCode: '',
  state: '',
  street: '',
  website: '',
};

const businessContactSlice = createSlice({
  name: 'businessContactSlice',
  initialState,
  reducers: {
    addContact: (state, action: PayloadAction<{ [x: string]: string }>) => {
      return { ...state, ...action.payload };
    },
    resetContact: () => initialState,
  },
});

export const { addContact, resetContact } = businessContactSlice.actions;
export default businessContactSlice.reducer;
