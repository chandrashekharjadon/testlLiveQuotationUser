// store/serviceSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { calculation } from '../../util/pdfHelper';

const initialState = {

  serviceTypes: [],
  selectedService: null,

  methods: [],
  selectedMethod: null,

  methodsType: null,
  selectedMethodType: null,

  ResCat: [],
  ResCatOne: null,
  selectedResCat: null,

  Price: null,
  ShowPriceBtn: false,

  Addons: [],
  selectedAddons: null,
  AddonsItems: [],
  CustomAddons: [],
  CustomAddonsShow: false,
  AddonDiscount: [],


  Tools: [],
  selectedTools: null,
  ToolUp: [],
  ToolDiscounts: [],

  Page: 1,
  tempPage: null,
  Demand: 'Page',
  Currency: 'Rupee',
  Symbol: "₹",
  ShowDiscount: false,
  Test: false,
  PorA: true,

  Discount: 0,
  Discount2: 0,

  Gst: 18,

  calculationResult: {},
};

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    //for service..
    setServiceTypes: (state, action) => {
      state.serviceTypes = action.payload;
    },
    setSelectedService: (state, action) => {
      state.selectedService = action.payload;
    },
    //for Method..
    setMethods: (state, action) => {
      state.methods = action.payload;
    },
    setSelectedMethod: (state, action) => {
      state.selectedMethod = action.payload;
    },
    // for method type..
    setMethodsType: (state, action) => {
      state.methodsType = action.payload;
    },
    setSelectedMethodType: (state, action) => {
      state.selectedMethodType = action.payload;
    },

    // for Res_Cat type..
    setResCat: (state, action) => {
      state.ResCat = action.payload;
    },
    setResCatOne: (state, action) => {
      state.ResCatOne = action.payload;
    },
    setSelectedResCat: (state, action) => {
      state.selectedResCat = action.payload;
    },

    // price 
    setPrice: (state, action) => {
      state.Price = action.payload;
    },
    // updateprice 
    updatePriceData: (state, action) => {
      const { key, value } = action.payload;
      state.Price[key] = value;
    },
    // ShowPriceBtn 
    setShowPriceBtn: (state, action) => {
      state.ShowPriceBtn = action.payload;
    },

    // for Addons..
    setAddons: (state, action) => {
      state.Addons = action.payload;
    },
    setSelectedAddons: (state, action) => {
      state.selectedAddons = action.payload;
    },
    setAddonsItems: (state, action) => {
      state.AddonsItems = action.payload;
    },
    setCustomAddons: (state, action) => {
      state.CustomAddons = action.payload;
    },
    setCustomAddonsShow: (state, action) => {
      state.CustomAddonsShow = action.payload;
    },
    setAddonDiscount: (state, action) => {
      state.AddonDiscount = action.payload;
    },


    // for Tools..
    setTools: (state, action) => {
      state.Tools = action.payload;
    },
    
    setSelectedTools: (state, action) => {
      state.selectedTools = action.payload;
    },

    // tool up...
    setToolUp: (state, action) => {
      state.ToolUp = action.payload;
    },

    // ToolDiscounts...
    setToolDiscounts: (state, action) => {
      state.ToolDiscounts = action.payload;
    },

    // no of page...
    setPage: (state, action) => {
      state.Page = action.payload;
    },

    // tempage
    settempPage: (state, action) => {
      state.tempPage = action.payload;
    },

    // Demand
    setDemand: (state, action) => {
      state.Demand = action.payload;
    },

    // Currency  
    setCurrency: (state, action) => {
      state.Currency = action.payload;
      state.Gst = action.payload === 'Rupee' ? 18 : 0;
    },

    // Currency symbol
    setSymbol: (state, action) => {
      state.Symbol = action.payload;
    },

    // ShowDiscount
    setShowDiscount: (state, action) => {
      state.ShowDiscount = action.payload;
    },

    // Test checkbox
    setTest: (state, action) => {
      state.Test = action.payload;
    },

    // PorA checkbox
    setPorA: (state, action) => {
      state.PorA = action.payload;
    },

    // Discount
    setDiscount: (state, action) => {
      state.Discount = action.payload;
    },

    // Discount1
    setDiscount2: (state, action) => {
      state.Discount2 = action.payload;
    },

    // Gst
    setGst: (state, action) => {
      state.Gst = action.payload;
    },

    // calculationResult ....
    calculateAll: (state) => {
      const { Price, Currency, Discount, Discount2, Page, Demand, AddonsItems,CustomAddons, AddonDiscount, ToolUp, ToolDiscounts, Gst, PorA } = state;
      //  state.calculationResult = caltf(Page);
      state.calculationResult = calculation(Price, Currency, Discount, Discount2, Page, Demand, AddonsItems,CustomAddons, AddonDiscount, ToolUp, ToolDiscounts, Gst, PorA);
    },

    resetSelections: (state) => {
      state.selectedService = null;
      state.selectedMethod = null;
      state.methods = [];
    }
  },
});

export const {
  setServiceTypes,
  setSelectedService,
  setMethods,
  setSelectedMethod,
  setMethodsType,
  setSelectedMethodType,
  setResCat,
  setResCatOne,
  setSelectedResCat,
  setPrice,
  updatePriceData,
  setShowPriceBtn,
  setAddons,
  setSelectedAddons,
  setTools,
  setSelectedTools,
  setToolUp,
  setToolDiscounts,
  setPage,
  settempPage,
  setDemand,
  setCurrency,
  setSymbol,
  setShowDiscount,
  setTest,
  setPorA,
  setDiscount,
  setDiscount2,
  setGst,
  setAddonsItems,
  setCustomAddons,
  setCustomAddonsShow,
  setAddonDiscount,
  calculateAll,

  resetSelections,


} = serviceSlice.actions;

export default serviceSlice.reducer;
