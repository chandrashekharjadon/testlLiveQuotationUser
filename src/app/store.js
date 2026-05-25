import { configureStore } from '@reduxjs/toolkit'
import serviceReducer from '../features/service/serviceSlice';
import installmentReducer from '../features/installment/installmentSlice';
import userDataReducer from '../features/userData/userDataSlice';
import pdfDownloadReducer from '../features/Pdfdownload/pdfDownloadSlice';

import { setupListeners } from '@reduxjs/toolkit/query'
import { serviceApi } from '../services/servicedata'
import { crmApi } from '../services/crmapidata'

export const store = configureStore({
  reducer: {
    service: serviceReducer,
    installment: installmentReducer,
    userData: userDataReducer,
    pdfDownload: pdfDownloadReducer,
    [serviceApi.reducerPath]: serviceApi.reducer,
    [crmApi.reducerPath]: crmApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(serviceApi.middleware).concat(crmApi.middleware),
})

setupListeners(store.dispatch)