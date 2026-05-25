
// store/pdfDownloadSlice.js
import { createSlice } from '@reduxjs/toolkit';

const pdfDownloadSlice = createSlice({
  name: 'pdfDownload',
  initialState: {
    otp: '',
    Pin: '',
    shouldFocus: false,
    TandE: [],
    Desc: {},
    Loader: false,
  },
  reducers: {
    setOtp: (state, action) => {
      state.otp = action.payload;
    },
    setPin: (state, action) => {
      state.Pin = action.payload;
    },
    setShouldFocus: (state, action) => {
      state.shouldFocus = action.payload;
    },
    setTandE: (state, action) => {
      state.TandE = action.payload;
    },
    setDesc: (state, action) => {
      state.Desc = action.payload;
    },
    setLoader: (state, action) => {
      state.Loader = action.payload;
    },
    clearOtp: (state) => {
      state.otp = '';
    },
    reset: (state) => {
      state.otp = '';
      state.Pin = '';
      state.shouldFocus = false;
      state.TandE = [];
      state.Desc = {};
      state.Loader = false;
    },
  },
});

export const {
  setOtp,
  setPin,
  setShouldFocus,
  setTandE,
  setDesc,
  setLoader,
  clearOtp,
  reset,
} = pdfDownloadSlice.actions;
export default pdfDownloadSlice.reducer;
