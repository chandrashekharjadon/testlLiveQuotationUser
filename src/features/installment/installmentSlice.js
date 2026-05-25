// store/installmentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const getNextMonthDate = () => {
  const today = new Date();
  today.setMonth(today.getMonth() + 1);
  return today.toISOString(); // optional: return in ISO format
};

const initialState = {
  
  // Installment
  Times: 1,
  Installments: [],
  Text: [''],
  Gst2: 0,
  Net: 0,
  InstallmentTotal: 0,
  MainTotal: 0,
  SelectedDate: getNextMonthDate(),
  Remark: '',
  InstallmentData: [],
};

const installmentSlice = createSlice({
  name: 'installment',
  initialState,
  reducers: {
    // Times
    setTimes: (state, action) => {
      state.Times = action.payload;
    },

    // Installments
    setInstallments: (state, action) => {
      state.Installments = action.payload;
    },

    // Gst2
    setGst2: (state, action) => {
      state.Gst2 = action.payload;
    },

    // Text
    setText: (state, action) => {
      state.Text = action.payload;
    },

    //Net total
    setNet: (state, action) => {
      state.Net = action.payload;
    },

    //Installmenttotal
    setInstallmentTotal: (state, action) => {
      state.InstallmentTotal = action.payload;
    },

    //MainTotal
    setMainTotal: (state, action) => {
      state.MainTotal = action.payload;
    },

    //SelectedDate
    setSelectedDate: (state, action) => {
      state.SelectedDate = action.payload;
    },

    // remark 
    setRemark: (state, action) => {
      state.Remark = action.payload;
    },

    //InstallmentData
    setInstallmentData: (state, action) => {
      state.InstallmentData = action.payload;
    },


    resetSelections: (state) => {
      state.selectedService = null;
      state.selectedMethod = null;
      state.methods = [];
    }
  },
});

export const {
  setTimes,
  setInstallments,
  setGst2,
  setText,
  setNet,
  setInstallmentTotal,
  setMainTotal,
  setSelectedDate,
  setRemark,
  setInstallmentData,
  resetSelections,

} = installmentSlice.actions;

export default installmentSlice.reducer;
