
// store/companyDetailSlice.js
import { createSlice } from '@reduxjs/toolkit';

const companyDetailSlice = createSlice({
  name: 'companyDetail',
  initialState: {
    CompanyId: '',
    Name: '',
    logo: '',
    address: '',
    email: '',
    gst: '',
    allCompanyDetails: [],
  },
  reducers: {
    setCompanyId: (state, action) => {
      state.CompanyId = action.payload;
    },
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
    setCompGst: (state, action) => {
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
  setCompanyId,
  setName,
  setLogo,
  setAddress,
  setEmail,
  setCompGst,
  setAllCompanyDetails,
  reset,
} = companyDetailSlice.actions;

export default companyDetailSlice.reducer;
