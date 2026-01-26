import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/colors";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchSettings } from "../../store/slices/settingsSlice";

const ContactScreen = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((s) => s.settings);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const name = settings.restaurantName || "Delice";
  const address = settings.address || "";
  const phone = settings.phone || "";
  const emailAddr = settings.email || "";
  const weekday = settings.weekdayHours || "";
  const weekend = settings.weekendHours || "";
  const mapsQuery = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + address)}`;

  const call = () => phone && Linking.openURL(`tel:${phone}`);
  const email = () => emailAddr && Linking.openURL(`mailto:${emailAddr}`);
  const openMaps = () => Linking.openURL(mapsQuery);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Restaurant</Text>
        <Text style={styles.value}>{name}</Text>

        <Text style={[styles.label, { marginTop: 12 }]}>Address</Text>
        <Text style={styles.value}>{address || "—"}</Text>

        <Text style={[styles.label, { marginTop: 12 }]}>Hours</Text>
        {!!weekday && <Text style={styles.value}>{weekday}</Text>}
        {!!weekend && <Text style={styles.value}>{weekend}</Text>}

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={call}>
            <Ionicons name="call-outline" size={18} color="#000" />
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={email}>
            <Ionicons name="mail-outline" size={18} color="#000" />
            <Text style={styles.actionText}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={openMaps}>
            <Ionicons name="map-outline" size={18} color="#000" />
            <Text style={styles.actionText}>Map</Text>
          </TouchableOpacity>
        </View>
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
  },
  label: { color: Colors.primary, fontWeight: "bold" },
  value: { color: Colors.text, marginTop: 2 },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionText: { color: "#000", fontWeight: "bold" },
});

export default ContactScreen;
