import { CreateBusinessLink } from '@/app/interfaces/business.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CreateBusinessLink[] = [];

const businessLinkSlice = createSlice({
  name: 'businessLinkSlice',
  initialState,
  reducers: {
    addLink: (state, action: PayloadAction<CreateBusinessLink>) => {
      const payload = action.payload;
      const link = state.find(item => item.text === payload.text);
      if (link) {
        link.url = payload.url;
      } else {
        state.push({ ...action.payload });
      }
    },

    addLinks: (state, action: PayloadAction<CreateBusinessLink[]>) => {
      const payload = action.payload;
      return payload;
    },

    resetLinks: () => initialState,
  },
});

export const { addLink, resetLinks, addLinks } = businessLinkSlice.actions;
export default businessLinkSlice.reducer;
