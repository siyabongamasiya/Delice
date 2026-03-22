import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Spinner from "../../components/ui/Spinner";
import { Colors } from "../../constants/colors";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  deleteMenuItem,
  fetchMenu,
  toggleAvailability,
} from "../../store/slices/menuSlice";

const AdminMenuItemsScreen = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.menu);
  const navigation = useNavigation<any>();

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  const confirmDelete = (id: string, name: string) => {
    Alert.alert("Delete Item", `Are you sure you want to delete "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => dispatch(deleteMenuItem(id)),
      },
    ]);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu Items</Text>
      {loading && <Spinner />}
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.row, !item.available && { opacity: 0.6 }]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("AdminEditMenuItem", { item })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>
                {item.category} • R{item.price.toFixed(2)}
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.tag}
                activeOpacity={0.8}
                onPress={() =>
                  dispatch(
                    toggleAvailability({
                      id: item.id,
                      available: !item.available,
                    }),
                  )
                }
              >
                <Text style={styles.tagText}>
                  {item.available ? "Available" : "Hidden"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => confirmDelete(item.id, item.name)}
                activeOpacity={0.85}
              >
                <Ionicons name="trash-outline" size={16} color="#ef4444" />
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
      <TouchableOpacity
        style={styles.addBtn}
        activeOpacity={0.85}
        onPress={() => navigation.navigate("AdminEditMenuItem")}
      >
        <Text style={styles.addText}>+ Add Item</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  title: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
  },
  name: { color: Colors.text, fontWeight: "bold", fontSize: 16 },
  meta: { color: Colors.text, opacity: 0.85, marginTop: 2 },
  actions: { flexDirection: "row", alignItems: "center", gap: 8 },
  tag: {
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: { color: Colors.primary, fontWeight: "600" },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#ef4444",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  deleteText: { color: "#ef4444", fontWeight: "600" },
  addBtn: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: Colors.primary,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addText: { color: "#000", fontWeight: "bold" },
});

export default AdminMenuItemsScreen;
