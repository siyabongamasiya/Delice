import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Spinner from "../../components/ui/Spinner";
import { Colors } from "../../constants/colors";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchMyOrders } from "../../store/slices/ordersSlice";

const STATUS_TEXT: Record<
  "pending" | "confirmed" | "ready" | "completed" | "cancelled",
  string
> = {
  pending: "Your order is being prepared",
  confirmed: "Your order is confirmed",
  ready: "Your order is ready for pickup",
  completed: "Thank you for your order",
  cancelled: "Your order has been cancelled",
};

const STATUS_COLOR: Record<
  "pending" | "confirmed" | "ready" | "completed" | "cancelled",
  string
> = {
  pending: "#f59e0b", // amber
  confirmed: "#3b82f6", // blue
  ready: "#22c55e", // green
  completed: "#a3a3a3", // gray
  cancelled: "#ef4444", // red
};

const LEGEND: Array<{ key: keyof typeof STATUS_TEXT; label: string }> = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "ready", label: "Ready" },
  { key: "cancelled", label: "Cancelled" },
];

const OrdersScreen = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((s) => s.orders.orders);
  const loading = useAppSelector((s) => s.orders.loading);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchMyOrders());
      return () => {};
    }, [dispatch]),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      {loading && <Spinner />}
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.code}>#{item.id}</Text>
            <Text style={[styles.status, { color: STATUS_COLOR[item.status] }]}>
              {STATUS_TEXT[item.status]}
            </Text>
            {item.items && (
              <View style={{ marginTop: 8 }}>
                {item.items.map((it: any) => (
                  <View key={it.id} style={styles.itemRow}>
                    <Text style={styles.itemText}>
                      {it.name} x {it.qty}
                    </Text>
                    <Text style={styles.itemText}>
                      R{(it.qty * it.price).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            {item.total != null && (
              <View style={styles.itemRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>R{item.total?.toFixed(2)}</Text>
              </View>
            )}
            {item.type === "reservation" && (
              <Text style={styles.itemText}>Guests: {item.guestCount}</Text>
            )}
            {item.date && item.time && (
              <Text style={styles.itemText}>
                {item.date} {item.time}
              </Text>
            )}
          </View>
        )}
      />

      <View style={styles.legend}>
        {LEGEND.map((l) => (
          <View key={l.key} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: STATUS_COLOR[l.key] },
              ]}
            />
            <Text style={styles.legendText}>{l.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  title: {
    color: Colors.primary,
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  code: { color: Colors.text, opacity: 0.9, marginBottom: 6 },
  status: { color: Colors.primary, fontWeight: "bold", marginBottom: 12 },
  sectionTitle: { color: Colors.primary, fontWeight: "bold", marginBottom: 8 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  itemText: { color: Colors.text },
  totalLabel: { color: Colors.text, fontWeight: "600" },
  totalValue: { color: Colors.primary, fontWeight: "bold" },
  legend: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: 6,
  },
  legendText: { color: Colors.text, fontSize: 12 },
});

export default OrdersScreen;
