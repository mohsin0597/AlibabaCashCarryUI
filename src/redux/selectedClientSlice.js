import { createSlice } from '@reduxjs/toolkit';

const selectedClientSlice = createSlice({
  name: 'selectedClient',
  initialState: {
    data: null
  },
  reducers: {
    setSelectedClient: (state, action) => {
      state.data = action.payload;
    },
    clearSelectedClient: (state) => {
      state.data = null;
    }
  }
});

export const { setSelectedClient, clearSelectedClient } = selectedClientSlice.actions;
export default selectedClientSlice.reducer;
