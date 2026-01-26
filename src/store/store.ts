import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  PersistConfig,
  createTransform,
  persistReducer,
  persistStore,
} from "redux-persist";
// Import slices below
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import menuReducer from "./slices/menuSlice";
import ordersReducer from "./slices/ordersSlice";
import settingsReducer from "./slices/settingsSlice";
import userReducer from "./slices/userSlice";

const authPersistTransform = createTransform(
  // inbound: state being persisted
  (inboundState: any, key) => {
    if (key !== "auth" || !inboundState) return inboundState;
    const { loading, error, isTokenExpired, ...rest } = inboundState;
    return { ...rest, loading: false, error: null, isTokenExpired: false };
  },
  // outbound: state being rehydrated
  (outboundState: any, key) => {
    if (key !== "auth" || !outboundState) return outboundState;
    const { loading, error, isTokenExpired, ...rest } = outboundState;
    return { ...rest, loading: false, error: null, isTokenExpired: false };
  },
  { whitelist: ["auth"] },
);

const rootPersistConfig: PersistConfig<any> = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "user", "settings"],
  blacklist: ["cart", "menu", "orders"],
  transforms: [authPersistTransform],
  timeout: 0,
};

const rootReducer = combineReducers({
  auth: authReducer,
  menu: menuReducer,
  cart: cartReducer,
  orders: ordersReducer,
  settings: settingsReducer,
  user: userReducer,
});

const persistedReducer = persistReducer(rootPersistConfig as any, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
