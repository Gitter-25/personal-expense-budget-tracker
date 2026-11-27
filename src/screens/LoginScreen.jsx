import LoginBackground from "../components/LoginBackground";
import { Ionicons } from "@expo/vector-icons";

import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
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

