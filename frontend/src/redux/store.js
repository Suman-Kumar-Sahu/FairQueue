import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import slotReducer from './slices/slotSlice';
import centerReducer from './slices/centerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    slot: slotReducer,
    center: centerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['slot/setSelectedDate'],
        ignoredPaths: ['slot.selectedDate'],
      },
    }),
});