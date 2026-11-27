import SignupBackground from "../components/SignupBackground";
import { Ionicons } from "@expo/vector-icons";

import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "../styles/SignupScreen.styles";
import useSignup from "../hooks/useSignup";

export default function SignupScreen() {
  const { navigation, name, setName, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, loading, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword, handleSignup } = useSignup();
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

