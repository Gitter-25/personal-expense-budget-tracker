import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        "Missing information",
        "Please enter your email and password.",
      );
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Login failed", error.message);
      return;
    }

    router.replace("/");
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
