import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import GoldButton from "../../components/GoldButton";
import Spinner from "../../components/ui/Spinner";
import { Colors } from "../../constants/colors";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addMenuItem, updateMenuItem } from "../../store/slices/menuSlice";

const AdminEditMenuItemScreen = () => {
  const dispatch = useAppDispatch();
  const saving = useAppSelector((s) => s.menu.loading);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const existingItem = route?.params?.item as
    | {
        id: string;
        name: string;
        description: string;
        price: number;
        category: string;
        available: boolean;
        imageUrl: string | null;
      }
    | undefined;

  const isEdit = useMemo(() => !!existingItem?.id, [existingItem?.id]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("meals");
  const [description, setDescription] = useState("");
  const [available, setAvailable] = useState(true);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    if (!existingItem) return;
    setName(existingItem.name || "");
    setPrice(
      typeof existingItem.price === "number" ? String(existingItem.price) : "",
    );
    setCategory(existingItem.category || "meals");
    setDescription(existingItem.description || "");
    setAvailable(!!existingItem.available);
    setImageUri(existingItem.imageUrl || null);
  }, [existingItem]);

  const pickFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow photo library access.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!res.canceled) setImageUri(res.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow camera access.");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!res.canceled) setImageUri(res.assets[0].uri);
  };

  const onSave = async () => {
    const p = Number(price);
    if (!name || isNaN(p)) {
      Alert.alert("Invalid input", "Please enter name and a valid price.");
      return;
    }
    const action = isEdit
      ? await dispatch(
          updateMenuItem({
            id: existingItem!.id,
            changes: {
              name,
              price: p,
              category,
              description,
              available,
            },
            newImageUri: imageUri,
          }),
        )
      : await dispatch(
          addMenuItem({
            name,
            price: p,
            category,
            description,
            available,
            localImageUri: imageUri,
          }),
        );
    if ((action as any).error) {
      Alert.alert("Error", (action as any).payload || "Failed to save");
      return;
    }
    // @ts-ignore
    navigation.goBack();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <Text style={styles.title}>
        {isEdit ? "Edit Menu Item" : "Add Menu Item"}
      </Text>

      {saving && <Spinner />}

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Grilled Chicken"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
        placeholder="e.g. 129.99"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder="meals or drinks"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: "top" }]}
        value={description}
        onChangeText={setDescription}
        multiline
        placeholder="Optional description"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Availability</Text>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <TouchableOpacity
          onPress={() => setAvailable(true)}
          style={[styles.toggle, available && styles.toggleActive]}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.toggleText, available && styles.toggleTextActive]}
          >
            Available
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setAvailable(false)}
          style={[styles.toggle, !available && styles.toggleActive]}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.toggleText, !available && styles.toggleTextActive]}
          >
            Hidden
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.label, { marginTop: 16 }]}>Image</Text>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.preview} />
      ) : (
        <View
          style={[
            styles.preview,
            { alignItems: "center", justifyContent: "center" },
          ]}
        >
          <Text style={{ color: "#888" }}>No image selected</Text>
        </View>
      )}

      <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
        <GoldButton
          title="Pick from Gallery"
          onPress={pickFromLibrary}
          disabled={saving}
        />
        <GoldButton title="Take Photo" onPress={takePhoto} disabled={saving} />
      </View>

      <GoldButton
        title={isEdit ? "Update" : "Save"}
        onPress={onSave}
        disabled={saving}
        style={{ marginTop: 16 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  title: {
    color: Colors.primary,
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 12,
  },
  label: { color: Colors.primary, fontWeight: "600", marginTop: 12 },
  input: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    color: Colors.text,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 6,
  },
  toggle: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  toggleActive: { borderColor: Colors.primary },
  toggleText: { color: Colors.text },
  toggleTextActive: { color: Colors.primary, fontWeight: "600" },
  preview: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    backgroundColor: "#111",
    marginTop: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});

export default AdminEditMenuItemScreen;
