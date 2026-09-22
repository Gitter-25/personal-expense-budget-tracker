import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
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
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
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

      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        Alert.alert("Login failed", error.message);
        return;
      }

      router.replace("/(tabs)");
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

  const handleGoogleLogin = async () => {
    if (loading) return;

    try {
      setLoading(true);

      // Keep the existing scheme for now because Google OAuth
      // and Supabase redirect configuration currently use it.
      const redirectTo = AuthSession.makeRedirectUri({
        scheme: "budgettracker",
        path: "auth/callback",
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        Alert.alert("Google login failed", error.message);
        return;
      }

      if (!data.url) {
        Alert.alert("Google login failed", "Unable to start Google sign-in.");
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo,
      );

      if (result.type !== "success") {
        return;
      }

      const url = new URL(result.url);
      const code = url.searchParams.get("code");

      if (!code) {
        Alert.alert(
          "Google login failed",
          "No authorization code was returned.",
        );
        return;
      }

      const { error: sessionError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (sessionError) {
        Alert.alert("Google login failed", sessionError.message);
        return;
      }

      router.replace("/(tabs)");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      Alert.alert("Google login failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F4F9FF" }}
      edges={["top", "left", "right", "bottom"]}
    >
      {/* Background decorations */}
      <View
        pointerEvents="none"
        className="absolute -left-28 -top-24 h-72 w-72 rounded-full bg-[#D8EAFE]"
      />

      <View
        pointerEvents="none"
        className="absolute -right-36 top-52 h-80 w-80 rounded-full bg-[#E4F0FF]"
      />

      <View
        pointerEvents="none"
        className="absolute -bottom-40 -left-24 h-80 w-80 rounded-full bg-[#D9EAFF]"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-start",
            paddingHorizontal: 24,
            paddingTop: 40,
            paddingBottom: 64,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* PesoTrack branding */}
          <View className="mb-6">
            <View className="flex-row items-center">
              {/* Temporary brand icon */}
              <View className="mr-4 h-[68px] w-[68px] items-center justify-center rounded-[22px] bg-[#1677F2]">
                <Ionicons name="wallet" size={36} color="#FFFFFF" />
              </View>

              <View className="flex-1">
                <View className="flex-row flex-wrap items-baseline">
                  <Text className="text-[36px] font-extrabold tracking-tight text-[#071B46]">
                    Peso
                  </Text>

                  <Text className="text-[36px] font-extrabold tracking-tight text-[#1677F2]">
                    Track
                  </Text>
                </View>

                <Text className="mt-1 text-[15px] text-[#65758B]">
                  Plan today. Build tomorrow.
                </Text>
              </View>
            </View>
          </View>

          {/* Login card */}
          <View className="rounded-[28px] border border-[#E0EBF6] bg-white px-6 py-6">
            <View className="mb-7">
              <Text className="text-[31px] font-extrabold text-[#071B46]">
                Welcome back
              </Text>

              <Text className="mt-2 text-[15px] leading-6 text-[#718096]">
                Log in to manage your expenses and stay on track.
              </Text>
            </View>

            {/* Email */}
            <Text className="mb-2 text-sm font-bold text-[#17335F]">Email</Text>

            <View className="mb-5 flex-row items-center rounded-2xl border border-[#D7E5F4] bg-[#F8FBFF] px-4">
              <Ionicons name="mail-outline" size={21} color="#6EA8F4" />

              <View className="mx-3 h-7 w-px bg-[#DCE8F5]" />

              <TextInput
                style={{
                  flex: 1,
                  minHeight: 56,
                  color: "#071B46",
                  fontSize: 16,
                }}
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
            <Text className="mb-2 text-sm font-bold text-[#17335F]">
              Password
            </Text>

            <View className="mb-7 flex-row items-center rounded-2xl border border-[#D7E5F4] bg-[#F8FBFF] px-4">
              <Ionicons name="lock-closed-outline" size={21} color="#6EA8F4" />

              <View className="mx-3 h-7 w-px bg-[#DCE8F5]" />

              <TextInput
                style={{
                  flex: 1,
                  minHeight: 56,
                  color: "#071B46",
                  fontSize: 16,
                }}
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
              />

              <TouchableOpacity
                className="ml-2 h-10 w-10 items-center justify-center"
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

            {/* Login button */}
            <TouchableOpacity
              className={`min-h-[56px] flex-row items-center justify-center rounded-2xl ${
                loading ? "bg-[#7CB3F8]" : "bg-[#1677F2]"
              }`}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              {loading ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />

                  <Text className="ml-3 text-base font-extrabold text-white">
                    Logging in...
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-base font-extrabold text-white">
                    Login
                  </Text>

                  <View className="ml-2">
                    <Ionicons name="arrow-forward" size={21} color="#FFFFFF" />
                  </View>
                </>
              )}
            </TouchableOpacity>

            {/* OR divider */}
            <View className="my-6 flex-row items-center">
              <View className="h-px flex-1 bg-[#DCE7F2]" />

              <Text className="mx-4 text-sm font-medium text-[#8492A6]">
                OR
              </Text>

              <View className="h-px flex-1 bg-[#DCE7F2]" />
            </View>

            {/* Google login */}
            <TouchableOpacity
              className="min-h-[56px] flex-row items-center justify-center rounded-2xl border border-[#CFE0F1] bg-white px-4"
              onPress={handleGoogleLogin}
              disabled={loading}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-[#F7FAFC]">
                <Text className="text-lg font-extrabold text-[#4285F4]">G</Text>
              </View>

              <Text className="text-base font-bold text-[#17335F]">
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* Signup */}
            <View className="mt-7 flex-row flex-wrap items-center justify-center">
              <Text className="text-sm text-[#7A879A]">
                Don't have an account?{" "}
              </Text>

              <TouchableOpacity
                onPress={() => router.push("/signup")}
                disabled={loading}
                accessibilityRole="button"
              >
                <Text className="text-sm font-extrabold text-[#1677F2]">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View className="mt-5 items-center pb-4">
            <Text className="text-sm font-medium italic text-[#79A9DB]">
              Better habits. Brighter future.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
