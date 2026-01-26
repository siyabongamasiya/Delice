import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import supabase from "../../api/supabase";

interface User {
  email: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  isTokenExpired: boolean;
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  user: null,
  loading: false,
  error: null,
  isTokenExpired: false,
};

// Async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });
    if (error) return rejectWithValue(error.message);
    const session = data.session;
    return {
      token: session?.access_token || null,
      refreshToken: session?.refresh_token || null,
      user: { email: data.user?.email || payload.email },
    };
  },
);

// Mock Google login/signup
export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async () => {
    await new Promise((r) => setTimeout(r, 300));
    return {
      token: "mock-token",
      refreshToken: "mock-refresh",
      user: { email: "google.user@example.com" },
    };
  },
);

export const signupWithGoogle = createAsyncThunk(
  "auth/signupWithGoogle",
  async () => {
    await new Promise((r) => setTimeout(r, 300));
    return {
      token: "mock-token",
      refreshToken: "mock-refresh",
      user: { email: "google.user@example.com" },
    };
  },
);

// Async thunk for signup
export const signup = createAsyncThunk(
  "auth/signup",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
    });
    if (error) return rejectWithValue(error.message);
    // If email confirmations are enabled, session may be null. We still return user email.
    const session = data.session;
    return {
      token: session?.access_token || null,
      refreshToken: session?.refresh_token || null,
      user: { email: data.user?.email || payload.email },
    };
  },
);

// Move extraReducers into createSlice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.isTokenExpired = false;
    },
    setToken(
      state,
      action: PayloadAction<{ token: string; refreshToken: string }>,
    ) {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setTokenExpired(state, action: PayloadAction<boolean>) {
      state.isTokenExpired = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
      })
      .addCase(signup.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginWithGoogle.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          state.user = action.payload.user;
        },
      )
      .addCase(loginWithGoogle.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signupWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        signupWithGoogle.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          state.user = action.payload.user;
        },
      )
      .addCase(signupWithGoogle.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  logout,
  setToken,
  setUser,
  setError,
  setLoading,
  setTokenExpired,
} = authSlice.actions;
export default authSlice.reducer;
