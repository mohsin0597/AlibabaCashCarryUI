import { createSlice } from '@reduxjs/toolkit';
import { orders } from '../utils';

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {
    setOrders: (state, action) => {
      state.list = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateOrderField: (state, action) => {
      const { id, field, value } = action.payload;
      const order = state.list.find(o => o.id === id);
      if (order) {
        order[field] = value;
      }
    },
    addOrder: (state, action) => {
      // state.list.push(action.payload);
      state.list = action.payload.items;
    }
  }
});

export const { setOrders, updateOrderField, addOrder } = ordersSlice.actions;
export default ordersSlice.reducer;