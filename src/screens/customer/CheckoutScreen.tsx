import Constants from "expo-constants";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import supabase, { SUPABASE_ANON_KEY, SUPABASE_URL } from "../../api/supabase";
import GoldButton from "../../components/GoldButton";
import { Colors } from "../../constants/colors";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createOrder } from "../../store/slices/ordersSlice";

WebBrowser.maybeCompleteAuthSession();

const CheckoutScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((s) => s.cart);
  const userEmail = useAppSelector((s) => s.auth.user?.email) || "";
  const loading = useAppSelector((s) => s.orders.loading);

  const [paying, setPaying] = useState(false);

  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const canPlace = useMemo(
    () => items.length > 0 && total > 0,
    [items.length, total],
  );

  const onPayWithCard = async () => {
    if (paying) return;
    setPaying(true);
    if (!canPlace) {
      Alert.alert(
        "Cart is empty",
        "Please add items to your cart before checkout.",
      );
      setPaying(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();

    const accessToken = sessionData.session?.access_token;
    console.log("ACCESS TOKEN EXISTS?", !!accessToken);
    if (!accessToken) {
      Alert.alert("Login required", "Please login before making a payment.");
      setPaying(false);
      return;
    }

    const payload = {
      customer_phone: phone || null,
      notes: notes || null,
      items: items.map((it) => ({
        id: it.id,
        name: it.name,
        qty: it.quantity,
        price: it.price,
      })),
      total,
      type: "takeout" as const,
    };

    const res = await dispatch(createOrder(payload));
    if (createOrder.fulfilled.match(res)) {
      const orderId = res.payload.id;

      // Paystack expects the lowest currency unit. We'll treat total as ZAR and convert to cents.
      const amount = Math.max(1, Math.round(total * 100));
      const email = userEmail || "customer@example.com";

      // In a standalone build we want Paystack to redirect to our custom scheme.
      // In Expo Go, deep links use an Expo-managed URL, so keep the default.
      const callbackUrl =
        Constants.appOwnership === "expo"
          ? Linking.createURL("paystack/callback", {
              queryParams: { order_id: orderId },
            })
          : Linking.createURL("paystack/callback", {
              scheme: "delice",
              queryParams: { order_id: orderId },
            });

      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        Alert.alert("Missing env", "SUPABASE_URL / SUPABASE_ANON_KEY not set");
        setPaying(false);
        return;
      }

      const initRes = await fetch(
        `${SUPABASE_URL}/functions/v1/paystack-init`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            email,
            order_id: orderId,
            callback_url: callbackUrl,
          }),
        },
      );

      const initText = await initRes.text();
      const initJson = (() => {
        try {
          return initText ? JSON.parse(initText) : {};
        } catch {
          return { message: initText };
        }
      })();
      if (!initRes.ok) {
        Alert.alert(
          "Payment init failed",
          initJson?.error || initJson?.message || `HTTP ${initRes.status}`,
        );
        setPaying(false);
        return;
      }

      const authorizationUrl = initJson?.authorization_url as
        | string
        | undefined;
      const reference = initJson?.reference as string | undefined;
      if (!authorizationUrl || !reference) {
        Alert.alert("Payment init failed", "Missing authorization URL");
        setPaying(false);
        return;
      }

      // Open Paystack hosted checkout and automatically return to the app via deep link.
      const result = await WebBrowser.openAuthSessionAsync(
        authorizationUrl,
        callbackUrl,
      );

      // Paystack does not always deep-link back after a successful payment.
      // If the user closes the webview (back/X), still attempt verification using
      // the reference returned by our init endpoint.
      if (result.type === "success") {
        const parsed = Linking.parse(result.url);
        const returnedReference =
          (parsed.queryParams?.reference as string | undefined) ||
          (parsed.queryParams?.trxref as string | undefined) ||
          reference;

        navigation.navigate("PaystackCallback", {
          reference: returnedReference,
          order_id:
            (parsed.queryParams?.order_id as string | undefined) || orderId,
        });
      } else {
        navigation.navigate("PaystackCallback", {
          reference,
          order_id: orderId,
        });
      }
      setPaying(false);
    } else {
      Alert.alert(
        "Checkout failed",
        (res.payload as string) || "Please try again.",
      );
      setPaying(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Checkout</Text>

        {paying && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map((it) => (
            <View key={it.id} style={styles.row}>
              <Text style={styles.text}>
                {it.name} x {it.quantity}
              </Text>
              <Text style={styles.text}>
                R{(it.price * it.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={[styles.row, { marginTop: 8 }]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R{total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number"
            placeholderTextColor="#777"
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes (optional)"
            placeholderTextColor="#777"
            style={[styles.input, { height: 90, textAlignVertical: "top" }]}
            multiline
          />
        </View>

        <GoldButton
          title={loading || paying ? "Starting payment..." : "Pay with Card"}
          onPress={onPayWithCard}
          disabled={!canPlace || loading || paying}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 16, paddingBottom: 28 },
  title: {
    color: Colors.primary,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "center",
  },
  section: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  sectionTitle: { color: Colors.primary, fontWeight: "bold", marginBottom: 10 },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 12,
  },
  loadingText: { color: Colors.text, opacity: 0.9 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  text: { color: Colors.text },
  totalLabel: { color: Colors.text, fontWeight: "600" },
  totalValue: { color: Colors.primary, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "#000",
    color: Colors.text,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
});

export default CheckoutScreen;
