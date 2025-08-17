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
    setSelectedClientRemaining: (state, action) => {
      if (state.data) {
      state.data.totalPendingBalance = action.payload;
    }
    },
    clearSelectedClient: (state) => {
      state.data = null;
    }
  }
});

export const { setSelectedClient, setSelectedClientRemaining, clearSelectedClient } = selectedClientSlice.actions;
export default selectedClientSlice.reducer;
