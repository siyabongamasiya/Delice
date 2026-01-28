import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { login, loginWithGoogle } from "../../store/slices/authSlice";

const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const loading = useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.auth.error);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return;
    await dispatch(login({ email, password }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.googleBtn]}
        onPress={() => dispatch(loginWithGoogle())}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <View style={styles.googleContent}>
            <Ionicons name="logo-google" size={18} color="#4285F4" />
            <Text style={styles.googleText}>Continue with Google</Text>
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Signup" as never)}
        style={styles.linkContainer}
      >
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 24,
  },
  title: {
    color: "#D4AF37",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#D4AF37",
  },
  button: {
    backgroundColor: "#D4AF37",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  googleBtn: {
    backgroundColor: "#fff",
    marginTop: 12,
  },
  googleContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  googleText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "#ff4444",
    marginBottom: 8,
  },
  linkContainer: {
    marginTop: 24,
  },
  link: {
    color: "#D4AF37",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
