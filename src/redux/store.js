import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import ordersReducer from './orderSlice';
import clientsReducer from './clientSlice';
import selectedClientReducer from './selectedClientSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
    clients: clientsReducer,
    selectedClient: selectedClientReducer
  },
});