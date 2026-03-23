import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Spinner from "../../components/ui/Spinner";
import { Colors } from "../../constants/colors";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchOrders, updateOrderStatus } from "../../store/slices/ordersSlice";

// Loaded from Supabase via Redux thunks

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "ready", label: "Ready" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
] as const;

type StatusKey = (typeof FILTERS)[number]["key"];

const STATUS_FLOW: StatusKey[] = [
  "pending",
  "confirmed",
  "ready",
  "completed",
  "cancelled",
];

const STATUS_COLOR: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  ready: "#22c55e",
  completed: "#a3a3a3",
  cancelled: "#ef4444",
};

const AdminOrdersScreen = () => {
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<StatusKey>("all");
  const { orders, loading } = useAppSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const advanceStatus = (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    const currentIndex = STATUS_FLOW.indexOf(order.status as StatusKey);
    const nextIndex = (currentIndex + 1) % STATUS_FLOW.length;
    const nextStatus = STATUS_FLOW[nextIndex] as any;
    dispatch(updateOrderStatus({ id, status: nextStatus }));
  };

  const data = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((o) => o.status === filter);
  }, [filter, orders]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>

      {loading && <Spinner />}

      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={[styles.chip, filter === f.key && styles.chipActive]}
          >
            <Text
              style={[
                styles.chipText,
                filter === f.key && styles.chipTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={data}
        keyExtractor={(o) => o.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.left}>
              <Text style={styles.id} numberOfLines={1}>
                #{item.id}
              </Text>
              {typeof item.total === "number" ? (
                <Text style={styles.total} numberOfLines={1}>
                  R{item.total.toFixed(2)}
                </Text>
              ) : (
                <Text style={styles.total} numberOfLines={1}>
                  —
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={() => advanceStatus(item.id)}
              style={[
                styles.statusPill,
                { borderColor: STATUS_COLOR[item.status] || Colors.border },
              ]}
            >
              <Text
                style={{
                  color: STATUS_COLOR[item.status] || Colors.text,
                  fontWeight: "600",
                }}
                numberOfLines={1}
              >
                {item.status}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
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
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  chip: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: Colors.card,
  },
  chipActive: { borderColor: Colors.primary },
  chipText: { color: Colors.text },
  chipTextActive: { color: Colors.primary, fontWeight: "600" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  left: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },
  id: { color: Colors.text, fontWeight: "bold" },
  total: { color: Colors.text, marginTop: 4 },
  status: { color: Colors.primary, fontWeight: "600" },
  statusPill: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    flexShrink: 0,
    maxWidth: "45%",
  },
});

export default AdminOrdersScreen;
