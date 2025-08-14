import { createSlice } from '@reduxjs/toolkit';
import { clients } from '../utils';

const clientsSlice = createSlice({
  name: 'clients',
  initialState: {
    list: clients,
    loading: false,
    error: null
  },
  reducers: {
    setClients: (state, action) => {
      state.list = action.payload;
    },
    addClient: (state, action) => {
      state.list.push(action.payload);
    },
    updateClient(state, action) {
      const updatedClient = action.payload;
      const index = state.list.findIndex(c => c.code === updatedClient.code);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...updatedClient };
      }
    },
    deleteClient(state, action) {
      state.list = state.list.filter(c => c.code !== action.payload);
    }
  }
});

export const { setClients, addClient, updateClient } = clientsSlice.actions;
export default clientsSlice.reducer;