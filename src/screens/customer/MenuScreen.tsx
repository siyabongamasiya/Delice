import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MenuCard from "../../components/MenuCard";
import Spinner from "../../components/ui/Spinner";
import { Colors } from "../../constants/colors";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchMenu } from "../../store/slices/menuSlice";

const MenuScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { items, loading, error } = useAppSelector((state) => state.menu);
  const cart = useAppSelector((s) => s.cart);

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      // Refetch when returning to this tab to reflect recent admin changes
      dispatch(fetchMenu());
      return () => {};
    }, [dispatch]),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu</Text>
      {loading && <Spinner />}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MenuCard {...item} />}
        contentContainerStyle={{
          paddingBottom: (cart.items.length > 0 ? 180 : 32) + insets.bottom,
        }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() =>
          !loading ? <Text style={styles.empty}>No items available</Text> : null
        }
      />
      {cart.items.length > 0 && (
        <View style={[styles.footer, { paddingBottom: 16 + insets.bottom }]}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R{cart.total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={styles.placeOrderBtn}
            onPress={() => navigation.navigate("CartModal")}
            activeOpacity={0.9}
          >
            <Text style={styles.placeOrderText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  title: {
    color: "#D4AF37",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "center",
  },
  error: {
    color: "#ff4444",
    marginBottom: 8,
    alignSelf: "center",
  },
  empty: {
    color: "#fff",
    alignSelf: "center",
    marginTop: 32,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: "#000",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalLabel: { color: Colors.text, fontSize: 16 },
  totalValue: { color: Colors.primary, fontSize: 18, fontWeight: "bold" },
  placeOrderBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  placeOrderText: { color: "#000", fontWeight: "bold", fontSize: 16 },
});

export default MenuScreen;
