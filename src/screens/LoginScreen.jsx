import InputField from "../components/InputField";
import Button from "../components/Button";
import Background from "../components/Background";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  // Screen state and navigation.
  const navigation = useNavigation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (loading) return;

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      Alert.alert(
        "Missing information",
        "Please enter your email and password.",
      );
      return;
    }

    try {
      setLoading(true);

      // Verify local credentials and persist the session.
      await signIn(trimmedEmail, password);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      Alert.alert("Login failed", message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <SafeAreaView
      style={styles.layout}
      edges={["top", "left", "right", "bottom"]}
    >
      <Background screen="Login" />
      <KeyboardAvoidingView
        style={styles.pesotrackBranding4}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.pesotrackBranding4}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* PesoTrack branding */}
          <View style={styles.pesotrackBranding}>
            <View style={styles.pesotrackBranding2}>
              <View style={styles.pesotrackBranding3}>
                <Ionicons name="wallet" size={36} color="#FFFFFF" />
              </View>
              <View style={styles.pesotrackBranding4}>
                <View style={styles.pesotrackBranding5}>
                  <Text style={styles.pesotrackBranding6}>
                    Peso
                  </Text>
                  <Text style={styles.pesotrackBranding7}>
                    Track
                  </Text>
                </View>
                <Text style={styles.pesotrackBranding8}>
                  Plan today. Build tomorrow.
                </Text>
              </View>
            </View>
          </View>

          {/* Login card */}
          <View style={styles.loginCard}>
            <View style={styles.loginCard2}>
              <Text style={styles.loginCard3}>
                Welcome back
              </Text>
              <Text style={styles.loginCard4}>
                Log in to manage your expenses and stay on track.
              </Text>
            </View>

            <InputField label="Email" icon="mail-outline" placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" textContentType="emailAddress" value={email} onChangeText={setEmail} editable={!loading} returnKeyType="next" accessibilityLabel="Email address" />
            <InputField label="Password" icon="lock-closed-outline" visible={showPassword} onToggle={() => setShowPassword(v => !v)} bottom={28} placeholder="Enter your password" autoCapitalize="none" autoCorrect={false} autoComplete="password" textContentType="password" value={password} onChangeText={setPassword} editable={!loading} returnKeyType="done" onSubmitEditing={handleLogin} />
            <Button title="Login" busyTitle="Logging in..." loading={loading} onPress={handleLogin} />

            {/* Signup */}
            <View style={styles.signup}>
              <Text style={styles.signup2}>
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Signup")}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Create a new account"
              >
                <Text style={styles.signup3}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footer2}>
              Better habits. Brighter future.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Styles for this UI.
const styles = StyleSheet.create({
  pesotrackBranding: {
    marginBottom: 24
  },

  pesotrackBranding2: {
    flexDirection: "row",
    alignItems: "center"
  },

  pesotrackBranding3: {
    marginRight: 16,
    height: 68,
    width: 68,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#1677F2"
  },

  pesotrackBranding4: {
    flex: 1
  },

  pesotrackBranding5: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline"
  },

  pesotrackBranding6: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -0.85,
    color: "#071B46"
  },

  pesotrackBranding7: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -0.85,
    color: "#1677F2"
  },

  pesotrackBranding8: {
    marginTop: 4,
    fontSize: 15,
    color: "#65758B"
  },

  loginCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#E0EBF6",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 24
  },

  loginCard2: {
    marginBottom: 28
  },

  loginCard3: {
    fontSize: 31,
    fontWeight: "800",
    color: "#071B46"
  },

  loginCard4: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 24,
    color: "#718096"
  },

  signup: {
    marginTop: 28,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center"
  },

  signup2: {
    fontSize: 14,
    lineHeight: 20,
    color: "#7A879A"
  },

  signup3: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800",
    color: "#1677F2"
  },

  footer: {
    marginTop: 20,
    alignItems: "center",
    paddingBottom: 16
  },

  footer2: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    fontStyle: "italic",
    color: "#79A9DB"
  },

  layout: {
    flex: 1,
    backgroundColor: "#F4F9FF"
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40
  },

});
