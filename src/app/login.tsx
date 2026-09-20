import * as AuthSession from "expo-auth-session";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    if (!email.trim() || !password) {
      Alert.alert(
        "Missing information",
        "Please enter your email and password.",
      );
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
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
    try {
      setLoading(true);

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
    <View className="flex-1 justify-center bg-gray-100 px-6">
      <View className="mb-8">
        <Text className="text-4xl font-bold text-gray-900">Budget Tracker</Text>

        <Text className="mt-2 text-base text-gray-500">
          Login to manage your expenses
        </Text>
      </View>

      <View className="rounded-2xl bg-white p-6">
        <Text className="mb-6 text-2xl font-bold text-gray-900">Login</Text>

        <Text className="mb-2 text-sm font-semibold text-gray-700">Email</Text>

        <TextInput
          className="mb-4 rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
          placeholder="Enter your email"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <Text className="mb-2 text-sm font-semibold text-gray-700">
          Password
        </Text>

        <TextInput
          className="mb-6 rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
          placeholder="Enter your password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          className={`items-center rounded-xl py-4 ${
            loading ? "bg-blue-400" : "bg-blue-600"
          }`}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-base font-bold text-white">
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <View className="my-5 flex-row items-center">
          <View className="h-px flex-1 bg-gray-200" />
          <Text className="mx-3 text-sm text-gray-400">OR</Text>
          <View className="h-px flex-1 bg-gray-200" />
        </View>

        <TouchableOpacity
          className="items-center rounded-xl border border-gray-300 bg-white py-4"
          onPress={handleGoogleLogin}
          disabled={loading}
        >
          <Text className="text-base font-bold text-gray-700">
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-5 items-center"
          onPress={() => router.push("/signup")}
        >
          <Text className="text-gray-500">
            Don't have an account?{" "}
            <Text className="font-bold text-blue-600">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
