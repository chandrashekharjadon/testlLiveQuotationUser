
// store/companyDetailSlice.js
import { createSlice } from '@reduxjs/toolkit';

const companyDetailSlice = createSlice({
  name: 'companyDetail',
  initialState: {
    Name: '',
    logo: '',
    address: '',
    email: '',
    gst: '',
    allCompanyDetails: [],
  },
  reducers: {
    setName: (state, action) => {
      state.Name = action.payload;
    },
    setLogo: (state, action) => {
      state.logo = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setGst: (state, action) => {
      state.gst = action.payload;
    },
    setAllCompanyDetails: (state, action) => {
      state.allCompanyDetails = action.payload;
    },
    reset: (state) => {
      state.Name = '';
      state.logo = '';
      state.address = '';
      state.email = '';
      state.gst = '';
      state.allCompanyDetails = [];
    },
  },
});

export const {
  setName,
  setLogo,
  setAddress,
  setEmail,
  setGst,
  setAllCompanyDetails,
  reset,
} = companyDetailSlice.actions;

export default companyDetailSlice.reducer;
