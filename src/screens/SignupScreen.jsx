import AuthField from "../components/AuthField";
import AuthButton from "../components/AuthButton";
import SignupBackground from "../components/SignupBackground";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/SignupScreen.styles";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { registerUser } from "../storage/userStorage";

export default function SignupScreen() {

  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    if (loading) return;

    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim() || !trimmedEmail || !password || !confirmPassword) {
      Alert.alert("Missing information", "Please complete all fields.");
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Weak password", "Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      // Register locally; no email confirmation or internet is required.
      await registerUser({ name, email: trimmedEmail, password, confirmPassword });
      Alert.alert("Account created", "You can now log in.", [
        { text: "Go to Login", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      Alert.alert("Signup failed", message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView
      style={styles.layout}
      edges={["top", "left", "right", "bottom"]}
    >
      <SignupBackground />
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
                  Start building better money habits.
                </Text>
              </View>
            </View>
          </View>

          {/* Signup card */}
          <View style={styles.signupCard}>
            <View style={styles.signupCard2}>
              <Text style={styles.signupCard3}>
                Create account
              </Text>
              <Text style={styles.signupCard4}>
                Create your PesoTrack account and start managing your budget.
              </Text>
            </View>

            <AuthField label="Full Name" icon="person-outline" placeholder="Enter your full name" autoCapitalize="words" autoCorrect={false} autoComplete="name" textContentType="name" value={name} onChangeText={setName} editable={!loading} returnKeyType="next" />
            <AuthField label="Email" icon="mail-outline" placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" textContentType="emailAddress" value={email} onChangeText={setEmail} editable={!loading} returnKeyType="next" accessibilityLabel="Email address" />
            <AuthField label="Password" icon="lock-closed-outline" visible={showPassword} onToggle={() => setShowPassword(v => !v)} bottom={20} placeholder="Create a password" autoCapitalize="none" autoCorrect={false} autoComplete="new-password" textContentType="newPassword" value={password} onChangeText={setPassword} editable={!loading} returnKeyType="next"  />
            <AuthField label="Confirm Password" icon="shield-checkmark-outline" visible={showConfirmPassword} onToggle={() => setShowConfirmPassword(v => !v)} bottom={12} placeholder="Confirm your password" autoCapitalize="none" autoCorrect={false} autoComplete="new-password" textContentType="newPassword" value={confirmPassword} onChangeText={setConfirmPassword} editable={!loading} returnKeyType="done" onSubmitEditing={handleSignup} />
            <Text style={styles.confirmPassword2}>Password must contain at least 8 characters.</Text>
            <AuthButton title="Create Account" busyTitle="Creating account..." loading={loading} onPress={handleSignup} />

            {/* Login link */}
            <View style={styles.loginLink}>
              <Text style={styles.loginLink2}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Go to login"
              >
                <Text style={styles.loginLink3}>
                  Login
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
