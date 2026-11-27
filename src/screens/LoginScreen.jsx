import LoginBackground from "../components/LoginBackground";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
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
  };

  return (
    <SafeAreaView
      style={styles.layout}
      edges={["top", "left", "right", "bottom"]}
    >
      <LoginBackground />
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

            {/* Email */}
            <Text style={styles.email}>Email</Text>
            <View style={styles.email2}>
              <Ionicons name="mail-outline" size={21} color="#6EA8F4" />
              <View style={styles.email3} />
              <TextInput
                style={styles.layout2}
                placeholder="Enter your email"
                placeholderTextColor="#A0AEC0"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
                returnKeyType="next"
                accessibilityLabel="Email address"
              />
            </View>

            {/* Password */}
            <Text style={styles.email}>
              Password
            </Text>
            <View style={styles.password}>
              <Ionicons name="lock-closed-outline" size={21} color="#6EA8F4" />
              <View style={styles.email3} />
              <TextInput
                style={styles.layout2}
                placeholder="Enter your password"
                placeholderTextColor="#A0AEC0"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                textContentType="password"
                value={password}
                onChangeText={setPassword}
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                accessibilityLabel="Password"
              />
              <TouchableOpacity
                style={styles.password2}
                onPress={() => setShowPassword((currentValue) => !currentValue)}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#8191A9"
                />
              </TouchableOpacity>
            </View>

            {/* Login */}
            <TouchableOpacity
              style={[styles.login, loading ? styles.loginState : styles.loginState2]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Log in"
              accessibilityState={{
                disabled: loading,
              }}
            >
              {loading ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.login2}>
                    Logging in...
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.login3}>
                    Login
                  </Text>
                  <View style={styles.login4}>
                    <Ionicons name="arrow-forward" size={21} color="#FFFFFF" />
                  </View>
                </>
              )}
            </TouchableOpacity>

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

// UI styles: edit these values during visual debugging.
const styles = StyleSheet.create({
  pesotrackBranding: {marginBottom: 24},
  pesotrackBranding2: {flexDirection: "row", alignItems: "center"},
  pesotrackBranding3: {marginRight: 16, height: 68, width: 68, alignItems: "center", justifyContent: "center", borderRadius: 22, backgroundColor: "#1677F2"},
  pesotrackBranding4: {flex: 1},
  pesotrackBranding5: {flexDirection: "row", flexWrap: "wrap", alignItems: "baseline"},
  pesotrackBranding6: {fontSize: 36, fontWeight: "800", letterSpacing: -0.85, color: "#071B46"},
  pesotrackBranding7: {fontSize: 36, fontWeight: "800", letterSpacing: -0.85, color: "#1677F2"},
  pesotrackBranding8: {marginTop: 4, fontSize: 15, color: "#65758B"},
  loginCard: {borderRadius: 28, borderWidth: 1, borderColor: "#E0EBF6", backgroundColor: "#FFFFFF", paddingHorizontal: 24, paddingVertical: 24},
  loginCard2: {marginBottom: 28},
  loginCard3: {fontSize: 31, fontWeight: "800", color: "#071B46"},
  loginCard4: {marginTop: 8, fontSize: 15, lineHeight: 24, color: "#718096"},
  email: {marginBottom: 8, fontSize: 14, lineHeight: 20, fontWeight: "700", color: "#17335F"},
  email2: {marginBottom: 20, flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: "#D7E5F4", backgroundColor: "#F8FBFF", paddingHorizontal: 16},
  email3: {marginHorizontal: 12, height: 28, width: 1, backgroundColor: "#DCE8F5"},
  password: {marginBottom: 28, flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: "#D7E5F4", backgroundColor: "#F8FBFF", paddingHorizontal: 16},
  password2: {marginLeft: 8, height: 40, width: 40, alignItems: "center", justifyContent: "center"},
  loginState: {backgroundColor: "#7CB3F8"},
  loginState2: {backgroundColor: "#1677F2"},
  login: {minHeight: 56, flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 16},
  login2: {marginLeft: 12, fontSize: 16, lineHeight: 24, fontWeight: "800", color: "#FFFFFF"},
  login3: {fontSize: 16, lineHeight: 24, fontWeight: "800", color: "#FFFFFF"},
  login4: {marginLeft: 8},
  signup: {marginTop: 28, flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "center"},
  signup2: {fontSize: 14, lineHeight: 20, color: "#7A879A"},
  signup3: {fontSize: 14, lineHeight: 20, fontWeight: "800", color: "#1677F2"},
  footer: {marginTop: 20, alignItems: "center", paddingBottom: 16},
  footer2: {fontSize: 14, lineHeight: 20, fontWeight: "500", fontStyle: "italic", color: "#79A9DB"},
  layout: {flex: 1, backgroundColor: "#F4F9FF"},
  scrollContent: {flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 40},
  layout2: {flex: 1, minHeight: 56, color: "#071B46", fontSize: 16},
});
