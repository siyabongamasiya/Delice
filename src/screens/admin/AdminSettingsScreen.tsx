import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GoldButton from "../../components/GoldButton";
import { Colors } from "../../constants/colors";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchSettings, saveSettings } from "../../store/slices/settingsSlice";

const AdminSettingsScreen = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((s) => s.settings);
  const insets = useSafeAreaInsets();

  const [restaurantName, setRestaurantName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [weekdayHours, setWeekdayHours] = useState("");
  const [weekendHours, setWeekendHours] = useState("");

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    setRestaurantName(settings.restaurantName || "");
    setAddress(settings.address || "");
    setPhone(settings.phone || "");
    setEmail(settings.email || "");
    setWeekdayHours(settings.weekdayHours || "");
    setWeekendHours(settings.weekendHours || "");
  }, [
    settings.restaurantName,
    settings.address,
    settings.phone,
    settings.email,
    settings.weekdayHours,
    settings.weekendHours,
  ]);

  const onSave = () => {
    dispatch(
      saveSettings({
        restaurantName,
        address,
        phone,
        email,
        weekdayHours,
        weekendHours,
      }),
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 24 + insets.bottom,
        }}
      >
        <Text style={styles.title}>Restaurant Settings</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={restaurantName}
            onChangeText={setRestaurantName}
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#888"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Hours (Weekdays)</Text>
          <TextInput
            style={styles.input}
            value={weekdayHours}
            onChangeText={setWeekdayHours}
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Hours (Weekend)</Text>
          <TextInput
            style={styles.input}
            value={weekendHours}
            onChangeText={setWeekendHours}
            placeholderTextColor="#888"
          />
          {settings.loading ? (
            <View style={{ marginTop: 12 }}>
              <ActivityIndicator color={Colors.primary} />
            </View>
          ) : (
            <GoldButton
              title="Save"
              onPress={onSave}
              style={{ marginTop: 12 }}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 16,
  },
  label: { color: Colors.primary, fontWeight: "600", marginTop: 8 },
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
});

export default AdminSettingsScreen;
