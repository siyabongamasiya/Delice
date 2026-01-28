import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import supabase, { SUPABASE_ANON_KEY, SUPABASE_URL } from "../../api/supabase";
import { Colors } from "../../constants/colors";
import { useAppDispatch } from "../../store/hooks";
import { clearCart } from "../../store/slices/cartSlice";

const PaystackCallbackScreen = ({ route, navigation }: any) => {
  const reference = route?.params?.reference as string | undefined;
  const orderId = route?.params?.order_id as string | undefined;
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(true);
  const [lastStatus, setLastStatus] = useState<string | null>(null);

  const verifyOnce = useCallback(async () => {
    if (!reference || !orderId) {
      throw new Error("Missing payment reference");
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) {
      throw new Error("Login required to verify payment");
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error(
        "Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY",
      );
    }

    const verifyRes = await fetch(
      `${SUPABASE_URL}/functions/v1/paystack-verify`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reference, order_id: orderId }),
      },
    );

    const verifyText = await verifyRes.text();
    const verifyJson = (() => {
      try {
        return verifyText ? JSON.parse(verifyText) : {};
      } catch {
        return { message: verifyText };
      }
    })();

    if (!verifyRes.ok) {
      throw new Error(
        verifyJson?.error || verifyJson?.message || `HTTP ${verifyRes.status}`,
      );
    }

    return verifyJson as { paid?: boolean; status?: string };
  }, [orderId, reference]);

  const runVerification = useCallback(async () => {
    setError(null);
    setVerifying(true);
    setLastStatus(null);

    try {
      for (let attempt = 0; attempt < 8; attempt++) {
        const res = await verifyOnce();
        const status = res?.status || null;
        setLastStatus(status);

        if (res?.paid) {
          dispatch(clearCart());
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "Tabs",
                params: {
                  screen: "Tracking",
                },
              },
            ],
          });
          return;
        }

        await new Promise((r) => setTimeout(r, 3000));
      }

      setError(`Payment not successful: ${lastStatus || "unknown"}`);
    } catch (e: any) {
      setError(e.message || "Payment verification failed");
    } finally {
      setVerifying(false);
    }
  }, [dispatch, lastStatus, navigation, verifyOnce]);

  useEffect(() => {
    runVerification();
  }, [runVerification]);

  return (
    <View style={styles.container}>
      {verifying && <ActivityIndicator color={Colors.primary} />}
      <Text style={styles.title}>
        {verifying ? "Verifying payment..." : "Payment verification"}
      </Text>
      {!!lastStatus && (
        <Text style={styles.subtitle}>Latest status: {lastStatus}</Text>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
      {!verifying && (
        <TouchableOpacity
          onPress={runVerification}
          style={styles.retryBtn}
          activeOpacity={0.85}
        >
          <Text style={styles.retryText}>Retry verification</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: { color: Colors.text, marginTop: 12 },
  subtitle: { color: Colors.text, marginTop: 8, opacity: 0.8 },
  error: { color: Colors.error, marginTop: 12, textAlign: "center" },
  retryBtn: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  retryText: { color: Colors.primary },
});

export default PaystackCallbackScreen;
