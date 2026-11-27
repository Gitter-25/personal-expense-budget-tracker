import SignupBackground from "../components/SignupBackground";
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

            {/* Full Name */}
            <Text style={styles.fullName}>Full Name</Text>
            <View style={styles.fullName2}>
              <Ionicons name="person-outline" size={21} color="#6EA8F4" />
              <View style={styles.fullName3} />
              <TextInput
                style={styles.layout2}
                placeholder="Enter your full name"
                placeholderTextColor="#A0AEC0"
                autoCapitalize="words"
                autoCorrect={false}
                autoComplete="name"
                textContentType="name"
                value={name}
                onChangeText={setName}
                editable={!loading}
                returnKeyType="next"
              />
            </View>

            {/* Email */}
            <Text style={styles.fullName}>Email</Text>
            <View style={styles.fullName2}>
              <Ionicons name="mail-outline" size={21} color="#6EA8F4" />
              <View style={styles.fullName3} />
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
              />
            </View>

            {/* Password */}
            <Text style={styles.fullName}>
              Password
            </Text>
            <View style={styles.fullName2}>
              <Ionicons name="lock-closed-outline" size={21} color="#6EA8F4" />
              <View style={styles.fullName3} />
              <TextInput
                style={styles.layout2}
                placeholder="Create a password"
                placeholderTextColor="#A0AEC0"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                value={password}
                onChangeText={setPassword}
                editable={!loading}
                returnKeyType="next"
              />
              <TouchableOpacity
                style={styles.password}
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

            {/* Confirm password */}
            <Text style={styles.fullName}>
              Confirm Password
            </Text>
            <View style={styles.confirmPassword}>
              <Ionicons
                name="shield-checkmark-outline"
                size={21}
                color="#6EA8F4"
              />
              <View style={styles.fullName3} />
              <TextInput
                style={styles.layout2}
                placeholder="Confirm your password"
                placeholderTextColor="#A0AEC0"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={handleSignup}
              />
              <TouchableOpacity
                style={styles.password}
                onPress={() =>
                  setShowConfirmPassword((currentValue) => !currentValue)
                }
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel={
                  showConfirmPassword
                    ? "Hide confirmation password"
                    : "Show confirmation password"
                }
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#8191A9"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.confirmPassword2}>
              Password must contain at least 8 characters.
            </Text>

            {/* Create account button */}
            <TouchableOpacity
              style={[styles.createAccountButton, loading ? styles.createAccountButtonState : styles.createAccountButtonState2]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Create account"
            >
              {loading ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.createAccountButton2}>
                    Creating account...
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.createAccountButton3}>
                    Create Account
                  </Text>
                  <View style={styles.createAccountButton4}>
                    <Ionicons name="arrow-forward" size={21} color="#FFFFFF" />
                  </View>
                </>
              )}
            </TouchableOpacity>

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

// UI styles: edit these values during visual debugging.
const styles = StyleSheet.create({
  pesotrackBranding: {marginBottom: 20},
  pesotrackBranding2: {flexDirection: "row", alignItems: "center"},
  pesotrackBranding3: {marginRight: 16, height: 68, width: 68, alignItems: "center", justifyContent: "center", borderRadius: 22, backgroundColor: "#1677F2"},
  pesotrackBranding4: {flex: 1},
  pesotrackBranding5: {flexDirection: "row", flexWrap: "wrap", alignItems: "baseline"},
  pesotrackBranding6: {fontSize: 36, fontWeight: "800", letterSpacing: -0.85, color: "#071B46"},
  pesotrackBranding7: {fontSize: 36, fontWeight: "800", letterSpacing: -0.85, color: "#1677F2"},
  pesotrackBranding8: {marginTop: 4, fontSize: 15, color: "#65758B"},
  signupCard: {borderRadius: 28, borderWidth: 1, borderColor: "#E0EBF6", backgroundColor: "#FFFFFF", paddingHorizontal: 24, paddingVertical: 24},
  signupCard2: {marginBottom: 28},
  signupCard3: {fontSize: 31, fontWeight: "800", color: "#071B46"},
  signupCard4: {marginTop: 8, fontSize: 15, lineHeight: 24, color: "#718096"},
  fullName: {marginBottom: 8, fontSize: 14, lineHeight: 20, fontWeight: "700", color: "#17335F"},
  fullName2: {marginBottom: 20, flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: "#D7E5F4", backgroundColor: "#F8FBFF", paddingHorizontal: 16},
  fullName3: {marginHorizontal: 12, height: 28, width: 1, backgroundColor: "#DCE8F5"},
  password: {marginLeft: 8, height: 40, width: 40, alignItems: "center", justifyContent: "center"},
  confirmPassword: {marginBottom: 12, flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: "#D7E5F4", backgroundColor: "#F8FBFF", paddingHorizontal: 16},
  confirmPassword2: {marginBottom: 28, fontSize: 12, lineHeight: 20, color: "#8794A8"},
  createAccountButtonState: {backgroundColor: "#7CB3F8"},
  createAccountButtonState2: {backgroundColor: "#1677F2"},
  createAccountButton: {minHeight: 56, flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 16},
  createAccountButton2: {marginLeft: 12, fontSize: 16, lineHeight: 24, fontWeight: "800", color: "#FFFFFF"},
  createAccountButton3: {fontSize: 16, lineHeight: 24, fontWeight: "800", color: "#FFFFFF"},
  createAccountButton4: {marginLeft: 8},
  loginLink: {marginTop: 28, flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "center"},
  loginLink2: {fontSize: 14, lineHeight: 20, color: "#7A879A"},
  loginLink3: {fontSize: 14, lineHeight: 20, fontWeight: "800", color: "#1677F2"},
  footer: {marginTop: 20, alignItems: "center", paddingBottom: 24},
  footer2: {fontSize: 14, lineHeight: 20, fontWeight: "500", fontStyle: "italic", color: "#79A9DB"},
  layout: {flex: 1, backgroundColor: "#F4F9FF"},
  scrollContent: {flexGrow: 1, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 64},
  layout2: {flex: 1, minHeight: 56, color: "#071B46", fontSize: 16},
});
