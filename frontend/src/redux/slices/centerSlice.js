import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import centerService from '../../services/centerService';

const initialState = {
  centers: [],
  selectedCenter: null,
  isLoading: false,
  isError: false,
  message: '',
};

export const getCenters = createAsyncThunk(
  'center/getAll',
  async (_, thunkAPI) => {
    try {
      return await centerService.getCenters();
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getCenter = createAsyncThunk(
  'center/getOne',
  async (id, thunkAPI) => {
    try {
      return await centerService.getCenter(id);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const centerSlice = createSlice({
  name: 'center',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
    setSelectedCenter: (state, action) => {
      state.selectedCenter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get centers
      .addCase(getCenters.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCenters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.centers = action.payload.data;
      })
      .addCase(getCenters.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCenter.fulfilled, (state, action) => {
        state.selectedCenter = action.payload.data;
      });
  },
});

export const { reset, setSelectedCenter } = centerSlice.actions;
export default centerSlice.reducer;
