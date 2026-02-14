import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import slotService from '../../services/slotService';

const initialState = {
  slots: [],
  selectedSlot: null,
  selectedDate: new Date().toISOString().split('T')[0],
  alternatives: [],
  slotSummary: null,
  isLoading: false,
  isError: false,
  message: '',
};

// Get slots
export const getSlots = createAsyncThunk(
  'slot/getSlots',
  async ({ centerId, date }, thunkAPI) => {
    try {
      return await slotService.getSlots(centerId, date);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get alternative slots
export const getAlternatives = createAsyncThunk(
  'slot/getAlternatives',
  async (slotId, thunkAPI) => {
    try {
      return await slotService.getAlternatives(slotId);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get slot summary
export const getSlotSummary = createAsyncThunk(
  'slot/getSummary',
  async ({ centerId, date }, thunkAPI) => {
    try {
      return await slotService.getSlotSummary(centerId, date);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const slotSlice = createSlice({
  name: 'slot',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
    setSelectedSlot: (state, action) => {
      state.selectedSlot = action.payload;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    clearAlternatives: (state) => {
      state.alternatives = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get slots
      .addCase(getSlots.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSlots.fulfilled, (state, action) => {
        state.isLoading = false;
        state.slots = action.payload.data;
      })
      .addCase(getSlots.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get alternatives
      .addCase(getAlternatives.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAlternatives.fulfilled, (state, action) => {
        state.isLoading = false;
        state.alternatives = action.payload.alternatives;
      })
      .addCase(getAlternatives.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get summary
      .addCase(getSlotSummary.fulfilled, (state, action) => {
        state.slotSummary = action.payload.data;
      });
  },
});

export const { reset, setSelectedSlot, setSelectedDate, clearAlternatives } =
  slotSlice.actions;
export default slotSlice.reducer;