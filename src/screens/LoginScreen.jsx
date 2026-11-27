import AuthField from "../components/AuthField";
import AuthButton from "../components/AuthButton";
import LoginBackground from "../components/LoginBackground";
import { Ionicons } from "@expo/vector-icons";

import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "../styles/LoginScreen.styles";
import useLogin from "../hooks/useLogin";

export default function LoginScreen() {
  const { navigation, email, setEmail, password, setPassword, loading, showPassword, setShowPassword, handleLogin } = useLogin();
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

            <AuthField label="Email" icon="mail-outline" placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" textContentType="emailAddress" value={email} onChangeText={setEmail} editable={!loading} returnKeyType="next" accessibilityLabel="Email address" />
            <AuthField label="Password" icon="lock-closed-outline" visible={showPassword} onToggle={() => setShowPassword(v => !v)} bottom={28} placeholder="Enter your password" autoCapitalize="none" autoCorrect={false} autoComplete="password" textContentType="password" value={password} onChangeText={setPassword} editable={!loading} returnKeyType="done" onSubmitEditing={handleLogin} />
            <AuthButton title="Login" busyTitle="Logging in..." loading={loading} onPress={handleLogin} />

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

