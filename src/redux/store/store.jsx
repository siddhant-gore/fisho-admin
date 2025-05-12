
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../slices/apiSlice';
import authReducer from '../slices/authSlice';

const rootReducer = combineReducers({
  auth: authReducer,
   
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

export const setupStore = preloadedState => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    preloadedState
  })
};

export default store;
