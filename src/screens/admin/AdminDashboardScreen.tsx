import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/colors";

const stats = [
  { key: "Orders Today", value: 24 },
  { key: "Revenue Today", value: "R 3,560" },
  { key: "Pending", value: 5 },
  { key: "Ready", value: 7 },
];

const recentOrders = [
  { id: "ord-1010", customer: "John D.", total: 189.99, status: "ready" },
  { id: "ord-1009", customer: "Nomsa K.", total: 98.5, status: "confirmed" },
  { id: "ord-1008", customer: "Peter S.", total: 256.0, status: "pending" },
];

const AdminDashboardScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
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
