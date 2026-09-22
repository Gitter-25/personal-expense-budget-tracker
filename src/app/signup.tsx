import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    if (loading) return;

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password || !confirmPassword) {
      Alert.alert("Missing information", "Please complete all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
      });

      if (error) {
        Alert.alert("Signup failed", error.message);
        return;
      }

      if (!data.session) {
        Alert.alert(
          "Account created",
          "Please check your email and confirm your account before logging in.",
          [
            {
              text: "Go to Login",
              onPress: () => router.replace("/login"),
            },
          ],
        );

        return;
      }

      Alert.alert(
        "Account created",
        "Your account has been created successfully.",
        [
          {
            text: "Continue",
            onPress: () => router.replace("/(tabs)"),
          },
        ],
      );
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
            paddingHorizontal: 24,
            paddingTop: 32,
            paddingBottom: 64,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Brand */}
          <View className="mb-5">
            <View className="flex-row items-center">
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
                  Start building better money habits.
                </Text>
              </View>
            </View>
          </View>

          {/* Signup card */}
          <View className="rounded-[28px] border border-[#E0EBF6] bg-white px-6 py-6">
            <View className="mb-7">
              <Text className="text-[31px] font-extrabold text-[#071B46]">
                Create account
              </Text>

              <Text className="mt-2 text-[15px] leading-6 text-[#718096]">
                Create your PesoTrack account and start managing your budget.
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

            <View className="mb-5 flex-row items-center rounded-2xl border border-[#D7E5F4] bg-[#F8FBFF] px-4">
              <Ionicons name="lock-closed-outline" size={21} color="#6EA8F4" />

              <View className="mx-3 h-7 w-px bg-[#DCE8F5]" />

              <TextInput
                style={{
                  flex: 1,
                  minHeight: 56,
                  color: "#071B46",
                  fontSize: 16,
                }}
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

            {/* Confirm Password */}
            <Text className="mb-2 text-sm font-bold text-[#17335F]">
              Confirm Password
            </Text>

            <View className="mb-3 flex-row items-center rounded-2xl border border-[#D7E5F4] bg-[#F8FBFF] px-4">
              <Ionicons
                name="shield-checkmark-outline"
                size={21}
                color="#6EA8F4"
              />

              <View className="mx-3 h-7 w-px bg-[#DCE8F5]" />

              <TextInput
                style={{
                  flex: 1,
                  minHeight: 56,
                  color: "#071B46",
                  fontSize: 16,
                }}
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
                className="ml-2 h-10 w-10 items-center justify-center"
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

            <Text className="mb-7 text-xs leading-5 text-[#8794A8]">
              Password must contain at least 6 characters.
            </Text>

            {/* Create account */}
            <TouchableOpacity
              className={`min-h-[56px] flex-row items-center justify-center rounded-2xl ${
                loading ? "bg-[#7CB3F8]" : "bg-[#1677F2]"
              }`}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              {loading ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />

                  <Text className="ml-3 text-base font-extrabold text-white">
                    Creating account...
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-base font-extrabold text-white">
                    Create Account
                  </Text>

                  <View className="ml-2">
                    <Ionicons name="arrow-forward" size={21} color="#FFFFFF" />
                  </View>
                </>
              )}
            </TouchableOpacity>

            {/* Login link */}
            <View className="mt-7 flex-row flex-wrap items-center justify-center">
              <Text className="text-sm text-[#7A879A]">
                Already have an account?{" "}
              </Text>

              <TouchableOpacity
                onPress={() => router.replace("/login")}
                disabled={loading}
                accessibilityRole="button"
              >
                <Text className="text-sm font-extrabold text-[#1677F2]">
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View className="mt-5 items-center pb-6">
            <Text className="text-sm font-medium italic text-[#79A9DB]">
              Better habits. Brighter future.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
