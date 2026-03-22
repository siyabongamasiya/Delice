import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo } from "react";
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
import { fetchOrders } from "../../store/slices/ordersSlice";

const AdminDashboardScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const { stats, recentOrders } = useMemo(() => {
    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10);

    const todays = orders.filter((o) => o.date === todayKey);
    const ordersToday = todays.length;
    const revenueToday = todays.reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingCount = orders.filter((o) => o.status === "pending").length;
    const readyCount = orders.filter((o) => o.status === "ready").length;

    const recent = orders.slice(0, 6).map((o) => ({
      id: o.id,
      customer: o.customerName || "—",
      total: typeof o.total === "number" ? o.total : 0,
      status: o.status,
    }));

    return {
      stats: [
        { key: "Orders Today", value: ordersToday },
        { key: "Revenue Today", value: `R ${revenueToday.toFixed(2)}` },
        { key: "Pending", value: pendingCount },
        { key: "Ready", value: readyCount },
      ],
      recentOrders: recent,
    };
  }, [orders]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      {loading && <Spinner />}
      <View style={styles.quickRow}>
        <TouchableOpacity
          style={styles.quick}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("AdminOrders" as never)}
        >
          <Text style={styles.quickTitle}>Manage Orders</Text>
          <Text style={styles.quickHint}>View, filter and track</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quick}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("AdminMenuItems" as never)}
        >
          <Text style={styles.quickTitle}>Menu Items</Text>
          <Text style={styles.quickHint}>Edit prices & availability</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quick}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("AdminSettings" as never)}
        >
          <Text style={styles.quickTitle}>Settings</Text>
          <Text style={styles.quickHint}>Restaurant info</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardsRow}>
        {stats.map((s) => (
          <View key={s.key} style={styles.card}>
            <Text style={styles.cardKey}>{s.key}</Text>
            <Text style={styles.cardValue}>{String(s.value)}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
        Recent Orders
      </Text>
      <FlatList
        data={recentOrders}
        keyExtractor={(o) => o.id}
        renderItem={({ item }) => (
          <View style={styles.orderRow}>
            <Text style={styles.orderId}>#{item.id}</Text>
            <Text style={styles.orderText}>R{item.total.toFixed(2)}</Text>
            <Text style={styles.orderText}>{item.customer}</Text>
            <Text style={styles.orderStatus}>{item.status}</Text>
          </View>
        )}
        ListEmptyComponent={() =>
          !loading ? (
            <Text style={{ color: Colors.text, opacity: 0.8, marginTop: 12 }}>
              No orders yet.
            </Text>
          ) : null
        }
      />
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
    marginBottom: 12,
  },
  cardsRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  quickRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  quick: {
    flexBasis: "31%",
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
  },
  quickTitle: { color: Colors.primary, fontWeight: "bold" },
  quickHint: { color: "#aaa", marginTop: 4, fontSize: 12 },
  card: {
    flexBasis: "48%",
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
  },
  cardKey: { color: Colors.text, opacity: 0.8 },
  cardValue: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },
  sectionTitle: { color: Colors.primary, fontWeight: "bold" },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  orderId: { color: Colors.text, fontWeight: "bold" },
  orderText: { color: Colors.text },
  orderStatus: { color: Colors.primary, fontWeight: "600" },
});

export default AdminDashboardScreen;
