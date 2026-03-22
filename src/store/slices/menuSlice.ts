import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system/legacy";
import supabase from "../../api/supabase";

const base64ToUint8Array = (base64: string): Uint8Array => {
  const g: any = globalThis as any;
  const atobFn = g.atob as ((b64: string) => string) | undefined;
  if (!atobFn) {
    throw new Error("Missing base64 decoder (atob) in this environment");
  }
  const binary = atobFn(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const guessImageMime = (uri: string): { mime: string; ext: string } => {
  const clean = uri.split("?")[0];
  const m = clean.match(/\.([a-zA-Z0-9]+)$/);
  const ext = (m?.[1] || "jpg").toLowerCase();
  switch (ext) {
    case "png":
      return { mime: "image/png", ext: "png" };
    case "webp":
      return { mime: "image/webp", ext: "webp" };
    case "heic":
      return { mime: "image/heic", ext: "heic" };
    case "jpeg":
    case "jpg":
    default:
      return { mime: "image/jpeg", ext: "jpg" };
  }
};

const readImageBytes = async (
  uri: string,
): Promise<{
  bytes: Uint8Array;
  mime: string;
  ext: string;
}> => {
  const { mime, ext } = guessImageMime(uri);
  const b64 = await FileSystem.readAsStringAsync(uri, {
    encoding: "base64" as any,
  });
  return { bytes: base64ToUint8Array(b64), mime, ext };
};

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  available: boolean;
  category: string;
}

type MenuRow = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  available: boolean;
  image_url: string | null;
  created_at?: string;
  updated_at?: string;
};

const mapRowToItem = (r: MenuRow): MenuItem => ({
  id: r.id,
  name: r.name,
  description: r.description || "",
  price: Number(r.price),
  imageUrl: r.image_url,
  available: !!r.available,
  category: r.category || "",
});

export const fetchMenu = createAsyncThunk<
  MenuItem[],
  void,
  { rejectValue: string }
>("menu/fetchMenu", async (_, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from("menu_items")
    .select("id,name,description,price,category,available,image_url")
    .order("created_at", { ascending: false });
  console.log("Here", data);
  if (error) return rejectWithValue(error.message);
  return (data || []).map(mapRowToItem);
});

type AddPayload = {
  name: string;
  description?: string;
  price: number;
  category: string;
  available?: boolean;
  localImageUri?: string | null;
};

export const addMenuItem = createAsyncThunk<
  MenuItem,
  AddPayload,
  { rejectValue: string }
>("menu/addMenuItem", async (payload, { rejectWithValue }) => {
  try {
    let image_url: string | null = null;
    if (payload.localImageUri) {
      const { bytes, mime, ext } = await readImageBytes(payload.localImageUri);
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(path, bytes, {
          contentType: mime,
          upsert: false,
        });
      if (uploadError) return rejectWithValue(uploadError.message);
      const { data: pub } = supabase.storage
        .from("menu-images")
        .getPublicUrl(path);
      image_url = pub.publicUrl;
    }

    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        name: payload.name,
        description: payload.description ?? null,
        price: payload.price,
        category: payload.category,
        available: payload.available ?? true,
        image_url,
      })
      .select("id,name,description,price,category,available,image_url")
      .single();

    if (error || !data)
      return rejectWithValue(error?.message || "Failed to add");
    return mapRowToItem(data as MenuRow);
  } catch (e: any) {
    return rejectWithValue(e.message || "Failed to add");
  }
});

type UpdatePayload = {
  id: string;
  changes: Partial<
    Pick<MenuItem, "name" | "description" | "price" | "category" | "available">
  >;
  newImageUri?: string | null;
};

export const updateMenuItem = createAsyncThunk<
  MenuItem,
  UpdatePayload,
  { rejectValue: string }
>(
  "menu/updateMenuItem",
  async ({ id, changes, newImageUri }, { rejectWithValue }) => {
    try {
      let image_url_field: string | undefined;
      const shouldUploadImage =
        !!newImageUri && !/^https?:\/\//i.test(String(newImageUri));
      if (shouldUploadImage) {
        const { bytes, mime, ext } = await readImageBytes(newImageUri);
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("menu-images")
          .upload(path, bytes, {
            contentType: mime,
            upsert: true,
          });
        if (uploadError) return rejectWithValue(uploadError.message);
        const { data: pub } = supabase.storage
          .from("menu-images")
          .getPublicUrl(path);
        image_url_field = pub.publicUrl;
      }

      const updateObj: any = {
        ...("name" in changes ? { name: changes.name } : {}),
        ...("description" in changes
          ? { description: changes.description ?? null }
          : {}),
        ...("price" in changes ? { price: changes.price } : {}),
        ...("category" in changes ? { category: changes.category } : {}),
        ...("available" in changes ? { available: changes.available } : {}),
      };
      if (image_url_field !== undefined) updateObj.image_url = image_url_field;

      const { data, error } = await supabase
        .from("menu_items")
        .update(updateObj)
        .eq("id", id)
        .select("id,name,description,price,category,available,image_url")
        .single();
      if (error || !data)
        return rejectWithValue(error?.message || "Failed to update");
      return mapRowToItem(data as MenuRow);
    } catch (e: any) {
      return rejectWithValue(e.message || "Failed to update");
    }
  },
);

export const deleteMenuItem = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("menu/deleteMenuItem", async (id, { rejectWithValue }) => {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) return rejectWithValue(error.message);
  return id;
});

export const toggleAvailability = createAsyncThunk<
  { id: string; available: boolean },
  { id: string; available: boolean },
  { rejectValue: string }
>("menu/toggleAvailability", async ({ id, available }, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from("menu_items")
    .update({ available })
    .eq("id", id)
    .select("id,available")
    .single();
  if (error || !data)
    return rejectWithValue(error?.message || "Failed to toggle");
  return { id: data.id, available: data.available };
});

interface MenuState {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
  lastFetched: number;
  cacheValid: boolean;
}

const initialState: MenuState = {
  items: [],
  loading: false,
  error: null,
  lastFetched: 0,
  cacheValid: false,
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenu(state, action: PayloadAction<MenuItem[]>) {
      state.items = action.payload;
      state.lastFetched = Date.now();
      state.cacheValid = true;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    invalidateCache(state) {
      state.cacheValid = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMenu.fulfilled,
        (state, action: PayloadAction<MenuItem[]>) => {
          state.loading = false;
          state.items = action.payload;
          state.lastFetched = Date.now();
          state.cacheValid = true;
        },
      )
      .addCase(fetchMenu.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addMenuItem.fulfilled,
        (state, action: PayloadAction<MenuItem>) => {
          state.loading = false;
          state.items.unshift(action.payload);
        },
      )
      .addCase(addMenuItem.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateMenuItem.fulfilled,
        (state, action: PayloadAction<MenuItem>) => {
          state.loading = false;
          const idx = state.items.findIndex((i) => i.id === action.payload.id);
          if (idx !== -1) state.items[idx] = action.payload;
        },
      )
      .addCase(updateMenuItem.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteMenuItem.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.items = state.items.filter((i) => i.id !== action.payload);
        },
      )
      .addCase(deleteMenuItem.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        toggleAvailability.fulfilled,
        (state, action: PayloadAction<{ id: string; available: boolean }>) => {
          state.loading = false;
          const item = state.items.find((i) => i.id === action.payload.id);
          if (item) item.available = action.payload.available;
        },
      )
      .addCase(toggleAvailability.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setMenu, setLoading, setError, invalidateCache } =
  menuSlice.actions;
export default menuSlice.reducer;
